import "./chatlist-item.css"
import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import Router from "../../modules/router"

export default class ChatlistItem extends Block {
    constructor(props: Props) {
        super("li", {
            ...props,
            linkClassName: "chatlist-item" + (props.active ? " chatlist-item-active" : ""),
            id: "#",
            attrs: {
                class: "chatlist_row"
            },
            events: {
                click: (event: Event) => {
                    event.preventDefault()
                    const router = Router.getInstance()
                    router.go("/chats")
                }
            }
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
