import BaseAPI from "../utils/HTTP/base-api"

export default class ChatAPI extends BaseAPI {
    constructor() {
        super("/chats")
    }

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

    delete(chatId?: number) {
        if (!chatId) {
            throw new Error("ChatAPI.delete: need chatId")
        }

        return this.HTTP.delete("", { data: { chatId }, withCredentials: true })
    }
}
