"use client";

import * as z from "zod"
import React from "react"
import Link from "next/link"
import { set, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckBadge } from "@/components/ui/checkbadge"
import { useState, useEffect } from "react"
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
import useMsgStore from "@/components/msgStore";
import { useToast } from "@/components/ui/use-toast";


export default function register() {
    const [validName, setValidName] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [namebadge, setNamebadge] = useState("");
    const { toast } = useToast()
    const [username, setUsername] = useState("");
    const formSchema = z.object({
        name: z.string()
            .min(3, { message: "Must be at least 3 characters" })
            .max(15, { message: "Must be at most 15 characters" })
            .refine(() => {
                if (validName || namebadge != "taken") {
                    return true;
                }
                return validName;
            }, { message: "Username already taken" }),
        email: z.string()
            .email({ message: "Must be a valid email" }),
        password: z.string()
            .min(6, { message: "Must be at least 6 characters" })
            .max(50, { message: "Must be at most 15 characters" }),
        confirm: z.string()
            .refine(data => {
                const result: string = form.getValues("password")
                return data == result;
            }, {
                message: "Passwords must match",
            })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const vals = {
            name: values.name,
            email: values.email,
            password: values.password,
        }
        fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(vals),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async response => {
            const data = await response.json();
            if (!response.ok) {
                setLoading(false);
                toast({
                    description: data.message,
                    variant: "destructive"
                })
                throw new Error(data);
            }
            useMsgStore.setState({ loginPage: "Registration Success! Please Login." });
            setLoading(false);
            window.location.href = "/auth/login";
        }).catch(error => {
            console.error(error);
        })
    }

    async function validateName() {
        setValidName(false);
        if (form.getValues("name") != username && form.getValues("name") != undefined && form.getValues("name") != "" && form.getValues("name").length > 3) {
            console.log('changed')
            setUsername(form.getValues("name"))
            const response = await fetch("/api/auth/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ value: form.getValues("name"), type: "username" }),
            });
            if (response.status != 200) {
                setNamebadge("taken");
            } else {
                setNamebadge("Available")
                setValidName(true);
            }
        }
        else {
            if (form.getValues("name").length < 4) {
                setNamebadge("");
            }
            console.log('no change')
        }
    }

    return (
        <main>
            <Card className="hover:glow-xl transition duration-300 py-5 px-5 justify-center">
                <CardHeader>
                    <CardTitle className="text-xl text-heavy">Register</CardTitle>
                    <CardDescription>Create your account.</CardDescription>
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
                                            <FormLabel className="my-auto">Username</FormLabel><CheckBadge text={namebadge} />
                                        </div>
                                        <FormControl >
                                            <Input placeholder="Username" {...field} onBlur={async () => validateName()} />
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail</FormLabel>
                                        <FormControl>
                                            <Input placeholder="user@gmail.com" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <br></br>
                            <div className="grid grid-cols-2">
                                <div className="mr-5">
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
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="confirm"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Password" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <br></br>
                            <Button>Register</Button>
                        </CardContent>
                    </form>
                </Form>
            </Card>
            <div className="flex">
                <p className="text-white text-xs mt-5 mx-auto"><>Have an account? <Link href="/auth/login" ><u>Sign in.</u></Link></></p>
            </div>
        </main>
    );
}