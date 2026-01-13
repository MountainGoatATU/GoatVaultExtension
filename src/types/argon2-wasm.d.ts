declare module "argon2-wasm" {
    export type Argon2Type = "i" | "id" | "d";

    export interface HashOptions {
        pass: string;
        salt: Uint8Array;
        hashLen?: number;
        time?: number;
        mem?: number;
        parallelism?: number;
        type?: Argon2Type;
    }

    export interface HashResult {
        hash: Uint8Array;
    }

    export function hash(options: HashOptions): Promise<HashResult>;
}