import Block from "../../../modules/block"
import tmp from "./tmp.hbs?raw"
import "./msg-form.css"
import BaseInput from "../../../components/baseInput"

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
        console.log(e)
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
