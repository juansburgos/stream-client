// @ts-nocheck
'use client'

import {useEffect} from "react";
import { useSearchParams } from "next/navigation";

export default function ViewerBody() {
    const params = useSearchParams()

    // let bool = false
    // let bool2 = false
    let sourceBuffer, video, ws2 = null, media;
    let queue = [];

    useEffect(() => {
        // navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
            // @ts-ignore
            /*var ws = null, mediaRecorder;

            var options = {
                mimeType: "video/webm;codecs=opus, vp8",
                bitsPerSecond: 5000 //quality
            };


            function connect() {
                let randomId = Math.floor(Math.random() * 10000) + 1;
                ws = new WebSocket("ws://localhost:8080/rooms/0?Id=" + randomId + "&username=frontStreamer");
                ws.binaryType = "arraybuffer"
                mediaRecorder = new MediaRecorder(stream, options);
                mediaRecorder.ondataavailable = function (e) {

                    if (e.data && e.data.size > 0) {
                        e.data.arrayBuffer().then(buffer => {
                            // @ts-ignore
                            ws.send(buffer)
                            console.log("Sent: ", e.data.size)
                        })
                    }
                }
                mediaRecorder.start(300);
                bool = true
            }
            */
            // let sourceBuffer,ws2 = null, video, media;
            // let queue = [];

            function handleStream(e) {
                if (media.readyState != 'open'){
                    console.log("not open")
                    return
                }
                const buffer = e.data
                console.log("Buffer: ", buffer)
                if (!buffer) return
                if (sourceBuffer.updating) {
                    queue.push(buffer)
                } else {
                    sourceBuffer.appendBuffer(buffer)
                }
            }

            function createVideo() {
                // if (bool2) return
                media = new MediaSource();
                media.onsourceopen = () => {
                    // setTimeout(() => {
                    //
                    // }, 500)
                    sourceBuffer = media.addSourceBuffer("video/webm;codecs=opus, vp8");
                    sourceBuffer.onupdateend = () => {
                        if (queue.length > 0 && !sourceBuffer.updating) {
                            sourceBuffer.appendBuffer(queue.shift())
                        }
                    }
                    sourceBuffer.mode = "segments"
                }
                video = document.getElementById('videoID')
                video.oncanplay = e => video.play()
                video.src = URL.createObjectURL(media);
                video.onerror = e => {
                    console.log("ERROR VIDEO:", e)
                }
                // bool2 = true
            }

            function connect2(){
                const id  = params.get('id')
                console.log("id v ",id)
                // if (bool2) {
                //     return
                // }
                let randomId = Math.floor(Math.random() * 10000) + 1;
                ws2 = new WebSocket("ws://localhost:8080/rooms/"+id+"?Id=" + randomId + "&username=frontViewer");
                ws2.binaryType = "arraybuffer"
                // ws2.onopen = createVideo
                ws2.onmessage = handleStream
            }
            //connect()
            createVideo()
            connect2()
    })

    // })

    return (
        <div>
            <video style={{maxWidth:1200, maxHeight:800}} id="videoID"></video>
        </div>
    )
}
