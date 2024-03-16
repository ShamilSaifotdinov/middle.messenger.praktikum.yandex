import UserAPI from "../modules/HTTP/api/user-api"
import { bus, fields } from "../modules/global"
import store from "../modules/store"
import {
    AvatarFormModel, Indexed, ProfileFormModel, UpdatePasswordFormModel, err
} from "../modules/types"
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

const avatarValidator = validator(
    [ "avatar" ],
    { avatar: { label: "Аватар" } }
)

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

    public static async updateAvatar(data: AvatarFormModel) {
        try {
            console.log(data)
            const validateData = avatarValidator(data)

            if (!validateData.isCorrect) {
                throw { type: "validationErr", desc: validateData }
            }

            const res = await userApi.updateAvatar(data.avatar)

            console.log(res)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            const user = JSON.parse(res.response)

            store.set("user", user)
            bus.emit("user-updateAvatar:avatarChanged")
        } catch (e) {
            console.error(e)

            if ((e as Indexed).type === "requestErr") {
                const customErr = e as err

                if (customErr.desc.response) {
                    const res = JSON.parse(customErr.desc.response as string)
                    if (res.reason) {
                        bus.emit("user-updateAvatar:err", res.reason)
                    }
                }
            }
        }
    }
}
