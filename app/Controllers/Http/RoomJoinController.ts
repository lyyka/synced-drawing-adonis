import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoomJoin from 'App/Validators/RoomJoinValidator'
import RoomService from 'App/Services/RoomService'
import RoomParticipantSessionService from 'App/Services/RoomParticipantSessionService'

export default class RoomJoinController {
    public async index(ctx: HttpContextContract) {
        if (ctx.params.code) {
            const roomService = new RoomService
            if (!roomService.find(ctx.params.code)) {
                return ctx.response
                    .redirect()
                    .toRoute('home')
            }
        }

        return ctx.view.render('pages/room_join', {
            code: ctx.params.code
        })
    }

    public async join(ctx: HttpContextContract) {
        const data = await ctx.request.validate(RoomJoin)

        const roomService = new RoomService

        const room = roomService.find(data.code)

        if (!room) {
            ctx.session.flash('errors.code', 'Invalid room code')
            return ctx.response
                .redirect()
                .back()
        }

        if (roomService.isUsernameBusy(data.username, room)) {
            ctx.session.flash('errors.username', 'Username already exists in the room')
            return ctx.response
                .redirect()
                .back()
        }

        const auth = (new RoomParticipantSessionService(ctx.session)).current()
        if (auth && roomService.exactParticipantInRoom(auth, room)) {
            ctx.session.flash('errors.username', 'You are already in this room')
            return ctx.response
                .redirect()
                .back()
        }

        roomService.join(data.username, room, ctx.session)

        return ctx.response
            .redirect()
            .toRoute('room.show', { code: room.getCode() })
    }
}