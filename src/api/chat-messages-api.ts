// import HTTP from "modules/http"
// import BaseAPI from "../base-api"

// const chatMessagesAPIInstance = new HTTP("api/v1/messages")

// class ChatMessagesAPI extends BaseAPI {
//     request({ id }) {
//         return chatMessagesAPIInstance.get(`/${id}`)
//     }
// }

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
        // .then(({ response }) => JSON.parse(response))
    }

    // delete(data) {
    //     return this.HTTP.delete("/", { data, withCredentials: true })
    //         .then(({ response }) => JSON.parse(response))
    // }
}
