export type Indexed<T = unknown> = {
    [key in string | symbol]: T;
}

export interface LoginFormModel extends Indexed<string> {
    login: string;
    password: string;
}

export interface RegistryFormModel extends Indexed<string> {
    first_name: string
    second_name: string
    login: string
    email: string
    phone: string
    password: string
    passwordTry: string
}

export interface ProfileFormModel extends Indexed<string> {
    first_name: string
    second_name: string
    display_name: string
    login: string
    email: string
    phone: string
}

export type err = {
    type: string
    desc: Indexed
}
