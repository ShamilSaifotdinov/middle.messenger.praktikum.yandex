import { expect } from "chai"
import isEqual from "./isEqual.ts"

describe("isEqual", () => {
    describe("Примитивы", () => {
        it("Две одинаковые строки", () => {
            const a = "str"
            const b = "str"

            return expect(isEqual(a, b)).to.be.true
        })

        it("Две разные строки", () => {
            const a = "str1"
            const b = "str2"

            return expect(isEqual(a, b)).to.be.false
        })

        it("Два одинаковых числа", () => {
            const a = 10
            const b = 10

            return expect(isEqual(a, b)).to.be.true
        })

        it("Два разных числа", () => {
            const a = 10
            const b = 20

            return expect(isEqual(a, b)).to.be.false
        })

        it("Два NaN", () => {
            const a = NaN
            const b = NaN

            return expect(isEqual(a, b)).to.be.true
        })

        it("Два одинаковых булево", () => {
            const a = true
            const b = true

            return expect(isEqual(a, b)).to.be.true
        })

        it("Два разных булево", () => {
            const a = false
            const b = true

            return expect(isEqual(a, b)).to.be.false
        })

        it("Два null", () => {
            const a = null
            const b = null

            return expect(isEqual(a, b)).to.be.true
        })

        it("Два undefined", () => {
            const a = undefined
            const b = undefined

            return expect(isEqual(a, b)).to.be.true
        })

        it("null и undefined", () => {
            const a = null
            const b = undefined

            return expect(isEqual(a, b)).to.be.true
        })

        it("null и строка", () => {
            const a = null
            const b = "str"

            return expect(isEqual(a, b)).to.be.false
        })

        it("Объект и строка", () => {
            const a = { foo: 1 }
            const b = "str"

            return expect(isEqual(a, b)).to.be.false
        })
    })

    describe("Объекты", () => {
        it("Массивоподобный объект и обычный массив", () => {
            const a = { foo: [ 1, 2 ] }
            const b = { foo: { 0: 1, 1: 2 } }

            return expect(isEqual(a, b)).to.be.false
        })

        describe("Функции", () => {
            it("Две одинаковые функции", () => {
                const a = () => true
                const b = () => true

                return expect(isEqual(a, b)).to.be.true
            })

            it("Две разные функции", () => {
                const a = () => true
                const b = () => false

                return expect(isEqual(a, b)).to.be.false
            })
        })

        describe("Массивы", () => {
            it("Два одинаковых массива", () => {
                const a = [ "str", 1, false ]
                const b = [ "str", 1, false ]

                return expect(isEqual(a, b)).to.be.true
            })

            it("Два разных массива", () => {
                const a = [ "str1", 1, false ]
                const b = [ "str2", 3, true ]

                return expect(isEqual(a, b)).to.be.false
            })
        })

        describe("Объекты", () => {
            it("Два одинаковых объекта", () => {
                const a = { a: 1 }
                const b = { a: 1 }

                return expect(isEqual(a, b)).to.be.true
            })

            it("Два разных объекта", () => {
                const a = { a: 1 }
                const b = { a: 2 }

                return expect(isEqual(a, b)).to.be.false
            })

            it("Два объекта с одинаковыми функциями", () => {
                const a = { foo: () => true }
                const b = { foo: () => true }

                return expect(isEqual(a, b)).to.be.true
            })

            it("Два объекта с разными функциями", () => {
                const a = { foo: () => true }
                const b = { foo: () => false }

                return expect(isEqual(a, b)).to.be.false
            })

            it("Два объекта c ссылкой на один и тотже объект", () => {
                const obj = { foo: 1 }
                const obj1 = { bar: obj }
                const obj2 = { ...obj1 }
                obj2.bar.foo = 2

                return expect(isEqual(obj1, obj2)).to.be.true
            })

            it("Два объекта c NaN", () => {
                const a = { foo: NaN }
                const b = { foo: NaN }

                return expect(isEqual(a, b)).to.be.true
            })

            it("Два Date", () => {
                const a = new Date()
                const b = new Date()

                return expect(isEqual(a, b)).to.be.false
            })

            it("Объект и null", () => {
                const a = { foo: 1 }
                const b = null

                return expect(isEqual(a, b)).to.be.false
            })

            it("Два объекта с null и undefined", () => {
                const a = { c: "test" }
                const b = { c: "test", d: null }

                return expect(isEqual(a, b)).to.be.true
            })

            class Test {}

            it("Два экземпляра одного класса", () => {
                const a = new Test()
                const b = new Test()

                return expect(isEqual(a, b)).to.be.false
            })

            it("Экземпляр класса и null", () => {
                const a = new Test()
                const b = null

                return expect(isEqual(a, b)).to.be.false
            })
        })
    })
})
