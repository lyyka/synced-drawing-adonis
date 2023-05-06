import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomePageController {
    public async index(ctx: HttpContextContract) {
        return ctx.view.render('pages/home')
    }
}