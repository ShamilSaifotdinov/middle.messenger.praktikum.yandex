import Block, { Props } from "./block"
import { Indexed } from "../interfaces"
import store, { StoreEvents } from "../store"
import isEqual from "./isEqual"

export default function connect<T = Props>(
    Component: new (props: T) => Block,
    mapStateToProps: (state: Indexed) => Indexed
) {
    return class extends Component {
        constructor(props?: Indexed) {
            let state = mapStateToProps(store.getState())

            super({ ...props, ...state } as T)

            store.on(StoreEvents.Updated, () => {
                const newState = mapStateToProps(store.getState())

                if (!isEqual(state, newState)) {
                    this.setProps({ ...newState })
                    state = newState
                }
            })
        }
    }
}
