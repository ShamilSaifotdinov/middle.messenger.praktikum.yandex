import "./sidebar.css"
import Block, { Props } from "../../utils/block"
import tmp from "./tmp.hbs?raw"
import Input from "../../components/field"
import ChatlistItem from "./chatlist-item"
import Router from "../../utils/router"
import Avatar from "../../components/avatar"

const router = Router.getInstance()

export default class Sidebar extends Block {
    constructor(props: Props) {
        props.chats = (props.raw_chats as Array<Record<string, unknown>>)
            .map((chat) => new ChatlistItem(chat))

        super("div", {
            ...props,
            attrs: { class: "sidebar" },
            profile: new Avatar(
                {
                    onClick: () => {
                        router.go("/settings")
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
