import Block from "../../../../utils/block"
import template from "./tmp.hbs?raw"
import "./delete-chat.css"
import Button from "../../../../components/button"
import ChatService from "../../../../services/chat-service"

export default class DeleteChat extends Block {
    constructor(props : { onClose: CallableFunction, chatId: number }) {
        super("div", {
            attrs: {
                class: "delete-chat"
            },
            delete: new Button({
                text: "Продолжить",
                color: "red",
                onClick: () => {
                    ChatService.deleteChat(props.chatId)
                }
            }),
            cancel: new Button({
                text: "Отмена",
                class: "button-link delete-chat_cancel",
                color: "outline-blue",
                onClick: () => props.onClose()
            })
        })
    }

    render() {
        return this.compile(template, this.props)
    }
}
