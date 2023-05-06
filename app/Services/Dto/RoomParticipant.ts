export default class Room {
    private name: string

    constructor(name: string) {
        this.name = name
    }

    public getName(): string {
        return this.name
    }
}