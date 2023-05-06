import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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

        roomService.leave(ctx.session.pull('username'), room)

        return ctx.response
            .redirect()
            .toRoute('home')
    }
}