import RoomService from "App/Services/RoomService";

export default class NewObjectAddedController {
    public handle(event: Object, roomCode: string) {
        (new RoomService).addCanvasObjectToRoom(event, roomCode)
    }
}