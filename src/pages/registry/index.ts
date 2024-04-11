import Link from "../../components/link"
import Input from "../../components/field"
import Block, { Props } from "../../utils/block"
import tmp from "./tmp.hbs?raw"
import Form from "../../components/form"
import { bus, fields } from "../../global"
import UserRegistryService from "../../services/user-registry"
import { RegistryFormModel } from "../../interfaces"

const localFields = [
    "first_name",
    "second_name",
    "login",
    "email",
    "phone",
    "password",
    "passwordTry"
] as const

type FormInputs = { [key in typeof localFields[number]]: Input }

interface RegistryProps extends Props {
    form_inputs: FormInputs
}

export default class Registry extends Block<RegistryProps> {
    constructor() {
        const registryFields = localFields.reduce<FormInputs>((obj, key) => {
            const field = fields[key]

            if (key !== "passwordTry") {
                return {
                    ...obj,
                    [key]: new Input({
                        labelText: field.label,
                        name: key,
                        pattern: field.regex,
                        type: field.type,
                        onBlur: (value : string) => {
                            const inputs = this.props.form_inputs
                            if (value.length === 0) {
                                inputs[key].setProps({
                                    invalidMsg: "Обязательное значение",
                                    state: false
                                })
                            } else if (field.regex && !value.match(field.regex)) {
                                inputs[key].setProps({
                                    invalidMsg: field.desc,
                                    state: false
                                })
                            } else {
                                inputs[key].setProps({
                                    invalidMsg: undefined,
                                    state: true
                                })
                            }
                        }
                    })
                }
            }
            return {
                ...obj,
                [key]: new Input({
                    labelText: fields.passwordTry.label,
                    name: "passwordTry",
                    type: fields.passwordTry.type,
                    onBlur: (value : string) => {
                        const { password } = this.props.form_inputs
                        const passwordTryElem = this.props.form_inputs.passwordTry

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
            }
        }, {} as FormInputs)

        super("div", {
            attrs: {
                class: "auth"
            },
            form_inputs: registryFields,
            form: new Form({
                class: "auth_form",
                inputs: Object.values(registryFields),
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
        const inputs = this.props.form_inputs
        inputs.passwordTry.setProps({ invalidMsg: reason })
    }

    userIsExist(field: string) {
        const inputs = this.props.form_inputs
        const fieldLabel = {
            login: "логином",
            email: "Email"
        }[field]

        inputs[field as typeof localFields[number]].setProps({
            invalidMsg: `Пользователь с таким ${fieldLabel} уже существует`
        })
    }

    handleRegistry(data: RegistryFormModel) {
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

        UserRegistryService.registry(data)
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
