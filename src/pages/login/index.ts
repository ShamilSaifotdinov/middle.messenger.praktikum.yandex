import Link from "../../components/link"
import Input from "../../components/input"
import Block from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import UserService from "../../services/user-service"
import Form from "../../components/form"
import { fields } from "../../modules/global"

const userService = new UserService()

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
                onSubmit: (data: Record<string, unknown>) => this.handleLogin(data)
            }),
            registry: new Link({
                href: "/sign-up",
                content: "Регистрация"
            })
        })
    }

    handleLogin(data: Record<string, unknown>) {
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

        userService.login(data)

        // const formInputs = this.props.form_inputs as Record<string, Block>

        // formInputs.login.setProps({ state: false })
        // formInputs.password.setProps({
        //     state: false,
        //     invalidMsg: "Неверный логин или пароль"
        // })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
