import Block, { Props } from "../../utils/block"
import tmp from "./tmp.hbs?raw"
import "./window.css"

export default class PageWindow extends Block {
    constructor(props: Props) {
        super("div", { ...props, attrs: { class: "window" } })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
