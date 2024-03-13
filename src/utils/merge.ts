import { Indexed } from "../modules/types"

function merge(lhs: Indexed, rhs: Indexed): Indexed {
    Object.keys(rhs).forEach((key: string) => {
        try {
            if (
                Object.prototype.hasOwnProperty.call(lhs, key)
                && (lhs[key] as Indexed).constructor === Object
                && (rhs[key] as Indexed).constructor === Object
            ) {
                lhs[key] = merge(lhs[key] as Indexed, rhs[key] as Indexed)
            } else {
                lhs[key] = rhs[key]
            }
        } catch (e) {
            lhs[key] = rhs[key]
        }
    })

    return lhs
}

export default merge
