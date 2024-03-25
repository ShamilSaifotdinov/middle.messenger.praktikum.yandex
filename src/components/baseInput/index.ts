import Block, { Props } from "../../utils/block"
import "./baseInput.css"

export default class BaseInput extends Block {
    constructor(props: Props) {
        super("input", props)
    }

    render() {
        return this.compile("", this.props)
    }
}
