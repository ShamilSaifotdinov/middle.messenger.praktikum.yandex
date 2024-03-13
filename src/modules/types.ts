export type Indexed<T = unknown> = {
    [key in string]: T;
}

export interface LoginFormModel extends Indexed {
    login: string;
    password: string;
}

export interface RegistryFormModel extends Indexed {
    first_name: string
    second_name: string
    login: string
    email: string
    phone: string
    password: string
    passwordTry: string
}

export type err = {
    type: string
    desc: Indexed
}
