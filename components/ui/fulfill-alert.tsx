"use client";
import { buttonVariants } from "@/components/ui/button"
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
import { useToast } from "@/components/ui/use-toast"

  
export function FulfillAlert({ id }: { id: number }) {
    const { toast } = useToast()
    const handleClick = async () => {
        try {
            await postFulfill(id);
            toast({
                title: "Spending Fulifilled!",
                description: "Spending for ID #" + id + " has been fulfilled.",
            });
            onFulfill();
            // Replace 123 with the desired ID
        } catch (error) {
            console.error(error);
        }
    };
    return (
    <AlertDialog>
        <AlertDialogTrigger>Fulfill</AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Fullfill this spending? (Spending ID #{id})</AlertDialogTitle>
                <AlertDialogDescription>
                    This basically means you have set aside funds for this spending, making it ready for the statement.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={handleClick}>Fulfill</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    );
}

async function postFulfill(id: number) {
    const response = await fetch("/api/spending/fulfill/" + id, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }
}