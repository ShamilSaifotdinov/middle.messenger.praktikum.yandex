import Block, { Props } from "../../modules/block.ts"
import "./button.css"

interface PropsButton extends Props {
    color?: string,
    type?: string
    class?: string
}

export default class Button extends Block {
    constructor(props: PropsButton) {
        const attrs: Record<string, string> = {
            class: "button"
                + (props.color ? ` button-${props.color}` : "")
                + (props.class ? ` ${props.class}` : ""),
            ...(props.type && { type: props.type })
        }

        super("button", { ...props, attrs })
    }

    render() {
        return this.compile("{{ text }}", this.props)
    }
}
