import { Server, Socket } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'
import NewObjectAddedController from 'App/Controllers/Socket/NewObjectAddedController'

export default class SocketService {
    private static instance: SocketService
    private static io: Server

    private constructor() { }

    public static boot(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService()
        }

        return SocketService.instance
    }

    public listen(): void {
        SocketService.io = new Server(AdonisServer.instance!, {
            cors: {
                origin: '*'
            }
        })
        SocketService.io.on('connection', this.handleNewSocket)
    }

    public handleNewSocket(socket: Socket): void {
        // const userId = String(socket.handshake.query.userId)
        const username = String(socket.handshake.query.username)
        const roomCode = String(socket.handshake.query.roomCode)

        socket.join(roomCode)
        socket.to(roomCode).emit('new_user_joined', { username })

        /*
         Whenever, client-side, new object gets written on the canvas, 
         that object is emitted through `new_object_added` event to the server,
         which then takes that object, stores it in the room data,
         and emits it back to all of the sockets (including the one that emitted it in the first place)
         */
        socket.on('new_object_added', (event) => {
            (new NewObjectAddedController).handle(event, roomCode)

            SocketService.io.to(roomCode).emit('sync_new_object', event)
        })
    }
}