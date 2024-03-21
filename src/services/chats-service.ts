import ChatsAPI from "../api/chats-api"
import UserAPI from "../api/user-api"
import { bus } from "../global"
import { NewChat } from "../interfaces"
import actions from "../store/actions"
import validator from "../utils/validator"

const chatAPI = new ChatsAPI()
const userAPI = new UserAPI()

const newChatValidator = validator([ "title" ])

export default class ChatsService {
    public static async getChats() {
        try {
            const res = await chatAPI.request()

            console.log(res)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            const chats = JSON.parse(res.response)

            actions.setNewChats(chats)

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
            console.error(error)
        }
    }

    public static async getUsers(e: InputEvent) {
        try {
            const { value } = (e.target as HTMLInputElement)

            const res = await userAPI.searchUser(value)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            console.log(res)

            const users = JSON.parse(res.response)

            bus.emit("user-list:users", users)

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
            console.error(error)
        }
    }

    public static async createChat(chat: NewChat) {
        try {
            const validateData = newChatValidator(chat)

            if (!validateData.isCorrect) {
                throw { type: "validationErr", desc: validateData }
            }

            const resChat = await chatAPI.create(chat.title)

            console.log(resChat)

            if (resChat.status !== 200) {
                throw { type: "requestErr", desc: resChat }
            }

            const chatId = JSON.parse(resChat.response).id

            if (chatId && chat.users.length > 0) {
                const resUsers = await chatAPI.addUsers({ chatId, users: chat.users })

                console.log(resUsers)

                if (resUsers.status !== 200) {
                    throw { type: "requestErr", desc: resUsers }
                }
            }

            bus.emit("chats-createChat:created")

            ChatsService.getChats().then(() => {
                actions.setActiveChat(chatId)
            })

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
            console.error(error)
        }
    }
}
