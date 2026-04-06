import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Username = string;
export interface UserProfile {
    username: Username;
    displayName: string;
    userId: UserId;
}
export type Password = string;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(userId: UserId): Promise<UserProfile>;
    isCallerAdmin(): Promise<boolean>;
    login(username: Username, password: Password): Promise<UserId>;
    register(username: Username, password: Password): Promise<void>;
    saveCallerUserProfile(displayName: string): Promise<void>;
}
