import Block, { Props } from "../../utils/block.ts"
import Button from "../button/index.ts"
import DropdownItem from "./dropdown-item/index.ts"
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
        props.list = props.items.map((item) => new DropdownItem({
            ...item,
            onToggle: () => this.onToggle()
        }))

        super("div", {
            attrs: {
                class: "dropdown"
            },
            opened: false,
            button: new Button({
                class: props.buttonClass,
                onClick: () => this.onToggle()
            }),
            items: props.list
        })
    }

    onToggle() {
        this.setProps({ opened: !this.props.opened })
    }

    render() {
        return this.compile(template, this.props)
    }
}
