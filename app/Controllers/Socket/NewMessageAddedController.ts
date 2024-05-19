import RoomService from "App/Services/RoomService";

export default class NewMessageAddedController {
    public handle(event: Object, roomCode: string) {
        (new RoomService).addCanvasObjectToRoom(event, roomCode)
    }
}
