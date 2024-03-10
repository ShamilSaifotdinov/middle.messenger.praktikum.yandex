import "./sidebar.css"
import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import Input from "../../components/input"
import ChatlistItem from "../../components/chatlist-item"
import Router from "../../modules/router"

export default class Sidebar extends Block {
    constructor(props: Props) {
        props.chats = (props.raw_chats as Array<Record<string, unknown>>)
            .map((chat) => new ChatlistItem(chat))

        super("div", {
            ...props,
            attrs: { class: "sidebar" },
            profile: new Block(
                "a",
                {
                    attrs: {
                        class: "sidebar-header_avatar",
                        href: "./profile"
                    },
                    events: {
                        click: (event: Event) => {
                            event.preventDefault()
                            const router = Router.getInstance()
                            router.go("/profile")
                        }
                    }
                }
            ),
            search: new Input({
                name: "search",
                class: "sidebar-header_search-input",
                placeholder: "Поиск"
            })
        })

        window.onpopstate = ((event: PopStateEvent) => {
            const newPath = (event.currentTarget as Window).location.pathname

            // if (new_path)
            console.log(newPath)
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
