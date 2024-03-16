import Block, { Props } from "../../utils/block"
import Router from "../../utils/router"
import "./link.css"

interface PropsLink extends Props {
    href?: string
}

export default class Link extends Block {
    constructor(props: PropsLink) {
        super("a", {
            attrs: {
                class: "link" + (props.class ? ` ${props.class}` : ""),
                href: props.href || "#"
            },
            content: props.content,
            events: {
                click: (event: Event) => {
                    event.preventDefault()
                    const router = Router.getInstance()
                    router.go(props.href || "#")
                }
            }
        })
    }

    render() {
        return this.compile("{{ content }}", this.props)
    }
}
