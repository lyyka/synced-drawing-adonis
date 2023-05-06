/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'HomePageController.index').as('home')

// auth
Route.group(() => {
    Route.get('/auth/current', 'AuthController.getCurrent').as('auth.current')
}).prefix('/api')

// room join
Route.get('/room/join/:code?', 'RoomJoinController.index').as('room.join.show')
    .where('code', {
        match: /^[a-zA-Z0-9_-]+$/,
        cast: (code) => String(code),
    })
Route.post('/room/join', 'RoomJoinController.join').as('room.join.perform')

// room create
Route.get('/room/create', 'RoomCreateController.index').as('room.create.show')
Route.post('/room/create', 'RoomCreateController.create').as('room.create.perform')

// room 
Route.get('/room/:code', 'RoomShowController.show').as('room.show')
    .where('code', {
        match: /^[a-zA-Z0-9_-]+$/,
        cast: (code) => String(code),
    })
Route.post('/room/leave/:code', 'RoomLeaveController.leave').as('room.leave')
    .where('code', {
        match: /^[a-zA-Z0-9_-]+$/,
        cast: (code) => String(code),
    })
