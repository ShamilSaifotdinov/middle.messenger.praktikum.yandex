import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import "./chat.css"
import MsgForm from "./msg-form"

export default class ChatPage extends Block {
    constructor(props: Props) {
        super("div", {
            ...props,
            attrs: { class: "chat" },
            msgForm: new MsgForm()
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
