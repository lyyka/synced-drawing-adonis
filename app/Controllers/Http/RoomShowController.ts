import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoomService from 'App/Services/RoomService'

export default class RoomJoinController {
    public async show(ctx: HttpContextContract) {
        const code = ctx.params.code
        const roomService = new RoomService

        if (!roomService.find(code)) {
            return ctx.response
                .redirect()
                .toRoute('home')
        }

        return ctx.view.render('pages/room_show')
    }
}