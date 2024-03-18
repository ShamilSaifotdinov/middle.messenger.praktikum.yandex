import BaseAPI from "../utils/HTTP/base-api"

export default class ChatsAPI extends BaseAPI {
    constructor() {
        super("/chats")
    }

    create(title?: string) {
        return this.HTTP.post("/", { data: { title }, withCredentials: true })
    }

    addUsers(data: { chatId: number, users: number[] }) {
        return this.HTTP.put("/users", { data, withCredentials: true })
    }

    request() {
        return this.HTTP.get("/", { withCredentials: true })
        // .then(({ response }) => JSON.parse(response))
    }

    // delete(data) {
    //     return this.HTTP.delete("/", { data, withCredentials: true })
    //         .then(({ response }) => JSON.parse(response))
    // }
}
