import store from "."
import { Indexed } from "../interfaces"
import ChatService from "../services/chat-service"

export default class Actions {
    static setActiveChat(newChat: Indexed) {
        const state = store.getState()
        const chats = state.chats as Indexed[]

        const currentActiveChatIndex = chats.findIndex(
            (chat) => chat.id !== newChat.id && chat.active
        )

        if (currentActiveChatIndex !== -1) {
            chats[currentActiveChatIndex].active = null
        }

        chats[chats.findIndex((chat) => chat.id === newChat.id)].active = true

        store.set("chats", state.chats)
        store.set("active_chat", newChat)
    }

    static getActiveChatUsers() {
        const state = store.getState()
        const chats = state.chats as Indexed[]

        const currentActiveChat = chats.find((chat) => chat.active)

        if (!currentActiveChat) {
            return
        }

        ChatService.getChatUsers(currentActiveChat.id as number)
    }

    static setActiveChatUsers(users: Indexed) {
        store.set("active_chat.users", users)
    }

    static unsetActiveChat() {
        const state = store.getState()
        const chats = state.chats as Indexed[]

        const currentActiveChatIndex = chats.findIndex((chat) => chat.active)

        if (currentActiveChatIndex !== -1) {
            chats[currentActiveChatIndex].active = null
            store.set("chats", state.chats)
        }

        store.set("active_chat", undefined)
    }
}
