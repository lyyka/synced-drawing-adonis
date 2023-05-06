import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoomParticipantSessionService from 'App/Services/RoomParticipantSessionService'
import RoomService from 'App/Services/RoomService'

export default class RoomJoinController {
    public async show(ctx: HttpContextContract) {
        const code = ctx.params.code
        const roomService = new RoomService
        const room = roomService.find(code)

        if (!room) {
            return ctx.response
                .redirect()
                .toRoute('home')
        }

        const sessionService = new RoomParticipantSessionService(ctx.session)
        const roomParticipant = sessionService.current()

        // prevents users from joining with link only
        // as we need the username in session for every room visit
        if (!roomParticipant || !roomService.exactParticipantInRoom(roomParticipant, room)) {
            return ctx.response
                .redirect()
                .toRoute('room.join.show', { code })
        }

        return ctx.view.render('pages/room_show', {
            code
        })
    }
}