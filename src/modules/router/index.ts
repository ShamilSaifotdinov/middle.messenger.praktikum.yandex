import Route from "./route"
import { AuthMode, BlockClass, RouteOptions, RouterOptions } from "./types"

class Router {
    private routes: Route<BlockClass>[]

    private history: History

    private _currentRoute: Route<BlockClass> | null

    private _rootQuery?: string

    private static __instance: Router

    _authrized = false

    private constructor() {
        this.routes = []
        this.history = window.history
        this._currentRoute = null
    }

    setRootQuery(rootQuery: string) {
        if (this._rootQuery) {
            throw new Error("rootQuery is already exist")
        }

        this._rootQuery = rootQuery
    }

    public static getInstance(): Router {
        if (!Router.__instance) {
            Router.__instance = new Router()
        }

        return Router.__instance
    }

    use<T extends BlockClass>(pathname: string, block: T, options?: RouterOptions<T>) {
        if (typeof this._rootQuery === "undefined") {
            throw new Error("rootQuery is required")
        }

        const route = new Route<T>(
            pathname,
            block,
            { rootQuery: this._rootQuery, ...options } as RouteOptions<T>
        )

        this.routes.push(route)

        return this
    }

    start() {
        window.onpopstate = ((event: PopStateEvent) => {
            this._onRoute((event.currentTarget as Window).location.pathname)
        })

        this._onRoute(window.location.pathname)
    }

    _onRoute(pathname: string) {
        let route = this.getRoute(pathname)
        if (!route) {
            route = this.getRoute("*")
        }

        if (!route) {
            return
        }

        if (this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave()
        }

        this._currentRoute = route
        route.render()
    }

    go(pathname: string) {
        this.history.pushState({}, "", pathname)
        this._onRoute(pathname)
    }

    back() {
        this.history.back()
    }

    setAuthrized(state: boolean) {
        this._authrized = state
        this._onRoute(window.location.pathname)
    }

    forward() {
        this.history.forward()
    }

    getRoute(pathname: string) {
        return this.routes.find((route) => (
            route.match(pathname)
            && (
                (route._options.authMode === AuthMode.onlyAuthrized && this._authrized)
                || (route._options.authMode === AuthMode.onlyNotAuthrized && !this._authrized)
                || !route._options.authMode
            )
        ))
    }
}

export default Router
