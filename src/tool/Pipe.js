import { randomUUID } from 'crypto'

const net = require('net')
const path = require('path')
const {EventEmitter} = require('events')

export class PipeServer extends EventEmitter{
    constructor(pipePath){
        super()
        this.sockets = []
        this.server = net.createServer().listen(
            path.join('\\\\?\\pipe', pipePath));
        
        this.server.on('connection',(socket)=>{
            socket.id = randomUUID()
            socket.on('close',()=>{
                this.sockets = this.sockets.filter((s)=>{
                    return s.id != socket.id
                })
            })
            this.sockets.push(socket)
        })
    }

    sendData(data){
        this.sockets.forEach(async (socket)=>{
            socket.write(data)
        })
    }
}

export class PipeClient extends EventEmitter{
    constructor(pipePath){
        super()
        this.socket = net.createConnection(path.join('\\\\?\\pipe',pipePath))
        this.socket.on('data',(data)=>{
            this.emit('data',data)
        })
    }
    destroy(){
        this.socket.destroy()
    }
}