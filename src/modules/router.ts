import { Props } from "./block"
import Route, { blockClass } from "./route"

class Router {
    private routes: Route[]

    private history: History

    private _currentRoute: Route | null

    private _rootQuery?: string

    private static __instance: Router

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

    use(pathname: string, block: blockClass, props?: Props) {
        if (typeof this._rootQuery === "undefined") {
            throw new Error("rootQuery is required")
        }

        const route = new Route(pathname, block, { rootQuery: this._rootQuery, ...props })

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

    forward() {
        this.history.forward()
    }

    getRoute(pathname: string) {
        return this.routes.find((route) => route.match(pathname))
    }
}

export default Router
