import isEqual from "../isEqual.ts"
import render from "../renderDOM.ts"
import Block from "../block"
import { defaultTitle } from "../../global.ts"
import { BlockClass, BlockWithoutProps, OptionsWithProps, RouteOptions } from "./types"

export default class Route<T extends BlockClass> {
    _pathname: string

    _blockClass: T

    _block: Block | null

    _options: RouteOptions<T>

    constructor(pathname: string, view: T, options: RouteOptions<T>) {
        this._pathname = pathname
        this._blockClass = view
        this._block = null
        this._options = options
    }

    navigate(pathname: string) {
        if (this.match(pathname)) {
            this._pathname = pathname
            this.render()
        }
    }

    leave() {
        document.title = defaultTitle

        if (this._block) {
            this._block.hide()
        }
    }

    match(pathname: string) {
        return isEqual(pathname, this._pathname)
    }

    render() {
        if (this._options.title) {
            document.title = this._options.title
        }

        if (!this._block) {
            if ((this._options as OptionsWithProps).props !== undefined) {
                this._block = new this._blockClass((this._options as OptionsWithProps).props)
            } else {
                this._block = new (this._blockClass as BlockWithoutProps)()
            }
            render(this._options.rootQuery, this._block)
            return
        }

        this._block.show()
    }
}
