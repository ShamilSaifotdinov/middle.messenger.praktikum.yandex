import { Indexed } from "../interfaces"

function isObject(value: unknown): value is Indexed {
    return typeof value === "object"
        && value !== null
        && value.constructor === Object
        && Object.prototype.toString.call(value) === "[object Object]"
}

function isArray(value: unknown): value is [] {
    return Array.isArray(value)
}

function isObjectOrArray(value: unknown): value is (Indexed | unknown[]) {
    return isObject(value) || isArray(value)
}

export {
    isObject,
    isArray,
    isObjectOrArray
}
