"use client"

import { ColumnDef } from "@tanstack/react-table"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Spend = {
    id: number;
    userid: number;
    remark: string;
    amount: number;
    walletid: string;
    recslug: string;
    fulfilled_at: string;
}

export const columns: ColumnDef<Spend>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "remark",
    header: "Spending",
  },
  {
    accessorKey: "walletid",
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
    accessorKey: "fulfilled_at",
    header: "Fulfilled On",
    cell: ({ row }) => {
        const fulfill = String (row.getValue("fulfilled_at"));
        if (fulfill == "null" || fulfill == null || fulfill == "") {
            return <div className="text-left font-medium">N/A</div>
        }
        
        return <div className="text-left font-medium">{fulfill}</div>
    },
  },
]
