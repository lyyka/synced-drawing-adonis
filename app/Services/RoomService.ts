import { SessionContract } from "@ioc:Adonis/Addons/Session"
import Room from "../Models/Room"
import { nanoid } from 'nanoid'
import RoomParticipantSessionService from "./RoomParticipantSessionService"
import RoomParticipant from "App/Models/RoomParticipant"

export default class RoomService {
    private static rooms: { [key: string]: Room } = {
        // test: new Room("test", "test")
    }

    public addCanvasObjectToRoom(object: Object, roomCode: string) {
        const room = this.find(roomCode)

        if (room) {
            room.addCanvasObject(object)
        }
    }

    public create(name: string): Room {
        const code: string = nanoid()

        const room = new Room(
            name,
            code,
        )

        RoomService.rooms[code] = room

        return room
    }

    public isUsernameBusy(username: string, room: Room): boolean {
        return room.usernameExists(username)
    }

    public exactParticipantInRoom(participant: RoomParticipant, room: Room): boolean {
        return room.participantExists(participant)
    }

    public join(username: string, room: Room, session: SessionContract): void {
        const sessionService = new RoomParticipantSessionService(session)

        const auth = sessionService.current()
        let reauth = auth === null

        if (auth && auth.getName() !== username) {
            auth.setName(username)
            reauth = true
        }

        const participant = auth || new RoomParticipant(username);

        room.addParticipant(participant)

        // reauth the user if
        // 1) no user was authed in the first place
        // 2) username updated while joining
        if (reauth) {
            sessionService.logout()
            sessionService.login(participant)
        }
    }

    public leave(username: string, room: Room): void {
        room.removeParticipant(username)
        if (room.isEmpty()) {
            delete RoomService.rooms[room.getCode()]
        }
    }

    public find(code: string): Room | undefined {
        return RoomService.rooms[code] ?? undefined
    }
}