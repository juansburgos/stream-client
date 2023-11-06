'use client'
import { useState, useRef, useContext, useEffect } from "react";
import ChatBody from '../Component/chat_body'
import StreamBody from '../Component/stream_body'
import { WebsocketContext } from "@/app/websocket_provider";
import { useRouter } from "next/navigation";

export type Message = {
    content: string,
    username: string,
    type: 'recv' | 'self'
}
const fake_usernames = ["Juan", "Carlos", "Mariana", "Marcelo", "Romina", "Javier"]
let username = fake_usernames[Math.floor(Math.random()*fake_usernames.length)];
export default function Room() {

    const [messages, setMessage] = useState<Array<Message>>([])
    const textarea = useRef<HTMLTextAreaElement>(null)
    const { conn } = useContext(WebsocketContext)
    const router = useRouter()

    // useEffect(() => {
    //     if (conn === null) {
    //         router.push("/")
    //         return
    //     }
    //
    //     conn.onmessage = (message) => {
    //         console.log("onmessage")
    //         const m: Message = JSON.parse(message.data)
    //         m.type = 'recv'
    //         setMessage([...messages, m])
    //     }
    //
    //     conn.onclose = () => {}
    //     conn.onerror = () => {}
    //     conn.onopen = () => {}
    //
    // }, [textarea, messages, conn, router])

    // const sendMessage = () => {
    //     if (!textarea.current?.value) return
    //     if (conn === null) {
    //         router.push("/")
    //         return
    //     }
    //     let m: Message = {
    //         content: textarea.current.value,
    //         type: 'self',
    //         username: username
    //     }
    //     conn.send(m.content)
    //     textarea.current.value = ''
    //
    //     setMessage([...messages, m])
    // }

    return (
        <>
            <div style={{resize: "none"}}>
                <StreamBody />
            </div>
            <div style={{resize: "none"}}> 123 hola on main </div>
            <div className='flex flex-col w-full'>
                {/*<div style={{resize: "none"}}>*/}
                {/*    <ChatBody data={messages}/>*/}
                {/*</div>*/}
                {/*<div style={{border:"blue", borderStyle: "solid", flex: "auto", }}>*/}
                {/*    <textarea ref={textarea}*/}
                {/*        placeholder='type here'*/}
                {/*        style={{resize: "none"}}*/}
                {/*    />*/}
                {/*</div>*/}
                {/*<button onClick={sendMessage}> Send </button>*/}
            </div>
        </>
    )
}