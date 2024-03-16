import Block from "../../utils/block"
import "./avatar.css"
import template from "./tmp.hbs?raw"
import avatarUrl from "./avatar.svg"

class Avatar extends Block {
    constructor(props: { src?: string, class?: string, onClick?: CallableFunction }) {
        super("div", {
            src: props.src || avatarUrl,
            attrs: {
                class: "avatar" + (props.class ? ` ${props.class}` : "")
            },
            events: {
                ...(typeof props.onClick === "function" && {
                    click: () => (props.onClick as Function)()
                })
            }
        })
    }

    render() {
        return this.compile(template, this.props)
    }
}

export default Avatar
