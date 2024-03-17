import { Indexed } from "../../interfaces"
import connect from "../../utils/connect"
import ChatPage from "./ChatPage"

function mapChatToProps(state: Indexed) {
    return {
        active_chat: state.active_chat || undefined
    }
}

export default connect(ChatPage, mapChatToProps)
