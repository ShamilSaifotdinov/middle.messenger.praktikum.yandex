// import { bus } from "../modules/global"
// import { HTTP } from "../modules/fetch"

import { fields } from "../modules/global"

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

export default class UserService {
    login(credential: Record<string, unknown>) {
        console.log({
            credential,
            invalid_fields: getInvalidFields(
                credential,
                [ "login", "password" ],
                {
                    login: {
                        label: fields.login.label,
                        regex: "\\S",
                        desc: "Обязательное значение"
                    },
                    password: {
                        label: fields.password.label,
                        regex: "\\S",
                        desc: "Обязательное значение"
                    }
                }
            )
        })
        // HTTP.post("/login", { credential })
        // .then(function (user) {
        //     // do stuff

        //     bus.emit('user:logged-in', user)
        // })
    }

    registry(credential: Record<string, unknown>) {
        console.log({
            credential,
            invalid_fields: getInvalidFields(
                credential,
                [
                    "first_name",
                    "second_name",
                    "login",
                    "email",
                    "phone",
                    "password",
                    "passwordTry"
                ],
                {
                    ...fields,
                    passwordTry: {
                        label: fields.passwordTry.label,
                        regex: `^${credential.password}$`,
                        ...(fields.passwordTry.desc && { desc: fields.passwordTry.desc })
                    }
                }
            )
        })
    }

    sendMessage(message: Record<string, unknown>) {
        console.log({ message, invalid_fields: getInvalidFields(message, [ "message" ]) })
    }

    updateProfile(credential: Record<string, unknown>) {
        console.log({
            credential,
            invalid_fields: getInvalidFields(
                credential,
                [
                    "first_name",
                    "second_name",
                    "login",
                    "email",
                    "phone",
                    "display_name"
                ]
            )
        })
    }
}
