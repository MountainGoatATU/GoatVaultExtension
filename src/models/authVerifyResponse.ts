import type { VaultModel } from "./vault";

export type AuthVerifyResponse = {
    access_token: string;
    vault: VaultModel;
    token_type: string;
};