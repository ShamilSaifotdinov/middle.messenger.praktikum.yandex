// import { bus } from "../modules/global"
import { HTTP } from "../modules/fetch"

export default class UserService {
    login(credential: {
        login: string,
        password: string
    }) {
        console.log(credential)
        HTTP.post("/login", { credential })
            // .then(function (user) {
            //     // do stuff

            //     bus.emit('user:logged-in', user)
            // })
    }
} 