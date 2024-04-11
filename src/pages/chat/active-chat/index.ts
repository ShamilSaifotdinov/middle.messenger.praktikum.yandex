import { Chat, Indexed } from "../../../interfaces"
import Block, { Props } from "../../../utils/block"
import template from "./tmp.hbs?raw"
import "./active-chat.css"
import MsgForm from "./msg-form"
import Modal from "../../../components/modal"
import EditChat from "./edit-chat"
import Avatar from "../../../components/avatar"
import WS, { WSEvents } from "../../../utils/ws"
import actions from "../../../store/actions"
import Messages from "./messages"
import Dropdown from "../../../components/dropdown"
import DeleteChat from "./delete-chat"

interface ActiveChatProps extends Props {
    active_chat: Chat
    websocket?: WS
}

export default class ActiveChat extends Block<ActiveChatProps> {
    constructor(props: ActiveChatProps) {
        super("div", {
            ...props,
            attrs: {
                class: "chat_container"
            },
            avatar: new Avatar({
                src: (props.active_chat && props.active_chat.avatar && (
                    "https://ya-praktikum.tech/api/v2/resources"
                    + props.active_chat.avatar
                )) || undefined,
                onClick: () => {
                    this.setProps({ editChatModal: new Modal({
                        children: new EditChat({
                            active_chat: props.active_chat,
                            onClose: () => this.setProps({ editChatModal: null })
                        })
                    }) })
                }
            }),
            dropdown: new Dropdown({
                buttonClass: "chat_settings",
                items: [ {
                    title: "Удалить чат",
                    color: "red",
                    onClick: () => {
                        this.setProps({ deleteChatModal: new Modal({
                            children: new DeleteChat({
                                onClose: () => this.setProps({ deleteChatModal: null }),
                                chatId: props.active_chat.id
                            })
                        }) })
                    }
                } ]
            }),
            messages: new Messages({
                getOldMessages: () => this.getOldMessages(),
                days: props.active_chat.days || []
            }),
            msgForm: new MsgForm({ sendMessage: (content: string) => this.sendMessage(content) })
        })
    }

    componentDidUpdate(oldProps: ActiveChatProps, newProps: ActiveChatProps): boolean {
        if (newProps.websocket && oldProps.websocket !== newProps.websocket) {
            newProps.websocket.on(WSEvents.message, (data: Indexed[]) => {
                actions.addMessages(data)
            })

            newProps.websocket.connect()

            newProps.websocket.on(WSEvents.open, () => {
                newProps.websocket?.send({
                    content: "0",
                    type: "get old"
                })
            })
        }

        if (oldProps.active_chat.avatar !== newProps.active_chat.avatar) {
            (this.children.avatar as Avatar).setProps({
                src: (newProps.active_chat.avatar && (
                    "https://ya-praktikum.tech/api/v2/resources"
                    + newProps.active_chat.avatar
                )) || undefined
            })
            if (newProps.websocket) {
                newProps.websocket.send({
                    content: "0",
                    type: "get old"
                })
            }
        }

        if (newProps.active_chat.days) {
            (this.children.messages as Messages).setProps({ days: newProps.active_chat.days })
        }

        return true
    }

    getOldMessages() {
        const { content } = this.props.active_chat

        if (typeof content === "number") {
            this.props.websocket?.send({
                content: ((content + 1) * 20).toString(),
                type: "get old"
            })
        }
    }

    sendMessage(content: string) {
        this.props.websocket?.send({
            content,
            type: "message"
        })
    }

    render() {
        return this.compile(template, this.props)
    }
}
