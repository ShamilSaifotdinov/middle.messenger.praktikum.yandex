import Block, { Props } from "../../utils/block"
import template from "./tmp.hbs?raw"
import "./chat.css"
import { Chat } from "../../interfaces"
import ActiveChat from "./active-chat"
import ChatService from "../../services/chat-service"
import WS from "../../utils/ws"
import actions from "../../store/actions"

interface ChatPageProps extends Props { active_chat?: Chat }

export default class ChatPage extends Block {
    constructor(props: ChatPageProps) {
        super("div", {
            ...props,
            attrs: { class: "chat" }
        })
    }

    componentDidUpdate(oldProps: ChatPageProps, newProps: ChatPageProps): boolean {
        const currentActiveChat = this.children.activeChat as ActiveChat
        if (newProps.active_chat) {
            if (
                !oldProps.active_chat
                || oldProps.active_chat.id !== newProps.active_chat.id
            ) {
                if (currentActiveChat && currentActiveChat.props.websocket) {
                    (currentActiveChat.props.websocket as WS).close()
                }

                this.setProps({ activeChat: new ActiveChat({
                    active_chat: newProps.active_chat
                }) })

                ChatService.getToken(newProps.active_chat.id)

                return true
            }

            if (
                newProps.active_chat.token
                && typeof newProps.active_chat.token === "string"
                && oldProps.active_chat.token
                !== newProps.active_chat.token
            ) {
                const user = actions.getUser()

                if (!user) {
                    return false
                }

                const ws = new WS(
                    `wss://ya-praktikum.tech/ws/chats/${
                        user.id
                    }/${newProps.active_chat.id}/${
                        newProps.active_chat.token
                    }`
                )

                currentActiveChat.setProps({ websocket: ws })

                return true
            }

            if (oldProps.active_chat) {
                currentActiveChat.setProps({
                    active_chat: newProps.active_chat
                })
            }
        }

        if (oldProps.active_chat && !newProps.active_chat) {
            (currentActiveChat.props.websocket as WS).close()
            this.setProps({ activeChat: undefined })

            return true
        }

        return false
    }

    render() {
        return this.compile(template, this.props)
    }
}
