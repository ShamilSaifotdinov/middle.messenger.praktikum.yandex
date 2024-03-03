import Input from "../../../components/input"
import Block, { Props } from "../../../modules/block"
import tmp from "./tmp.hbs?raw"
import "./details-row.css"

export interface PropsDetailsItem extends Props {
    title: string
    name: string
    value: string
    type?: string
    pattern?: string
    desc?: string
}

export default class DetailsRow extends Block {
    constructor(props: PropsDetailsItem) {
        super("div", {
            attrs: { class: "profile-details_item" },
            title: props.title,
            input: new Input({
                name: props.name,
                value: props.value,
                type: props.type,
                ...(props.pattern && { pattern: props.pattern }),
                field_class: "profile-details_input",
                required: true,
                onBlur: (value : string) => {
                    if (value.length === 0) {
                        (this.children as Record<string, Block>).input.setProps({
                            invalidMsg: "Обязательное значение"
                        })
                    } else if (props.pattern && !value.match(props.pattern)) {
                        (this.children as Record<string, Block>).input.setProps({
                            invalidMsg: props.desc
                        })
                    } else {
                        (this.children as Record<string, Block>).input.setProps({
                            invalidMsg: undefined
                        })
                    }
                }
            })
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
