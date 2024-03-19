import store from "."
import { Indexed, User } from "../interfaces"
import ChatService from "../services/chat-service"
import { getLocalHourAndMinuteFromISO } from "../utils/getLocal"
import { isObject } from "../utils/types"
// import WS from "../utils/ws"

type days = Array<{
    messages: Indexed[]
}>

class Actions {
    setActiveChat(newChat: Indexed) {
        const state = store.getState()
        const chats = state.chats as Indexed[]

        const currentActiveChatIndex = chats.findIndex(
            (chat) => chat.id !== newChat.id && chat.active
        )

        if (currentActiveChatIndex !== -1) {
            chats[currentActiveChatIndex].active = undefined
        }

        chats[chats.findIndex((chat) => chat.id === newChat.id)].active = true

        store.set("chats", state.chats)
        store.set("active_chat", {
            ...newChat,
            content: -1,
            days: [ { messages: [] } ]
        })
    }

    addMessages(data: unknown) {
        const state = store.getState()
        const activeChat = state.active_chat as Indexed
        const days = activeChat.days as days

        console.log(data)

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
            console.log(days[0].messages)

            if (data.user_id === (state.user as User).id) {
                data.type = "outcome"
            } else {
                data.type = "income"
            }

            data.time = getLocalHourAndMinuteFromISO(data.time as string)

            store.set("active_chat.days", [ { messages: [ ...days[0].messages, data ] } ])
        }
    }

    getActiveChatUsers() {
        const state = store.getState()
        const chats = state.chats as Indexed[]

        const currentActiveChat = chats.find((chat) => chat.active)

        if (!currentActiveChat) {
            return
        }

        ChatService.getChatUsers(currentActiveChat.id as number)
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
