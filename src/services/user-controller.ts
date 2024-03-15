import AuthAPI from "../modules/HTTP/api/auth-api"
import store from "../modules/store"
import { Indexed, err } from "../modules/types"

const authApi = new AuthAPI()

export default class UserController {
    public static async getUser() {
        try {
            const res = await authApi.getUser()

            console.log(res)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            const data = JSON.parse(res.response)

            store.set("user", data)
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
