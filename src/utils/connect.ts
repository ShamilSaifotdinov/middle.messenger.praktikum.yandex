import Block from "../modules/block"
import { Indexed } from "../modules/global"
import store, { StoreEvents } from "../modules/store"
import isEqual from "./isEqual"

export default function connect(
    Component: new (props: Indexed) => Block,
    mapStateToProps: (state: Indexed) => Indexed
) {
    return class extends Component {
        constructor(props?: Indexed) {
            const state = mapStateToProps(store.getState())

            super({ ...props, ...state })

            store.on(StoreEvents.Updated, () => {
                const newState = mapStateToProps(store.getState())

                if (!isEqual(state, newState)) {
                    this.setProps({ ...newState })
                }
            })
        }
    }
}
