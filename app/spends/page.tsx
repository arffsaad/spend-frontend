"use client";
import { useState, useEffect } from 'react';
import { Spend, columns } from './columns';
import { DataTable } from './datatable';
import { Button } from '@/components/ui/button';


async function getData(): Promise<Spend[]> {
  const response = await fetch('/api/spending/user/1', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return data.data;
}

export default function Spends() {
  const [data, setData] = useState<Spend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const newData = await getData();
      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData(); // Fetch data on initial component mount
  }, []);

  return (
    <main className="p-24">
      <Button onClick={fetchData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Reload Data'}
      </Button>
      <br></br>
      <br></br>
      <DataTable columns={columns} data={data} />
    </main>
  );
}
