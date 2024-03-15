import { ProfileFormModel } from "../../types"
import BaseAPI from "../base-api"

export default class UserAPI extends BaseAPI {
    constructor() {
        super("/user")
    }

    request() {
        // return this.HTTP.put("/profile/avatar", { data }).then((data) => {})
    }
    // create() {
    //     return this.HTTP.post("/", {})
    //         // И то, только в случае, если уверены в результате,
    //         // иначе контроллер проверит все сам дальше
    //         .then(({user: {info}}) => info)
    // }

    updateProfile(profile: ProfileFormModel) {
        return this.HTTP.put("/profile", { data: profile, withCredentials: true })
    }

    updateAvatar(file: File) {
        const data = new FormData()
        data.append("avatar", file)
        // return this.HTTP.put("/profile/avatar", { data }).then((data) => {})
    }
}
