import Link from "../../components/link"
import Input from "../../components/input"
import Block from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import Form from "../../components/form"
import { bus, fields } from "../../modules/global"
import UserRegistryController from "../../controllers/user-registry"
import { RegistryFormModel } from "../../modules/types"

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
            labelText: fields.passwordTry.label,
            name: "passwordTry",
            type: fields.passwordTry.type,
            onBlur: (value : string) => {
                const password = (this.props.form_inputs as Record<string, Block>)
                    .password as Input
                const passwordTryElem = (this.props.form_inputs as Record<string, Block>)
                    .passwordTry

                if (value !== password.value) {
                    passwordTryElem.setProps({
                        invalidMsg: fields.passwordTry.desc,
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
                onSubmit: (data: RegistryFormModel) => this.handleRegistry(data)
            }),
            login: new Link({
                href: "/",
                content: "Войти"
            })
        })

        bus.on("userIsExist", this.userIsExist.bind(this))
        bus.on("reqErr", this.reqError.bind(this))
    }

    reqError(reason: string) {
        const inputs = this.props.form_inputs as Record<string, Block>
        inputs.passwordTry.setProps({ invalidMsg: reason })
    }

    userIsExist(field: string) {
        const inputs = this.props.form_inputs as Record<string, Block>
        const fieldLabel = {
            login: "логином",
            email: "Email"
        }[field]

        inputs[field].setProps({ invalidMsg: `Пользователь с таким ${fieldLabel} уже существует` })
    }

    handleRegistry(data: RegistryFormModel) {
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

        UserRegistryController.registry(data)
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
