const enum METHODS {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE",
}

interface Options {
    method?: METHODS
    timeout?: number
    data?: Record<string, unknown>
    retries?: number
    [key: string]: unknown
}

interface OptionsRequest extends Options {
    method: METHODS
}

function queryStringify(data: Record<string, unknown>) {
    let result = ""

    Object.keys(data).forEach((key) => {
        if (result === "") {
            result += `?${key}=${data[key]}`
        } else {
            result += `&${key}=${data[key]}`
        }
    })

    return result
}

type HTTPMethod = (url: string, options?: Options) => Promise<unknown>

class HTTPTransport {
    // Read
    get: HTTPMethod = (url, options = {}) => {
        if (options.data) {
            Object.assign(options, { data: queryStringify(options.data) })
        }

        return this.request(url, { ...options, method: METHODS.GET }, options.timeout)
    }

    // Create
    post: HTTPMethod = (url, options = {}) => {
        console.log({ url, options })
        return this.request(url, { ...options, method: METHODS.POST }, options.timeout)
    }

    // Update
    put: HTTPMethod = (url, options = {}) => {
        console.log({ url, options })
        return this.request(url, { ...options, method: METHODS.PUT }, options.timeout)
    }

    // Delete
    delete: HTTPMethod = (url, options = {}) => {
        console.log({ url, options })
        return this.request(url, { ...options, method: METHODS.DELETE }, options.timeout)
    }

    request = (
        url: string,
        options: OptionsRequest,
        timeout: number | null = 5000
    ): Promise<unknown> => {
        const { method, data, headers }: Options = options

        console.log({ url, method, data, headers, timeout })
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            if (method === METHODS.GET) {
                xhr.open(method, url + data)
            } else {
                xhr.open(method, url)
            }

            xhr.onload = () => {
                resolve(xhr)
            }

            xhr.onabort = reject
            xhr.onerror = reject
            xhr.ontimeout = reject

            if (method === METHODS.GET || !data) {
                xhr.send()
            } else {
                xhr.send(JSON.stringify(data))
            }
        })
    }
}

export const HTTP = new HTTPTransport()

export function fetchWithRetry(url: string, options: Options): Promise<unknown> {
    let { retries = 1 } = options
    console.log({ url, options, retries })

    const retry = (err: Error): Promise<unknown> => {
        retries -= 1

        if (retries === 0) {
            throw err
        } else {
            return fetchWithRetry(url, { ...options, retries })
        }
    }
    return new HTTPTransport().get(url, options).catch(retry)
}
