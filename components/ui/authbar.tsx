"use client";
import * as React from "react"
import Link from "next/link"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useUserStore } from "../userStore";

export function AuthBar() {
  return (
    <nav className="p-5">
      <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">Sign in or Register</Button>
      </PopoverTrigger>
      { useUserStore((state) => state.user) == "undefined" ?
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
            <h4 className="font-medium leading-none">{useUserStore((state) => state.email)}</h4>
            <p className="text-sm text-muted-foreground">
              Free Tier{/* tier kinda things */}
            </p>
          </div>
          <div>
            <div className="grid grid-cols-3">
              <Button>Profile</Button>
              <Button className="col-start-3" variant="destructive">Sign Out</Button>
            </div>
            </div>
          </div>
      </PopoverContent>
      )}
    </Popover>
    </nav>
  )
}