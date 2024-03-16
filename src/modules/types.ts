export type Indexed<T = unknown> = {
    [key in string | symbol]: T;
}

export interface LoginFormModel extends Indexed<string> {
    login: string;
    password: string;
}

export interface RegistryModel extends Indexed<string> {
    first_name: string
    second_name: string
    login: string
    email: string
    phone: string
    password: string
}

export interface RegistryFormModel extends RegistryModel {
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

export interface UpdatePasswordModel extends Indexed<string> {
    oldPassword: string
    newPassword: string
}

export interface UpdatePasswordFormModel extends UpdatePasswordModel {
    tryNewPassword: string
}

export type err = {
    type: string
    desc: Indexed
}
