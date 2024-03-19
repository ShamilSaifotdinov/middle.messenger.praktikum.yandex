import Button from "../../../../components/button"
import Block, { Props } from "../../../../utils/block"
import template from "./tmp.hbs?raw"
import "./edit-chat.css"
import Avatar from "../../../../components/avatar"
import { Indexed, UpdateChatModel, User } from "../../../../interfaces"
import Input from "../../../../components/field"
import ChatsService from "../../../../services/chats-service"
import UsersList from "../../../../modules/users-list"
import isEqual from "../../../../utils/isEqual"
import { getDifference } from "../../../../utils/setOps"
import Actions from "../../../../store/actions"
import store, { StoreEvents } from "../../../../store"
import ChatService from "../../../../services/chat-service"

interface EditChatProps extends Props {
    onClose: CallableFunction
    users?: User[]
}

export default class EditChat extends Block {
    constructor(props: EditChatProps) {
        const input = new Input({
            type: "file",
            name: "avatar",
            attrs: {
                accept: "image/*"
            },
            search: new Input({
                name: "search",
                field_class: "create-chat_input",
                class: "sidebar-header_search-input",
                labelText: "Введите логин пользователя",
                placeholder: "Поиск",
                onInput: ChatsService.getUsers
            }),
            onChange: (e: InputEvent) => {
                const inputTarget = e.target as HTMLInputElement
                if (inputTarget.files) {
                    const [ file ] = inputTarget.files
                    this.setAvatar(file)
                }
            }
        })

        const state = store.getState()
        const activeChat = state.active_chat

        super("div", {
            ...props,
            attrs: {
                class: "edit-chat"
            },
            input,
            avatar: new Avatar({
                src: (activeChat && (activeChat as Indexed).avatar && (
                    "https://ya-praktikum.tech/api/v2/resources"
                    + (activeChat as Indexed).avatar
                )) as string || undefined,
                class: "new-avatar"
            }),
            userRows: new UsersList(),
            save: new Button({
                text: "Сохранить",
                color: "blue",
                onClick: () => this.handleUpdateChat()
            }),
            cancel: new Button({
                text: "Отмена",
                color: "outline-blue",
                onClick: () => {
                    store.off(StoreEvents.Updated, this.sub)
                    props.onClose()
                }
            })
        })
        store.on(StoreEvents.Updated, this.sub)

        Actions.getActiveChatUsers()
    }

    sub = () => {
        const state = store.getState()

        if ((state.active_chat as Indexed).users) {
            this.setProps({ users: (state.active_chat as Indexed).users })
        }
    }

    componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        if (
            (!oldProps.users && newProps.users)
            || (
                newProps.users
                && !isEqual(oldProps.users as unknown[], newProps.users as unknown[])
            )
        ) {
            (this.children.userRows as UsersList).setProps({ oldUsers: newProps.users })
        }
        return true
    }

    setAvatar(src: File) {
        const avatar = new Avatar({ src: URL.createObjectURL(src), class: "new-avatar" })
        this.setProps({ newAvatar: src, avatar })
    }

    handleUpdateChat() {
        const data: UpdateChatModel = {}
        if (this.props.newAvatar) {
            data.avatar = this.props.newAvatar as File
        }

        const children = this.children as Record<string, Block>

        const userrows = (
            children.userRows.children.userRows as Block
        ).children.checkedUsers as Block[]

        const oldUsers = new Set((this.props.users as User[]).map((user) => user.id))
        const newUsers = new Set(userrows.map((user) => (user.props as User).id))

        const addUsers = Array.from(getDifference<number>(newUsers, oldUsers))
        const deleteUsers = Array.from(getDifference<number>(oldUsers, newUsers))

        if (addUsers.length > 0) {
            data.add = addUsers
        }

        if (deleteUsers.length > 0) {
            data.delete = deleteUsers
        }

        ChatService.updateChat(data)

        store.off(StoreEvents.Updated, this.sub);
        (this.props as EditChatProps).onClose()
    }

    render() {
        return this.compile(template, this.props)
    }
}
