import Block, { Props } from "../../utils/block"
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
    onChange?: Function,
    onInput?: Function,
    class?: string
    value?: string
}

export default class Input extends Block<PropsInput> {
    value: string = ""

    constructor(props: PropsInput) {
        const isFile = props.type === "file"
        const attrs: Record<string, string> = {
            name: props.name,
            id: props.name,
            ...(props.pattern && { pattern: props.pattern }),
            ...(props.placeholder && { placeholder: props.placeholder }),
            ...(props.value && { value: props.value }),
            type: props.type || "text",
            ...(props.required && { required: "" }),
            ...((props.state === false) && { "aria-invalid": "true" }),
            class: "input-form_input" + (props.class ? ` ${props.class}` : ""),
            ...props.attrs
        }

        super("field", {
            ...props,
            isFile,
            ...(isFile && { labelText: "Обзор" }),
            attrs: {
                class: "input-form" + (props.field_class ? ` ${props.field_class}` : "")
            },
            input: new BaseInput({
                attrs,
                events: {
                    blur: (event: Event) => {
                        if (props.onBlur) {
                            props.onBlur((event.target as HTMLInputElement).value)
                        }
                    },
                    change: (event: Event) => {
                        if (props.onChange) {
                            props.onChange(event)
                        }
                    },
                    input: (event: Event) => {
                        this.value = (event.target as HTMLInputElement).value

                        if (props.onInput) {
                            props.onInput(event)
                        }
                    }
                }
            })
        })
    }

    componentDidUpdate(oldProps: PropsInput, newProps: PropsInput) {
        const input = this.children.input as Block
        const attrs = { ...input._meta.props.attrs }
        if (oldProps.state !== newProps.state) {
            if (newProps.state === false) {
                attrs["aria-invalid"] = "true"
            } else {
                attrs["aria-invalid"] = "false"
            }

            input.setProps({ attrs })
        } else if (oldProps.value !== newProps.value) {
            if (newProps.value) {
                input.setProps({ attrs: { ...attrs, value: newProps.value } })
            } else {
                delete attrs.value
                input.setProps({ attrs })
            }
        }

        return true
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
