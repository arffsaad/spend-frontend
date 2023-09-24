import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"


export function CheckBadge(props: { text: string }) {
    useEffect(() => {}), [props.text]
    return (
        // if text is valid, return a green badge else return a red badge
        props.text == "" ? <></> : 
        props.text == "too short" ? <Badge className="bg-red-500 ml-auto">Too short!</Badge> :
        props.text == "loading" ? 
            <Badge className="ml-auto">checking...</Badge> 
            : props.text == "Available" ? 
                <Badge className="bg-green-500 ml-auto">Available!</Badge>
                : <Badge className="bg-red-500 ml-auto">Taken</Badge>

    )
}