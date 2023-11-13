// @ts-nocheck
'use client'

import {useEffect} from "react";

export default function StreamBody() {

    var bool = false
    var bool2 = false
    useEffect(() => {
        console.log("antes del getusermedia")
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
            console.log("getusermedia")
            // @ts-ignore
            var ws = null, mediaRecorder;

            var options = {
                mimeType: "video/webm;codecs=opus, vp8",
                bitsPerSecond: 5000 //quality
            };

            function connect() {
                if(bool) {
                    console.log("EN EL IF DE CONNECT 1")
                    return
                }
                console.log("CONNECT 1")
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
                    sourceBuffer.mode = "sequence"
                }
                video = document.getElementById('videoID')
                video.oncanplay = e => video.play()
                video.src = URL.createObjectURL(media);
                video.onerror = e => {
                    console.log("ERROR VIDEO")
                }
            }

            function connect2(){
                if (bool2) {
                    return
                }
                console.log("CONNECT 2")
                let randomId = Math.floor(Math.random() * 10000) + 1;
                ws2 = new WebSocket("ws://localhost:8080/rooms/0?Id=" + randomId + "&username=frontViewer");
                ws2.binaryType = "arraybuffer"
                ws2.onopen = createVideo
                ws2.onmessage = handleStream
                bool2 = true
            }
            connect()
            connect2()
        })

    })

    return (
        <div>
            <video style={{maxWidth:1200, maxHeight:800}} id="videoID"></video>
        </div>
    )
}
