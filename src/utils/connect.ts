import Block, { Props } from "../modules/block"
import { Indexed } from "../modules/types"
import store, { StoreEvents } from "../modules/store"
import isEqual from "./isEqual"

export default function connect<T = Props>(
    Component: new (props: T) => Block,
    mapStateToProps: (state: Indexed) => Indexed
) {
    return class extends Component {
        constructor(props?: Indexed) {
            const state = mapStateToProps(store.getState())

            super({ ...props, ...state } as T)

            store.on(StoreEvents.Updated, () => {
                const newState = mapStateToProps(store.getState())

                if (!isEqual(state, newState)) {
                    this.setProps({ ...newState })
                }
            })
        }
    }
}
