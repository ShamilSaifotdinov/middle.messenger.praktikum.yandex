import { Indexed } from "../../interfaces"
import connect from "../../utils/connect"
import ProfilePage from "./ProfilePage"

function mapUserToProps(state: Indexed) {
    return {
        profile: state.user || {}
    }
}

export default connect(ProfilePage, mapUserToProps)
