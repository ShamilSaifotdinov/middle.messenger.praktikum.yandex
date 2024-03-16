import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import Button from "../../components/button"

interface PropsForm extends Props {
    class?: string,
    submit_text?: string,
    onSubmit?: Function
}

export default class Form extends Block {
    constructor(props: PropsForm) {
        const attrs = {
            ...(props.class && { class: props.class })
        }

        super("form", {
            ...props,
            attrs,
            events: {
                submit: (e: Event) => this.handleEvent(e)
            },
            inputs: props.inputs,
            submit: props.submit_text && new Button({
                text: props.submit_text,
                type: "submit",
                color: "blue",
                class: "auth_submit" + (props.submit_class ? ` ${props.submit_class}` : ""),
                onClick: (e: Event) => this.handleEvent(e)
            })
        })
    }

    handleEvent(e : Event) {
        e.preventDefault()

        const data = Object.fromEntries(
            new FormData(this.element as HTMLFormElement).entries()
        )

        const props = this.props as PropsForm

        if (props.onSubmit) {
            props.onSubmit(data)
        }
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
