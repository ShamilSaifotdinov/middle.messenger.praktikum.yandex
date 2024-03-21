import AuthAPI from "../api/auth-api"
import { bus, fields } from "../global"
import Router from "../utils/router"
import { err, Indexed, LoginFormModel } from "../interfaces"
import validator from "../utils/validator"

const authApi = new AuthAPI()
const userLoginValidator = validator(
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

const router = Router.getInstance()

export default class UserLoginService {
    public static async login(data: LoginFormModel) {
        try {
            const validateData = userLoginValidator(data)

            if (!validateData.isCorrect) {
                throw validateData
            }

            const res = await authApi.request(data)

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
                        const { reason }: { reason: string } = JSON.parse(
                            customErr.desc.response as string
                        )

                        if (customErr.desc.status === 400) {
                            bus.emit("reqErr", reason)
                        }
                    }

                    if (customErr.desc.status === 401) {
                        bus.emit("badLogin")
                    }

                    if (customErr.desc.status === 500) {
                        router.go("/500")
                    }
                }
            }
        }
    }

    public static async logout() {
        try {
            const res = await authApi.delete()

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            bus.emit("getUser")

            router.go("/")

            bus.emit("getUser")
            bus.emit("getChats")
        } catch (error) {
            console.error(error)

            if ((error as Indexed).type) {
                const customErr = error as err

                if (customErr.type === "requestErr") {
                    if (customErr.desc.status === 500) {
                        router.go("/500")
                    }
                }
            }
        }
    }
}
