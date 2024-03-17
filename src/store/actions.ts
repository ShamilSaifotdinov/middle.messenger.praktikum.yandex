import store from "."
import { Indexed } from "../interfaces"

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
