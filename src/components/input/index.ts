import Block, { Props } from "../../modules/block"
import BaseInput from "../baseInput/index"
import tmp from "./tmp.hbs?raw"
import "./input.css"

interface PropsInput extends Props {
    name: string
    placeholder?: string
    pattern?: string
    type?: string
    required?: boolean
    state?: boolean
    onBlur?: Function,
    class?: string
    value?: string
}

export default class Input extends Block {
    value: string = ""

    constructor(props: PropsInput) {
        const attrs: Record<string, string> = {
            name: props.name,
            ...(props.pattern && { pattern: props.pattern }),
            ...(props.placeholder && { placeholder: props.placeholder }),
            ...(props.value && { value: props.value }),
            type: props.type || "text",
            ...(props.required && { required: "" }),
            ...((props.state === false) && { "aria-invalid": "true" }),
            class: "input-form_input" + (props.class ? ` ${props.class}` : "")
        }

        super("div", {
            ...props,
            attrs: {
                class: "input-form" + (props.field_class ? ` ${props.field_class}` : "")
            },
            input: new BaseInput({
                attrs,
                events: {
                    blur: (event: Event) => {
                        this.value = (event.target as HTMLInputElement).value

                        if (props.onBlur) {
                            props.onBlur((event.target as HTMLInputElement).value)
                        }
                    }
                }
            })
        })
    }

    componentDidUpdate(oldProps: Props, newProps: Props) {
        if (oldProps.state !== newProps.state) {
            const input = this.children.input as Block
            const newAttrs = { ...input._meta.props.attrs }

            if (newProps.state === false) {
                newAttrs["aria-invalid"] = "true"
            } else {
                newAttrs["aria-invalid"] = "false"
            }

            input.setProps({ attrs: newAttrs })
        }

        return true
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
