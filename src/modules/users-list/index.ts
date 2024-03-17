import Block, { Props } from "../../utils/block"

export default class UsersList extends Block {
    constructor(props: Props) {
        super("ul", {
            ...props,
            attrs: {
                class: "users-list"
            }
        })
    }

    render() {
        return this.compile("{{{ checkedUsers }}}{{{ users }}}", this.props)
    }
}
