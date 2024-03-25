import { LoginFormModel, RegistryModel } from "../interfaces"
import BaseAPI from "../utils/HTTP/base-api"

export default class AuthAPI extends BaseAPI {
    constructor() {
        super("/auth")
    }

    public request(user?: LoginFormModel) {
        if (!user) {
            throw new Error("RegistryAPI.create: need \"user\"")
        }

        return this.HTTP.post("/signin", { data: user, withCredentials: true })
    }

    public getUser() {
        return this.HTTP.get("/user", { withCredentials: true })
    }

    public create(user?: RegistryModel) {
        if (!user) {
            throw new Error("RegistryAPI.create: need \"user\"")
        }

        return this.HTTP.post("/signup", { data: user, withCredentials: true })
    }

    public delete() {
        return this.HTTP.post("/logout", { withCredentials: true })
    }
}
