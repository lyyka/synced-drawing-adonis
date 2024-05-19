import { io } from "socket.io-client";
import QRCode from 'qrcode';
import p5 from "p5";

const activeToolButtonClass = 'bg-purple-200'
let activeToolButton = null
let canvasObjects = []
const canvasSize = 420
let mousePressed = false
let tool = 'pen'
let color = '#000000'
let brushSize = 14
let rect_start
let line_start
let ellipse_start

window.addEventListener('DOMContentLoaded', async () => {
    const notificationCenter = document.querySelector("#room-notification-center")
    const messagesCenter = document.querySelector("#room-messages-center")
    const messagesCenterInput = document.querySelector("#room-messages-center-input")
    const messagesCenterBtn = document.querySelector("#room-messages-center-btn")
    const txtInp = document.querySelector("#room_cavnas_text_tool_input");
    const roomQr = document.querySelector("#room-qr");
    const currentUser = await (await fetch("/api/auth/current")).json()
    const roomCode = window.location.href.split('/').at(-1)

    QRCode.toCanvas(roomQr, roomCode);

    const socket = new io(window.location.host, {
        query: {
            userId: currentUser.id,
            username: currentUser.username,
            roomCode: roomCode
        },
    })


    const addMsgHtml = (msg) => {
      messagesCenter.innerHTML += `<p><strong>${msg.username}</strong>: <span>${msg.message}</span></p>`;
    }

    socket.on('new_user_joined', (event) => {
        notificationCenter.innerHTML += `<p><strong>${event.username}</strong> joined</p>`
    })

    socket.on('sync_new_message', (event) => {
      addMsgHtml(event);
    })

    socket.on('sync_all_messages', (event) => {
      console.log(event);
      event.data.forEach(addMsgHtml);
    })

    const syncNewObject = (object) => {
        socket.emit('new_object_added', object)
    }

    messagesCenterBtn.addEventListener('click', () => {
      const msg = messagesCenterInput.value;
      socket.emit('new_message_added', {username: currentUser.username, message: msg})
      messagesCenterInput.value = '';
    });

    const getTextToolValue = () => txtInp.value

    const drawAllObjects = (sketch) => {
        canvasObjects.forEach(obj => {
            if (obj.type === "line") {
                sketch.stroke(obj.color)
                sketch.strokeWeight(obj.size)
                sketch.line(obj.x, obj.y, obj.px, obj.py)
            } else if (obj.type === "text") {
                sketch.strokeWeight(0)
                sketch.fill(obj.color)
                sketch.textSize(Number(obj.size))
                sketch.text(obj.text, obj.x, obj.y)
            } else if (obj.type === "circle") {
                sketch.strokeWeight(0)
                sketch.fill(obj.color)
                sketch.circle(obj.x, obj.y, obj.size)
            } else if (obj.type === "ellipse") {
                sketch.strokeWeight(0)
                sketch.fill(obj.color)
                sketch.ellipse(obj.center.x, obj.center.y, obj.w, obj.h)
            } else if (obj.type === "rectangle") {
                sketch.strokeWeight(0)
                sketch.fill(obj.color)
                sketch.rect(Math.min(obj.start.x, obj.end.x), Math.min(obj.start.y, obj.end.y), Math.abs(obj.end.x - obj.start.x), Math.abs(obj.end.y - obj.start.y))
            }
        })
    }

    activeToolButton = document.querySelector(`#room-canvas-controls > [tool=${tool}]`)
    activeToolButton.classList.add(activeToolButtonClass)
    const handleToolButton = toolButton => {
        toolButton.addEventListener('click', (e) => {
            if (activeToolButton) {
                activeToolButton.classList.remove(activeToolButtonClass)
            }

            activeToolButton = toolButton

            activeToolButton.classList.add(activeToolButtonClass)

            tool = toolButton.getAttribute('tool')
        })
    }

    const handleColorChange = event => {
        color = event.target.value
    }

    const handleBrushSizeChange = event => {
        brushSize = event.target.value
    }

    new p5((sketch) => {
        sketch.setup = () => {
            const canvas = sketch.createCanvas(canvasSize, canvasSize).parent("room-canvas")

            document.querySelectorAll("#room-canvas-controls > [tool]").forEach(handleToolButton)
            document.querySelector("#room-canvas-color").addEventListener('change', handleColorChange)
            handleColorChange({target: document.querySelector("#room-canvas-color")})
            document.querySelector("#room-canvas-brush-size").addEventListener('change', handleBrushSizeChange)

            canvas.mouseClicked((event) => {
                if (tool === "text") {
                    txtInp.style.display = "block"
                    txtInp.style.top = `${event.clientY}px`
                    txtInp.style.left = `${event.clientX}px`
                    txtInp.focus();
                    const xyfixed = {x: sketch.mouseX, y: sketch.mouseY};
                    const keydown = (e) => {
                      if(e.key === 'Enter') {
                        syncNewObject({
                            x: xyfixed.x,
                            y: xyfixed.y,
                            text: txtInp.value.trim(),
                            color: color,
                            size: brushSize,
                            type: "text"
                        })

                        txtInp.removeEventListener('keydown', keydown)

                        txtInp.style.display = "none"
                        txtInp.value = '';
                      }
                  };
                  txtInp.addEventListener('keydown', keydown)
                } else if (tool === "circle") {
                    syncNewObject({
                        x: sketch.mouseX,
                        y: sketch.mouseY,
                        color: color,
                        size: brushSize,
                        type: "circle"
                    })
                }
            })

            const pressHandler = () => {
                mousePressed = true
                if (tool === "rectangle" && !rect_start) {
                    rect_start = {
                        x: sketch.mouseX,
                        y: sketch.mouseY
                    }
                } else if (tool === "ellipse" && !ellipse_start) {
                    ellipse_start = {
                        x: sketch.mouseX,
                        y: sketch.mouseY
                    }
                } else if (tool === "line" && !line_start) {
                    line_start = {
                        x: sketch.mouseX,
                        y: sketch.mouseY
                    }
                }
            }
            canvas.mousePressed(pressHandler)
            canvas.touchStarted(pressHandler)

            const moveHandler = () => {
                sketch.background(255);
                drawAllObjects(sketch);
                sketch.stroke(0);
                sketch.strokeWeight(2);
                if (tool === "text") { // Render text guidelines
                    let width = brushSize;
                    if (getTextToolValue().trim().length > 0) {
                        sketch.textSize(brushSize);
                        width = sketch.textWidth();
                    }
                    const height = brushSize * 0.75;
                    sketch.line(sketch.mouseX, sketch.mouseY, sketch.mouseX + width, sketch.mouseY);
                    sketch.line(sketch.mouseX, sketch.mouseY, sketch.mouseX, sketch.mouseY - height);
                } else if (["pen", "eraser"].includes(tool) && mousePressed) {
                    syncNewObject({
                        x: sketch.mouseX,
                        y: sketch.mouseY,
                        px: sketch.pmouseX,
                        py: sketch.pmouseY,
                        color: tool == "pen" ? color : "#ffffff",
                        size: brushSize,
                        type: "line"
                    });
                } else if (tool === "rectangle") {
                    if (mousePressed && rect_start) {
                        sketch.fill(color);
                        sketch.strokeWeight(0);
                        sketch.rect(Math.min(rect_start.x, sketch.mouseX), Math.min(rect_start.y, sketch.mouseY), Math.abs(sketch.mouseX - rect_start.x), Math.abs(sketch.mouseY - rect_start.y));
                    }

                    sketch.line(sketch.mouseX - 10, sketch.mouseY, sketch.mouseX + 10, sketch.mouseY);
                    sketch.line(sketch.mouseX, sketch.mouseY - 10, sketch.mouseX, sketch.mouseY + 10);
                } else if (tool === "ellipse" && mousePressed && ellipse_start) {
                    sketch.fill(color);
                    sketch.strokeWeight(0);
                    sketch.ellipse((ellipse_start.x + sketch.mouseX) / 2, (ellipse_start.y + sketch.mouseY) / 2, Math.abs(sketch.mouseX - ellipse_start.x), Math.abs(sketch.mouseY - ellipse_start.y));
                } else if (tool === "line" && mousePressed && line_start) {
                    sketch.stroke(color);
                    sketch.strokeWeight(brushSize);
                    sketch.line(sketch.mouseX, sketch.mouseY, line_start.x, line_start.y);
                } else { // Draw circle guide for anything other then a text
                    // Fill the guiding circle if we are going to draw a circle
                    if (tool === "circle") {
                        sketch.fill(color);
                    } else {
                        sketch.noFill();
                    }
                    sketch.circle(sketch.mouseX, sketch.mouseY, brushSize);
                }
            };
            canvas.mouseMoved(moveHandler)
            canvas.touchMoved(moveHandler)

            const releaseHandler = () => {
                mousePressed = false
                if (tool === "rectangle" && rect_start) {
                    syncNewObject({
                        start: rect_start,
                        end: {
                            x: sketch.mouseX,
                            y: sketch.mouseY
                        },
                        color: color,
                        size: brushSize,
                        type: "rectangle"
                    })
                    rect_start = undefined
                } else if (tool === "ellipse" && ellipse_start) {
                    syncNewObject({
                        center: {
                            x: (ellipse_start.x + sketch.mouseX) / 2,
                            y: (ellipse_start.y + sketch.mouseY) / 2
                        },
                        w: Math.abs(ellipse_start.x - sketch.mouseX),
                        h: Math.abs(ellipse_start.y - sketch.mouseY),
                        type: "ellipse",
                        color: color
                    })
                    ellipse_start = undefined
                } else if (tool === "line" && line_start) {
                    syncNewObject({
                        x: line_start.x,
                        y: line_start.y,
                        px: sketch.mouseX,
                        py: sketch.mouseY,
                        color: color,
                        size: brushSize,
                        type: "line"
                    })
                    line_start = undefined
                }
            };
            canvas.mouseReleased(releaseHandler)
            canvas.touchEnded(releaseHandler)

            socket.on('sync_new_object', (object) => {
                canvasObjects.push(object)
                drawAllObjects(sketch)
            })

            drawAllObjects(sketch)
        }
    })
})
