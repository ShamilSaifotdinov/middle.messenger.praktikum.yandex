// eslint-disable-next-line max-classes-per-file
import { expect } from "chai"
import { createSandbox } from "sinon"
import Block, { Props } from "./block.ts"
import isEqual from "./isEqual.ts"
import renderDOM from "./renderDOM.ts"

describe("Block", () => {
    const sandbox = createSandbox()
    class Component extends Block {}

    afterEach(() => {
        sandbox.restore()
    })

    describe("Создание компонента", () => {
        function createComponent(...options: [ string?, Props? ]) {
            return new Component(...options)
        }

        it("Без свойств", () => {
            const component = createComponent()

            const content = component.getContent()

            expect(content.outerHTML).to.eq(`<div data-id="${component.props.__id}"></div>`)
        })

        it("C одним свойством", () => {
            const component = createComponent("div", { children: "test" })

            const content = component.getContent()

            expect(content.outerHTML).to.eq(`<div data-id="${component.props.__id}">test</div>`)
        })

        it("C одним дочерним компонентом", () => {
            const children = createComponent("span", { children: "test" })
            const component = createComponent("div", { children })

            const content = component.getContent()

            expect(content.outerHTML).to.eq(
                `<div data-id="${component.props.__id}">`
                + `<span data-id="${children.props.__id}">test</span>`
                + "</div>"
            )
        })

        it("C массивом дочерних компонентом", () => {
            const children1 = createComponent("li", { children: "test1" })
            const children2 = createComponent("li", { children: "test2" })
            const component = createComponent("ul", { children: [ children1, children2 ] })

            const content = component.getContent()

            expect(content.outerHTML).to.eq(
                `<ul data-id="${component.props.__id}">`
                + `<li data-id="${children1.props.__id}">test1</li>`
                + `<li data-id="${children2.props.__id}">test2</li>`
                + "</ul>"
            )
        })
    })

    describe("Обновление свойств и дочерних компонентов", () => {
        let component: Block

        beforeEach(() => {
            component = new Component()
        })

        it("Без свойств", () => {
            const render = sandbox.spy(component, "render")

            component.setProps({})

            const res = render.notCalled
            return expect(res).to.be.true
        })

        it("Со свойством", () => {
            const render = sandbox.spy(component, "render")

            component.setProps({ data: { a: "1", b: "2" } })

            const res = render.calledOnce
            return expect(res).to.be.true
        })

        it("Одно свойство", () => {
            component.setProps({ data: { a: "1", b: "2" } })

            expect(component.props).to.satisfy((props: Props) => (
                props.data && isEqual(props.data, { a: "1", b: "2" })
            ))
        })

        it("Один дочерний компонент", () => {
            component.setProps({ children: new Component() })

            expect(component.children.children).to.be.an.instanceof(Component)
        })

        it("Массив дочерних компонент", () => {
            component.setProps({ children: [ new Component(), new Component() ] })

            expect(component.children.children).to.satisfy(
                (children: unknown) => (
                    Array.isArray(children) && children.length === 2 && children.every(
                        (child) => (child instanceof Component)
                    )
                )
            )
        })
    })

    describe("Сравнение состояний", () => {
        function createComponent(props?: Props) {
            const component = new Component("div", props)
            const render = sandbox.spy(component, "render")
            return { component, render }
        }

        describe("Одинаковые примитивы", () => {
            it("Строки", () => {
                const { component, render } = createComponent({ data: "test" })

                component.setProps({ data: "test" })

                return expect(render.notCalled).to.be.true
            })

            it("Числа", () => {
                const { component, render } = createComponent({ data: 1 })

                component.setProps({ data: 1 })

                return expect(render.notCalled).to.be.true
            })

            it("NaN", () => {
                const { component, render } = createComponent({ data: NaN })

                component.setProps({ data: NaN })

                return expect(render.notCalled).to.be.true
            })

            it("Булево", () => {
                const { component, render } = createComponent({ data: false })

                component.setProps({ data: false })

                return expect(render.notCalled).to.be.true
            })

            it("undefined и null", () => {
                const { component, render } = createComponent()

                component.setProps({ data: null })

                return expect(render.notCalled).to.be.true
            })
        })

        describe("Разные примитивы", () => {
            it("Строки", () => {
                const { component, render } = createComponent({ data: "test1" })

                component.setProps({ data: "test2" })

                return expect(render.calledOnce).to.be.true
            })

            it("Числа", () => {
                const { component, render } = createComponent({ data: 1 })

                component.setProps({ data: 2 })

                return expect(render.calledOnce).to.be.true
            })

            it("Булево", () => {
                const { component, render } = createComponent({ data: false })

                component.setProps({ data: true })

                return expect(render.calledOnce).to.be.true
            })
        })

        describe("Объекты", () => {
            it("Одинаковые объекты", () => {
                const { component, render } = createComponent({
                    data: { a: "test", b: 1, c: false }
                })

                component.setProps({ data: { a: "test", b: 1, c: false, d: null } })

                return expect(render.notCalled).to.be.true
            })

            it("Разные объекты", () => {
                const { component, render } = createComponent({
                    data: { a: new Date(), b: 1, c: false }
                })

                component.setProps({ data: { a: new Date(), b: 1, c: false } })

                return expect(render.calledOnce).to.be.true
            })
        })

        describe("Свойства и дочернии компоненты", () => {
            it("Текст -> дочерний компонент", () => {
                const child = new Component()
                const { component } = createComponent({ children: "test" })

                component.setProps({ children: child })

                expect(component.props.children).to.be.an("undefined")
                expect(component.children.children).to.equal(child)
            })

            it("Дочерний компонент -> текст", () => {
                const child = new Component()
                const { component } = createComponent({ children: child })

                component.setProps({ children: "test" })

                expect(component.props.children).to.equal("test")
                expect(component.children.children).to.be.an("null")
            })

            it("Пустой массив -> массив дочерних компонентов", () => {
                const child = new Component()
                const { component } = createComponent({ children: [] })

                component.setProps({ children: [ child ] })

                expect(component.props.children).to.be.an("undefined")
                expect(component.children.children).to.deep.equal([ child ])
            })

            it("Массив дочерних компонентов -> пустой массив", () => {
                const child = new Component()
                const { component } = createComponent({ children: [ child ] })

                component.setProps({ children: [] })

                expect(component.props.children).to.be.an("undefined")
                return expect(component.children.children).to.be.an("array").that.is.empty
            })
        })
    })

    describe("Методы жизненного цикла", () => {
        class ComponentWithLifecycle extends Block {
            componentDidMount() {}

            componentDidUpdate(oldProps: Props, newProps: Props): boolean {
                if (!isEqual(oldProps, newProps)) {
                    return true
                }

                return false
            }
        }

        const component = new ComponentWithLifecycle()

        it("componentDidMount", () => {
            const componentDidMount = sandbox.spy(component, "componentDidMount")
            renderDOM("#app", component)

            return expect(componentDidMount.calledOnce).to.be.true
        })

        it("componentDidUpdate", () => {
            const componentDidUpdate = sandbox.spy(component, "componentDidUpdate")

            component.setProps({ data: "test" })

            return expect(componentDidUpdate.calledOnce).to.be.true
        })
    })
})
