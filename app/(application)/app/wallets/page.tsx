"use client";
import { Skeleton } from "@/components/ui/skeleton"
import { AiFillPlusCircle } from "react-icons/ai"
import { FaWallet } from "react-icons/fa";
import { App } from '@/components/authCheck';
import { BsPlusCircle } from "react-icons/bs";
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
    return data;
}

export default function Reloads() {
    const [walletData, setData] = useState<wallets[]>([]);
  const [authed, setAuthed] = useState<boolean>(false);
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
                                <Link href={"/app/wallets/" + walletItem.id}>
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
                { loading ? (<></>) : (<>
                <Link href="/app/wallets/create">
                    <Card className="hover:shadow-xl transition duration-300 group">
                        <CardHeader>
                            <p className="font-medium text-5xl mx-auto pt-5 grid grid-cols-3"><BsPlusCircle className="scale-0 group-hover:scale-100 transition duration-300"/><AiFillPlusCircle className="group-hover:scale-0 transition duration-300 col-start-2"/><FaWallet className="scale-0 group-hover:scale-100 transition duration-300 col-start-3"/></p>
                            <p className="font-semibold mx-auto">Create new Wallet</p>
                        </CardHeader>
                        <CardFooter>
                            
                        </CardFooter>
                    </Card>
                </Link>
                </>)}
                
            </div>
        </main>
    );
}