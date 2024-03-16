import { fields } from "../global"
import { Indexed } from "../interfaces"

export default function validator(
    keys: string[],
    rules: Record<string, Record<string, string>> = fields
) {
    return function validateData(obj: Indexed) {
        const result: Record<string, Record<string, unknown> | boolean> = {
            isCorrect: true
        }

        keys.forEach((key) => {
            try {
                if (!obj[key]) {
                    throw {
                        desc: "Обязательное значение",
                        value: obj[key]
                    }
                } else if (
                    (
                        typeof obj[key] === "string"
                        && rules[key].regex
                        && !(obj[key] as string).match(rules[key].regex)
                    )
                    || (
                        rules[key].isEqual
                        && obj[key] !== obj[rules[key].isEqual]
                    )
                ) {
                    throw {
                        desc: rules[key].desc,
                        value: obj[key]
                    }
                }
            } catch (err) {
                if (typeof err === "object" && (err as Record<string, string>).desc) {
                    result[key] = err as Record<string, unknown>
                    console.error(
                        `Ошибка валидации "${rules[key].label}": ${
                            (err as Record<string, string>).desc
                        }`
                    )
                }
            }
        })

        if (Object.keys(result).length > 1) {
            result.isCorrect = false
        }

        return result
    }
}
