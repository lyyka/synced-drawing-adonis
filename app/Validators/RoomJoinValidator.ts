import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoomJoinValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    code: schema.string([
      rules.trim(),
      rules.minLength(21),
      rules.maxLength(21),
    ]),

    username: schema.string([
      rules.trim(),
      rules.minLength(2),
      rules.maxLength(24),
    ]),
  })

  public messages: CustomMessages = {}
}
