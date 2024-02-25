import Block from "../modules/block"

export function render(query: string, block: Block): HTMLElement | null {
    const root: HTMLElement | null = document.querySelector(query)

    // Можно завязаться на реализации вашего класса Block
    root?.appendChild(block.getContent())

    block.dispatchComponentDidMount()

    return root
} 