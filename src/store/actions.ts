import store from "."
import { Chat, Indexed, User } from "../interfaces"
import ChatService from "../services/chat-service"
import { getLocalHourAndMinuteFromISO } from "../utils/getLocal"
import { isObject } from "../utils/types"

type daysType = Array<{
    messages: Indexed[]
}>

class Actions {
    getUser(): User | undefined {
        const state = store.getState()
        const user = state.user as User | undefined

        return user
    }

    setNewChats(chats: Chat[]) {
        const state = store.getState()
        const activeChat = state.active_chat as Chat | undefined

        store.set("chats", chats)

        if (activeChat) {
            this.unsetActiveChat()
            this.setActiveChat(activeChat.id)
        }
    }

    setActiveChat(chatId: number) {
        const state = store.getState()
        const chats = state.chats as Indexed[]

        const currentActiveChatIndex = chats.findIndex(
            (chat) => chat.id !== chatId && chat.active
        )

        if (currentActiveChatIndex !== -1) {
            chats[currentActiveChatIndex].active = undefined
        }

        const newChat = chats[chats.findIndex((chat) => chat.id === chatId)]

        newChat.active = true

        store.set("chats", state.chats)
        store.set("active_chat", {
            ...newChat,
            content: -1,
            days: [ { messages: [] } ]
        })
    }

    getActiveChat(): Chat | undefined {
        const state = store.getState()
        const activeChat = state.active_chat as Chat | undefined

        return activeChat
    }

    addMessages(data: unknown) {
        const state = store.getState()
        const activeChat = state.active_chat as Chat
        const days = activeChat.days as daysType

        // console.log(data)

        if (data instanceof Array) {
            if (data.length === 0) {
                return
            }

            const content = data.length < 20 ? undefined : (activeChat.content as number) + 1

            const messages = data.reduce((arr, message) => ([
                ...arr,
                {
                    ...message,
                    type: message.user_id === (state.user as User).id ? "outcome" : "income",
                    time: new Date(message.time).toLocaleTimeString(navigator.language, {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                }
            ]), [])

            store.set("active_chat", {
                ...activeChat,
                content,
                days: [ {
                    date: "Сегодня",
                    messages: [ ...messages.reverse(), ...days[0].messages ]
                } ]
            })
        }

        if (isObject(data) && data.type === "message") {
            // console.log(days[0].messages)

            if (data.user_id === (state.user as User).id) {
                data.type = "outcome"
            } else {
                data.type = "income"
            }

            data.time = getLocalHourAndMinuteFromISO(data.time as string)

            store.set("active_chat.days", [ { messages: [ ...days[0].messages, data ] } ])
        }
    }

    requestActiveChatUsers() {
        const activeChat = this.getActiveChat()

        if (!activeChat) {
            return
        }

        ChatService.getChatUsers(activeChat.id)
    }

    setActiveChatUsers(users: Indexed) {
        store.set("active_chat.users", users)
    }

    unsetActiveChat() {
        const state = store.getState()
        const chats = state.chats as Indexed[]

        const currentActiveChatIndex = chats.findIndex((chat) => chat.active)

        if (currentActiveChatIndex !== -1) {
            chats[currentActiveChatIndex].active = undefined
            store.set("chats", state.chats)
        }

        store.set("active_chat", undefined)
    }
}

export default new Actions()
