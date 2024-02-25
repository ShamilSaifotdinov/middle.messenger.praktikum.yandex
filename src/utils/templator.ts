import Handlebars from "handlebars"

export function compile (template: string, props: Record<string, unknown>): string {
    return Handlebars.compile(template)(props)
}

export default {
    compile
}