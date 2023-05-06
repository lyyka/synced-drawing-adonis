import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoomJoin from 'App/Validators/RoomJoinValidator'
import RoomService from 'App/Services/RoomService'

export default class RoomJoinController {
    public async index(ctx: HttpContextContract) {
        return ctx.view.render('pages/room_join')
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

        roomService.join(data.username, room)

        ctx.session.put('username', data.username)

        return ctx.response
            .redirect()
            .toRoute('room.show', { code: room.getCode() })
    }
}