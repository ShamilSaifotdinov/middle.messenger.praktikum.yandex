import BaseAPI from "../base-api"

export default class UserAPI extends BaseAPI {
    constructor() {
        super("/auth")
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

    updateAvatar(file: File) {
        const data = new FormData()
        data.append("avatar", file)
        // return this.HTTP.put("/profile/avatar", { data }).then((data) => {})
    }
}
