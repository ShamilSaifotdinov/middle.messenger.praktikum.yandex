import Block, { Props } from "../../utils/block"
import "./avatar.css"
import template from "./tmp.hbs?raw"
import avatarUrl from "./avatar.svg"

interface AvatarProps extends Props {
    src?: string
    class?: string
    onClick?: CallableFunction
}

class Avatar extends Block {
    constructor(props: AvatarProps) {
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

    componentDidUpdate(oldProps: AvatarProps, newProps: AvatarProps): boolean {
        if (oldProps.src !== newProps.src && newProps.src === undefined) {
            this.setProps({ src: avatarUrl })
        }

        return true
    }

    render() {
        return this.compile(template, this.props)
    }
}

export default Avatar
