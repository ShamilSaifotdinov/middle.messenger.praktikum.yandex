import UserAPI from "../modules/HTTP/api/user-api"
import { bus } from "../modules/global"
import store from "../modules/store"
import { Indexed, ProfileFormModel, err } from "../modules/types"
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
}
