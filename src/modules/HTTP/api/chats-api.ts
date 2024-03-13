import BaseAPI from "../base-api"

export default class ChatAPI extends BaseAPI {
    constructor() {
        super("/chats")
    }

    // create(data) {
    //     return this.HTTP.post("/", { data })
    // }

    // request(data) {
    //     return this.HTTP.get("/", { data, withCredentials: true })
    //         .then(({ response }) => JSON.parse(response))
    // }

    // delete(data) {
    //     return this.HTTP.delete("/", { data, withCredentials: true })
    //         .then(({ response }) => JSON.parse(response))
    // }
}
