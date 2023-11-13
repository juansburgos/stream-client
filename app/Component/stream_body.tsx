'use client'

export default function StreamBody() {
    console.log("antes del getusermedia")
    navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(stream => {
        console.log("getusermedia")
        // @ts-ignore
        var ws, mediaRecorder;

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
        }

        connect()
    })

    var sourceBuffer,ws2, video, media;

    function handleStream(e){

        const buffer=e.data
        const data = new Uint8Array(buffer)
        if(data[0]===26&&data[1]===69&&data[2]===223){
            // if(media){
            //     URL.revokeObjectURL(media)
            //     sourceBuffer=null;
            // }

            video.onloadedmetadata=function(){
                video.muted=false
                video.play()
            }

            media.onsourceopen=function(){
                // @ts-ignore
                sourceBuffer= media.addSourceBuffer("video/webm;codecs=opus, vp8");
                sourceBuffer.appendBuffer(buffer)
            }

        } else {
            console.log("en el else")
            // @ts-ignore
            if(!media)return;

            console.log("Buffer antes del append: ", buffer)
            // @ts-ignore
            sourceBuffer.appendBuffer(buffer)

        }
    }

    function createVideo() {
        media = new MediaSource();
        video = document.getElementById('videoID')
        video.src = URL.createObjectURL(media);
    }

    function connect2(){
        let randomId = Math.floor(Math.random() * 10000) + 1;
        ws2 = new WebSocket("ws://localhost:8080/rooms/0?Id=" + randomId + "&username=frontStreamer");
        ws2.binaryType = "arraybuffer"
        ws2.onopen = createVideo
        ws2.onmessage = handleStream
        ws2.onclose = connect2
    }
    connect2()


    return (
        <div>
            <video style={{maxWidth:600, maxHeight:300}} id="videoID"></video>
        </div>
    )
}
