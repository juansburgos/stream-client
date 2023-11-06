"use client";
import React, {useState, useEffect, useContext} from 'react'
import {randomUUID} from "crypto";
import {v4 as uuidv4} from 'uuid'
import { WebsocketContext } from "./websocket_provider"
import { useRouter } from "next/navigation"

const Landing = () => {

const fake_usernames = ["Juan", "Carlos", "Mariana", "Marcelo", "Romina", "Javier"]

const [roomName, setRoomName] = useState('')
const [rooms, setRooms] = useState<{ id: string; name:string; ownerName: string }[]>([])
const { setConn } = useContext(WebsocketContext)
const router = useRouter()
    const getRooms = async () => {
        try {
            const res = await fetch(`http://localhost:8080/rooms`, {
                method: 'GET',
            })
            const rooms = await res.json()
            if (res.ok) {
                setRooms(rooms as { id: string; name:string; ownerName: string }[])
            }

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getRooms()
    }, [])
    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            setRoomName('')
            let fake_username = fake_usernames[Math.floor(Math.random()*fake_usernames.length)]
            const res = await fetch(`http://localhost:8080/rooms`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: uuidv4(),
                    name: roomName,
                    ownerName: fake_username,
                    ownerId: uuidv4()
                })
            })
            if (res.ok) {
                console.log("llego res")
                getRooms()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const joinRoom = (roomId: string) => {
        let username = fake_usernames[Math.floor(Math.random()*fake_usernames.length)];
        const ws = new WebSocket(`ws://localhost:8080/rooms/${roomId}?Id=${uuidv4()}&username=${username}`)
        if (ws.OPEN) {
            setConn(ws)
            router.push('/room')
            return
        } else {
            router.push('/room')
        }
    }

  return(
      <>
          <div>
              <input
                  style={{margin: 20, marginBottom: 0}}
                  type='text'
                  placeholder='Room name'
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
              />
          </div>
          <div>
              <button style={{marginLeft: 20}} onClick={submitHandler}>Create Room</button>
          </div>
          <div className='mt-6' style={{margin: 20}}>
              <div className='font-bold'>Available Rooms</div>
              <div style={{display:"flex", borderWidth:4, borderColor:"white"}}>
                  {rooms.map((room, index) => (
                      <span key={index} style={{margin: 10, marginBottom:20, maxWidth: 300, borderStyle:"solid", borderColor:"white", padding: 6}}>
                          <div>{room.name}</div>
                          <div>owner: {room.ownerName}</div>
                          <div>
                              <button onClick={() => joinRoom(room.id as string)}>Join</button>
                          </div>
                      </span>
                  ))}
              </div>
          </div>
      </>
  )
}

export default Landing