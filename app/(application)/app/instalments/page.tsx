"use client";
import { Skeleton } from "@/components/ui/skeleton"
import { AiFillPlusCircle } from "react-icons/ai"
import { FaWallet } from "react-icons/fa";
import { App } from '@/components/authCheck';
import { BsFillCalendar2WeekFill } from "react-icons/bs";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
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
type instalments = {
    id: number;
    amountLeft: number;
    amountDue: number;
    months: number;
    name: string;
    monthly: number;
}

async function fetchWallets(): Promise<instalments[]> {
    const response = await fetch('/api/instalments/user', {
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

export default function Instalments() {
    const [instalmentsData, setData] = useState<instalments[]>([]);
  const [authed, setAuthed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
    const fetchData = async () => {
        try {
            const newData = await fetchWallets();
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
                            instalmentsData.map(item => (
                                <Link key={item.id} href={"/app/instalments/" + item.id}>
                                    <Card className="hover:shadow-xl transition duration-300">
                                        <CardHeader>
                                            <div className="grid grid-cols-2">
                                                <CardTitle className="text-xl text-heavy">{item.name}</CardTitle>
                                                <div className="place-self-end pr-3">
                                                    {(item.amountDue) > (2 * item.monthly) ? (
                                                    <>
                                                    <IconContext.Provider value={{ color: "red", className: "global-class-name" }}>
                                                        <FaExclamationTriangle className="text-xl" />
                                                    </IconContext.Provider>
                                                    </>
                                                    ) : (item.amountDue) > item.monthly ? (
                                                    <>
                                                    <IconContext.Provider value={{ color: "orange", className: "global-class-name" }}>
                                                        <FaExclamationTriangle className="text-xl" />
                                                    </IconContext.Provider>
                                                    </>
                                                    ) : (
                                                    <>
                                                    <IconContext.Provider value={{ color: "green", className: "global-class-name" }}>
                                                        <FaCheckCircle className="text-xl" />
                                                    </IconContext.Provider>
                                                    </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 xs:grid-cols-1">
                                                <div>
                                                    <p className="text-sm">Balance:</p>
                                                    <span className="text-xl font-bold">{"RM " + ((item.amountLeft / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm">Due:</p>
                                                    <span className="text-xl font-bold">{"RM " + ((item.amountDue / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                </div>
                                                <div className="pt-5">
                                                    <p className="text-sm">Months left:</p>
                                                    <span className="text-xl font-bold">{item.months}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            )))
                }
                { loading ? (<></>) : (<>
                <Link href="/app/instalments/create">
                    <Card className="hover:shadow-xl transition duration-300 group pt-8 pb-9">
                        <CardHeader>
                            <p className="font-medium text-5xl mx-auto pt-5 grid grid-cols-3"><BsFillCalendar2WeekFill className="scale-0 group-hover:scale-90 transition duration-300"/><AiFillPlusCircle className="group-hover:scale-0 transition duration-300 col-start-2"/><FaWallet className="scale-0 group-hover:scale-100 transition duration-300 col-start-3"/></p>
                            <p className="font-semibold mx-auto">Track an Instalment</p>
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