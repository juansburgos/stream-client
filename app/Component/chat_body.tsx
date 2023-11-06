'use client'
import { Message } from "@/app/room/page";

export default function ChatBody( {data} : {data: Array<Message> }) {
    return(
        <div>
            {data.map((message: Message, index: number) => {
                if(message.type == 'recv') {
                    return(
                        <div key={index} style={{background:"lightblue"}}>
                            <div>{message.username}</div>
                            <div>{message.content}</div>
                        </div>
                    )
                } else {
                    // @ts-ignore
                    return(
                        <div key={index} style={{background:"gray"}}>
                            <div>{message.username}</div>
                            <div>{message.content}</div>
                        </div>
                    )
                }
            })}
        </div>
    )
}