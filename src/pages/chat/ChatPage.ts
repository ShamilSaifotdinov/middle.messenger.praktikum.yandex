import Block, { Props } from "../../utils/block"
import template from "./tmp.hbs?raw"
import "./chat.css"
import { Indexed } from "../../interfaces"
import ActiveChat from "./active-chat"
import ChatService from "../../services/chat-service"
import store from "../../store"
import WS from "../../utils/ws"

interface ChatPageProps extends Props { active_chat?: Indexed }

export default class ChatPage extends Block {
    constructor(props: ChatPageProps) {
        super("div", {
            ...props,
            attrs: { class: "chat" }
        })
    }

    componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        if (newProps.active_chat) {
            if (
                !oldProps.active_chat
                || (oldProps.active_chat as Indexed).id !== (newProps.active_chat as Indexed).id
            ) {
                if (this.children.activeChat) {
                    ((this.children.activeChat as ActiveChat).props.websocket as WS).close()
                }

                this.setProps({ activeChat: new ActiveChat({
                    active_chat: newProps.active_chat as Indexed
                }) })

                ChatService.getToken((newProps.active_chat as Indexed).id as number)

                return true
            }

            if (
                (newProps.active_chat as Indexed).token
                && typeof (newProps.active_chat as Indexed).token === "string"
                && (oldProps.active_chat as Indexed).token
                !== (newProps.active_chat as Indexed).token
            ) {
                const state = store.getState()

                const ws = new WS(
                    `wss://ya-praktikum.tech/ws/chats/${
                        (state.user as Indexed).id
                    }/${(newProps.active_chat as Indexed).id}/${
                        (newProps.active_chat as Indexed).token
                    }`
                );

                (this.children.activeChat as ActiveChat).setProps({ websocket: ws })

                return true
            }

            if (oldProps.active_chat) {
                (this.children.activeChat as ActiveChat).setProps({
                    active_chat: newProps.active_chat
                })
            }
        }

        if (oldProps.active_chat && !newProps.active_chat) {
            ((this.children.activeChat as ActiveChat).props.websocket as WS).close()
            this.setProps({ activeChat: undefined })

            return true
        }

        return false
    }

    render() {
        return this.compile(template, this.props)
    }
}
