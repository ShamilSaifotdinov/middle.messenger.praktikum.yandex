import UserAPI from "../modules/HTTP/api/user-api"
import { bus, fields } from "../modules/global"
import store from "../modules/store"
import { Indexed, ProfileFormModel, UpdatePasswordFormModel, err } from "../modules/types"
import validator from "../utils/validator"

const userApi = new UserAPI()
const profileValidator = validator(
    [
        "first_name",
        "second_name",
        "display_name",
        "login",
        "email",
        "phone"
    ]
)

const passwordsValidator = validator(
    [
        "oldPassword",
        "newPassword",
        "newPasswordTry"
    ],
    {
        newPassword: fields.password,
        newPasswordTry: {
            label: "Повторите новый пароль",
            isEqual: "newPassword",
            desc: fields.passwordTry.desc as string
        }
    }
)

const preparePasswords = (passwords: UpdatePasswordFormModel) => ({
    oldPassword: passwords.oldPassword,
    newPassword: passwords.newPassword
})

export default class ProfileService {
    public static async updateProfile(profile: ProfileFormModel) {
        try {
            const validateData = profileValidator(profile)

            if (!validateData.isCorrect) {
                throw { type: "validationErr", desc: validateData }
            }

            const res = await userApi.updateProfile(profile)

            console.log(res)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            const data = JSON.parse(res.response)

            store.set("user", data)
            bus.emit("user:profileIsChanged")
        } catch (e) {
            console.error(e)

            if ((e as Indexed).type === "requestErr") {
                const customErr = e as err

                if (customErr.desc.status === 401) {
                    store.set("user", null)
                }
            }
        }
    }

    public static async updatePassword(passwords: UpdatePasswordFormModel) {
        try {
            const validateData = passwordsValidator(passwords)

            if (!validateData.isCorrect) {
                throw { type: "validationErr", desc: validateData }
            }

            const res = await userApi.updatePassword(preparePasswords(passwords))

            console.log(res)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            bus.emit("user-updatePassword:passwordChanged")
        } catch (e) {
            console.error(e)

            if ((e as Indexed).type === "requestErr") {
                const customErr = e as err

                if (customErr.desc.status === 400) {
                    bus.emit("user-updatePassword:badOldPassword")
                }
            }
        }
    }
}
