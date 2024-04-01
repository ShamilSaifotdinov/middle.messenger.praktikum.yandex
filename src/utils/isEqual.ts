import { isArray, isObject, isObjectOrArray } from "./types.ts"

function isEqual(
    a: unknown,
    b: unknown
): boolean {
    if ((a === undefined || a === null) && (b === undefined || b === null)) {
        return true
    }

    if (typeof a !== typeof b) {
        return false
    }

    if (
        typeof a === "string"
        || typeof a === "boolean"
        || (typeof a === "number" && !Number.isNaN(a) && !Number.isNaN(b))
    ) {
        return a === b
    }

    if (a !== b) {
        if (typeof a === "function" && typeof b === "function") {
            return a.toString() === b.toString()
        }

        if (
            typeof a === "object"
            && (
                !isObjectOrArray(a)
                || !isObjectOrArray(b)
                || isArray(a) !== isArray(b)
            )
        ) {
            return false
        }

        if (isArray(a) && isArray(b)) {
            if (a.length !== b.length) {
                return false
            }

            for (const [ index, aValue ] of a.entries()) {
                const bValue = b[index]

                if (!isEqual(aValue, bValue)) {
                    return false
                }
            }
        }

        if (isObject(a) && isObject(b)) {
            const aKeys = Object.keys(a)
            const bKeys = Object.keys(b)

            const uniqKeys = new Set([ ...aKeys, ...bKeys ])
            if (!(aKeys.length === uniqKeys.size && bKeys.length === uniqKeys.size)) {
                return false
            }

            for (const [ key, aValue ] of Object.entries(a)) {
                const bValue = b[key]

                if (!isEqual(aValue, bValue)) {
                    return false
                }
            }
        }
    }

    return true
}

export default isEqual
