// @ts-nocheck
'use client'

import {useEffect} from "react";
import { useSearchParams } from "next/navigation";
import {arrayBuffer} from "stream/consumers";
import {isUint8Array} from "util/types";

export default function StreamBody() {
    const params = useSearchParams()
    var bool = true
    var ws = null, mediaRecorder;
    const id  = params.get('id')
    var mystream
    function connect() {
        // if(bool) return
        let randomId = Math.floor(Math.random() * 10000) + 1;
        ws = new WebSocket("ws://localhost:8080/rooms/" + id + "?Id=" + randomId + "&username=frontStreamer");
        ws.binaryType = "arraybuffer"
        ws.onmessage = (e) => {
            if(ws.readyState != ws.OPEN)
                return
            console.log(e.data.byteLength)
            if (e.data.byteLength != 20)
                return
            mystream.getVideoTracks()[0].stop()
            mystream.getAudioTracks()[0].stop()
            ws.send(new Uint8Array([1, 2, 3, 4, 5]).buffer)
            streamCamera()
        }
    }


    function streamCamera() {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
            // @ts-ignore
            mystream = stream
            var options = {
                mimeType: "video/webm;codecs=opus, vp8",
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 2500000,
            };
            mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorder.ondataavailable = function (e) {
                if (e.data && e.data.size > 0) {
                    e.data.arrayBuffer().then(buffer => {
                        ws.send(buffer)
                    })
                }
            }
            mediaRecorder.start(50);
        })
    }

    useEffect(() => {
        connect()
        streamCamera()
    })

    return (
        <div> HOLA
        </div>
    )
}
