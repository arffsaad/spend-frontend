"use client";
import { useState, useEffect } from 'react';
import { Spend, columns } from './columns';
import { DataTable } from './datatable';
import { Button } from '@/components/ui/button';
import useUserStore from '@/components/userStore';
import useStore from '@/components/useStore';
import { App } from '@/components/authCheck';
import { set } from 'zod';
import useMsgStore from '@/components/msgStore';


async function getData(): Promise<Spend[]> {
  const response = await fetch('/api/spending/user', {
    method: 'GET',
    headers: {
      "Token": useUserStore.getState().token
    }
  });

  if (response.status == 401) {
    useStore(useUserStore, (state) => state.resetUser());
  }

  const data = await response.json();
  return data.data;
}

export default function Spends() {
  const [data, setData] = useState<Spend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authed, setAuthed] = useState<boolean>(false);
  const [hasWallets, setHasWallets] = useState<boolean>(false);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const newData = await getData();
      const wallets = await fetch('/api/wallets/user', {
        method: 'GET',
        headers: {
          "Token": useUserStore.getState().token
        }
      });
      await wallets.json().then((data) => {
        if (data.length == 0) {
          setHasWallets(false);
        } else {
          setHasWallets(true);
        }
      });
      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
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
  }, []);
  return (
    <main className="p-24">
      <Button onClick={fetchData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Refresh'}
      </Button>
      <br></br>
      <br></br>
      <DataTable columns={columns} data={data} hasWallets={hasWallets}/>
    </main>
  );
}
