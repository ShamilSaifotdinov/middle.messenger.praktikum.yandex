import render from "./utils/renderDOM"
import Index from "./pages/index"
import Login from "./pages/login"
import Registry from "./pages/registry"
import "./style.css"
import Block from "./modules/block"
import ErrorPage from "./pages/error"
import Sidebar from "./components/sidebar"
import PageWindow from "./layout/window"
import ProfilePage from "./pages/profile"
import ChatPage from "./pages/chat"

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
    "/index.html": {
        title: "Страницы",
        pages: [] as { href: string; title: string; }[]
    },
    "/login.html": {
        title: "Авторизация"
    },
    "/registry.html": {
        title: "Регистрация"
    },
    "/chats.html": {
        title: "Список чатов",
        chats,
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
    "/profile.html": {
        title: "Настройка профиля",
        chats: chats.filter((chat) => !chat.active),
        profile: {
            first_name: "Иван",
            second_name: "Пупкин",
            display_name: "Иван",
            login: "Ivan_pupkin",
            email: "Ivan_pupkin@yandex.ru",
            phone: "+79999999999"
        }
    },
    "/404.html": {
        title: "Ошибка 404",
        code: "404",
        msg: "Упс... не туда",
        face: "¯\\_(ツ)_/¯"
    },
    "/500.html": {
        title: "Ошибка 500",
        code: "500",
        msg: "Уже чиним",
        face: "ʕ•ᴥ•ʔ"
    }
}

const pages = Object.entries(pageData)
pageData["/index.html"].pages = pages.slice(1, pages.length)
    .map(([ key, value ]) => ({ href: key, title: value.title }))

const route = (href: string, data: Record<string, unknown>, view: Block): void => {
    document.title = (data[href === "*" ? "/index.html" : href] as Record<string, string>).title
    render("#app", view)
}

const sidebar = new Sidebar({})

if (window.location.pathname === "/login.html") {
    route("/login.html", pageData, new Login())
} else if (window.location.pathname === "/registry.html") {
    route("/registry.html", pageData, new Registry())
} else if (window.location.pathname === "/chats.html") {
    route("/chats.html", pageData, new PageWindow({
        sidebar,
        content: new ChatPage(pageData["/chats.html"])
    }))
    sidebar.setProps({ chats: pageData["/chats.html"].chats })
} else if (window.location.pathname === "/profile.html") {
    route("/profile.html", pageData, new PageWindow({
        sidebar,
        content: new ProfilePage(pageData["/profile.html"])
    }))
    sidebar.setProps({ chats: pageData["/profile.html"].chats })
} else if (window.location.pathname === "/404.html") {
    route("/404.html", pageData, new ErrorPage(pageData["/404.html"]))
} else if (window.location.pathname === "/500.html") {
    route("/500.html", pageData, new ErrorPage(pageData["/500.html"]))
} else {
    route("*", pageData, new Index({ pages: pageData["/index.html"].pages }))
}
