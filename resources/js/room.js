import { io } from "socket.io-client"

window.addEventListener('DOMContentLoaded', async () => {
    const notificationCenter = document.querySelector("#room-notification-center")
    const currentId = await (await fetch("/api/auth/current")).json()
    const roomCode = window.location.href.split('/').at(-1)

    const socket = new io(window.location.host, {
        query: {
            userId: currentId.id,
            username: currentId.username,
            roomCode: roomCode
        },
    })


    socket.on('new_user_joined', (event) => {
        notificationCenter.innerHTML += `<p><strong>${event.username}</strong> joined</p>`
    })
})