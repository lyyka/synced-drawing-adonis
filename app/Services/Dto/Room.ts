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

    public participantExists(username: string): boolean {
        return this.participants.some(p => p.getName() === username)
    }

    public indexOfParticipant(username: string): number {
        return this.participants.findIndex(p => p.getName() === username)
    }

    public addParticipant(username: string): void {
        this.participants.push(new RoomParticipant(username))
    }

    public removeParticipant(username: string): void {
        const idx = this.indexOfParticipant(username)
        if (idx >= 0) {
            this.participants.splice(idx, 1)
        }
    }
}