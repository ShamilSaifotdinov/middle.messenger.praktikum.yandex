import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import "./profile.css"
import Form from "../../components/form"
import DetailsRow from "./details-row"
import { fields } from "../../modules/global"
import UserService from "../../services/user-service"
import Link from "../../components/link"
import Button from "../../components/button"
import UserLoginController from "../../controllers/user-login"
import isEqual from "../../utils/isEqual"

const userService = new UserService()

const localFields = [ "first_name", "second_name", "display_name", "login", "email", "phone" ]

interface PropsProfileDetails extends Props {
    profile: Record<string, string>
}

type DetailsRowsType = Record<string, DetailsRow>

export default class ProfilePage extends Block {
    constructor(props: PropsProfileDetails) {
        const detailsRows: DetailsRowsType = localFields
            .reduce((obj, key) => ({
                ...obj,
                [key]: new DetailsRow({
                    name: key,
                    title: fields[key].label,
                    value: props.profile[key],
                    ...(fields[key].type && { type: fields[key].type }),
                    pattern: fields[key].regex,
                    desc: fields[key].desc
                })
            }), {})

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
            detailsRows,
            form: new Form({
                class: "profile-details",
                inputs: [ ...Object.values(detailsRows) ],
                submit_text: "Сохранить изменения",
                submit_class: "profile-details_button",
                onSubmit: (data: Record<string, unknown>) => this.handleUpdateProfile(data)
            })
        })
    }

    componentDidUpdate(oldProps: PropsProfileDetails, newProps: PropsProfileDetails) {
        if (!isEqual(oldProps.profile, newProps.profile)) {
            localFields.forEach((key) => {
                if (oldProps.profile[key] !== newProps.profile[key]) {
                    console.log(oldProps.profile[key], newProps.profile[key]);
                    (this.props.detailsRows as DetailsRowsType)[key].setProps({
                        value: newProps.profile[key]
                    })
                }
            })
            return true
        }

        return false
    }

    handleUpdateProfile(data: Record<string, unknown>) {
        userService.updateProfile(data)
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
