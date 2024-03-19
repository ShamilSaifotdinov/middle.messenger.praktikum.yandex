import Block, { Props } from "../../../../utils/block"
import tmp from "./tmp.hbs?raw"
import "./msg-form.css"
import BaseInput from "../../../../components/baseInput"

interface MsgFormProps extends Props {
    sendMessage: CallableFunction
}

export default class MsgForm extends Block {
    constructor(props: MsgFormProps) {
        super("form", {
            ...props,
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

        console.log(data);

        (this.props as MsgFormProps).sendMessage(data.message)

        const target = e.target as HTMLFormElement

        target.reset()
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
