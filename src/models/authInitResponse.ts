export type AuthInitResponse = {
    _id: string;
    authSalt: string;
    mfaEnabled: boolean;
}