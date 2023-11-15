"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  date: string;
  amount: number;
  wallet: string;
}


export const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "date",
    header: "Payment Date",
    cell: ({ row }) => {
      const datePaid = new Date(String(row.getValue("date")));
      const formatted = datePaid.toLocaleString('en-GB');
      return <div className="text-left font-medium">{formatted}</div>
    },
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
    accessorKey: "wallet",
    header: "Wallet",
  }
]
