import Block, { Props } from "../block"

type BlockWithProps = { new(props: Props): Block }

export type BlockWithoutProps = { new(): Block }

export type BlockClass = BlockWithProps | BlockWithoutProps

export enum AuthMode {
    onlyAuthrized = "onlyAuthrized",
    onlyNotAuthrized = "onlyNotAuthrized"
}

interface defaultOptions {
    authMode?: AuthMode
    title?: string
}

export interface OptionsWithProps extends defaultOptions {
    props: Props
}

export type RouterOptions<T> = T extends BlockWithoutProps ? defaultOptions : OptionsWithProps

interface RouteOptionsWithProps extends OptionsWithProps {
    rootQuery: string
}

interface RouteOptionsWithoutProps extends defaultOptions {
    rootQuery: string
}

export type RouteOptions<T> = T extends BlockWithoutProps ? RouteOptionsWithoutProps
    : RouteOptionsWithProps
