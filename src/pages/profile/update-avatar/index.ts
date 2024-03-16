import Avatar from "../../../components/avatar"
import Button from "../../../components/button"
import Form from "../../../components/form"
import Input from "../../../components/field"
import Block from "../../../utils/block"
import { bus } from "../../../global"
import { AvatarFormModel } from "../../../interfaces"
import ProfileService from "../../../services/profile-service"
import template from "./tmp.hbs?raw"
import "./update-avatar.css"

export default class UpdateAvatar extends Block {
    constructor(props : { onClose: CallableFunction }) {
        const input = new Input({
            type: "file",
            name: "avatar",
            attrs: {
                accept: "image/*"
            },
            onChange: (e: InputEvent) => {
                const inputTarget = e.target as HTMLInputElement
                if (inputTarget.files) {
                    const [ file ] = inputTarget.files
                    this.setAvatar(URL.createObjectURL(file))
                }
            }
        })

        super("div", {
            ...props,
            attrs: {
                class: "update-avatar"
            },
            form: new Form({
                class: "auth_form",
                inputs: [ input ],
                submit_text: "Сохранить",
                submit_class: "update-avatar_submit",
                onSubmit: (data: AvatarFormModel) => this.handleUpdateAvatar(data)
            }),
            input,
            cancel: new Button({
                text: "Отмена",
                class: "button-link update-password_cancel",
                color: "outline-blue",
                onClick: () => props.onClose()
            })
        })

        bus.on("user-updateAvatar:err", this.handleErr.bind(this))
        bus.on("user-updateAvatar:avatarChanged", () => props.onClose())
    }

    setAvatar(src: string) {
        const { form, input } = (this.children as Record<string, Block>)
        const avatar = new Avatar({ src, class: "new-avatar" })
        form.setProps({
            inputs: [ input, avatar ],
            submit_text: "Сохранить"
        })
    }

    handleUpdateAvatar(data: AvatarFormModel) {
        ProfileService.updateAvatar(data)
    }

    handleErr(err: string) {
        const { input } = (this.children as Record<string, Block>)
        input.setProps({ invalidMsg: err })
    }

    render() {
        return this.compile(template, this.props)
    }
}
