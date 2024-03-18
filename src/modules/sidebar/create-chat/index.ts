import "./create-chat.css"
import Block from "../../../utils/block"
import tmp from "./tmp.hbs?raw"
import Button from "../../../components/button"
import Input from "../../../components/field"
import ChatsService from "../../../services/chats-service"
import { bus } from "../../../global"
import UsersList from "../../users-list"
import { User } from "../../../interfaces"

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
            users: new UsersList(),
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

        bus.on("chats-createChat:created", () => props.onClose())
    }

    handleCreateChat() {
        const children = this.children as Record<string, Block>

        const title = children.chatTitle as Input
        const userrows = (
            children.users.children.userRows as Block
        ).children.checkedUsers as Block[]

        if (!title.value) {
            title.setProps({
                invalidMsg: "Обязательное значение",
                state: false
            })

            return
        }

        ChatsService.createChat({
            title: title.value,
            users: userrows.map((user) => (user.props as User).id)
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
