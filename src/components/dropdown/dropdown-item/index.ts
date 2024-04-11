import Block, { Props } from "../../../utils/block"

type DropdownItemProps = {
    onToggle: CallableFunction
    onClick: CallableFunction
} & Props

export default class DropdownItem extends Block {
    constructor(props: DropdownItemProps) {
        super("li", {
            events: {
                click: () => {
                    props.onToggle()
                    props.onClick()
                }
            },
            attrs: {
                class: "dropdown-item" + (props.color ? ` dropdown-item-${props.color}` : "")
            },
            children: props.title
        })
    }
}
