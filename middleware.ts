import useUserStore from '@/components/userStore'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = useUserStore.getState().token
    if (request.nextUrl.pathname.startsWith('/app')) {
        const vals = {
            token: token
        }
        const response = await fetch("http://localhost:8080/api/auth/verify", {
            method: "POST",
            body: JSON.stringify(vals),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resp = await response.json();
        if (resp.ok) {
            // let the request continue
            return NextResponse.next()
        }
        else {
            // reset the store
            useUserStore.getState().resetUser()
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    } 
    if (request.nextUrl.pathname.startsWith('/auth')) {
        if (token == "" ) {
            // proceed
            return NextResponse.next()
        }
        else {
            // send to the app
            return NextResponse.redirect(new URL('/app/spends', request.url))
        }
    } else {
        return NextResponse.next()
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: "/:path*"
}