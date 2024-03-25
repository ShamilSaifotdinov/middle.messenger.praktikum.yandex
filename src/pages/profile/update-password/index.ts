import Button from "../../../components/button"
import Form from "../../../components/form"
import Input from "../../../components/field"
import Block from "../../../utils/block"
import { bus, fields } from "../../../global"
import { UpdatePasswordFormModel } from "../../../interfaces"
import ProfileService from "../../../services/profile-service"
import template from "./tmp.hbs?raw"
import "./update-password.css"

export default class UpdatePassword extends Block {
    constructor(props : { onClose: CallableFunction }) {
        const passwordFields = {
            oldPassword: new Input({
                labelText: "Старый пароль",
                name: "oldPassword",
                type: fields.password.type,
                onBlur: (value : string) => {
                    const field = (this.props.passwordFields as Record<string, Block>).oldPassword

                    if (value.length === 0) {
                        field.setProps({
                            invalidMsg: "Обязательное значение",
                            state: false
                        })
                    } else {
                        field.setProps({
                            invalidMsg: undefined,
                            state: undefined
                        })
                    }
                }
            }),
            newPassword: new Input({
                labelText: "Новый пароль",
                name: "newPassword",
                pattern: fields.password.regex,
                type: fields.password.type,
                onBlur: (value : string) => {
                    const field = (this.props.passwordFields as Record<string, Block>).newPassword

                    if (value.length === 0) {
                        field.setProps({
                            invalidMsg: "Обязательное значение",
                            state: false
                        })
                    } else if (fields.password.regex && !value.match(fields.password.regex)) {
                        field.setProps({
                            invalidMsg: fields.password.desc,
                            state: false
                        })
                    } else {
                        field.setProps({
                            invalidMsg: undefined,
                            state: undefined
                        })
                    }
                }
            }),
            newPasswordTry: new Input({
                labelText: "Повторите новый пароль",
                name: "newPasswordTry",
                type: fields.passwordTry.type,
                onBlur: (value : string) => {
                    const password = (this.props.passwordFields as Record<string, Block>)
                        .newPassword as Input
                    const passwordTryElem = (this.props.passwordFields as Record<string, Block>)
                        .newPasswordTry

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

        super("div", {
            ...props,
            attrs: {
                class: "update-password"
            },
            form: new Form({
                class: "auth_form",
                inputs: [ ...Object.values(passwordFields) ],
                submit_text: "Сохранить",
                submit_class: "profile-details_submit",
                onSubmit: (data: UpdatePasswordFormModel) => this.handleUpdatePassword(data)
            }),
            passwordFields,
            cancel: new Button({
                text: "Отмена",
                class: "button-link update-password_cancel",
                color: "outline-blue",
                onClick: () => props.onClose()
            })
        })

        bus.on("user-updatePassword:badOldPassword", this.badOldPassword.bind(this))
        bus.on("user-updatePassword:passwordChanged", () => props.onClose())
    }

    badOldPassword() {
        (this.props.passwordFields as Record<string, Block>).oldPassword.setProps({
            invalidMsg: "Неверный пароль",
            state: false
        })
    }

    handleUpdatePassword(data: UpdatePasswordFormModel) {
        let isInvalid = false
        Object.keys(data).forEach((key) => {
            const inputs = this.props.passwordFields as Record<string, Block>
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

        ProfileService.updatePassword(data)
    }

    render() {
        return this.compile(template, this.props)
    }
}
