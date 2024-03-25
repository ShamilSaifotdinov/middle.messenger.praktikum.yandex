import { Indexed } from "../interfaces"

type Return<T> = T extends Date ? Date :
    T extends Set<unknown> ? Set<unknown> :
    T extends Map<unknown, unknown> ? Map<unknown, unknown> :
    T extends unknown[] ? unknown[] :
    T extends T[] ? T[] :
    T extends Indexed ? Indexed
    : T

function cloneDeep<T extends object = object>(obj: T) {
    return (function _cloneDeep(item: T): Return<T> {
        // Handle:
        // * null
        // * undefined
        // * boolean
        // * number
        // * string
        // * symbol
        // * function
        if (item === null || typeof item !== "object") {
            return item
        }

        // Handle:
        // * Date
        if (item instanceof Date) {
            return new Date(item.valueOf()) as Return<T>
        }

        // Handle:
        // * Array
        if (item instanceof Array) {
            const copy: unknown[] = []

            item.forEach((_, i) => {
                copy[i] = _cloneDeep(item[i])
            })

            return copy as Return<T>
        }

        // Handle:
        // * Set
        if (item instanceof Set) {
            const copy = new Set()

            item.forEach((v) => copy.add(_cloneDeep(v)))

            return copy as Return<T>
        }

        // Handle:
        // * Map
        if (item instanceof Map) {
            const copy = new Map()

            item.forEach((v, k) => copy.set(k, _cloneDeep(v)))

            return copy as Return<T>
        }

        // Handle:
        // * Object
        if (item instanceof Object) {
            const copy: Indexed = {}

            // Handle:
            // * Object.symbol
            Object.getOwnPropertySymbols(item).forEach((s) => {
                copy[s] = _cloneDeep((item as Indexed)[s] as T)
            })

            // Handle:
            // * Object.name (other)
            Object.keys(item).forEach((k) => {
                copy[k] = _cloneDeep((item as Indexed)[k] as T)
            })

            return copy as Return<T>
        }

        throw new Error(`Unable to copy object: ${item}`)
    }(obj))
}

export default cloneDeep
