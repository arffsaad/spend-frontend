"use client";
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from "react";
type wallets = {
    id: number;
    name: string;
    amount: number;
    userid: number;
    createdtime: string;
}

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

export default function Reloads() {
    const [walletData, setData] = useState<wallets[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
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
        setLoading(false);
    }, []);

    return (
        <main className="p-24">
            <div className="items-start justify-center gap-6 rounded-lg p-8 grid md:grid lg:grid-cols-2 xl:grid-cols-3">
                {
                    loading ? (
                        <>
                            <Card className="hover:shadow-xl transition duration-300">
                                <CardHeader>
                                    <CardTitle className="text-xl text-heavy"><Skeleton className="w-[100px] h-[20px] rounded-full" /></CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                                </CardContent>
                                <CardFooter>

                                </CardFooter>
                            </Card>
                            <Card className="hover:shadow-xl transition duration-300">
                                <CardHeader>
                                    <CardTitle className="text-xl text-heavy"><Skeleton className="w-[100px] h-[20px] rounded-full" /></CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                                </CardContent>
                                <CardFooter>

                                </CardFooter>
                            </Card>
                            <Card className="hover:shadow-xl transition duration-300">
                                <CardHeader>
                                    <CardTitle className="text-xl text-heavy"><Skeleton className="w-[100px] h-[20px] rounded-full" /></CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                                </CardContent>
                                <CardFooter>

                                </CardFooter>
                            </Card>
                        </>
                    )
                        : 
                        (
                            walletData.map(walletItem => (
                                <Link href={"/wallets/" + walletItem.id}>
                                    <Card className="hover:shadow-xl transition duration-300">
                                        <CardHeader>
                                            <CardTitle className="text-xl text-heavy">{walletItem.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm">Balance:</p>
                                            <span className="text-xl font-bold">{"RM" + (walletItem.amount / 100).toFixed(2)}</span>
                                        </CardContent>
                                        <CardFooter>

                                        </CardFooter>
                                    </Card>
                                </Link>
                            )))
                }
            </div>
        </main>
    );
}