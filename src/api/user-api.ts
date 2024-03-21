import { ProfileFormModel, UpdatePasswordModel } from "../interfaces"
import BaseAPI from "../utils/HTTP/base-api"

export default class UserAPI extends BaseAPI {
    constructor() {
        super("/user")
    }

    updateProfile(profile: ProfileFormModel) {
        return this.HTTP.put("/profile", { data: profile, withCredentials: true })
    }

    updatePassword(passwords: UpdatePasswordModel) {
        return this.HTTP.put("/password", { data: passwords, withCredentials: true })
    }

    updateAvatar(file: File) {
        const data = new FormData()
        data.append("avatar", file)
        return this.HTTP.put("/profile/avatar", { data, withCredentials: true })
    }

    searchUser(login: string) {
        return this.HTTP.post("/search", { data: { login }, withCredentials: true })
    }
}
