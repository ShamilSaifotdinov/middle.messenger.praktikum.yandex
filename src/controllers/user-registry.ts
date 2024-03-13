import AuthAPI from "../modules/HTTP/api/auth-api"
import { bus, fields } from "../modules/global"
import Router from "../modules/router"
import { Indexed, RegistryFormModel, err } from "../modules/types"
// import Router from "../modules/router"
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
        ...fields
        // ,
        // passwordTry: {
        //     label: fields.passwordTry.label,
        //     regex: `^${credential.password}$`,
        //     ...(fields.passwordTry.desc && { desc: fields.passwordTry.desc })
        // }
    }
)

const router = Router.getInstance()

export default class UserRegistryController {
    public static async registry(data: RegistryFormModel) {
        try {
            const validateData = userRegistryValidator(data)

            if (!validateData.isCorrect) {
                throw { type: "validationErr", desc: validateData }
            }

            const res = await authApi.create(data)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            bus.emit("getUser")

            router.go("/messenger")

            // console.log(userID)
            // if (!!userID) {
            // }
        } catch (error) {
            console.error(error)

            if ((error as Indexed).type) {
                const customErr = error as err

                if (customErr.type === "requestErr") {
                    const { reason }: { reason: string } = JSON.parse(
                        customErr.desc.response as string
                    )
                    console.error(reason)

                    if (customErr.desc.status === 400) {
                        bus.emit("reqErr", reason)
                    }

                    if (customErr.desc.status === 409) {
                        const field = {
                            "Login already exists": "login",
                            "Email already exists": "email"
                        }[reason]
                        bus.emit("userIsExist", field)
                    }
                }
            }
        }
    }
}
