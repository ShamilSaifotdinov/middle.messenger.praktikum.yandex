import "./chatlist-item.css"
import Block, { Props } from "../../../utils/block"
import tmp from "./tmp.hbs?raw"
import Router from "../../../utils/router"
import Avatar from "../../../components/avatar"
import { Indexed } from "../../../interfaces"
import Actions from "../../../store/actions"
import { getLocalHourAndMinuteFromISO } from "../../../utils/getLocal"
import { isObject } from "../../../utils/types"

export default class ChatlistItem extends Block {
    constructor(props: Props) {
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

                    Actions.setActiveChat(props as Indexed)
                }
            }
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
