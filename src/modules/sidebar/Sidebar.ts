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
import { Chat, User } from "../../interfaces"

const router = Router.getInstance()

interface SidebarProps extends Props {
    raw_chats?: Array<Chat>
    user?: User
    chats?: ChatlistItem[]
}

export default class Sidebar extends Block {
    constructor(props: SidebarProps) {
        if (props.raw_chats) {
            props.chats = props.raw_chats
                .map((chat) => new ChatlistItem(chat))
        }

        super("div", {
            ...props,
            attrs: { class: "sidebar" },
            profile: new Avatar(
                {
                    src: (props.user && props.user.avatar) ? (
                        "https://ya-praktikum.tech/api/v2/resources" + props.user.avatar
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

    componentDidUpdate(oldProps: SidebarProps, newProps: SidebarProps): boolean {
        if (
            newProps.raw_chats
            && !isEqual(oldProps.raw_chats as unknown[], newProps.raw_chats as unknown[])
        ) {
            this.setProps({
                chats: newProps.raw_chats
                    .map((chat) => new ChatlistItem(chat))
            })
        }

        if (newProps.user) {
            (this.children.profile as Avatar).setProps({
                src: newProps.user.avatar ? (
                    "https://ya-praktikum.tech/api/v2/resources" + newProps.user.avatar
                ) : undefined
            })
        }

        return true
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
