import HTTPTransport from "."

export default class BaseAPI {
    HTTP: HTTPTransport

    constructor(path: string) {
        this.HTTP = new HTTPTransport(path)
    }

    create() { throw new Error("Not implemented") }

    request() { throw new Error("Not implemented") }

    update() { throw new Error("Not implemented") }

    delete() { throw new Error("Not implemented") }
}
