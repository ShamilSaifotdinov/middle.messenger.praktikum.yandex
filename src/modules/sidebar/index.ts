import { Indexed } from "../../interfaces"
import connect from "../../utils/connect"
import Sidebar from "./Sidebar"

function mapChatToProps(state: Indexed) {
    return {
        raw_chats: state.chats || [],
        user: state.user
    }
}

export default connect(Sidebar, mapChatToProps)
