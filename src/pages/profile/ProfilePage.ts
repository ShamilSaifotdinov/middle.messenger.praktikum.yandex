import Block, { Props } from "../../utils/block"
import tmp from "./tmp.hbs?raw"
import "./profile.css"
import Form from "../../components/form"
import DetailsRow from "./details-row"
import { bus, fields } from "../../global"
import Link from "../../components/link"
import Button from "../../components/button"
import UserLoginService from "../../services/user-login"
import isEqual from "../../utils/isEqual"
import { ProfileFormModel } from "../../interfaces"
import ProfileService from "../../services/profile-service"
import UpdatePassword from "./update-password"
import Modal from "../../components/modal"
import Avatar from "../../components/avatar"
import UpdateAvatar from "./update-avatar"

const localFields = [ "first_name", "second_name", "display_name", "login", "email", "phone" ]

type DetailsRowsType = Record<string, DetailsRow>

interface PropsProfileDetails extends Props {
    profile: ProfileFormModel
    isChangeable?: boolean
    updateAvatarModal: Block | null
    detailsChangeableRows: DetailsRowsType
    detailsRows: DetailsRowsType
}

export default class ProfilePage extends Block<PropsProfileDetails> {
    constructor(props: PropsProfileDetails) {
        props.isChangeable = false

        const getDetailsRows = (isChangeable: boolean) => (localFields
            .reduce((obj, key) => ({
                ...obj,
                [key]: new DetailsRow({
                    isChangeable,
                    name: key,
                    title: fields[key].label,
                    value: props.profile[key],
                    ...(fields[key].type && { type: fields[key].type }),
                    pattern: fields[key].regex,
                    desc: fields[key].desc
                })
            }), {})
        )

        const detailsChangeableRows: DetailsRowsType = getDetailsRows(true)
        const detailsRows: DetailsRowsType = getDetailsRows(false)

        super("div", {
            ...props,
            attrs: { class: "profile" },
            back: new Link({
                href: "/messenger",
                class: "profile_back"
            }),
            logout: new Button({
                text: "Выйти",
                type: "submit",
                color: "outline-red",
                onClick: () => {
                    UserLoginService.logout()
                }
            }),
            avatar: new Avatar({
                src: props.profile.avatar && (
                    "https://ya-praktikum.tech/api/v2/resources" + props.profile.avatar
                ),
                class: "profile_avatar",
                onClick: () => {
                    this.setProps({ updateAvatarModal: new Modal({
                        children: new UpdateAvatar({
                            onClose: () => this.setProps({ updateAvatarModal: null })
                        })
                    }) })
                }
            }),
            detailsChangeableRows,
            detailsRows,
            details: [ ...Object.values(detailsRows) ],
            form: new Form({
                class: "profile-details",
                inputs: [ ...Object.values(detailsChangeableRows) ],
                submit_text: "Сохранить изменения",
                submit_class: "profile-details_submit",
                onSubmit: (data: ProfileFormModel) => this.handleUpdateProfile(data)
            }),
            changeProfile: new Button({
                text: "Изменить данные",
                color: "outline-blue",
                onClick: () => { this.setProps({ isChangeable: true }) }
            }),
            changePassword: new Button({
                text: "Изменить пароль",
                color: "outline-blue",
                onClick: () => {
                    this.setProps({ updatePasswordModal: new Modal({
                        children: new UpdatePassword({
                            onClose: () => this.setProps({ updatePasswordModal: null })
                        })
                    }) })
                }
            })
        })

        bus.on("user:profileIsChanged", () => this.setProps({ isChangeable: false }))
        bus.on("user:profileUpdateErr", this.reqError.bind(this))
    }

    componentDidUpdate(oldProps: PropsProfileDetails, newProps: PropsProfileDetails) {
        if (!isEqual(oldProps.profile, newProps.profile)) {
            localFields.forEach((key) => {
                if (oldProps.profile[key] !== newProps.profile[key]) {
                    this.props.detailsRows[key].setProps({
                        value: newProps.profile[key]
                    })

                    this.props.detailsChangeableRows[key].setProps({
                        value: newProps.profile[key]
                    })
                }
            })
        }

        if (oldProps.profile.avatar !== newProps.profile.avatar) {
            (this.children.avatar as Block | null)?.setProps({
                src: newProps.profile.avatar && (
                    "https://ya-praktikum.tech/api/v2/resources" + newProps.profile.avatar
                )
            })
        }

        return true
    }

    reqError(reason: string) {
        const inputs = this.props.detailsChangeableRows;
        (inputs.phone.children.input as Block | null)?.setProps({ invalidMsg: reason })
    }

    handleUpdateProfile(data: ProfileFormModel) {
        ProfileService.updateProfile(data)
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
