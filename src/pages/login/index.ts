import Link from "../../components/link"
import Input from "../../components/field"
import Block, { Props } from "../../utils/block"
import tmp from "./tmp.hbs?raw"
import Form from "../../components/form"
import { bus, fields } from "../../global"
import UserLoginService from "../../services/user-login"
import { LoginFormModel } from "../../interfaces"

const localFields = [ "login", "password" ] as const

type FormInputs = { [key in typeof localFields[number]]: Input }

interface LoginProps extends Props {
    form_inputs: FormInputs
}

export default class Login extends Block<LoginProps> {
    constructor() {
        const setInput = (key: typeof localFields[number]): Input => (
            new Input({
                labelText: fields[key].label,
                name: key,
                type: fields[key].type,
                onBlur: (value : string) => {
                    const inputs = this.props.form_inputs
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

        const inputs = localFields.reduce<FormInputs>((obj, key) => ({
            ...obj,
            [key]: setInput(key)
        }), {} as FormInputs)

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
        bus.on("reqErr", this.reqError.bind(this))
    }

    badLogin() {
        const inputs = this.props.form_inputs
        inputs.password.setProps({
            invalidMsg: "Неверный логин или пароль"
        })
    }

    reqError(reason: string) {
        const inputs = this.props.form_inputs
        inputs.password.setProps({ invalidMsg: reason })
    }

    handleLogin(data: LoginFormModel) {
        let isInvalid = false
        const inputs = this.props.form_inputs

        Object.keys(data).forEach((key) => {
            if (typeof data[key] === "string" && data[key].length === 0) {
                isInvalid = true
                inputs[key as typeof localFields[number]].setProps({
                    invalidMsg: "Обязательное значение",
                    state: false
                })
            }
        })

        if (isInvalid) {
            return
        }

        UserLoginService.login(data)
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
