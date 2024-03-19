import EventBus from "./event-bus"

// const socket = new WebSocket(
//     "wss://ya-praktikum.tech/ws/chats/<USER_ID>/<CHAT_ID>/<TOKEN_VALUE>"
// )

// socket.addEventListener("open", () => {
//     console.log("Соединение установлено")

//     socket.send(JSON.stringify({
//         content: "Моё первое сообщение миру!",
//         type: "message"
//     }))
// })

// socket.addEventListener("close", (event) => {
//     if (event.wasClean) {
//         console.log("Соединение закрыто чисто")
//     } else {
//         console.log("Обрыв соединения")
//     }

//     console.log(`Код: ${event.code} | Причина: ${event.reason}`)
// })

// socket.addEventListener("message", (event) => {
//     console.log("Получены данные", event.data)
// })

// socket.addEventListener("error", (event) => {
//     console.log("Ошибка", event.message)
// })

export enum WSEvents {
    open = "open",
    message = "message",
    error = "error",
    close = "close"
}

export default class WS extends EventBus {
    private url: string

    private socket?: WebSocket

    private pingInterval = 30000

    private ping?: ReturnType<typeof setInterval>

    constructor(url: string) {
        super()
        this.url = url
    }

    connect() {
        if (this.socket) {
            throw new Error("Соединение уже установлено!")
        }

        this.socket = new WebSocket(this.url)

        this.subscribe(this.socket)
        this.setupPing()

        return new Promise((resolve, reject) => {
            this.on(WSEvents.error, reject)
            this.on(WSEvents.open, () => {
                this.off(WSEvents.error, reject)
                resolve("Соединение установлено!")
            })
        })
    }

    close() {
        if (!this.socket) {
            return
        }
        console.log("WS connection close")

        this.socket.close()

        clearInterval(this.ping)
        this.ping = undefined
    }

    private setupPing() {
        this.ping = setInterval(() => {
            this.send({ type: "ping" })
        }, this.pingInterval)

        this.on(WSEvents.close, () => {
            clearInterval(this.ping)
            this.ping = undefined
        })
    }

    private subscribe(socket: WebSocket) {
        socket.addEventListener("open", () => {
            this.emit(WSEvents.open)
        })

        socket.addEventListener("close", () => {
            this.emit(WSEvents.close)
        })

        socket.addEventListener("error", (event) => {
            this.emit(WSEvents.error, event)
        })

        socket.addEventListener("message", (message) => {
            try {
                const data = JSON.parse(message.data)
                // console.log(data)
                this.emit(WSEvents.message, data)
            } catch {
                //
            }
        })
    }

    send(data: string | number | object) {
        if (!this.socket) {
            throw new Error("Соединение еще не установлено!")
        }

        this.socket.send(JSON.stringify(data))
    }
}
