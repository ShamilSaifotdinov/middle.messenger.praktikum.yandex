import Login from "./pages/login"
import Registry from "./pages/registry"
import "./style.css"
import ErrorPage from "./pages/error"
import Sidebar from "./modules/sidebar"
import PageWindow from "./layout/window"
import ProfilePage from "./pages/profile"
import ChatPage from "./pages/chat"
import Router from "./utils/router"
import UserService from "./services/user-service"
import store, { StoreEvents } from "./store"
import { bus } from "./global"
import { AuthMode } from "./utils/router/types"
import ChatsService from "./services/chats-service"

const pageData = {
    "/404": {
        code: "404",
        msg: "Упс... не туда",
        face: "¯\\_(ツ)_/¯"
    },
    "/500": {
        code: "500",
        msg: "Уже чиним",
        face: "ʕ•ᴥ•ʔ"
    }
}

const router = Router.getInstance()

router.setRootQuery("#app")

bus.on("getUser", () => UserService.getUser())
bus.on("getChats", () => ChatsService.getChats())

UserService.getUser().then(() => {
    router
        .use("*", Login, { authMode: AuthMode.onlyNotAuthrized, title: "Авторизация" })
        .use("*", ErrorPage, { props: pageData["/404"], title: "Ошибка 404" })
        .use("/sign-up", Registry, { authMode: AuthMode.onlyNotAuthrized, title: "Регистрация" })
        .use("/messenger", PageWindow, {
            authMode: AuthMode.onlyAuthrized,
            title: "Список чатов",
            props: {
                sidebar: new Sidebar(),
                content: new ChatPage()
            }
        })
        .use("/settings", PageWindow, {
            authMode: AuthMode.onlyAuthrized,
            title: "Настройка профиля",
            props: {
                sidebar: new Sidebar(),
                content: new ProfilePage()
            }
        })
        .use("/500", ErrorPage, { props: pageData["/500"], title: "Ошибка 500" })
        .start()

    const state = store.getState()

    if (typeof state.user !== "undefined") {
        ChatsService.getChats()
    }
})

store.on(StoreEvents.Updated, () => {
    const state = store.getState()

    // console.log("store:", state)

    router.setAuthrized(!!state.user)
})
