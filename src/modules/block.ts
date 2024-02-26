import { v4 as makeUUID } from "uuid"
import EventBus from "./event-bus"
import Templator from "../utils/templator"

export interface Props {
    events?: Record<string, EventListener>
    attrs?: Record<string, string>
    [key: string]: unknown
}

interface Block {
    componentDidMount?(oldProps: Props): boolean
    componentDidUpdate?(oldProps: Props, newProps: Props): boolean
    render(): DocumentFragment
}

interface Children { [key: string]: Block | Array<Block> }

const enum EVENTS {
    INIT = "init",
    FLOW_CDM = "flow:component-did-mount",
    FLOW_CDU = "flow:component-did-update",
    FLOW_RENDER = "flow:render"
}

// Нельзя создавать экземпляр данного класса
class Block {
    _element: HTMLElement

    _meta: {
        tagName: string
        props: Props
        children: Children
    }

    _id: string

    props: Props

    children: Children

    _eventBus: Function

    _setUpdate: boolean = false

    /** JSDoc
     * @param {string} tagName
     * @param {Props} propsAndChildren
     *
     * @returns {void}
     */
    constructor(tagName:string = "div", propsAndChildren: Props = {}) {
        const { children, props } = this._getChildren(propsAndChildren)

        const eventBus = new EventBus()

        this._meta = {
            tagName,
            props,
            children
        }

        this._id = makeUUID()

        this.props = this._makePropsProxy({ ...props, __id: this._id }) as Props
        this.children = this._makePropsProxy(children) as Children

        this._eventBus = () => eventBus

        this._registerEvents(eventBus)

        this._element = this._createDocumentElement(tagName)
        this._eventBus().emit(EVENTS.FLOW_RENDER)
    }

    _getChildren(propsAndChildren: Record<string, unknown>) {
        const children: Children = {}
        const props: Props = {}

        Object.entries(propsAndChildren).forEach(([ key, value ]) => {
            if (
                value instanceof Block
                || (value instanceof Array && value.every((e) => e instanceof Block))
            ) {
                children[key] = value
            } else {
                props[key] = value
            }
        })

        return { children, props }
    }

    _registerEvents(eventBus: EventBus) {
        eventBus.on(EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
        eventBus.on(EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this))
        eventBus.on(EVENTS.FLOW_RENDER, this._render.bind(this))
    }

    _componentDidMount = () => {
        if (this.componentDidMount) {
            this.componentDidMount(this.props)
        }

        Object.values(this.children).forEach((child) => {
            if (child instanceof Block) {
                child.dispatchComponentDidMount()
            } else {
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

    dispatchComponentDidMount() {
        this._eventBus().emit(EVENTS.FLOW_CDM)
    }

    _componentDidUpdate(oldProps: Props, newProps: Props): void {
        if (this.componentDidUpdate) {
            const response = this.componentDidUpdate(oldProps, newProps)
            if (!response) {
                return
            }
        }

        this._eventBus().emit(EVENTS.FLOW_RENDER)
    }

    setProps = (nextProps: Props): void => {
        if (!nextProps) {
            return
        }

        const oldProps = { ...this.props }

        Object.assign(this.props, nextProps)

        const newProps = { ...this.props }

        if (this._setUpdate) {
            this._eventBus().emit(EVENTS.FLOW_CDU, oldProps, newProps)
        }
    }

    get element(): HTMLElement {
        return this._element
    }

    _render(): void {
        const block = this.render()

        this._removeEvents()

        this._element.innerHTML = ""

        this._element.appendChild(block)

        this._addEvents()
        this._addAttributes()
    }

    getContent(): HTMLElement {
        return this.element
    }

    _makePropsProxy(props: Props | Children): Props | Children {
        return new Proxy(props, {
            get: (target: Props | Children, prop:string): unknown => {
                const value = target[prop]
                return (typeof value === "function") ? value.bind(target) : value
            },

            set: (target: Props | Children, prop: string, value: unknown): boolean => {
                if (target[prop] !== value) {
                    target[prop] = value
                    this._setUpdate = true
                }

                return true
            },

            deleteProperty: (): boolean => {
                throw new Error("Нет прав")
            }
        })
    }

    _createDocumentElement(tagName: string): HTMLElement {
        const element = document.createElement(tagName)
        if (this._id) {
            element.setAttribute("data-id", this._id)
        }
        // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
        return element
    }

    compile(template: string, props: Props): DocumentFragment {
        const propsAndStubs = { ...props }

        Object.entries(this.children).forEach(([ key, child ]) => {
            if (child instanceof Block) {
                propsAndStubs[key] = `<div data-id="${child._id}"></div>`
            } else {
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
            } else {
                child.forEach((item) => {
                    const stub = content.querySelector(`[data-id="${item._id}"]`)
                    stub?.replaceWith(item.getContent())
                })
            }
        })

        return content
    }

    show(): void {
        this.getContent().style.display = "block"
    }

    hide(): void {
        this.getContent().style.display = "none"
    }
}

export default Block
