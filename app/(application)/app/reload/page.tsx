"use client";

import * as z from "zod"
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { App } from '@/components/authCheck';
import { zodResolver } from "@hookform/resolvers/zod"
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
import useUserStore from "@/components/userStore";
import useStore from "@/components/useStore";
import useMsgStore from "@/components/msgStore";

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
})

async function fetchWallets(): Promise<wallets[]> {
    const response = await fetch('/api/wallets/user', {
        method: 'GET',
        headers: {
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
            name: "Salary",
            amount: "10.00",
            wallet: "0"
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const vals = {
            remark: values.name,
            amount: Math.round(parseFloat(values.amount) * 100),
            walletid: parseInt(values.wallet),
            userid: 1
        }
        fetch("/api/reloads/create", {
            method: "POST",
            body: JSON.stringify(vals),
            headers: {
                "Content-Type": "application/json",
                "Token" : useUserStore.getState().token
            }
        }).then(async response => {
            const data = await response.json();
            if (response.status == 401) {
                useStore(useUserStore, (state) => state.resetUser());
            } else {
                useMsgStore.setState({ walletPage: data.message });
                window.location.href = "/app/wallets/" + values.wallet;
            }
            // redirect to spends page if successful
        }).catch(error => {
            console.error(error);
        })
    }


    return (
        <main className="p-24">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                    Amount to reload
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
                                    Select a wallet to add funds to
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Remarks</FormLabel>
                                <FormControl>
                                    <Input placeholder="Food" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Optional remarks for this reload (max 15 characters)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Reload</Button>
                </form>
            </Form>
        </main>
    );
}

