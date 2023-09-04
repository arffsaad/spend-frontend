import { Spend, columns } from "./columns"
import { DataTable } from "./datatable"

// dummy data for now
async function getData(): Promise<Spend[]> {
    return [
        {  
            id: 1,
            description: "test1",
            amount: 5000,
            wallet: "Grocery",
            image: "test",
            fulfilled: "2023-08-09"
        },
        {
            id: 2,
            description: "test2",
            amount: 1000,
            wallet: "Daily",
            image: "test",
            fulfilled: "null"
        }
    ];
}

export default async function Spends() {

    const data = await getData()

    return (
        <main className="p-24">
                <DataTable columns={columns} data={data} />
        </main>
    );
}