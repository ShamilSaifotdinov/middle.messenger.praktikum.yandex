import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import "./profile.css"
import Form from "../../components/form"
import DetailsRow from "./details-row"
import { bus, fields } from "../../modules/global"
import Link from "../../components/link"
import Button from "../../components/button"
import UserLoginController from "../../services/user-login"
import isEqual from "../../utils/isEqual"
import { ProfileFormModel } from "../../modules/types"
import ProfileService from "../../services/profile-service"

const localFields = [ "first_name", "second_name", "display_name", "login", "email", "phone" ]

interface PropsProfileDetails extends Props {
    profile: ProfileFormModel
    isChangeable?: boolean
}

type DetailsRowsType = Record<string, DetailsRow>

export default class ProfilePage extends Block {
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
                    UserLoginController.logout()
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
                onClick: () => {}
            })
        })

        bus.on("user:profileIsChanged", () => this.setProps({ isChangeable: false }))
    }

    componentDidUpdate(oldProps: PropsProfileDetails, newProps: PropsProfileDetails) {
        if (oldProps.isChangeable !== newProps.isChangeable) {
            return true
        }

        if (!isEqual(oldProps.profile, newProps.profile)) {
            localFields.forEach((key) => {
                if (oldProps.profile[key] !== newProps.profile[key]) {
                    (this.props.detailsRows as DetailsRowsType)[key].setProps({
                        value: newProps.profile[key]
                    });

                    (this.props.detailsChangeableRows as DetailsRowsType)[key].setProps({
                        value: newProps.profile[key]
                    })
                }
            })

            return true
        }

        return false
    }

    handleUpdateProfile(data: ProfileFormModel) {
        ProfileService.updateProfile(data)
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
