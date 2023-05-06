import RoomParticipant from "./RoomParticipant"

export default class Room {
    private name: string
    private code: string
    private participants: RoomParticipant[] = []

    constructor(name: string, code: string) {
        this.name = name
        this.code = code
    }

    public getName(): string {
        return this.name
    }

    public getCode(): string {
        return this.code
    }

    public addParticipant(username: string): void {
        this.participants.push(new RoomParticipant(username))
    }

    public getParticipants(): RoomParticipant[] {
        return this.participants
    }
}