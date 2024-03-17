import Button from "../../../components/button"
import Block, { Props } from "../../../utils/block"
import template from "./tmp.hbs?raw"
import "./edit-chat.css"
import Avatar from "../../../components/avatar"
import { Indexed } from "../../../interfaces"
import Input from "../../../components/field"
import ChatsService from "../../../services/chats-service"

interface EditChatProps extends Props {
    onClose: CallableFunction
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
                    this.setAvatar(URL.createObjectURL(file))
                }
            }
        })

        super("div", {
            attrs: {
                class: "edit-chat"
            },
            input,
            avatar: new Avatar({
                src: (props.active_chat && (props.active_chat as Indexed).avatar && (
                    "https://ya-praktikum.tech/api/v2/resources"
                    + (props.active_chat as Indexed).avatar
                )) as string || undefined,
                class: "new-avatar"
            }),
            save: new Button({
                text: "Сохранить",
                color: "blue",
                onClick: () => props.onClose()
            }),
            cancel: new Button({
                text: "Отмена",
                color: "outline-blue",
                onClick: () => props.onClose()
            })
        })
    }

    setAvatar(src: string) {
        const avatar = new Avatar({ src, class: "new-avatar" })
        this.setProps({ avatar })
    }

    render() {
        return this.compile(template, this.props)
    }
}
