import Block from "../../../utils/block"
import tmp from "./tmp.hbs?raw"
import "./msg-form.css"
import BaseInput from "../../../components/baseInput"
import UserService from "../../../services/user-service"

const userService = new UserService()

export default class MsgForm extends Block {
    constructor() {
        super("form", {
            attrs: { class: "chat-input" },
            events: {
                submit: (e: Event) => this.handleSubmit(e)
            },
            input: new BaseInput({
                attrs: {
                    class: "chat-input_input",
                    name: "message",
                    placeholder: "Напишите сообщение...",
                    required: ""
                }
            })
        })
    }

    handleSubmit(e: Event) {
        e.preventDefault()

        const data = Object.fromEntries(
            new FormData(this.element as HTMLFormElement).entries()
        )

        userService.sendMessage(data)

        const target = e.target as HTMLFormElement

        target.reset()
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
