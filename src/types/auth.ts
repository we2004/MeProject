

export type NewUser = {
    name: string
    username: string
    password: string
}

export type LogUser = {
    username: string
    password: string
}

export type ChangePassword = {
    username: string
    recoveryKey: string
    newPassword: string
}