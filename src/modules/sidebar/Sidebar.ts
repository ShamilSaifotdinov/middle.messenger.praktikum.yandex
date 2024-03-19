import "./sidebar.css"
import Block, { Props } from "../../utils/block"
import tmp from "./tmp.hbs?raw"
import Input from "../../components/field"
import ChatlistItem from "./chatlist-item"
import Router from "../../utils/router"
import Avatar from "../../components/avatar"
import Button from "../../components/button"
import CreateChat from "./create-chat"
import Modal from "../../components/modal"
import ChatsService from "../../services/chats-service"
import isEqual from "../../utils/isEqual"
import Actions from "../../store/actions"
import store from "../../store"
import { Indexed } from "../../interfaces"

const router = Router.getInstance()

export default class Sidebar extends Block {
    constructor(props: Props) {
        props.chats = (props.raw_chats as Array<Record<string, unknown>>)
            .map((chat) => new ChatlistItem(chat))

        const { user } = store.getState()

        super("div", {
            ...props,
            attrs: { class: "sidebar" },
            profile: new Avatar(
                {
                    src: (user as Indexed).avatar ? (
                        "https://ya-praktikum.tech/api/v2/resources" + (user as Indexed).avatar
                    ) : undefined,
                    onClick: () => {
                        router.go("/settings")

                        Actions.unsetActiveChat()
                    }
                }
            ),
            search: new Input({
                name: "search",
                class: "sidebar-header_search-input",
                placeholder: "Поиск",
                onInput: () => ChatsService.getChats()
            }),
            createChatBtn: new Button({
                class: "sidebar-header_create-chat",
                onClick: () => {
                    this.setProps({ createChatModal: new Modal({
                        children: new CreateChat({
                            onClose: () => this.setProps({ createChatModal: null })
                        })
                    }) })
                }
            })
        })
    }

    componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        if (!isEqual(oldProps.raw_chats as unknown[], newProps.raw_chats as unknown[])) {
            this.setProps({
                chats: (newProps.raw_chats as Array<Record<string, unknown>>)
                    .map((chat) => new ChatlistItem(chat))
            })
        }

        return true
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
