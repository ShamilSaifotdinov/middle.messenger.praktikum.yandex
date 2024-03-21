import { Indexed } from "../../../../interfaces"
import Block, { Props } from "../../../../utils/block"
import template from "./tmp.hbs?raw"
import "./messages.css"

interface MessagesProps extends Props {
    days: Indexed[]
    getOldMessages: CallableFunction
}

export default class Messages extends Block {
    constructor(props: MessagesProps) {
        super("div", {
            ...props,
            attrs: {
                class: "chat_messages"
            },
            events: {
                scroll: (e: Event) => {
                    const el = e.target as HTMLElement
                    if ((el.scrollHeight + el.scrollTop - el.clientHeight) < 1) {
                        this.setProps({ scrollTop: el.scrollTop })
                        props.getOldMessages()
                    }
                }
            }
        })
    }

    render() {
        return this.compile(template, this.props)
    }
}
