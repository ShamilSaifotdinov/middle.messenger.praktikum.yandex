import BaseAPI from "../utils/HTTP/base-api"

export default class ChatMessagesAPI extends BaseAPI {
    constructor() {
        super("/chats")
    }

    request(chatId?: number) {
        if (!chatId) {
            throw new Error("ChatMessagesAPI.request: need chatID")
        }
        return this.HTTP.post(`/token/${chatId}`, { withCredentials: true })
    }

    // delete(data) {
    //     return this.HTTP.delete("/", { data, withCredentials: true })
    //         .then(({ response }) => JSON.parse(response))
    // }
}
