"use client";
import useUserStore from "@/components/userStore";
import { use } from "react";

const token = useUserStore.getState().token;

export async function App() {
    const vals = {
        token: token
    }
    const response = await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify(vals),
        headers: {
            "Content-Type": "application/json"
        }
    }
    ).then(response => {
        if (response.status == 400) {
            useUserStore.getState().resetUser();
            return false;
        }
        else {
            return true;
        }
    })

    return response;
}

export function Auth() {
    if (token == "") {
        return true;
    }
    else {
        return false;
    }
}