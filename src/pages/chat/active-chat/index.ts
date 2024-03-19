import { Indexed } from "../../../interfaces"
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

interface ActiveChatProps extends Props {
    active_chat: Indexed
    websocket?: WS
}

export default class ActiveChat extends Block {
    constructor(props: ActiveChatProps) {
        super("div", {
            ...props,
            attrs: {
                class: "chat_container"
            },
            avatar: new Avatar({
                src: (props.active_chat && (props.active_chat as Indexed).avatar && (
                    "https://ya-praktikum.tech/api/v2/resources"
                    + (props.active_chat as Indexed).avatar
                )) as string || undefined,
                onClick: () => {
                    this.setProps({ editChatModal: new Modal({
                        children: new EditChat({
                            onClose: () => this.setProps({ editChatModal: null })
                        })
                    }) })
                }
            }),
            messages: new Messages({
                getOldMessages: () => this.getOldMessages(),
                days: props.active_chat.days as Indexed[]
            }),
            msgForm: new MsgForm({ sendMessage: (content: string) => this.sendMessage(content) })
        })
    }

    componentDidMount(oldProps: Props): boolean {
        console.log("CDM", oldProps)
        return true
    }

    componentDidUpdate(oldProps: ActiveChatProps, newProps: ActiveChatProps): boolean {
        console.log(newProps)
        if (newProps.websocket && oldProps.websocket !== newProps.websocket) {
            newProps.websocket.on(WSEvents.message, (data: Indexed[]) => {
                actions.addMessages(data)
            })

            newProps.websocket.on(WSEvents.open, () => {
                (newProps.websocket as WS).send({
                    content: "0",
                    type: "get old"
                })
            })
        }

        if (newProps.active_chat.days) {
            (this.children.messages as Block).setProps({ days: newProps.active_chat.days })
        }

        return true
    }

    getOldMessages() {
        console.log("get old mgs")
        const { content } = this.props.active_chat as Indexed

        if (typeof content === "number") {
            console.log((content + 1) * 20);
            (this.props.websocket as WS).send({
                content: ((content + 1) * 20).toString(),
                type: "get old"
            })
        }
    }

    sendMessage(content: string) {
        (this.props.websocket as WS).send({
            content,
            type: "message"
        })
    }

    render() {
        return this.compile(template, this.props)
    }
}
