import UserAPI from "../api/user-api"
import { bus, fields } from "../global"
import store from "../store"
import {
    AvatarFormModel, Indexed, ProfileFormModel, UpdatePasswordFormModel, err
} from "../interfaces"
import validator from "../utils/validator"
import Router from "../utils/router"

const userApi = new UserAPI()
const router = Router.getInstance()

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
                    router.go("/")
                }

                if (customErr.desc.response) {
                    const { reason }: { reason: string | undefined } = JSON.parse(
                        customErr.desc.response as string
                    )

                    if (customErr.desc.status === 400 && reason) {
                        bus.emit("user:profileUpdateErr", reason)
                    }
                }

                if (customErr.desc.status === 500) {
                    router.go("/500")
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

                if (customErr.desc.status === 401) {
                    store.set("user", null)
                    router.go("/")
                }

                if (customErr.desc.status === 500) {
                    router.go("/500")
                }
            }
        }
    }

    public static async updateAvatar(data: AvatarFormModel) {
        try {
            const validateData = avatarValidator(data)

            if (!validateData.isCorrect) {
                throw { type: "validationErr", desc: validateData }
            }

            const res = await userApi.updateAvatar(data.avatar)

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

                if (customErr.desc.status === 401) {
                    store.set("user", null)
                    router.go("/")
                }

                if (customErr.desc.status === 500) {
                    router.go("/500")
                }
            }
        }
    }
}
