import { resolve } from "path"
import { defineConfig } from "vite"
import handlebars from "vite-plugin-handlebars"


const chats = [
    { name: "Петр", msg: "Привет! Как дела? Давно не виделись. Хотел бы встретиться завтра", time: "20:30", count: 1, },
    { name: "Петр", msg: "Привет! Как дела? Давно не виделись. Хотел бы встретиться завтра", time: "20:30", active: true, },
    ...Array(14).fill(
        { name: "Петр", msg: "Привет! Как дела? Давно не виделись. Хотел бы встретиться завтра", time: "20:30", count: 2, },
    ),
]

const profile_titles = {
    first_name: "Имя",
    second_name: "Фамилия",
    display_name: "Имя в чате",
    login: "Логин",
    email: "E-mail",
    phone: "Телефон",
}

const profile = {
    first_name: "Иван",
    second_name: "Пупкин",
    display_name: "Иван",
    login: "Ivan_pupkin",
    email: "Ivan_pupkin@yandex.ru",
    phone: "+79999999999",
}

const pageData = {
    "/index.html": {
        title: "Страницы",
    },
    "/pages/login.html": {
        title: "Авторизация",
    },
    "/pages/registry.html": {
        title: "Регистрация",
    },
    "/pages/chats.html": {
        title: "Список чатов",
        chats,
        active_chat: {
            name: "Петр",
            days: [
                {
                    date: "5 февраля",
                    messages: [
                        { type: "outcome", time: "16:53", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fringilla ut morbi tincidunt augue interdum velit euismod. Vehicula ipsum a arcu cursus vitae congue mauris. Amet nisl suscipit adipiscing bibendum est. Fermentum leo vel orci porta." },
                        { type: "income", time: "16:54", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fringilla ut morbi tincidunt augue interdum velit euismod. Vehicula ipsum a arcu cursus vitae congue mauris. Amet nisl suscipit adipiscing bibendum est. Fermentum leo vel orci porta." },
                    ]
                },
            ]
        }
    },
    "/pages/profile.html": {
        title: "Настройка профиля",
        chats: chats.filter(chat => !chat.active),
        profile: Object.entries(profile_titles).map(([key, value]) => ({ name: key, title: value, value: profile[key], })),
    },
    "/pages/404.html": {
        title: "Ошибка 404"
    },
    "/pages/500.html": {
        title: "Ошибка 500"
    },
}

export default defineConfig({
    root: resolve(__dirname, "src"),
    resolve: {
        alias: {
            "@": resolve(__dirname, "public"),
        },
    },
    build: {
        outDir: resolve(__dirname, "dist"),
        rollupOptions: {
            input: {
                index: resolve(__dirname, "src/index.html"),
                login: resolve(__dirname, "src/pages/login.html"),
                registry: resolve(__dirname, "src/pages/registry.html"),
                chats: resolve(__dirname, "src/pages/chats.html"),
                profile: resolve(__dirname, "src/pages/profile.html"),
                404: resolve(__dirname, "src/pages/404.html"),
                500: resolve(__dirname, "src/pages/500.html"),
            }
        },
    },
    plugins: [
        handlebars({
            partialDirectory: [
                resolve(__dirname, "src/components/button_link"),
                resolve(__dirname, "src/components/link"),
                resolve(__dirname, "src/components/frame"),
                resolve(__dirname, "src/components/input"),
                resolve(__dirname, "src/components/sidebar"),
                resolve(__dirname, "src/components/chat"),
                resolve(__dirname, "src/components/profile"),
                resolve(__dirname, "src/layout/error"),
            ],
            context(pagePath) {
                return pageData[pagePath]
            },
        }),
    ],
})
