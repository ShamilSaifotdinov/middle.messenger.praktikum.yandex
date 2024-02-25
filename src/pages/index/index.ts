import Link from "../../components/link"
import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"

interface PropsIndex extends Props {
    pages: Array<Record<string, string>>
}

export default class Index extends Block {
    constructor(props: PropsIndex) {
        super("div", {
            attrs: {
                class: "auth"
            },
            links: [
                ...props.pages.map((page: Record<string, string>) => 
                    new Link({ href: page.href, title: page.title }))
            ]
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}