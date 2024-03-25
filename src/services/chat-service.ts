import ChatAPI from "../api/chat-api"
import ChatMessagesAPI from "../api/chat-messages-api"
import { bus } from "../global"
import { err, Indexed, UpdateChatModel } from "../interfaces"
import store from "../store"
import actions from "../store/actions"
import Router from "../utils/router"
import ChatsService from "./chats-service"

const chatApi = new ChatAPI()
const chatMessagesApi = new ChatMessagesAPI()
const router = Router.getInstance()

export default class ChatService {
    public static async getChatUsers(id: number) {
        try {
            const res = await chatApi.getChatUsers(id)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            const users = JSON.parse(res.response)

            actions.setActiveChatUsers(users)
        } catch (error) {
            console.error(error)

            if ((error as Indexed).type === "requestErr") {
                const customErr = error as err

                if (customErr.desc.status === 401) {
                    store.set("user", null)
                    router.go("/")
                }

                if (customErr.desc.status === 404) {
                    router.go("/404")
                }

                if (customErr.desc.status === 500) {
                    router.go("/500")
                }
            }
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
            }

            if (data.add) {
                const res = await chatApi.addUsers(data.add, chatId)

                if (res.status !== 200) {
                    throw { type: "requestErr", desc: res }
                }
            }

            if (data.delete) {
                const res = await chatApi.deleteUsers(data.delete, chatId)

                if (res.status !== 200) {
                    throw { type: "requestErr", desc: res }
                }
            }

            bus.emit("updateChat:chatUpdated")

            ChatsService.getChats()
        } catch (error) {
            console.error(error)

            if ((error as Indexed).type === "requestErr") {
                const customErr = error as err

                if (customErr.desc.response) {
                    const { reason }: { reason: string | undefined } = JSON.parse(
                        customErr.desc.response as string
                    )

                    if (customErr.desc.status === 400 && reason) {
                        bus.emit("updateChat:err", reason)
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

    public static async deleteChat(chatId: number) {
        try {
            const res = await chatApi.delete(chatId)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            actions.unsetActiveChat()
            ChatsService.getChats()
        } catch (error) {
            console.error(error)

            if ((error as Indexed).type === "requestErr") {
                const customErr = error as err

                if (customErr.desc.response) {
                    const { reason }: { reason: string | undefined } = JSON.parse(
                        customErr.desc.response as string
                    )

                    if (customErr.desc.status === 400 && reason) {
                        bus.emit("deleteChat:err", reason)
                    }
                }

                if (customErr.desc.status === 401) {
                    store.set("user", null)
                    router.go("/")
                }

                if (customErr.desc.status === 403) {
                    bus.emit("deleteChat:err", "Удаление недоступно!")
                }

                if (customErr.desc.status === 500) {
                    router.go("/500")
                }
            }
        }
    }

    public static async getToken(id: number) {
        try {
            const res = await chatMessagesApi.request(id)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            const { token } = JSON.parse(res.response)

            store.set("active_chat.token", token)
        } catch (error) {
            console.error(error)

            if ((error as Indexed).type === "requestErr") {
                const customErr = error as err

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
