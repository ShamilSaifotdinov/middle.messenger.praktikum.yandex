import Block from "./block"

export default function render(query: string, block: Block): HTMLElement | null {
    const root: HTMLElement | null = document.querySelector(query)

    root?.appendChild(block.getContent())

    block.dispatchComponentDidMount()

    return root
}
