import Link from "../../components/link"
import Input from "../../components/input"
import Block from "../../modules/block"
import tmp from "./tmp.hbs?raw"
// import UserService from "../../services/user-service"
// import Button from "../../components/button"
import Form from "../../components/form"

// const userService = new UserService()

export default class Login extends Block {
    constructor() {
        const login = new Input({
            labelText: "Логин",
            name: "login",
            required: true,
            onBlur: (value : string) => {
                let inputs = this.props.form_inputs as Record<string, Block>
                if (value.length == 0)
                {
                    inputs.login.setProps({
                        invalidMsg: "Обязательное значение"
                    })
                } else {
                    inputs.login.setProps({
                        invalidMsg: null,
                        state: true,
                    })
                }
            }
        })
        const password = new Input({
            labelText: "Пароль",
            name: "password",
            type: "password",
            required: true,
            onBlur: (value : string) => {
                let inputs = this.props.form_inputs as Record<string, Block>
                if (value.length == 0)
                {
                    inputs.password.setProps({
                        invalidMsg: "Обязательное значение"
                    })
                } else {
                    inputs.password.setProps({
                        invalidMsg: null,
                        state: true
                    })
                }
            }
        })

        super("div", {
            attrs: {
                class: "auth"
            },
            form_inputs: { login, password },
            form: new Form({
                class: "auth_form",
                inputs: [ login, password ],
                submit_text: "Войти",
                onSubmit: (data: Record<string, unknown>) => this.handleLogin(data)
            }),
            registry: new Link({
                href: "/registry.html",
                title: "Регистрация"
            })
        })
    }

    handleLogin(e: Record<string, unknown>) {
        console.log(e)

        const form_inputs = (this.props.form_inputs as Record<string, Block>)

        form_inputs.login.setProps({ state: false })
        form_inputs.password.setProps({
            state: false,
            invalidMsg: "Неверный логин или пароль"
        })

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