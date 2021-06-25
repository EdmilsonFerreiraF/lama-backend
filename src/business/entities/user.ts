export type AuthenticationData = {
    id: string
}

export interface User {
    id: string,
    name: string,
    email: string,
    nickname: string,
    password: string
};

export type SignupInputDTO = {
    name: string,
    email: string,
    nickname: string,
    password: string
};

export type LoginInputDTO = {
    email: string,
    password: string
};