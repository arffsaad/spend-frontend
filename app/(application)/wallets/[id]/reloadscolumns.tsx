"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Reloads = {
  id: number;
  amount: number;
  createdtime: string;
  remark: string;
  userid: number;
  walletid: string;
};

export const reloadColumns: ColumnDef<Reloads>[] = [
  {
    accessorKey: "remark",
    header: "Reload",
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
    accessorKey: "createdtime",
    header: "Reload Time"
  },
]
