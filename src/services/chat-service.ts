import ChatAPI from "../api/chat-api"
import ChatMessagesAPI from "../api/chat-messages-api"
import { UpdateChatModel } from "../interfaces"
import store from "../store"
import actions from "../store/actions"
import ChatsService from "./chats-service"

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

            actions.setActiveChatUsers(users)

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
            console.error(error)
        }
    }

    public static async updateChat(data: UpdateChatModel) {
        try {
            const activeChat = actions.getActiveChat()

            if (Object.keys(data).length === 0 || !(activeChat && activeChat.id)) {
                return
            }

            const chatId = activeChat.id

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

            ChatsService.getChats()

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
            console.error(error)
        }
    }

    public static async deleteChat(chatId: number) {
        try {
            const res = await chatApi.delete(chatId)

            console.log(res)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            actions.unsetActiveChat()
            ChatsService.getChats()
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
