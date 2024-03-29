import EventBus from "./utils/event-bus.ts"

export const defaultTitle = "Messenger"

export const bus = new EventBus()

export const fields: Record<string, {
    label: string
    regex?: string
    type?: string
    desc?: string
}> = {
    first_name: {
        label: "Имя",
        regex: "^[A-ZА-Я][A-Za-zА-Яа-я\\-]*$",
        desc: "Только латиница или кириллица, первая буква должна быть заглавной,"
            + " без пробелов и без цифр, спецсимвол - только дефис"
    },
    second_name: {
        label: "Фамилия",
        regex: "^[A-ZА-Я][A-Za-zА-Яа-я\\-]*$",
        desc: "Только латиница или кириллица, первая буква должна быть заглавной,"
            + " без пробелов и без цифр, спецсимвол - только дефис"
    },
    display_name: {
        label: "Имя в чате",
        regex: "^[A-ZА-Я][A-Za-zА-Яа-я\\-]*$",
        desc: "Только латиница или кириллица, первая буква должна быть заглавной,"
            + "без пробелов и без цифр, спецсимвол - только дефис"
    },
    login: {
        label: "Логин",
        regex: "(?!^[0-9]+$)^[A-Za-z0-9_\\-]{3,20}$",
        desc: "Допустимы латиница, цифры (но не состоять из них),"
            + " дефис и нижнее подчёркивание, от 3 до 20 символов"
    },
    email: {
        label: "E-mail",
        type: "email",
        regex: "^[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,4}$",
        desc: "Допустимы латиница, цифры и спецсимволы вроде дефиса и подчёркивания,"
            + " обязательно должна быть «собака» (@) и точка"
    },
    phone: {
        label: "Телефон",
        type: "tel",
        regex: "(^[+][0-9]{9,14}$)|(^[0-9]{10,15}$)",
        desc: "Допустимы цифры и может начинается с плюса, от 10 до 15 символов"
    },
    password: {
        label: "Пароль",
        type: "password",
        regex: "(?=.*[0-9])(?=.*[A-Z])^.{8,40}$",
        desc: "Обязательно хотя бы одна заглавная буква и цифра, от 8 до 40 символов"
    },
    passwordTry: {
        label: "Повторите пароль",
        type: "password",
        desc: "Пароли не совпадают"
    },
    message: {
        label: "Сообщение",
        regex: "\\S",
        desc: "Не пустое значение"
    }
}
