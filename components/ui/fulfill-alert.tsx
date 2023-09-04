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
  
export function FulfillAlert({ id }: { id: number }) {
    const handleClick = async () => {
        try {
            await postFulfill(id); // Replace 123 with the desired ID
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
    const response = await fetch("https://google.com", {
        method: "GET",
        // no cors
        mode: "no-cors",
    }); // just for the sake of "loading"

    console.log(id);
    console.log(response);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
}