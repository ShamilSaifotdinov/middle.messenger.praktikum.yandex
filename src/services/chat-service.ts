import ChatAPI from "../api/chat-api"
import ChatMessagesAPI from "../api/chat-messages-api"
import { Indexed, UpdateChatModel } from "../interfaces"
import store from "../store"
import Actions from "../store/actions"

const chatApi = new ChatAPI()
const chatMessagesApi = new ChatMessagesAPI()

export default class ChatService {
    public static async getChatUsers(id: number) {
        try {
            const res = await chatApi.getChatUsers(id)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            console.log(res)

            const users = JSON.parse(res.response)

            Actions.setActiveChatUsers(users)

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
            console.error(error)
        }
    }

    public static async updateChat(data: UpdateChatModel) {
        try {
            console.log(data)

            if (Object.keys(data).length === 0) {
                return
            }

            const chatId = (store.getState().active_chat as Indexed).id as number

            if (data.avatar) {
                const res = await chatApi.updateAvatar(data.avatar, chatId)

                if (res.status !== 200) {
                    throw { type: "requestErr", desc: res }
                }

                console.log(res)

                // const chat = JSON.parse(res.response)
            }

            if (data.add) {
                const res = await chatApi.addUsers(data.add, chatId)

                if (res.status !== 200) {
                    throw { type: "requestErr", desc: res }
                }

                console.log(res)

                // const chat = JSON.parse(res.response)
            }

            if (data.delete) {
                const res = await chatApi.deleteUsers(data.delete, chatId)

                if (res.status !== 200) {
                    throw { type: "requestErr", desc: res }
                }

                console.log(res)

                // const chat = JSON.parse(res.response)
            }

            // Actions.setActiveChatUsers(users)

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
            console.error(error)
        }
    }

    public static async getToken(id: number) {
        try {
            const res = await chatMessagesApi.request(id)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            console.log(res)

            const { token } = JSON.parse(res.response)

            store.set("active_chat.token", token)

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
            console.error(error)
            // return error
        }
    }
}
