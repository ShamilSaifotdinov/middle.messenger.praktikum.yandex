import ChatsAPI from "../api/chats-api"
import UserAPI from "../api/user-api"
import { bus } from "../global"
import { err, Indexed, NewChat } from "../interfaces"
import store from "../store"
import actions from "../store/actions"
import Router from "../utils/router"
import validator from "../utils/validator"

const chatAPI = new ChatsAPI()
const userAPI = new UserAPI()
const router = Router.getInstance()

const newChatValidator = validator([ "title" ])

export default class ChatsService {
    public static async getChats() {
        try {
            const res = await chatAPI.request()

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            const chats = JSON.parse(res.response)

            actions.setNewChats(chats)
        } catch (error) {
            console.error(error)

            if ((error as Indexed).type === "requestErr") {
                const customErr = error as err

                if (customErr.desc.status === 401) {
                    store.set("user", null)
                }

                if (customErr.desc.status === 500) {
                    router.go("/500")
                }
            }
        }
    }

    public static async getUsers(e: InputEvent) {
        try {
            const { value } = (e.target as HTMLInputElement)

            const res = await userAPI.searchUser(value)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            const users = JSON.parse(res.response)

            bus.emit("user-list:users", users)
        } catch (error) {
            console.error(error)

            if ((error as Indexed).type === "requestErr") {
                const customErr = error as err

                if (customErr.desc.response) {
                    const { reason }: { reason: string | undefined } = JSON.parse(
                        customErr.desc.response as string
                    )

                    if (customErr.desc.status === 400 && reason) {
                        bus.emit("user-list:err", reason)
                    }
                }

                if (customErr.desc.status === 401) {
                    store.set("user", null)
                    router.go("/")
                }

                if (customErr.desc.status === 500) {
                    router.go("/500")
                }
            }
        }
    }

    public static async createChat(chat: NewChat) {
        try {
            const validateData = newChatValidator(chat)

            if (!validateData.isCorrect) {
                throw { type: "validationErr", desc: validateData }
            }

            const resChat = await chatAPI.create(chat.title)

            if (resChat.status !== 200) {
                throw { type: "requestErr", desc: resChat }
            }

            const chatId = JSON.parse(resChat.response).id

            if (chatId && chat.users.length > 0) {
                const resUsers = await chatAPI.addUsers({ chatId, users: chat.users })

                if (resUsers.status !== 200) {
                    throw { type: "requestErr", desc: resUsers }
                }
            }

            bus.emit("chats-createChat:created")

            ChatsService.getChats().then(() => {
                actions.setActiveChat(chatId)
            })
        } catch (error) {
            console.error(error)

            if ((error as Indexed).type === "requestErr") {
                const customErr = error as err

                if (customErr.desc.response) {
                    const { reason }: { reason: string | undefined } = JSON.parse(
                        customErr.desc.response as string
                    )

                    if (customErr.desc.status === 400 && reason) {
                        bus.emit("chats-createChat:err", reason)
                    }
                }

                if (customErr.desc.status === 401) {
                    store.set("user", null)
                    router.go("/")
                }

                if (customErr.desc.status === 500) {
                    router.go("/500")
                }
            }
        }
    }
}
