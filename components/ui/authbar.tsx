"use client";
import * as React from "react"
import Link from "next/link"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"



import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import useUserStore from "../userStore";
import useStore from "../useStore";

export function AuthBar() {
  const username = useStore(useUserStore, (state) => state.user)
  const email = useStore(useUserStore, (state) => state.email)
  async function logout() {
    setLoggingOut(true)
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Token": useUserStore.getState().token
      },
    }).then(() => {
      useUserStore.getState().resetUser()

      window.location.href = "/auth/login"
    })
  }
  const [loggingOut, setLoggingOut] = useState(false)
  useEffect(() => {

  }, [username])
  return (
    <nav className="p-5">
      <Popover>
        <PopoverTrigger asChild>
          {username == "" ? <Button variant="ghost">Sign in or Register</Button> : <Button variant="ghost">{username}</Button>}
        </PopoverTrigger>
        {loggingOut ? <PopoverContent className="w-80">
          {/* Spinner */}
          <h1>Signing out...</h1>
        </PopoverContent> : username == "" ?
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Not Signed in</h4>
              </div>
              <div>
                <div className="grid grid-cols-3">
                  <Link href="/auth/login"><Button variant="secondary">Sign in</Button></Link>
                  <Link href="/auth/register"><Button className="col-start-3">Register</Button></Link>
                </div>
              </div>
            </div>
          </PopoverContent> : (
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">{email}</h4>
                  <p className="text-sm text-muted-foreground">
                    Free Tier{/* tier kinda things */}
                  </p>
                </div>
                <div>
                  <div className="grid grid-cols-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger><Button disabled>Profile</Button></TooltipTrigger>
                        <TooltipContent>
                          Feature coming soon!
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button onClick={async () => logout()} className="col-start-3" variant="destructive">Sign Out</Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          )}
      </Popover>
    </nav>
  )
}