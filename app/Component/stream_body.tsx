'use client'

export default function StreamBody() {
    console.log("antes del getusermedia")
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
        console.log("getusermedia")
        // @ts-ignore
        var ws, mediaRecorder;
        var options = {
            mimeType: "video/webm;codecs=opus, vp8",
            bitsPerSecond: 5000 //quality
        };

        function handleVideo() {

            try {
                // @ts-ignore
                mediaRecorder.stop()
            } catch (e) {
            }
            mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorder.ondataavailable = function (e) {

                if (e.data && e.data.size > 0) {
                    e.data.arrayBuffer().then(buffer => {
                        // @ts-ignore
                        ws.send(buffer)
                        console.log("send del buffer")
                    })
                }
            }
            mediaRecorder.start(300);
        }

        function connect() {
            ws = new WebSocket("ws://localhost:8080/rooms/0?Id=1010&username=frontStreamer")
            ws.binaryType = "arraybuffer"
            ws.onopen = handleVideo
            ws.onmessage = handleVideo
            ws.onclose = connect
        }

        connect()
    })

    // @ts-ignore
    var sourceBuffer,ws2, video;
    var media = new MediaSource()
    var src = URL.createObjectURL(media);
    media.onsourceopen=function(){
        // @ts-ignore
        sourceBuffer = media.addSourceBuffer("video/webm;codecs=opus, vp8");
    }

    // @ts-ignore
    function handleStream(e){
        // @ts-ignore
        if (video == null) {
            video = document.getElementById('videoID')
            // @ts-ignore
            video.src = src
        }
        // @ts-ignore
        const buffer=e.data
        // const data= new Uint8Array(buffer)
        // if(data[0]===26&&data[1]===69&&data[2]===223){
        //     // @ts-ignore
        //     // if(media){
        //     //     // @ts-ignore
        //     //     URL.revokeObjectURL(media)
        //     //     sourceBuffer=null;
        //     // }
        //
        //     // media = new MediaSource();
        //
        //     // let src = URL.createObjectURL(media);
        //     // @ts-ignore
        //     // video.src = src;
        //     // @ts-ignore
        //     video.onloadedmetadata=function(){
        //         // @ts-ignore
        //         video.muted=false
        //         // @ts-ignore
        //         video.play()
        //     }
        //
        //     media.onsourceopen=function(){
        //         // @ts-ignore
        //         sourceBuffer= media.addSourceBuffer("video/webm;codecs=opus, vp8");
        //         sourceBuffer.appendBuffer(buffer)
        //     }
        //
        // }
        //
        // else {
        //     console.log("en el else")
            // @ts-ignore
            if(!media)return;

            console.log("Buffer antes del append: ", buffer)
            // @ts-ignore
            sourceBuffer.appendBuffer(buffer)

        // }
    }
    function connect2(){
        ws2 = new WebSocket("ws://localhost:8080/rooms/0?Id=999&username=frontViewer")
        ws2.binaryType = "arraybuffer"
        ws2.onmessage=handleStream
        ws2.onclose=connect2
    }
    connect2()


    return (
        <div> HOLA XD
            <video id="videoID"></video>
        </div>
    )
}