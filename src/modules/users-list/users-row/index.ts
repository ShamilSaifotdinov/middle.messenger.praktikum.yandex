import "./users-row.css"
import Block, { Props } from "../../../utils/block"
import tmp from "./tmp.hbs?raw"
import { User } from "../../../interfaces"
import Avatar from "../../../components/avatar"

interface UsersRowProps extends Props, Omit<User, "avatar"> {
    avatar: Avatar
}

export default class UsersRow extends Block {
    constructor(props: UsersRowProps) {
        super("li", {
            ...props,
            attrs: {
                class: "users-row" + (props.checked ? " users-row_checked" : "")
            }
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
