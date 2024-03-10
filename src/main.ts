import Index from "./pages/index"
import Login from "./pages/login"
import Registry from "./pages/registry"
import "./style.css"
import ErrorPage from "./pages/error"
import Sidebar from "./layout/sidebar"
import PageWindow from "./layout/window"
import ProfilePage from "./pages/profile"
import ChatPage from "./pages/chat"
import Router from "./modules/router"

const chats = [
    {
        name: "Петр",
        msg: "Привет! Как дела? Давно не виделись. Хотел бы встретиться завтра",
        time: "20:30",
        count: 1
    },
    {
        name: "Петр",
        msg: "Привет! Как дела? Давно не виделись. Хотел бы встретиться завтра",
        time: "20:30",
        active: true
    },
    ...Array(14).fill(
        {
            name: "Петр",
            msg: "Привет! Как дела? Давно не виделись. Хотел бы встретиться завтра",
            time: "20:30",
            count: 2
        }
    )
]

const pageData = {
    "/index": {
        title: "Страницы",
        pages: [] as { href: string; title: string; }[]
    },
    "/login": {
        title: "Авторизация"
    },
    "/registry": {
        title: "Регистрация"
    },
    "/chats": {
        title: "Список чатов",
        active_chat: {
            name: "Петр",
            days: [
                {
                    date: "5 февраля",
                    messages: [
                        {
                            type: "outcome",
                            time: "16:53",
                            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
                                + " sed do eiusmod tempor incididunt ut labore et dolore"
                                + " magna aliqua. Fringilla ut morbi tincidunt augue interdum"
                                + " velit euismod. Vehicula ipsum a arcu cursus vitae congue"
                                + " mauris. Amet nisl suscipit adipiscing bibendum est."
                                + " Fermentum leo vel orci porta."
                        },
                        {
                            type: "income",
                            time: "16:54",
                            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,"
                                + " sed do eiusmod tempor incididunt ut labore et dolore"
                                + " magna aliqua. Fringilla ut morbi tincidunt augue interdum"
                                + " velit euismod. Vehicula ipsum a arcu cursus vitae congue"
                                + " mauris. Amet nisl suscipit adipiscing bibendum est."
                                + " Fermentum leo vel orci porta."
                        }
                    ]
                }
            ]
        }
    },
    "/profile": {
        title: "Настройка профиля",
        profile: {
            first_name: "Иван",
            second_name: "Пупкин",
            display_name: "Иван",
            login: "Ivan_pupkin",
            email: "Ivan_pupkin@yandex.ru",
            phone: "+79999999999"
        }
    },
    "/404": {
        title: "Ошибка 404",
        code: "404",
        msg: "Упс... не туда",
        face: "¯\\_(ツ)_/¯"
    },
    "/500": {
        title: "Ошибка 500",
        code: "500",
        msg: "Уже чиним",
        face: "ʕ•ᴥ•ʔ"
    }
}

const pages = Object.entries(pageData)
pageData["/index"].pages = pages.slice(1, pages.length)
    .map(([ key, value ]) => ({ href: key, title: value.title }))

const router = Router.getInstance()

router.setRootQuery("#app")

router
    .use("*", Index, { pages: pageData["/index"].pages })
    .use("/login", Login)
    .use("/registry", Registry)
    .use("/chats", PageWindow, {
        sidebar: new Sidebar({ raw_chats: chats }),
        content: new ChatPage(pageData["/chats"])
    })
    .use("/profile", PageWindow, {
        sidebar: new Sidebar({ raw_chats: chats.filter((chat) => !chat.active) }),
        content: new ProfilePage(pageData["/profile"])
    })
    .use("/404", ErrorPage, pageData["/404"])
    .use("/500", ErrorPage, pageData["/500"])
    .start()
