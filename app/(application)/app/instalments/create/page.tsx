"use client";

import * as z from "zod"
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { App } from '@/components/authCheck';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import useUserStore from "@/components/userStore";
import useStore from "@/components/useStore";
import useMsgStore from "@/components/msgStore";
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
    const [authed, setAuthed] = useState<boolean>(false);
    const { toast } = useToast();
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
        // trigger dialog
        const trigger = document.getElementById("trigger");
        trigger?.click();
    }, []);
    const formSchema = z.object({
        name: z.string()
            .min(3, { message: "Must be at least 3 characters" })
            .max(50, { message: "Must be at most 50 characters" }),
        totalAmount: z.string()
            .refine((value) => {
                try {
                    const val = parseFloat(value);
                    if (val > 0) {
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
        tenure: z.string()
            .refine((value) => {
                const val = parseInt(value);
                return val > 0;
            }),
        paid: z.string()
            .refine(data => {
                const result: number = parseInt(form.getValues("tenure"))
                return parseInt(data) < result;
            }, {
                message: "Paid months must be lower than tenure",
            }),
        dueDay: z.string().
            refine((value) => {
                const val = parseInt(value);
                if (val > 0 && val < 29) {
                    return true;
                }
                else {
                    return false;
                }
            })
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            totalAmount: "",
            tenure: "",
            paid: "",
            dueDay: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const months = parseInt(values.tenure);
        const paid = parseInt(values.paid);
        const monthsLeft = months - paid;

        // calculate how much total left
        const totalInitial = Math.round(parseFloat(values.totalAmount) * 100);
        const totalLeft = Math.round(totalInitial - ((totalInitial / months) * paid));

        const vals = {
            name: values.name,
            totalAmt: totalLeft,
            months: monthsLeft,
            dueDate: parseInt(values.dueDay),
        }
        fetch("/api/instalments/create", {
            method: "POST",
            body: JSON.stringify(vals),
            headers: {
                "Content-Type": "application/json",
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
            } else {
                useMsgStore.setState({ spendsPage: data.message, msgType: "success" });
                // redirect to spends page if successful
                const redir = data.data.id;
                window.location.href = "/app/instalments/" + redir;
            }

        }).catch(error => {
            console.error(error);
        })
    }

    const[pressed, setPressed] = useState<boolean>(false);


    return (
        <main className="p-24">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instalment Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Phone" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Label for this Instalment
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="totalAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Purchase Amount (RM)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="5000.00" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Total amount of purchase
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tenure"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tenure Length (Months)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="24" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Total length of tenure
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="paid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Months paid</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="4" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        For ongoing instalments, enter the number of months paid (0 for new Instalments)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dueDay"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of payment (1-28th)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="5" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Date when the payment is due (e.g 1st of every month, etc)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <Dialog>
                <DialogTrigger asChild>
                    <div className={pressed ? "hidden" : " " + "z-100 w-screen h-screen absolute bottom-0 left-0"} onClick={ () => setPressed(true)}></div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>This feature is in Beta!</DialogTitle>
                        <DialogDescription>
                            Some bugs might occur, however we try to ensure that it is properly calculated every month.<br></br><br></br>
                            Lastly, this feature only supports interest-free instalments only (EPP 0%). Interest-based instalments will be available in the future (hopefully)
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </main>
    );
}

