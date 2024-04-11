import { Indexed } from "../interfaces"
import { isObject, isObjectOrArray } from "./types.ts"

function getParams(obj: Indexed | unknown[], parentPath?: string): string[] {
    const result = []
    for (const [ key, value ] of Object.entries(obj)) {
        const path = parentPath ? `${parentPath}[${key}]` : key
        if (isObjectOrArray(value)) {
            result.push(...getParams(value, path))
        } else {
            result.push(`${path}=${encodeURIComponent(String(value))}`)
        }
    }
    return result
}

function queryStringify(data: Indexed): string | never {
    if (!isObject(data)) {
        throw new Error("input must be an object")
    }

    return getParams(data).join("&")
}

export default queryStringify
