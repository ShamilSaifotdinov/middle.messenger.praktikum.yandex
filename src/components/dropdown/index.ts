import Block, { Props } from "../../utils/block.ts"
import Button from "../button/index.ts"
import "./dropdown.css"
import template from "./tmp.hbs?raw"

interface DropdownProps extends Props {
    buttonClass?: string
    items: {
        title: string
        onClick: CallableFunction
        color?: string
    }[]
}

export default class Dropdown extends Block {
    constructor(props: DropdownProps) {
        props.list = props.items.map((item) => new Block("li", {
            events: {
                click: () => {
                    this.setProps({ opened: !this.props.opened })
                    item.onClick()
                }
            },
            attrs: {
                class: "dropdown-item" + (item.color ? ` dropdown-item-${item.color}` : "")
            },
            children: item.title
        }))

        super("div", {
            attrs: {
                class: "dropdown"
            },
            opened: false,
            button: new Button({
                class: props.buttonClass,
                onClick: () => this.setProps({ opened: !this.props.opened })
            }),
            items: props.list
        })
    }

    render() {
        return this.compile(template, this.props)
    }
}
