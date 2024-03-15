import Link from "../../components/link"
import Input from "../../components/input"
import Block from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import Form from "../../components/form"
import { bus, fields } from "../../modules/global"
import UserLoginController from "../../services/user-login"
import { LoginFormModel } from "../../modules/types"

const localFields = [ "login", "password" ]

export default class Login extends Block {
    constructor() {
        const setInput = (key: string):Input => (
            new Input({
                labelText: fields[key].label,
                name: key,
                type: fields[key].type,
                onBlur: (value : string) => {
                    const inputs = this.props.form_inputs as Record<string, Block>
                    if (value.length === 0) {
                        inputs[key].setProps({
                            invalidMsg: "Обязательное значение",
                            state: false
                        })
                    } else {
                        inputs[key].setProps({
                            invalidMsg: null,
                            state: true
                        })
                    }
                }
            })
        )

        const inputs = localFields.reduce((obj, key) => ({
            ...obj,
            [key]: setInput(key)
        }), {})

        super("div", {
            attrs: {
                class: "auth"
            },
            form_inputs: inputs,
            form: new Form({
                class: "auth_form",
                inputs: [ ...Object.values(inputs) ],
                submit_text: "Войти",
                onSubmit: (data: LoginFormModel) => this.handleLogin(data)
            }),
            registry: new Link({
                href: "/sign-up",
                content: "Регистрация"
            })
        })

        bus.on("badLogin", this.badLogin.bind(this))
    }

    badLogin() {
        const inputs = this.props.form_inputs as Record<string, Block>
        inputs.password.setProps({
            invalidMsg: "Неверный логин или пароль"
        })
    }

    handleLogin(data: LoginFormModel) {
        let isInvalid = false
        Object.keys(data).forEach((key) => {
            const inputs = this.props.form_inputs as Record<string, Block>
            if (typeof data[key] === "string" && (data[key] as string).length === 0) {
                isInvalid = true
                inputs[key].setProps({
                    invalidMsg: "Обязательное значение",
                    state: false
                })
            }
        })

        if (isInvalid) {
            return
        }

        UserLoginController.login(data)
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
