import Link from "../../components/link"
import Block, { Props } from "../../utils/block"
import tmp from "./tmp.hbs?raw"
import "./error.css"

export default class ErrorPage extends Block {
    constructor(props: Props) {
        super("div", {
            ...props,
            attrs: {
                class: "auth"
            },
            link: new Link({
                content: "Перейти к чатам",
                href: "/messenger"
            })
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
