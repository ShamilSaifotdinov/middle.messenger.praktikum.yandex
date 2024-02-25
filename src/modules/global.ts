import EventBus from "./event-bus.ts"

export const bus = new EventBus()

export const patterns = {
    login: ".{3,20}",
    password: ".{8,40}"
}