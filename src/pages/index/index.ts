import Link from "../../components/link"
import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"

export default class Index extends Block {
    constructor(props: Props) {
        super("div", {
            attrs: {
                class: "auth"
            },
            links: [
                ...(props.pages as Array<Record<string, string>>)
                    .map((page: Record<string, string>) => new Link({
                        href: page.href,
                        content: page.title
                    }))
            ]
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
