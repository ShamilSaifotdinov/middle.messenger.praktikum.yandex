import HTTPTransport, { Options } from "."

export default function fetchWithRetry(
    api: string,
    url: string,
    options: Options
): Promise<unknown> {
    let { retries = 1 } = options
    console.log({ url, options, retries })

    const retry = (err: Error): Promise<unknown> => {
        retries -= 1

        if (retries === 0) {
            throw err
        } else {
            return fetchWithRetry(api, url, { ...options, retries })
        }
    }
    return new HTTPTransport(api).get(url, options).catch(retry)
}
