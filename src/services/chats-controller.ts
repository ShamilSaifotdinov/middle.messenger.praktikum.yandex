import ChatAPI from "../api/chats-api"
import store from "../store"

const chatAPI = new ChatAPI()

const chats = [
    {
        name: "Петр",
        msg: "Привет! Как дела? Давно не виделись. Хотел бы встретиться завтра",
        time: "20:30",
        count: 1
    },
    {
        name: "Петр",
        msg: "Привет! Как дела? Давно не виделись. Хотел бы встретиться завтра",
        time: "20:30",
        active: true
    },
    ...Array(14).fill(
        {
            name: "Петр",
            msg: "Привет! Как дела? Давно не виделись. Хотел бы встретиться завтра",
            time: "20:30",
            count: 2
        }
    )
]

export default class ChatsController {
    public static async getChats() {
        try {
            const data = await chatAPI.request()

            console.log(data)

            // store.set("chats", data)
            store.set("chats", chats)

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
        }
    }

    public static async createChat() {
        try {
            const response = await chatAPI.create()

            console.log(response)

            // store.set('user', data)

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
        }
    }
}
