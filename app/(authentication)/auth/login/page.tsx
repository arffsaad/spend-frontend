"use client";
import * as z from "zod"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import useUserStore from "@/components/userStore";
import { Auth } from '@/components/authCheck';
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
import { Metadata } from "next";

export default function login() {
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(false);
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
    useEffect(() => {
        const toToast = useMsgStore.getState().loginPage;
        if (toToast != "") {
            const timeout = setTimeout(() => {
                toast({
                    description: toToast,
                })
                useMsgStore.setState({ loginPage: "" });
            }, 0)
            return (() => clearTimeout(timeout))
        }

    }, [toast, useMsgStore.getState().loginPage])
    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
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
            const data = await response.json();
            if (!response.ok) {
                setLoading(false);
                toast({
                    description: data.message,
                    variant: "destructive"
                })
                throw new Error(data);
            }
            useUserStore.setState(data.data);
            window.location.href = "/app/spends";
        }).catch(error => {

        });
    }

    if (!Auth()) {
        window.location.href = "/app/spends";
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
                            <Button disabled={loading}>{loading ? (<><div role="status">
                                <svg aria-hidden="true" className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div> Logging in...</>) : "Login"} </Button>
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