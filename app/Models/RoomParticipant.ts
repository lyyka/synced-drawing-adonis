import { nanoid } from "nanoid"

export default class RoomParticipant {
    private id: string
    private name: string

    constructor(name: string) {
        this.name = name
        this.id = nanoid()
    }

    public getName(): string {
        return this.name
    }

    public setId(id: string): void {
        this.id = id
    }

    public getId(): string {
        return this.id
    }
}