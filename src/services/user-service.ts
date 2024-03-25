import AuthAPI from "../api/auth-api"
import store from "../store"
import { Indexed, err } from "../interfaces"
import Router from "../utils/router"

const authApi = new AuthAPI()
const router = Router.getInstance()

export default class UserService {
    public static async getUser() {
        try {
            const res = await authApi.getUser()

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

                if (customErr.desc.status === 500) {
                    router.go("/500")
                }
            }
        }
    }
}
