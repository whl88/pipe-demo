const {EventEmitter} = require('events')
export default class FrameGen extends EventEmitter{
    init(width=1920,height=1080,deviceId = 'defalut'){
        this.width = width
        this.height = height
        return navigator.mediaDevices.getUserMedia({
            video:{
                deviceId,
                width,
                height
            },
            audio: false
        }).then((stream)=>{
            this.stream = stream
            this.videoElement = document.createElement('video')
            this.videoElement.autoplay = true
            this.videoElement.muted = true
            this.videoElement.width = width
            this.videoElement.height = height
            this.videoElement.style.width = 0
            this.videoElement.style.height = 0
            this.videoElement.srcObject = stream
            document.body.append(this.videoElement)

            this.canvas = document.createElement('canvas')
            this.canvas.width = width
            this.canvas.height = height
            this.canvas.style.width = 0
            this.canvas.style.height = 0
            document.body.append(this.canvas)
            this.canvasCtx = this.canvas.getContext('2d')
            this.flushFrame()
        })
    }
    async flushFrame(timestamp){
        if(!this.lastTimestamp){
            this.lastTimestamp = timestamp
        }
        if(timestamp - this.lastTimestamp >= 40){
            this.canvasCtx.drawImage(this.videoElement,0,0,this.canvas.width, this.canvas.height)
            this.lastTimestamp = timestamp
        }

        window.requestAnimationFrame(this.flushFrame.bind(this))
    }
    getFrame(){
        return this.canvasCtx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    }
}