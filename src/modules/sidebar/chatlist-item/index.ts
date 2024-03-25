import "./chatlist-item.css"
import Block from "../../../utils/block"
import tmp from "./tmp.hbs?raw"
import Router from "../../../utils/router"
import Avatar from "../../../components/avatar"
import Actions from "../../../store/actions"
import { getLocalHourAndMinuteFromISO } from "../../../utils/getLocal"
import { isObject } from "../../../utils/types"
import { Chat } from "../../../interfaces"

export default class ChatlistItem extends Block {
    constructor(props: Chat) {
        if (isObject(props.last_message) && typeof props.last_message.time === "string") {
            props.last_message.time = getLocalHourAndMinuteFromISO(props.last_message.time)
        }

        super("li", {
            ...props,
            avatar: new Avatar({
                class: "chatlist-item_avatar",
                src: (props.avatar && (
                    "https://ya-praktikum.tech/api/v2/resources" + props.avatar
                )) as string || undefined
            }),
            attrs: {
                class: "chatlist_row"
            },
            events: {
                click: (event: Event) => {
                    event.preventDefault()
                    const router = Router.getInstance()
                    router.go("/messenger")

                    Actions.setActiveChat(props.id)
                }
            }
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
