"use client";

import * as z from "zod"
import { useEffect, useState } from "react"
import { App } from '@/components/authCheck';
import { useForm, Controller } from "react-hook-form"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import useUserStore from "@/components/userStore";
import useStore from "@/components/useStore";
import useMsgStore from "@/components/msgStore";

const formSchema = z.object({
    name: z.string()
        .min(5, { message: "Must be at least 5 characters" })
        .max(15, { message: "Must be at most 15 characters" }),
    amount: z.string()
        .refine((value) => {
            try {
                const val = parseFloat(value);
                if (val >= 0 && val < 10000) {
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
})


export default function Page() {
  const [authed, setAuthed] = useState<boolean>(false);
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
}, []);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "Groceries",
            amount: "0.00"
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const vals = {
            name: values.name,
            amount: Math.round(parseFloat(values.amount) * 100),
            userid: 1
        }
        fetch("/api/wallets/create", {
            method: "POST",
            body: JSON.stringify(vals),
            headers: {
                "Content-Type": "application/json",
                "Token" : useUserStore.getState().token
            }
        }).then(response => {
            if (response.status == 401) {
                useStore(useUserStore, (state) => state.resetUser());
            }
            // redirect to spends page if successful
            window.location.href = "/app/wallets";
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Wallet Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Food" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Wallet name for reference (max 15 characters)
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
                                <FormLabel>Pre-load Amount (RM)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Initial starting amount
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Create Wallet</Button>
                </form>
            </Form>
        </main>
    );
}

