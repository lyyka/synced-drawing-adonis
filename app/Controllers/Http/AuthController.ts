import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RoomParticipantSessionService from 'App/Services/RoomParticipantSessionService'

export default class AuthController {
    public async getCurrent(ctx: HttpContextContract) {
        const current = (new RoomParticipantSessionService(ctx.session)).current()
        return {
            id: current?.getId(),
            username: current?.getName(),
        }
    }
}