import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoomCreateValidator {
    constructor(protected ctx: HttpContextContract) { }

    public schema = schema.create({
        room_name: schema.string([
            rules.trim(),
            rules.minLength(2),
            rules.maxLength(255),
        ]),

        username: schema.string([
            rules.trim(),
            rules.minLength(2),
            rules.maxLength(24),
        ]),
    })

    public messages: CustomMessages = {}
}
