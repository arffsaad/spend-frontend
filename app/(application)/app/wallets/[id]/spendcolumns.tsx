"use client"

import Image from "next/image"
import { ColumnDef } from "@tanstack/react-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import useUserStore from "@/components/userStore"
import useStore from "@/components/useStore"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Spend = {
  id: number;
  userid: number;
  remark: string;
  amount: number;
  wallet: string;
  recslug: string;
  fulfilled_at: string;
}

async function fulfillSpend(id: number) {
  const response = await fetch("/api/spending/fulfill/" + id, {
    method: "POST",
    headers: {
      "Token": useUserStore.getState().token
    }
  });
  if (response.status == 401) {
    useStore(useUserStore, (state) => state.resetUser());
  }
}

async function reverseSpend(id: number) {
  const response = await fetch("/api/spending/reverse/" + id, {
    method: "POST",
    headers: {
      "Token": useUserStore.getState().token
    }
  });
  if (response.status == 401) {
    useStore(useUserStore, (state) => state.resetUser());
  }
}

export const spendColumns: ColumnDef<Spend>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "remark",
    header: "Spending",
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
      const fulfill = String(row.getValue("fulfilled_at"));
      if (fulfill == "null" || fulfill == null || fulfill == "") {
        return <div className="text-left font-medium">N/A</div>
      }

      return <div className="text-left font-medium">{fulfill}</div>
    },
  },
  {
    accessorKey: "recslug",
    header: "Receipt",
    cell: ({ row }) => {
      const receipt = String(row.getValue("recslug"));
      if (receipt == "null" || receipt == null || receipt == "") {
        return <div className="text-left font-medium">No Receipt</div>
      }

      return <div className="text-left font-medium">
        <Dialog>
          <DialogTrigger>View</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{row.getValue("remark")}</DialogTitle>
              <DialogDescription className="p-2">
                <div className='h-96 relative'>
                  <img alt={row.getValue("remark")} src={process.env.NEXT_PUBLIC_MINIO_HOST + "/spend-bucket" + receipt} />
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    }
  }
]
