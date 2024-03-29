import AuthAPI from "../api/auth-api"
import { bus, fields } from "../global"
import Router from "../utils/router"
import { Indexed, RegistryFormModel, RegistryModel, err } from "../interfaces"
import validator from "../utils/validator"

const authApi = new AuthAPI()
const userRegistryValidator = validator(
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
            isEqual: "password",
            desc: fields.passwordTry.desc as string
        }
    }
)

const prepareUserRegistry = (user: RegistryFormModel): RegistryModel => ({
    first_name: user.first_name,
    second_name: user.second_name,
    login: user.login,
    email: user.email,
    phone: user.phone,
    password: user.password
})

const router = Router.getInstance()

export default class UserRegistryService {
    public static async registry(data: RegistryFormModel) {
        try {
            const validateData = userRegistryValidator(data)

            if (!validateData.isCorrect) {
                throw { type: "validationErr", desc: validateData }
            }

            const res = await authApi.create(prepareUserRegistry(data))

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            bus.emit("getUser")
            bus.emit("getChats")

            router.go("/messenger")
        } catch (error) {
            console.error(error)

            if ((error as Indexed).type) {
                const customErr = error as err

                if (customErr.type === "requestErr") {
                    if (customErr.desc.response) {
                        const { reason }: { reason: string | undefined } = JSON.parse(
                            customErr.desc.response as string
                        )

                        if (customErr.desc.status === 400 && reason) {
                            bus.emit("reqErr", reason)
                        }

                        if (customErr.desc.status === 409 && reason) {
                            const field = {
                                "Login already exists": "login",
                                "Email already exists": "email"
                            }[reason]
                            bus.emit("userIsExist", field)
                        }
                    }

                    if (customErr.desc.status === 500) {
                        router.go("/500")
                    }
                }
            }
        }
    }
}
