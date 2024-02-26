import Block, { Props } from "../../modules/block"
import "./link.css"

interface PropsLink extends Props {
    href?: string
}

export default class Link extends Block {
    constructor(props: PropsLink) {
        super("a", {
            attrs: {
                class: "link",
                href: props.href || "#"
            },
            title: props.title
        })
    }

    render() {
        return this.compile("{{ title }}", this.props)
    }
}
