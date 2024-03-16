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

        // public request(user: LoginRequest) {
        // return authAPIInstance.post<LoginRequest, LoginResponse>('/login', user)
        //     .then(({ user_id }) => user_id); // Обрабатываем получение данных из сервиса далее
        return this.HTTP.post("/signin", { data: user, withCredentials: true })
        // .then((user_id) => console.log(user_id))
        // Обрабатываем получение данных из сервиса далее
    }

    public getUser() {
        return this.HTTP.get("/user", { withCredentials: true })
        // Обрабатываем получение данных из сервиса далее
    }

    public create(user?: RegistryModel) {
        if (!user) {
            throw new Error("RegistryAPI.create: need \"user\"")
        }

        return this.HTTP.post("/signup", { data: user, withCredentials: true })
        // Обрабатываем получение данных из сервиса далее
    }

    public delete() {
        return this.HTTP.post("/logout", { withCredentials: true })
    }
}
