import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import "./profile.css"
import Form from "../../components/form"
import DetailsRow from "./details-row"
import { fields } from "../../modules/global"
import UserService from "../../services/user-service"
import Link from "../../components/link"

const userService = new UserService()

const localFields = [ "first_name", "second_name", "display_name", "login", "email", "phone" ]

interface PropsProfileDetails extends Props {
    profile: Record<string, string>
}

export default class ProfilePage extends Block {
    constructor(props: PropsProfileDetails) {
        const profileDetails = localFields
            .map((key) => ({
                name: key,
                title: fields[key].label,
                value: props.profile[key],
                ...(fields[key].type && { type: fields[key].type }),
                pattern: fields[key].regex,
                desc: fields[key].desc
            }))

        super("div", {
            ...props,
            attrs: { class: "profile" },
            back: new Link({
                href: "/chats",
                class: "profile_back"
            }),
            form: new Form({
                class: "profile-details",

                inputs: [ ...profileDetails.map((detail) => new DetailsRow(detail)) ],

                submit_text: "Сохранить изменения",
                submit_class: "profile-details_button",
                onSubmit: (data: Record<string, unknown>) => this.handleUpdateProfile(data)
            })
        })
    }

    handleUpdateProfile(data: Record<string, unknown>) {
        userService.updateProfile(data)
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
