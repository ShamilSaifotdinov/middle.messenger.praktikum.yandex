import { v4 as makeUUID } from "uuid"
import EventBus from "./event-bus.ts"
import Templator from "./templator.ts"
import { Indexed } from "../interfaces"
import isEqual from "./isEqual.ts"

export interface Props extends Indexed {
    events?: Record<string, EventListener>
    attrs?: Record<string, string>
}

interface Children { [key: string]: Block | Array<Block> | null }

const enum EVENTS {
    INIT = "init",
    FLOW_CDM = "flow:component-did-mount",
    FLOW_CDU = "flow:component-did-update",
    FLOW_RENDER = "flow:render"
}

abstract class Block<BlockProps extends Props = Props> {
    // #region Meta

    _element: HTMLElement

    _parentElement: ParentNode | null = null

    _meta: {
        tagName: string
        props: BlockProps
        children: Children
    }

    _id: string

    // #endregion

    props: BlockProps

    children: Children

    // #region Update

    _eventBus: Function

    _setUpdate: boolean = false

    // #endregion

    /** JSDoc
     * @param {string} tagName
     * @param {BlockProps} propsAndChildren
     *
     * @returns {void}
     */
    constructor(tagName: string = "div", propsAndChildren: BlockProps = {} as BlockProps) {
        const { children, props }:{
            children: Children
            props: BlockProps
        } = this._getChildren(propsAndChildren)

        const eventBus = new EventBus()

        this._meta = {
            tagName,
            props,
            children
        }

        this._id = makeUUID()

        this.props = this._makePropsProxy({ ...props, __id: this._id })
        this.children = this._makePropsProxy(children)

        this._eventBus = () => eventBus

        this._registerEvents(eventBus)

        this._element = this._createDocumentElement(tagName)
        this._eventBus().emit(EVENTS.FLOW_RENDER)
    }

    // #region Init

    _getChildren(propsAndChildren: Partial<BlockProps>) {
        const children: Children = {}
        const props: BlockProps = {} as BlockProps

        Object.entries(propsAndChildren).forEach(([ key, value ]) => {
            if (
                value instanceof Block
                || (
                    value instanceof Array
                    && value.length > 0
                    && value.every((e) => e instanceof Block)
                )
                || (
                    this.children && this.children[key]
                    && (value === null || (value instanceof Array && value.length === 0))
                )
            ) {
                children[key] = value

                if (this.props && this.props[key]) {
                    props[key as keyof BlockProps] = undefined as BlockProps[keyof BlockProps]
                }
            } else {
                props[key as keyof BlockProps] = value as BlockProps[keyof BlockProps]

                if (this.children && this.children[key]) {
                    children[key] = null
                }
            }
        })

        return { children, props }
    }

    _registerEvents(eventBus: EventBus) {
        eventBus.on(EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
        eventBus.on(EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this))
        eventBus.on(EVENTS.FLOW_RENDER, this._render.bind(this))
    }

    // #endregion

    componentDidMount?(): void

    componentDidUpdate?(oldProps: BlockProps, newProps: BlockProps): boolean

    // #region DidMount

    _componentDidMount() {
        if (this.componentDidMount) {
            this.componentDidMount()
        }

        Object.values(this.children).forEach((child) => {
            if (child instanceof Block) {
                child.dispatchComponentDidMount()
            }

            if (child instanceof Array && child.every((e) => e instanceof Block)) {
                child.forEach((item) => {
                    item.dispatchComponentDidMount()
                })
            }
        })
    }

    _addEvents() {
        const { events = {} } = this.props

        Object.keys(events).forEach((eventName) => {
            this._element.addEventListener(eventName, events[eventName])
        })
    }

    _addAttributes() {
        const { attrs = {} } = this.props

        Object.keys(attrs).forEach((attr) => {
            this._element.setAttribute(attr, attrs[attr])
        })
    }

    _removeEvents() {
        const { events = {} } = this.props

        Object.keys(events).forEach((eventName) => {
            this._element.removeEventListener(eventName, events[eventName])
        })
    }

    // #endregion

    dispatchComponentDidMount() {
        this._eventBus().emit(EVENTS.FLOW_CDM)
    }

    // #region DidUpdate

    _componentDidUpdate(oldProps: BlockProps, newProps: BlockProps): void {
        if (this.componentDidUpdate) {
            const response = this.componentDidUpdate(oldProps, newProps)
            if (!response) {
                return
            }
        }

        this._eventBus().emit(EVENTS.FLOW_RENDER)
    }

    // #endregion

    setProps(nextPropsAndChildren: Partial<BlockProps>): void {
        if (!nextPropsAndChildren || Object.keys(nextPropsAndChildren).length === 0) {
            return
        }

        const { children, props } = this._getChildren(nextPropsAndChildren)

        Object.assign(this.children, children)

        const oldProps = { ...this.props }

        Object.assign(this.props, props)

        const newProps = { ...this.props }

        if (this._setUpdate) {
            this._eventBus().emit(EVENTS.FLOW_CDU, oldProps, newProps)
        }

        this._setUpdate = false
    }

    get element(): HTMLElement {
        return this._element
    }

    render(): DocumentFragment {
        return this.compile("{{{ children }}}", this.props)
    }

    // #region Render

    _render(): void {
        const block = this.render()

        this._removeEvents()

        this._element.innerHTML = ""

        this._element.appendChild(block)

        this._addEvents()
        this._addAttributes()
    }

    // #endregion

    getContent(): HTMLElement {
        return this.element
    }

    // #region Compile

    _makePropsProxy<T extends BlockProps | Children>(props: T): T {
        return new Proxy(props, {
            get(target: T, prop:string): unknown {
                const value = target[prop]
                return (typeof value === "function") ? value.bind(target) : value
            },

            set: (target: T, prop: string, value: unknown): boolean => {
                if (!isEqual(target[prop], value)) {
                    target[prop] = value
                    this._setUpdate = true
                }

                return true
            },

            deleteProperty() {
                throw new Error("Нет прав")
            }
        })
    }

    _createDocumentElement(tagName: string): HTMLElement {
        const element = document.createElement(tagName)
        if (this._id) {
            element.setAttribute("data-id", this._id)
        }

        return element
    }

    // #endregion

    compile(template: string, props: Props): DocumentFragment {
        const propsAndStubs: Indexed = { ...props }

        Object.entries(this.children).forEach(([ key, child ]) => {
            if (child instanceof Block) {
                propsAndStubs[key] = `<div data-id="${child._id}"></div>`
            }

            if (child instanceof Array && child.every((e) => e instanceof Block)) {
                propsAndStubs[key] = ""
                child.forEach((item) => {
                    propsAndStubs[key] += `<div data-id="${item._id}"></div>`
                })
            }
        })

        const fragment = this._createDocumentElement("template") as HTMLTemplateElement

        fragment.innerHTML = Templator.compile(template, propsAndStubs)

        const { content } = fragment

        Object.values(this.children).forEach((child) => {
            if (child instanceof Block) {
                const stub = content.querySelector(`[data-id="${child._id}"]`)

                stub?.replaceWith(child.getContent())
            }

            if (child instanceof Array && child.every((e) => e instanceof Block)) {
                child.forEach((item) => {
                    const stub = content.querySelector(`[data-id="${item._id}"]`)
                    stub?.replaceWith(item.getContent())
                })
            }
        })

        return content
    }

    show(): void {
        this._parentElement?.appendChild(this.getContent())
    }

    hide(): void {
        this._parentElement = this.getContent().parentNode
        this.getContent().remove()
    }
}

export default Block
