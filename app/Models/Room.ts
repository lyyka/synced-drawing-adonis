import RoomParticipant from "./RoomParticipant"

export default class Room {
    private name: string
    private code: string
    private participants: RoomParticipant[] = []
    private canvasObjects: Object[] = []

    constructor(name: string, code: string) {
        this.name = name
        this.code = code
    }

    public addCanvasObject(object: Object): void {
        this.canvasObjects.push(object)
    }

    public getName(): string {
        return this.name
    }

    public getCode(): string {
        return this.code
    }

    public isEmpty(): boolean {
        return this.participants.length === 0
    }

    public usernameExists(username: string): boolean {
        return this.participants.some(p => p.getName() === username)
    }

    public participantExists(paraticipant: RoomParticipant): boolean {
        return this.participants.some(p => p.getName() === paraticipant.getName() && p.getId() === paraticipant.getId())
    }

    public indexOfParticipant(username: string): number {
        return this.participants.findIndex(p => p.getName() === username)
    }

    public addParticipant(participant: RoomParticipant): void {
        this.participants.push(participant)
    }

    public removeParticipant(username: string): void {
        const idx = this.indexOfParticipant(username)
        if (idx >= 0) {
            this.participants.splice(idx, 1)
        }
    }
}