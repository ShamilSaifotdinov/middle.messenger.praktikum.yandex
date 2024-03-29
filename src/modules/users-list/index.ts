import Avatar from "../../components/avatar"
import Input from "../../components/field"
import template from "./tmp.hbs?raw"
import { bus } from "../../global"
import { Indexed, User } from "../../interfaces"
import ChatsService from "../../services/chats-service"
import Block, { Props } from "../../utils/block"
import UsersRow from "./users-row"
import UsersRows from "./users-rows"
import isEqual from "../../utils/isEqual"

export default class UsersList extends Block {
    constructor(props?: { oldUsers?: Indexed[] }) {
        let users

        if (props && props.oldUsers) {
            users = props.oldUsers.map((user) => new UsersRow({
                ...user,
                checked: true,
                events: {
                    click: () => this.addUser(user)
                },
                avatar: new Avatar({
                    class: "users-row_avatar",
                    src: user.avatar ? ("https://ya-praktikum.tech/api/v2/resources" + user.avatar)
                        : undefined
                })
            }))
        } else {
            users = [] as UsersRow[]
        }

        super("div", {
            attrs: {
                class: "users-list"
            },
            userRows: new UsersRows({ users: [], checkedUsers: users }),
            search: new Input({
                name: "search",
                field_class: "create-chat_input",
                class: "sidebar-header_search-input",
                labelText: "Введите логин пользователя",
                placeholder: "Поиск",
                onInput: ChatsService.getUsers
            })
        })

        bus.on("user-list:users", this.handleUsers.bind(this))
        bus.on("user-list:err", this.reqError.bind(this))
    }

    getCheckedUsers() {
        const userrows = (this.children as Record<string, Block>).userRows
        const checkedUsers = (userrows.children.checkedUsers as Block[])

        return checkedUsers || []
    }

    getUsers() {
        const userrows = (this.children as Record<string, Block>).userRows
        const users = (userrows.children.users as Block[])

        return users || []
    }

    componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        if (
            (!oldProps.oldUsers && newProps.oldUsers)
            || (
                newProps.oldUsers
                && !isEqual(oldProps.oldUsers as User[], newProps.oldUsers as User[])
            )
        ) {
            const userrows = (this.children as Record<string, Block>).userRows
            const checkedUsers = this.getCheckedUsers()

            const rows = (newProps.oldUsers as User[])
                .filter(
                    (user) => !checkedUsers.find(
                        (row) => row.props.id === user.id
                    )
                )
                .map((user) => new UsersRow({
                    ...user,
                    checked: true,
                    events: {
                        click: () => this.removeUser(user)
                    },
                    avatar: new Avatar({
                        class: "users-row_avatar",
                        src: user.avatar ? (
                            "https://ya-praktikum.tech/api/v2/resources" + user.avatar
                        )
                            : undefined
                    })
                }))

            userrows.setProps({ checkedUsers: rows })
        }
        return true
    }

    handleUsers(users: User[]) {
        const userrows = (this.children as Record<string, Block>).userRows
        const checkedUsers = this.getCheckedUsers()

        const rows = users
            .filter(
                (user) => !checkedUsers.find(
                    (row) => row.props.id === user.id
                )
            ).map((user) => new UsersRow({
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

        userrows.setProps({ users: rows })
    }

    addUser(user: Indexed) {
        const userrows = (this.children as Record<string, Block>).userRows
        const users = this.getUsers()
        const checkedUsers = this.getCheckedUsers()

        const rows = users.filter((row) => row.props.id !== user.id)
        const checkedRows = [
            ...checkedUsers,
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

        userrows.setProps({ users: rows, checkedUsers: checkedRows })
    }

    removeUser(user: Indexed) {
        const userrows = (this.children as Record<string, Block>).userRows
        const checkedUsers = this.getCheckedUsers()

        const checkedRows = checkedUsers.filter(
            (row) => row.props.id !== user.id
        )

        userrows.setProps({ checkedUsers: checkedRows })
    }

    reqError(reason: string) {
        const search = this.children.search as Input
        search.setProps({ invalidMsg: reason })
    }

    render() {
        return this.compile(template, this.props)
    }
}
