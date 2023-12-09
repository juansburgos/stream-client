// @ts-nocheck
'use client'

import {useEffect} from "react";
import { useSearchParams } from "next/navigation";

export default function StreamBody() {
    const params = useSearchParams()
    var bool = false
    var bool2 = false
    var i = 0
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
            // @ts-ignore
            var ws = null, mediaRecorder;

            var options = {
                mimeType: "video/webm;codecs=opus, vp8",
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 2500000,
            };

            function connect() {
                if(bool) return
                const id  = params.get('id')
                console.log("id ",id)
                let randomId = Math.floor(Math.random() * 10000) + 1;
                ws = new WebSocket("ws://localhost:8080/rooms/" + id + "?Id=" + randomId + "&username=frontStreamer");
                ws.binaryType = "arraybuffer"
                mediaRecorder = new MediaRecorder(stream, options);
                mediaRecorder.ondataavailable = function (e) {

                    if (e.data && e.data.size > 0) {
                        e.data.arrayBuffer().then(buffer => {
                            // @ts-ignore
                            i += 1
                            if (i > 20 && i < 25) return
                            ws.send(buffer)
                        })
                    }
                }
                mediaRecorder.start(1000);
                bool = true
            }

            var sourceBuffer,ws2 = null, video, media;
            var queue = [];

            function handleStream(e) {
                const buffer = e.data
                console.log("Appending: ", buffer.size)
                if (sourceBuffer.updating) {
                    queue.push(buffer)
                } else {
                    sourceBuffer.appendBuffer(buffer)
                }
            }

            function createVideo() {
                media = new MediaSource();
                media.onsourceopen=function() {
                    sourceBuffer = media.addSourceBuffer("video/webm;codecs=opus, vp8");
                    sourceBuffer.onupdate = e => {
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
                    console.log("ERROR VIDEO")
                }
            }

            /*function connect2(){
                const id  = params.get('id')
                console.log("id v ",id)
                if (bool2) {
                    return
                }
                let randomId = Math.floor(Math.random() * 10000) + 1;
                ws2 = new WebSocket("ws://localhost:8080/rooms/"+id+"?Id=" + randomId + "&username=frontViewer");
                ws2.binaryType = "arraybuffer"
                ws2.onopen = createVideo
                ws2.onmessage = handleStream
                bool2 = true
            }*/

            connect()
            //connect2()
        })

    })

    return (
        <div>
            <video style={{maxWidth:1200, maxHeight:800}} id="videoID"></video>
        </div>
    )
}
