import "./sidebar.css"
import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import Input from "../input"

export default class Sidebar extends Block {
    constructor(props: Props) {
        super("div", {
            ...props,
            attrs: { class: "sidebar" },
            search: new Input({
                name: "search",
                class: "sidebar-header_search-input",
                placeholder: "Поиск"
            })
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
