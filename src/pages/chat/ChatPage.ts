import Block, { Props } from "../../utils/block"
import tmp from "./tmp.hbs?raw"
import "./chat.css"
import MsgForm from "./msg-form"
import Avatar from "../../components/avatar"
import { Indexed } from "../../interfaces"
import Modal from "../../components/modal"
import EditChat from "./edit-chat"

export default class ChatPage extends Block {
    constructor(props: Props) {
        console.log(props)

        const editChat = new EditChat({ onClose: () => this.setProps({ editChatModal: null }) })

        super("div", {
            ...props,
            avatar: new Avatar({
                src: (props.active_chat && (props.active_chat as Indexed).avatar && (
                    "https://ya-praktikum.tech/api/v2/resources"
                    + (props.active_chat as Indexed).avatar
                )) as string || undefined,
                onClick: () => {
                    this.setProps({ editChatModal: new Modal({
                        children: editChat,
                        onClose: () => this.setProps({ editChatModal: null })
                    }) })
                }
            }),
            attrs: { class: "chat" },
            msgForm: new MsgForm()
        })
    }

    componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        console.log(oldProps, newProps)
        return true
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
