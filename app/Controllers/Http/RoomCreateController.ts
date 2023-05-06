import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoomService from 'App/Services/RoomService'
import RoomCreateValidator from 'App/Validators/RoomCreateValidator'

export default class RoomCreateController {
    public async index(ctx: HttpContextContract) {
        return ctx.view.render("pages/room_create.edge")
    }

    public async create(ctx: HttpContextContract) {
        const data = await ctx.request.validate(RoomCreateValidator)

        const roomService = new RoomService

        const room = roomService.create(data.room_name)

        roomService.join(data.username, room, ctx.session)

        return ctx.response
            .redirect()
            .toRoute('room.show', { code: room.getCode() })
    }
}