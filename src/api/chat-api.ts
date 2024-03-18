import BaseAPI from "../utils/HTTP/base-api"

export default class ChatAPI extends BaseAPI {
    constructor() {
        super("/chats")
    }

    // request(id?: number) {
    //     if (!id) {
    //         throw "ChatAPI.request: need ID of chat"
    //     }

    //     return this.HTTP.get("", { data: { id }, withCredentials: true })
    //     // .then(({ response }) => JSON.parse(response))
    // }

    getChatUsers(id: number) {
        return this.HTTP.get(`/${id}/users`, { withCredentials: true })
    }

    updateAvatar(avatar: File, chatId: number) {
        const data = new FormData()
        data.append("chatId", chatId.toString())
        data.append("avatar", avatar)
        return this.HTTP.put("/avatar", { data, withCredentials: true })
    }

    addUsers(users: number[], chatId: number) {
        return this.HTTP.put("/users", { data: { users, chatId }, withCredentials: true })
    }

    deleteUsers(users: number[], chatId: number) {
        return this.HTTP.delete("/users", { data: { users, chatId }, withCredentials: true })
    }

    // delete(data) {
    //     return this.HTTP.delete("/", { data, withCredentials: true })
    //         .then(({ response }) => JSON.parse(response))
    // }
}
