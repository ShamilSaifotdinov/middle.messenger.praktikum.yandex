import Link from "../../components/link"
import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import "./error.css"

// const userService = new UserService()

export default class ErrorPage extends Block {
    constructor(props: Props) {
        super("div", {
            ...props,
            attrs: {
                class: "auth"
            },
            link: new Link({
                title: "Перейти к чатам",
                href: "./chats.html"
            })
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}