import { User } from "./user";

export interface UserSession {
    authenticationToken:string;
    refreshToken:string;
    userData:User;
}
