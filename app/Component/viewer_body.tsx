// @ts-nocheck
'use client'

import {useEffect} from "react";
import { useSearchParams } from "next/navigation";

export default function ViewerBody() {
    const params = useSearchParams()

    let sourceBuffer, video, ws2 = null, media;
    let queue = [];

    function connect2(){
        const id  = params.get('id')
        console.log("id v ",id)
        let randomId = Math.floor(Math.random() * 10000) + 1;
        ws2 = new WebSocket("ws://localhost:8080/rooms/"+id+"?Id=" + randomId + "&username=frontViewer");
        ws2.binaryType = "arraybuffer"
        ws2.onmessage = handleStream
    }

    function handleStream(e) {
        const buffer = e.data
        if (!buffer) return
        if (buffer.byteLength == 5)
            createVideo()
        if(buffer.byteLength == 20)
            return
        if (media.readyState != 'open')
            return
        console.log("Buffer: ", buffer)
        if (sourceBuffer.updating) {
            queue.push(buffer)
        } else {
            sourceBuffer.appendBuffer(buffer)
        }
    }

    function createVideo() {
        media = new MediaSource();
        media.onsourceopen = () => {
            sourceBuffer = media.addSourceBuffer("video/webm;codecs=opus, vp8");
            sourceBuffer.onupdateend = () => {
                if (queue.length > 0 && !sourceBuffer.updating) {
                    sourceBuffer.appendBuffer(queue.shift())
                }
            }
            sourceBuffer.mode = "segments"
        }
        video = document.getElementById('videoID')
        video.oncanplay = () => video.play()
        video.src = URL.createObjectURL(media);
        video.onerror = e => {
            console.log(e)
            createVideo()
        }
    }

    useEffect(() => {
            createVideo()
            connect2()
    })

    return (
        <div>
            <video controls={false} style={{maxWidth:1200, maxHeight:800, width:1200, height:800}} id="videoID"></video>
        </div>
    )
}
