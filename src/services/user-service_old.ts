import { fields } from "../global"

function getInvalidFields(
    obj: Record<string, unknown>,
    keys: string[],
    rules: Record<string, Record<string, string>> = fields
) {
    const result: Record<string, Record<string, unknown>> = {}

    keys.forEach((key) => {
        try {
            if (!obj[key]) {
                throw {
                    desc: "Обязательное значение",
                    value: obj[key]
                }
            } else if (
                typeof obj[key] === "string"
                && !(obj[key] as string).match(rules[key].regex)
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

    return result
}

export default class UserServiceOld {
    sendMessage(message: Record<string, unknown>) {
        console.log({ message, invalid_fields: getInvalidFields(message, [ "message" ]) })
    }
}
