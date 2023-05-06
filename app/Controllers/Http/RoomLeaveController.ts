import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoomParticipantSessionService from 'App/Services/RoomParticipantSessionService'
import RoomService from 'App/Services/RoomService'

export default class RoomLeaveController {
    public async leave(ctx: HttpContextContract) {
        if (!ctx.session.has('username')) {
            return ctx.response
                .redirect()
                .toRoute('home')
        }

        const roomService = new RoomService

        const code: string = ctx.params.code
        const room = roomService.find(code)

        if (!room) {
            return ctx.response
                .redirect()
                .back()
        }

        const sessionService = new RoomParticipantSessionService(ctx.session)
        const roomParticipant = sessionService.current()

        if (roomParticipant) {
            roomService.leave(roomParticipant.getName(), room)
            sessionService.logout()
        }

        return ctx.response
            .redirect()
            .toRoute('home')
    }
}