"use client"

import { ColumnDef } from "@tanstack/react-table"
import { FulfillAlert } from "@/components/ui/fulfill-alert";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Spend = {
    id: number;
    description: string;
    amount: number;
    wallet: string;
    image: string;
    fulfilled: string;
}

export const columns: ColumnDef<Spend>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "description",
    header: "Spending",
  },
  {
    accessorKey: "wallet",
    header: "Source",
  },
  {
    accessorKey: "amount",
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
        const amount = parseInt(row.getValue("amount"));
        const formatted = "RM" + (amount / 100).toFixed(2);
 
        return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "fulfilled",
    header: "Fulfilled On",
    cell: ({ row }) => {
        const fulfill = String (row.getValue("fulfilled"));
        const spendId = Number (row.getValue("id"));
        if (fulfill == "null" || fulfill == null || fulfill == "") {
            return <FulfillAlert id={spendId} />
        }
        
        return <div className="text-left font-medium">{fulfill}</div>
    },
  },
]
