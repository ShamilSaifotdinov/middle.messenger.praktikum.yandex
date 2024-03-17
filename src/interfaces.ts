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

export interface AvatarFormModel extends Indexed {
    avatar: File
}

export interface NewChat extends Indexed {
    title: string
    users: number[]
}

export interface User extends Indexed {
    id: number
    first_name: string
    second_name: string
    display_name: string
    login: string
    avatar: string
}

export type err = {
    type: string
    desc: Indexed
}
