export function getDifference<T = unknown>(setA: Set<T>, setB: Set<T>) {
    return new Set(
        [ ...setA ].filter((element) => !setB.has(element))
    )
}

export function getIntersection<T = unknown>(setA: Set<T>, setB: Set<T>) {
    return new Set(
        [ ...setA ].filter((element) => setB.has(element))
    )
}
