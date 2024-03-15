import queryStringify from "../../utils/queryString"

const enum METHODS {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE",
}

export interface Options {
    method?: METHODS
    timeout?: number
    data?: Record<string, unknown>
    retries?: number
    [key: string]: unknown
    withCredentials?: boolean
}

interface OptionsRequest extends Options {
    method: METHODS
}

type HTTPMethod = (url: string, options?: Options) => Promise<XMLHttpRequest>

class HTTPTransport {
    api = "https://ya-praktikum.tech/api/v2"

    baseURL: string

    constructor(path: string) {
        this.baseURL = this.api + path
    }

    // Read
    get: HTTPMethod = (url, options = {}) => {
        if (options.data) {
            Object.assign(options, { data: queryStringify(options.data) })
        }

        return this.request(url, { ...options, method: METHODS.GET }, options.timeout)
    }

    // Create
    post: HTTPMethod = (url, options = {}) => (
        this.request(url, { ...options, method: METHODS.POST }, options.timeout)
    )

    // Update
    put: HTTPMethod = (url, options = {}) => (
        this.request(url, { ...options, method: METHODS.PUT }, options.timeout)
    )

    // Delete
    delete: HTTPMethod = (url, options = {}) => (
        this.request(url, { ...options, method: METHODS.DELETE }, options.timeout)
    )

    request = (
        url: string,
        options: OptionsRequest,
        timeout: number | null = 5000
    ): Promise<XMLHttpRequest> => {
        const { method, data, headers }: Options = options

        const withCredentials: boolean = options.withCredentials || false

        console.log({ url, method, data, headers, timeout })
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            if (method === METHODS.GET && data) {
                xhr.open(method, this.baseURL + url + data)
            } else {
                xhr.open(method, this.baseURL + url)
            }

            xhr.onload = () => {
                resolve(xhr)
            }

            xhr.withCredentials = withCredentials

            xhr.onabort = reject
            xhr.onerror = reject
            xhr.ontimeout = reject

            if (method === METHODS.GET || !data) {
                xhr.send()
            } else if (data instanceof FormData) {
                xhr.send(data)
            } else {
                xhr.setRequestHeader("Content-Type", "application/json")
                xhr.send(JSON.stringify(data))
            }
        })
    }
}

export default HTTPTransport
