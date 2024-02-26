import Link from "../../components/link"
import Input from "../../components/input"
import Block from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import UserService from "../../services/user-service"
import Form from "../../components/form"
import { fields } from "../../modules/global"

const userService = new UserService()

const localFields = [ "first_name", "second_name", "login", "email", "phone", "password" ]

export default class Registry extends Block {
    constructor() {
        const registryFields = localFields.reduce((obj, key) => {
            const field = fields[key]
            return {
                ...obj,
                [key]: new Input({
                    labelText: field.label,
                    name: key,
                    pattern: field.regex,
                    required: true,
                    type: field.type,
                    onBlur: (value : string) => {
                        if (value.length === 0) {
                            (this.props.form_inputs as Record<string, Block>)[key].setProps({
                                invalidMsg: "Обязательное значение"
                            })
                        } else if (field.regex && !value.match(field.regex)) {
                            (this.props.form_inputs as Record<string, Block>)[key].setProps({
                                invalidMsg: field.desc
                            })
                        } else {
                            (this.props.form_inputs as Record<string, Block>)[key].setProps({
                                invalidMsg: undefined
                            })
                        }
                    }
                })
            }
        }, {})

        const passwordTry = new Input({
            labelText: "Повторите пароль",
            name: "passwordTry",
            type: "password",
            required: true,
            onBlur: (value : string) => {
                const password = (this.props.form_inputs as Record<string, Block>)
                    .password as Input
                const passwordTryElem = (this.props.form_inputs as Record<string, Block>)
                    .passwordTry

                if (value !== password.value) {
                    passwordTryElem.setProps({
                        invalidMsg: "Пароли не совпадают",
                        state: false
                    })
                } else {
                    passwordTryElem.setProps({
                        invalidMsg: undefined,
                        state: undefined
                    })
                }
            }
        })

        super("div", {
            attrs: {
                class: "auth"
            },
            form_inputs: { ...registryFields, passwordTry },
            form: new Form({
                class: "auth_form",
                inputs: [ ...Object.values(registryFields), passwordTry ],
                submit_text: "Зарегистрироваться",
                onSubmit: (data: Record<string, unknown>) => this.handleRegistry(data)
            }),
            registry: new Link({
                href: "./login.html",
                title: "Войти"
            })
        })
    }

    handleRegistry(data: Record<string, unknown>) {
        userService.registry(data)
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
