"use client";
import * as z from "zod"
import React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useUserStore from "@/components/userStore";
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
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function login() {

    const formSchema = z.object({
        name: z.string(),
        password: z.string()
            .min(6, { message: "Must be at least 6 characters" })
            .max(50, { message: "Must be at most 15 characters" }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const vals = {
            name: values.name,
            password: values.password,
        }
        fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(vals),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            useUserStore.setState(data);
            window.location.href = "/app/spends";
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <main>
            <Card className="hover:glow-xl transition duration-300 py-5 px-5 justify-center">
                <CardHeader>
                    <CardTitle className="text-xl text-heavy">Sign In</CardTitle>
                    <CardDescription>Access your account.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <CardContent>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-2">
                                            <FormLabel className="my-auto">Username</FormLabel>
                                        </div>
                                        <FormControl >
                                            <Input placeholder="Username" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <br></br>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Password" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <br></br>
                            <Button>Login</Button>
                        </CardContent>
                    </form>
                </Form>
            </Card>
            <div className="flex">
                <p className="text-white text-xs mt-5 mx-auto"><>No account? <Link href="/auth/register" ><u>Register Here.</u></Link></></p>
            </div>
        </main>
    );
}