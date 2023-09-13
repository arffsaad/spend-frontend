"use client";
import Link from 'next/link'
import { Skeleton } from "@/components/ui/skeleton"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "./datatable";
import { Reloads, reloadColumns } from "./reloadscolumns";
import { Spend, spendColumns } from "./spendcolumns";
import { useState, useEffect } from "react";

type Wallets = {
    id: number;
    name: string;
    amount: number;
    userid: number;
    createdtime: string;
    reloads: Reloads[];
    spends: Spend[];
}

async function getData(id: number): Promise<Wallets> {
    const response = await fetch('/api/wallets/' + id, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
}

export default function Wallet({ params }: { params: { id: number } }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<Wallets>();
    const [reload, setReload] = useState<Reloads[]>([]);
    const [spend, setSpend] = useState<Spend[]>([]);
    const fetchData = async () => {
        try {
            const newData = await getData(params.id);
            setWallet(newData);
            setReload(newData.reloads);
            setSpend(newData.spends);
            console.log(newData.reloads)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData(); // Fetch data on initial component mount
        setLoading(false);
    }, []);
    return (
        <main className="p-24">
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="text-xl text-heavy">
                        {loading ? <Skeleton className="w-[100px] h-[20px] rounded-full" /> : wallet?.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ?
                        <Skeleton className="w-[100px] h-[20px] rounded-full" /> :
                        <CardDescription>
                            <p className="text-sm">Balance:</p>
                            {wallet && (
                                <span className="text-xl font-bold">{"RM " + (wallet.amount / 100).toFixed(2)}</span>
                            )}
                        </CardDescription>}

                </CardContent>
                <CardFooter>
                    {loading ? <p></p> :
                        <Link className={buttonVariants({ variant: "outline" })} href="/reload">Reload</Link>
                    }
                </CardFooter>

            </Card>
            <br></br>
            <h1 className="text-xl font-bold">Last 5 Spends</h1>
            <br></br>
            <DataTable columns={spendColumns} data={spend} />
            <br></br>
            <h1 className="text-xl font-bold">Last 5 Reloads</h1>
            <br></br>
            <DataTable columns={reloadColumns} data={reload} />
        </main>
    );
}