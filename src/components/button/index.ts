import Block, { Props } from "../../utils/block.ts"
import "./button.css"

interface PropsButton extends Props {
    color?: string,
    type?: string
    class?: string
    onClick?: EventListener
}

export default class Button extends Block {
    constructor(props: PropsButton) {
        props.attrs = {
            class: "button"
                + (props.color ? ` button-${props.color}` : "")
                + (props.class ? ` ${props.class}` : ""),
            ...(props.type && { type: props.type })
        }

        if (props.onClick !== undefined) {
            props.events = {
                click: (e: Event) => (props.onClick as EventListener)(e)
            }
        }

        super("button", props)
    }

    render() {
        return this.compile("{{ text }}", this.props)
    }
}
