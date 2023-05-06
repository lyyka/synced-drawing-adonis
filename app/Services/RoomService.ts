import Room from "./Dto/Room"
import { nanoid } from 'nanoid'

export default class RoomService {
    private static rooms: { [key: string]: Room } = {}

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
        return room.getParticipants().some(participant => participant.getName() === username)
    }

    public join(username: string, room: Room): void {
        room.addParticipant(username)
    }

    public find(code: string): Room | undefined {
        return RoomService.rooms[code] ?? undefined
    }
}