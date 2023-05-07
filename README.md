# Synced drawing app

## About the app
This app is designed as a web application where users can either create or join existing rooms.

Each room has its own canvas for drawing different shapes of different sizes/colors.

The idea is to synchronise the drawing between all users in the room by utilising web sockets.

## General structure
- `app/Models` - Models the objects used in the application
- `app/Services` - Service classes for the business logic
- `app/Controller/Http` - HTTP request controllers
- `app/Controller/Socket` - Web socket request controllers

## "Authentication"
The application does not provide any concrete authentication system with username/password and/or oauth.

Instead, whenever a user first joins the room using some `username`, an `user id` is generated, and the pair of those two is stored in the session.

On any subsequent room join / creation, the session data is pulled to maintain the reference to the same user.

**Note:** User can join an existing room using a `username` that is different from the one in session. If the room allows the new `username`, the session data will be refreshed.

## Sockets

### Setup
Server side, socket setup is written inside `app/Services/SocketService.ts` class. This class acts as a singleton and is responsible for instantiating the socket.io server and attaching listeners to it for various events.

### Events definitions
`new_user_joined` - Server side emitted. Whenever a new connection to the server socket has been made, server emits this event to all *other* sockets to let them know about a new user

`new_object_added` - Client side emitted. Whenever a new object is added to the canvas, server is notified. Server then stores the object in the room data and emits the new object to all sockets (including the one emitting this event).

`sync_new_object` - Server side emitted. Extending on the previous, this event is emitted to let all sockets in the room know about the new object being added to the room. Client side handles this with drawing a new object on the canvas.

## How to run the app

The application is dockerized using [this guide](https://docs.adonisjs.com/cookbooks/dockerizing-adonis). As the guide features production build steps, to run the application locally, just run:

```
docker composer up
``` 

`docker-composer.yml` file is defined to only use "local" dev steps from the `Dockerfile`

## Nice to have

[ ] "Clear all" button

[ ] Text tool

[ ] Messaging inside the room

[ ] Save canvas

[ ] Undo an action

[ ] Redo an action