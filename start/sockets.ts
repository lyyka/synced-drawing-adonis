import SocketService from 'App/Services/SocketService'
import { Socket } from 'socket.io'
SocketService.boot()

/**
 * Listen for incoming socket connections
 */
SocketService.io.on('connection', (socket: Socket) => {
    socket.emit('news', { hello: 'world' })

    socket.on('my other event', (data) => {
        console.log(data)
    })
})