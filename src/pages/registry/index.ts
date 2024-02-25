import Link from "../../components/link"
import Input from "../../components/input"
import Block from "../../modules/block"
import tmp from "./tmp.hbs?raw"
// import UserService from "../../services/user-service"
// import Button from "../../components/button"
import Form from "../../components/form"
import { patterns } from "../../modules/global"

// const userService = new UserService()

export default class Registry extends Block {
    constructor() {
        const first_name = new Input({
            labelText: "Имя",
            name: "first_name",
            required: true,
        })

        const second_name = new Input({
            labelText: "Фамилия",
            name: "second_name",
            required: true,
        })

        const login = new Input({
            labelText: "Логин",
            name: "login",
            pattern: patterns.login,
            required: true,
            onBlur: (value : string) => {
                if (value.length == 0)
                {
                    // (this.props.form_inputs as Record<string, Block>)
                    //  .login.setProps({ state: false })
                    (this.props.form_inputs as Record<string, Block>).login.setProps({
                        invalidMsg: "Обязательное значение"
                    })
                }
                else if (!value.match(patterns.login))
                {
                    (this.props.form_inputs as Record<string, Block>).login.setProps({
                        invalidMsg: "Длина логина не менее 3 символов"
                    })
                }
                else
                {
                    (this.props.form_inputs as Record<string, Block>).login.setProps({
                        invalidMsg: undefined
                    })
                }
            }
        })

        const email = new Input({
            labelText: "E-mail",
            name: "email",
            type: "email",
            required: true,
        })

        const phone = new Input({
            labelText: "Телефон",
            type: "tel",
            name: "phone",
            required: true,
        })
        
        const password = new Input({
            labelText: "Пароль",
            name: "password",
            type: "password",
            pattern: patterns.password,
            required: true,
            onBlur: (value : string) => {
                if (value.length == 0)
                {
                    (this.props.form_inputs as Record<string, Block>).password.setProps({
                        invalidMsg: "Обязательное значение"
                    })
                }
                else if (!value.match(patterns.password))
                {
                    (this.props.form_inputs as Record<string, Block>).password.setProps({
                        invalidMsg: "Длина пароля не менее 8 символов"
                    })
                }
                else
                {
                    (this.props.form_inputs as Record<string, Block>).password.setProps({
                        invalidMsg: null
                    })
                }
            }
        })

        const password_2 = new Input({
            labelText: "Повторите пароль",
            name: "password_2",
            type: "password",
            required: true,
        })

        super("div", {
            attrs: {
                class: "auth"
            },
            form_inputs: { first_name, second_name, login, email, phone, password, password_2 },
            form: new Form({
                class: "auth_form",
                inputs: [ first_name, second_name, login, email, phone, password, password_2 ],
                submit_text: "Зарегистрироваться",
                onSubmit: (data: Record<string, unknown>) => this.handleRegistry(data)
            }),
            registry: new Link({
                href: "./login.html",
                title: "Войти"
            })
        })
    }

    handleRegistry(e: Record<string, unknown>) {
        console.log(e)
        // e.preventDefault()

        // const data = Object.fromEntries(
        //     new FormData(this.element as HTMLFormElement).entries()
        // ) as { login: string, password: string }

        // userService.login(data)
    }

    render() {
        return this.compile(tmp, this.props)
    }
}