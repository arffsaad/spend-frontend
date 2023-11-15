"use client";
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { App } from '@/components/authCheck';
import { DataTable } from "./datatable";
import { Payment, paymentColumns } from "./paymentcolumns";
import { useState, useEffect } from "react";
import useUserStore from '@/components/userStore';
import useStore from '@/components/useStore';
import useMsgStore from '@/components/msgStore';
import { useToast } from '@/components/ui/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type data = {
    data: instalment;
    payments: Payment[];
}

type instalment = {
    id: number;
    amountLeft: number;
    amountDue: number;
    months: number;
    name: string;
}

type wallets = {
    id: number;
    name: string;
    amount: number;
    userid: number;
    createdtime: string;
}

async function getData(id: number): Promise<data> {
    const response = await fetch('/api/instalments/' + id, {
        method: 'GET',
        headers: {
            "Token": useUserStore.getState().token
        }
    });

    if (response.status == 401) {
        useStore(useUserStore, (state) => state.resetUser());
    }

    const data = await response.json();
    return data;
}

export default function Instalment({ params }: { params: { id: number } }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [authed, setAuthed] = useState<boolean>(false);
    const [instalment, setInstalment] = useState<instalment>();
    const [payment, setPayment] = useState<Payment[]>([]);
    const { toast } = useToast();
    const [walletData, setData] = useState<wallets[]>([]);
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
    const fetchData = async () => {
        try {
            const newData = await getData(params.id);
            setInstalment(newData.data);
            setPayment(newData.payments);
            const walletData = await fetchWallets();
            setData(walletData);
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
        const toToast = useMsgStore.getState().instalmentsPage;
        if (toToast != "") {
            const timeout = setTimeout(() => {
                toast({
                    description: toToast,
                    variant: useMsgStore.getState().msgType == "error" ? "destructive" : "default"
                })
                useMsgStore.setState({ instalmentsPage: "" , msgType: ""});
            }, 0)
            return (() => clearTimeout(timeout))
        }
    }, [toast, useMsgStore.getState().instalmentsPage])
    useEffect(() => {
        checkAuth();
        fetchWallets();
        fetchData(); // Fetch data on initial component mount
        setLoading(false);
    }, []);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = document.getElementById("payForm") as HTMLFormElement;
        const formData = new FormData(form);
        const data: any = {};
        formData.forEach((value, key) => data[key] = value);
        data["amountPaid"] = parseFloat(data["amountPaid"]) * 100;
        data["walletId"] = parseInt(data["walletId"]);
        fetch('/api/instalments/' + params.id + "/pay", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Token": useUserStore.getState().token
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status == 401) {
                useStore(useUserStore, (state) => state.resetUser());
            }
            if (response.status == 200) {
                useMsgStore.setState({ instalmentsPage: "Payment success!" });
                window.location.href = "/app/instalments/" + params.id;
            }
            else {
                response.json().then(data => {
                    toast({
                        description: "Error performing payment: " + data.message,
                        variant: useMsgStore.getState().msgType == "error" ? "destructive" : "default"
                    })
                    useMsgStore.setState({ instalmentsPage: "Error performing payment: " + data.message, msgType: "error" });
                });
            }
        })
    }

    return (
        <main className="p-24">
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl text-heavy">
                        {loading ? <Skeleton className="w-[100px] h-[20px] rounded-full" /> : instalment?.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ?
                        <Skeleton className="w-[100px] h-[20px] rounded-full" /> :
                        <CardDescription>
                            <div className="grid grid-cols-5 sm:grid-cols-3 xs:grid-cols-2 justify-center">
                                <div>
                                    <p className="text-sm">Balance:</p>
                                    {instalment && (
                                        <span className="text-xl font-bold">{"RM " + (instalment.amountLeft / 100).toFixed(2)}</span>
                                    )}
                                </div>
                                <div className={(instalment && instalment.amountDue > 0 ? "text-red-500" : "text-green-500")}>
                                    <p className="text-sm">Amount Due:</p>
                                    {instalment && (
                                        <span className="text-xl font-bold ">{"RM " + (instalment.amountDue / 100).toFixed(2)}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm">Months Left:</p>
                                    {instalment && (
                                        <span className="text-xl font-bold ">{instalment.months}</span>
                                    )}
                                </div>
                            </div>
                        </CardDescription>}

                </CardContent>
                <CardFooter>
                    {loading ? <p></p> :
                        <>
                            <Dialog>
                                <DialogTrigger asChild><Button variant="outline">Pay</Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Make a payment</DialogTitle>
                                        <DialogDescription>
                                            Insert amount paid towards this instalment
                                        </DialogDescription>
                                    </DialogHeader>
                                    <>
                                        <form id="payForm" onSubmit={onSubmit}>
                                            <div className="flex flex-col mb-5">
                                                <label htmlFor="amount" className="text-sm font-bold">Amount (RM)</label>
                                                <input type="number" id="amount" name="amountPaid" className="border border-gray-300 rounded-lg p-2" />
                                            </div>
                                            {/* dropdown */}
                                            <div className="flex flex-col">
                                                <label htmlFor="wallet" className="text-sm font-bold">Wallet</label>
                                                <select id="wallet" name="walletId" className="border border-gray-300 rounded-lg p-2">
                                                    {walletData.map(walletItem => (
                                                        <option key={walletItem.id} value={walletItem.id.toString()}>{walletItem.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* submit button */}
                                            <div className="flex justify-end mt-5">
                                                <Button type="submit" className="bg-primary text-white rounded-lg px-5 py-2">Pay</Button>
                                            </div>
                                        </form>
                                    </>
                                </DialogContent>
                            </Dialog>
                        </>
                    }
                </CardFooter>

            </Card>
            <br></br>
            <h1 className="text-xl font-bold">Recent Payments</h1>
            <br></br>
            <DataTable columns={paymentColumns} data={payment} />
            <br></br>
        </main>
    );
}