"use client";

import * as z from "zod"
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { App } from '@/components/authCheck';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import useUserStore from "@/components/userStore";
import useStore from "@/components/useStore";
import useMsgStore from "@/components/msgStore";
import { useToast } from "@/components/ui/use-toast";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

type wallets = {
    id: number;
    name: string;
    amount: number;
    userid: number;
    createdtime: string;
}

const formSchema = z.object({
    name: z.string()
        .min(5, { message: "Must be at least 5 characters" })
        .max(15, { message: "Must be at most 15 characters" }),
    amount: z.string()
        .refine((value) => {
            try {
                const val = parseFloat(value);
                if (val > 0 && val < 10000) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                return false;
            }
        }),
    wallet: z.string()
        .refine(async (value) => {
            const val = parseInt(value);
            const wallets = await fetchWallets();
            const walletIds = wallets.map(wallet => wallet.id);
            return walletIds.includes(val);
        }, { message: "Wallet does not exist" }),
    fulfilled: z.boolean(),
    image: z.any()
})

async function fetchWallets(): Promise<wallets[]> {
    const response = await fetch('/api/wallets/user', {
        method: 'GET',
        headers : {
            "Token" : useUserStore.getState().token
        }
    });

    if (response.status == 401) {
        useStore(useUserStore, (state) => state.resetUser());
    }

    const data = await response.json();
    return data.data;
}


export default function Page() {
    const [authed, setAuthed] = useState<boolean>(false);
    const [walletData, setData] = useState<wallets[]>([]);
    const { toast } = useToast();
    const fetchData = async () => {
        try {
            const newData = await fetchWallets();
            console.log(newData);
            setData(newData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const checkAuth = async () => {
        const authed = await App();
        setAuthed(authed);
        if (!authed) {
          useUserStore.getState().resetUser();
          useMsgStore.setState({ loginPage: "Please login to continue" });
          window.location.href = "/auth/login";
        }
    }
    useEffect(() => {
        checkAuth();
        fetchData(); // Fetch data on initial component mount
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "Dinner!",
            amount: "10.00",
            fulfilled: false,
            image: null,
            wallet: "0"
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const vals = new FormData();
        vals.append("remark", values.name);
        vals.append("amount", String(parseFloat(values.amount) * 100));
        vals.append("walletid", values.wallet);
        vals.append("fulfilled", values.fulfilled.toString());
        (values.image) ? vals.append("receipt", values.image[0]) : vals.append("receipt", "none");
        vals.append("userid", "1")
        fetch("/api/spending/create", {
            method: "POST",
            body: vals,
            headers: {
                "Token": useUserStore.getState().token
            }
        }).then(async response => {
            const data = await response.json();
            if (response.status == 401) {
                useStore(useUserStore, (state) => state.resetUser());
            } else if (response.status != 201) {
                toast({
                    description: data.message,
                    variant: "destructive"
                })
                throw new Error("Error creating spending");
            }
            // redirect to spends page if successful
            window.location.href = "/app/spends";
        }).catch(error => {
            console.error(error);
        })
    }


    return (
        <main className="p-24">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" encType="multipart/form-data">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Spending</FormLabel>
                                <FormControl>
                                    <Input placeholder="Food" {...field} />
                                </FormControl>
                                <FormDescription>
                                    A simple spending description (max 15 characters)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount (RM)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="10.00" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Amount Spent
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="wallet"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Wallet</FormLabel>
                                <Select onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Wallet" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {walletData.map(walletItem => (
                                            <SelectItem key={walletItem.id} value={walletItem.id.toString()}>
                                                {walletItem.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select a wallet to deduct funds from
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fulfilled"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Spending Fulfilled</FormLabel>
                                    <FormDescription>
                                        Spending is funded and fulfilled.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Controller
                        name="image"
                        defaultValue={[]}
                        render={({ field }) => (
                            <FilePond
                                maxFiles={1}
                                name={"image"}
                                required={false}
                                storeAsFile={true}
                                credits={false}
                                files={field.value}
                                onupdatefiles={(fileItems) => {
                                    field.onChange(fileItems.map(fileItem => fileItem.file));
                                }}
                            />
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </main>
    );
}

