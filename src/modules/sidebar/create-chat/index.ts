import "./create-chat.css"
import Block from "../../../utils/block"
import tmp from "./tmp.hbs?raw"
import Button from "../../../components/button"
import Input from "../../../components/field"
import ChatsService from "../../../services/chats-service"
import { bus } from "../../../global"
import UsersList from "../../users-list"
import UsersRow from "../../users-list/users-row"
import Avatar from "../../../components/avatar"
import { Indexed, User } from "../../../interfaces"

export default class CreateChat extends Block {
    constructor(props : { onClose: CallableFunction }) {
        const chatTitle = new Input({
            name: "title",
            field_class: "create-chat_input",
            labelText: "Название чата",
            onBlur: (value : string) => {
                const field = this.children.chatTitle as Block

                if (value.length === 0) {
                    field.setProps({
                        invalidMsg: "Обязательное значение",
                        state: false
                    })
                } else {
                    field.setProps({
                        invalidMsg: undefined,
                        state: undefined
                    })
                }
            }
        })

        super("div", {
            attrs: {
                class: "create-chat"
            },
            chatTitle,
            search: new Input({
                name: "search",
                field_class: "create-chat_input",
                class: "sidebar-header_search-input",
                labelText: "Введите логин пользователя",
                placeholder: "Поиск",
                onInput: ChatsService.getUsers
            }),
            users: new UsersList({ users: [], checkedUsers: [] }),
            cancel: new Button({
                text: "Отмена",
                color: "outline-blue",
                onClick: () => props.onClose()
            }),
            create: new Button({
                text: "Сохранить",
                color: "blue",
                onClick: () => this.handleCreateChat()
            })
        })

        bus.on("chats-createChat:users", this.handleUsers.bind(this))
        bus.on("chats-createChat:created", () => props.onClose())
    }

    handleUsers(users: User[]) {
        const userlist = (this.children as Record<string, Block>).users
        const rows = users
            .filter(
                (user) => !(userlist.children.checkedUsers as Block[]).find(
                    (row) => row.props.id === user.id
                )
            )
            .map((user) => new UsersRow({
                ...user,
                events: {
                    click: () => this.addUser(user)
                },
                avatar: new Avatar({
                    class: "users-row_avatar",
                    src: user.avatar ? ("https://ya-praktikum.tech/api/v2/resources" + user.avatar)
                        : undefined
                })
            }))

        userlist.setProps({ users: rows })
    }

    addUser(user: Indexed) {
        const userlist = (this.children as Record<string, Block>).users

        const rows = (userlist.children.users as Block[]).filter((row) => row.props.id !== user.id)
        const checkedRows = [
            ...(userlist.children.checkedUsers as Block[]),
            new UsersRow({
                ...user,
                checked: true,
                events: {
                    click: () => this.removeUser(user)
                },
                avatar: new Avatar({
                    class: "users-row_avatar",
                    src: user.avatar ? ("https://ya-praktikum.tech/api/v2/resources" + user.avatar)
                        : undefined
                })
            })
        ]

        userlist.setProps({ users: rows, checkedUsers: checkedRows })
    }

    removeUser(user: Indexed) {
        const userlist = (this.children as Record<string, Block>).users

        const checkedRows = (userlist.children.checkedUsers as Block[]).filter(
            (row) => row.props.id !== user.id
        )

        userlist.setProps({ checkedUsers: checkedRows })
    }

    handleCreateChat() {
        const children = this.children as Record<string, Block>

        const title = children.chatTitle as Input
        const userlist = children.users.children.checkedUsers as Block[]

        if (!title.value) {
            title.setProps({
                invalidMsg: "Обязательное значение",
                state: false
            })

            return
        }

        ChatsService.createChat({
            title: title.value,
            users: userlist.map((user) => (user.props as User).id)
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
