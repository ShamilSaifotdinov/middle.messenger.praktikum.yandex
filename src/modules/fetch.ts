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

const enum METHODS {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE",
}

function queryStringify(data: Record<string, unknown>) {
    let result = ""

    Object.keys(data).forEach(key => {
        if (result === "") {
            result += `?${key}=${data[key]}`
        }
        else {
            result += `&${key}=${data[key]}`
        }
    })

    return result
}

class HTTPTransport {
    // Read
    get = (url: string, options: Options = {}): Promise<XMLHttpRequest> => {
        if (options.data) {
            Object.assign(options, { data: queryStringify(options.data) })
        }

        return this.request(url, {...options, method: METHODS.GET}, options.timeout)
    }

    // Create
    post = (url: string, options: Options = {}): Promise<XMLHttpRequest> => {
        console.log({url, options})
        return this.request(url, {...options, method: METHODS.POST}, options.timeout)
    }

    // Update
    put = (url: string, options: Options = {}): Promise<XMLHttpRequest> => {
        console.log({url, options})
        return this.request(url, {...options, method: METHODS.PUT}, options.timeout)
    }

    // Delete
    delete = (url: string, options: Options = {}): Promise<XMLHttpRequest> => {
        console.log({url, options})
        return this.request(url, {...options, method: METHODS.DELETE}, options.timeout)
    }

    request = (
        url: string,
        options: OptionsRequest,
        timeout: number | null = 5000
    ): Promise<XMLHttpRequest> => {
        const { method, data, headers }: Options = options

        console.log({url, method, data, headers, timeout})
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            if (method === METHODS.GET) {
                xhr.open(method, url + data)
            } else {
                xhr.open(method, url)
            }
            
            xhr.onload = function() {
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

export function fetchWithRetry(url: string, options: Options): Promise<XMLHttpRequest> {
    let { retries=1 } = options
	console.log({url, options, retries})
    
    const retry = (err: Error): Promise<XMLHttpRequest> => {
        retries--

        if (retries === 0) {
            throw err
        }
        else {
            return fetchWithRetry(url, {...options, retries})
        }


    }
    return new HTTPTransport().get(url, options).catch(retry)
}