import Block, { Props } from "../../../../utils/block"
import tmp from "./tmp.hbs?raw"
import "./msg-form.css"
import BaseInput from "../../../../components/baseInput"
import validator from "../../../../utils/validator"

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

        try {
            const msgValidator = validator([ "message" ])
            const validateData = msgValidator(data)

            if (!validateData.isCorrect) {
                throw validateData
            }

            (this.props as MsgFormProps).sendMessage(data.message)
        } catch (error) {
            console.error(error)
        }

        const target = e.target as HTMLFormElement

        target.reset()
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
