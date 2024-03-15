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
    isChangeable: boolean
}

export default class DetailsRow extends Block {
    constructor(props: PropsDetailsItem) {
        super("div", {
            isChangeable: props.isChangeable,
            attrs: { class: "profile-details_item" + (props.isChangeable ? ""
                : " profile-details_item-changeable"
            ) },
            title: props.title,
            value: props.value,
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

    componentDidUpdate(oldProps: PropsDetailsItem, newProps: PropsDetailsItem) {
        if (oldProps.value !== newProps.value) {
            (this.children.input as Input).setProps({ value: newProps.value })
            return true
        }

        return false
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
