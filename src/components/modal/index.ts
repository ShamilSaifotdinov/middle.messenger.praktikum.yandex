import Block from "../../utils/block"
import template from "./tmp.hbs?raw"
import "./modal.css"

export default class Modal extends Block {
    constructor(props : { children: Block }) {
        super("div", {
            ...props,
            attrs: {
                class: "modal"
            }
        })
    }

    render() {
        return this.compile(template, this.props)
    }
}
