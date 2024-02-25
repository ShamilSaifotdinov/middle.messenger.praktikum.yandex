import Block, { Props } from "../../modules/block"
import tmp from "./tmp.hbs?raw"
import "./profile.css"
import Form from "../../components/form"
import DetailsRow from "./details-row"

const profile_titles: Record<string, Record<string, string>> = {
    first_name: {
        label: "Имя"
    },
    second_name: {
        label: "Фамилия"
    },
    display_name: {
        label: "Имя в чате"
    },
    login: {
        label: "Логин"
    },
    email: {
        label: "E-mail",
        type: "email"
    },
    phone: {
        label: "Телефон",
        type: "tel"
    },
}

interface PropsProfileDetails extends Props {
    profile: Record<string, string>
}

export default class ProfilePage extends Block {
    constructor(props: PropsProfileDetails) {
        const profile_details = Object.entries(profile_titles)
            .map(([key, value]) => ({ 
                name: key,
                title: value.label,
                value: props.profile[key],
                ...(value.type && { type: value.type })
            }))
        
        super("div", {
            ...props,
            attrs: { class: "profile" },
            form: new Form({
                class: "profile-details",

                inputs: [...profile_details.map(detail => new DetailsRow(detail))],

                submit_text: "Сохранить изменения",
                submit_class: "profile-details_button",
                onSubmit: (data: []) => {
                    console.log(data)
                }
            })
        })
    }

    render() {
        return this.compile(tmp, this.props)
    }
}
