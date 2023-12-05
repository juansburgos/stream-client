'use client'
import StreamBody from '../Component/stream_body'



export default function Room() {

    return (
        <>
            <div style={{resize: "none"}}>
                <StreamBody />
            </div>
            <div className='flex flex-col w-full'>
            </div>
        </>
    )
}