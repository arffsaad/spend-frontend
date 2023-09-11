"use client";

import * as z from "zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
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
import { Switch } from "@/components/ui/switch"

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
    const response = await fetch('/api/wallets/user/1', {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
}


export default function Page() {
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
    useEffect(() => {
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
        vals.append("name", values.name);
        vals.append("amount", String(parseFloat(values.amount) * 100));
        vals.append("wallet", values.wallet);
        vals.append("fulfilled", values.fulfilled.toString());
        vals.append("image", values.image);
        vals.forEach((value, key) => {
            console.log(key, value);
        });
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
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </main>
    );
}

