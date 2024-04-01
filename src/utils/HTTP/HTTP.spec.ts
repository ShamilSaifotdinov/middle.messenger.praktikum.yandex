import { expect } from "chai"
import { createSandbox, SinonStub } from "sinon"
import HTTPTransport from "./index.ts"

describe("HTTPTransport", () => {
    const sandbox = createSandbox()
    let http: HTTPTransport
    let request: SinonStub

    beforeEach(() => {
        http = new HTTPTransport("/")
        request = sandbox.stub(http, "request")
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe("Метод GET", () => {
        it("Параметры должны быть строкой, если параметры - строки", () => {
            http.get("", { data: { a: "1", b: "2" } })

            const res = request.calledWithMatch("", { data: "a=1&b=2", method: "GET" })

            return expect(res).to.be.true
        })

        it("Параметры должны быть строкой, если параметры - число и строка", () => {
            http.get("", { data: { a: 1, b: "str" } })

            const res = request.calledWithMatch("", { data: "a=1&b=str", method: "GET" })

            return expect(res).to.be.true
        })

        it("Параметры должны быть строкой, если параметры - строки с символами", () => {
            http.get("", { data: { a: "1=2&1", b: "2 2" } })

            const res = request.calledWithMatch("", { data: "a=1%3D2%261&b=2%202", method: "GET" })

            return expect(res).to.be.true
        })

        it("Параметры должны быть строкой, если параметры - объекты со строками", () => {
            http.get("", { data: { a: { c: "1", d: "3" }, b: "2" } })

            const res = request.calledWithMatch("", { data: "a[c]=1&a[d]=3&b=2", method: "GET" })

            return expect(res).to.be.true
        })

        it("Параметры должны быть строкой, если параметры - объекты со строкой и числом", () => {
            http.get("", { data: { a: { c: "1", d: 3 }, b: "2" } })

            const res = request.calledWithMatch("", { data: "a[c]=1&a[d]=3&b=2", method: "GET" })

            return expect(res).to.be.true
        })

        it("Параметры должны быть строкой, если параметры - объекты со строкой и символами", () => {
            http.get("", { data: { a: { c: "1=2&1", d: "2 2" }, b: "2" } })

            const res = request.calledWithMatch("", {
                data: "a[c]=1%3D2%261&a[d]=2%202&b=2",
                method: "GET"
            })

            return expect(res).to.be.true
        })
    })
})
