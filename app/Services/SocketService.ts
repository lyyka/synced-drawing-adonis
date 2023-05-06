import { Server, Socket } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'

export default class SocketService {
    private static instance: SocketService
    public io: Server

    private constructor() { }

    public static boot(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService()
        }

        return SocketService.instance
    }

    public listen(): void {
        this.io = new Server(AdonisServer.instance!, {
            cors: {
                origin: '*'
            }
        })
        this.io.on('connection', this.handleNewSocket)
    }

    public handleNewSocket(socket: Socket): void {
        const userId = String(socket.handshake.query.userId)
        const username = String(socket.handshake.query.username)
        const roomCode = String(socket.handshake.query.roomCode)

        socket.join(roomCode)
        socket.to(roomCode).emit('new_user_joined', { username })
    }
}