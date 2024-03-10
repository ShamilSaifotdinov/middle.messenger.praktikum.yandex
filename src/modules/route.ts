import isEqual from "../utils/isEqual"
import render from "../utils/renderDOM"
import Block, { Props } from "./block"

interface RouteProps extends Props {
    rootQuery: string
}

export type blockClass = { new(props: RouteProps): Block }

export default class Route {
    _pathname: string

    _blockClass: blockClass

    _block: Block | null

    _props: RouteProps

    constructor(pathname: string, view: blockClass, props: RouteProps) {
        this._pathname = pathname
        this._blockClass = view
        this._block = null
        this._props = props
    }

    navigate(pathname: string) {
        if (this.match(pathname)) {
            this._pathname = pathname
            this.render()
        }
    }

    leave() {
        if (this._block) {
            this._block.hide()
        }
    }

    match(pathname: string) {
        return isEqual(pathname, this._pathname)
    }

    render() {
        if (!this._block) {
            this._block = new this._blockClass(this._props)
            render(this._props.rootQuery, this._block)
            return
        }

        this._block.show()
    }
}
