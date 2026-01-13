import type { VaultModel } from "./vault";

export type AuthVerifyResponse = {
    accessToken: string;
    vault: VaultModel;
    tokenType: string;
};