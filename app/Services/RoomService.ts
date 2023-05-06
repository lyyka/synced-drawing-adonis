import { SessionContract } from "@ioc:Adonis/Addons/Session"
import Room from "../Models/Room"
import { nanoid } from 'nanoid'
import RoomParticipantSessionService from "./RoomParticipantSessionService"
import RoomParticipant from "App/Models/RoomParticipant"

export default class RoomService {
    private static rooms: { [key: string]: Room } = {
        // test: new Room("test", "test")
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
        const participant = room.addParticipant(username);

        if (participant) {
            (new RoomParticipantSessionService(session)).login(participant)
        }
    }

    public leave(username: string, room: Room): void {
        room.removeParticipant(username)
    }

    public find(code: string): Room | undefined {
        return RoomService.rooms[code] ?? undefined
    }
}