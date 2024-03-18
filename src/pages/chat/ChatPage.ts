import Block, { Props } from "../../utils/block"
import tmp from "./tmp.hbs?raw"
import "./chat.css"
import MsgForm from "./msg-form"
import Avatar from "../../components/avatar"
import { Indexed } from "../../interfaces"
import Modal from "../../components/modal"
import EditChat from "./edit-chat"

interface ChatPageProps extends Props { active_chat?: Indexed }

export default class ChatPage extends Block {
    constructor(props: ChatPageProps) {
        console.log(props)

        super("div", {
            ...props,
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
            attrs: { class: "chat" },
            msgForm: new MsgForm()
        })
    }

    componentDidUpdate(oldProps: ChatPageProps, newProps: ChatPageProps): boolean {
        console.log(oldProps, newProps)

        if (
            newProps.active_chat
            && (
                !oldProps.active_chat || oldProps.active_chat.avatar !== newProps.active_chat.avatar
            )
        ) {
            (this.children.avatar as Avatar).setProps({
                src: (newProps.active_chat && (newProps.active_chat as Indexed).avatar && (
                    "https://ya-praktikum.tech/api/v2/resources"
                    + (newProps.active_chat as Indexed).avatar
                )) as string || undefined
            })
        }

        return true
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
