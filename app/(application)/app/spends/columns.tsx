"use client"
import Link from 'next/link'
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
import useUserStore from '@/components/userStore'
import useStore from '@/components/useStore'
import useMsgStore from '@/components/msgStore'


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Spend = {
  id: number;
  userid: number;
  remark: string;
  amount: number;
  wallet: string;
  walletid: number;
  recslug: string;
  fulfilled_at: string;
}

async function fulfillSpend(id: number) {
  const response = await fetch("/api/spending/fulfill/" + id, {
    method: "POST",
    headers : {
      "Token" : useUserStore.getState().token
    }
  });
  const data = await response.json();
  if (response.status == 401) {
    useStore(useUserStore, (state) => state.resetUser());
} else if (response.status != 200) {
    useMsgStore.setState({ spendsPage: data.message });
}
}

async function reverseSpend(id: number) {
  const response = await fetch("/api/spending/reverse/" + id, {
    method: "POST",
    headers: {
      "Token" : useUserStore.getState().token
    }
  });
  if (response.status == 401) {
        useStore(useUserStore, (state) => state.resetUser());
    }
}

export const columns: ColumnDef<Spend>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "walletid",
    header: "Wallet ID"
  },
  {
    accessorKey: "remark",
    header: "Spending",
  },
  {
    accessorKey: "wallet",
    header: "Wallet",
    cell: ({ row }) => {
      const wallet = String(row.getValue("wallet"));
      const id = parseInt(row.getValue("walletid"));
      return <div className="text-left font-medium">
        <Link href={"/app/wallets/" + id}>{wallet}</Link>
      </div>
    }
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
    header: "Fulfill",
    cell: ({ row }) => {
      const fulfill = String(row.getValue("fulfilled_at"));
      const id = parseInt(row.getValue("id"));
      const handlefulfill = async () => {
        try {
          await fulfillSpend(id);
          window.location.reload();
        } catch (error) {
          console.error(error);
        }
      };
      const handleReverse = async () => {
        try {
          await reverseSpend(id);
          window.location.reload();
        } catch (error) {
          console.error(error);
        }
      };

      if (fulfill == "null" || fulfill == null || fulfill == "") {
        return <div className="text-left font-medium">
          <AlertDialog>
            <AlertDialogTrigger>Fulfill</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Fullfill this spending?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will deduct the amount from the wallet
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handlefulfill}>Fulfill</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      }

      // check if fulfill is more than 8 hours
      const now = new Date();
      const fulfillDate = new Date(fulfill);
      const diff = Math.abs(now.getTime() - fulfillDate.getTime());
      const hours = Math.floor(diff / 1000 / 60 / 60);
      if (hours > 8) {
        return <></>
      }
      return (<div className="text-left font-medium">
        <AlertDialog>
          <AlertDialogTrigger>Reverse</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reverse this spending?</AlertDialogTitle>
              <AlertDialogDescription>
                Wrongly fulfilled this spending? Reverse it!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReverse}>Reverse</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>)
    }
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
                <img src={"/cdn" + receipt} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    }
  }
]
