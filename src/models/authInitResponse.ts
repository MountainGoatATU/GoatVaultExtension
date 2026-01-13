export type AuthInitResponse = {
    _id: string;
    auth_salt: string;
    mfa_enabled: boolean;
}