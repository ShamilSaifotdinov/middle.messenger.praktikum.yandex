import Input from "../../../components/input"
import Block, { Props } from "../../../modules/block"
import tmp from "./tmp.hbs?raw"
import "./details-row.css"

export interface PropsDetailsItem extends Props {
    title: string
    name: string
    value: string
    type?: string
}

export default class DetailsRow extends Block {
    constructor(props: PropsDetailsItem) {
        super("div", {
            ...props,
            attrs: { class: "profile-details_item" },
            title: props.title,
            input: new Input({
                name: props.name,
                value: props.value,
                type: props.type,
                field_class: "profile-details_input"
            })
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
