import AuthAPI from "../modules/HTTP/api/auth-api"
import { bus, fields } from "../modules/global"
import Router from "../modules/router"
import { LoginFormModel } from "../modules/types"
// import Router from "../modules/router"
import validator from "../utils/validator"

const authApi = new AuthAPI()
const userLoginValidator = validator(
    [ "login", "password" ],
    {
        login: {
            label: fields.login.label,
            regex: "\\S",
            desc: "Обязательное значение"
        },
        password: {
            label: fields.password.label,
            regex: "\\S",
            desc: "Обязательное значение"
        }
    }
)

const router = Router.getInstance()

export default class UserLoginController {
    public static async login(data: LoginFormModel) {
        try {
            // Запускаем крутилку

            const validateData = userLoginValidator(data)

            if (!validateData.isCorrect) {
                // throw new Error(validateData)
                throw validateData
            }

            // const userID = authApi.request(prepareDataToRequest(data));
            const res = await authApi.request(data)

            console.log(res)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            bus.emit("getUser")

            // console.log(userID)
            // if (!!userID) {
            // }

            router.go("/messenger")

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
            console.error(error)
            bus.emit("badLogin")
        }
    }

    public static async logout() {
        try {
            // Запускаем крутилку
            const res = await authApi.delete()

            console.log(res)

            if (res.status !== 200) {
                throw { type: "requestErr", desc: res }
            }

            bus.emit("getUser")

            router.go("/")

            // Останавливаем крутилку
        } catch (error) {
            // Логика обработки ошибок
            console.error(error)
        }
    }
}

// С использованием декораторов
// class UserLoginController {
//     @validate(userLoginValidateRules)
//     @handleError(handler)
//     public async login(data: LoginFormModel) {
//         const userID = loginApi.request(prepareDataToRequest(data));
//         RouteManagement.go('/chats');
//     }
// }
