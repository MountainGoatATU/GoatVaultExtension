import axios from "axios";
import type { AuthInitResponse } from "../models/authInitResponse";
import type { AuthVerifyResponse } from "../models/authVerifyResponse";
import * as argon2 from "argon2-browser";

export async function generateAuthVerifier(
  masterPassword: string,
  authSalt: string
): Promise<string> {
  const salt = Uint8Array.from(atob(authSalt), c => c.charCodeAt(0));

  const hash = await argon2.hash({
    pass: masterPassword,
    salt: salt,
    type: argon2.ArgonType.Argon2id, // Argon2id is equivalent to C# Argon2Type.DataIndependentAddressing
    time: 10,          // Time cost
    mem: 32768,        // Memory cost in KiB
    parallelism: 5,    // Number of lanes
    hashLen: 32,       // Hash length
  });

  // hash.hash is a Uint8Array; convert to Base64
  return btoa(String.fromCharCode(...hash.hash));
}

export async function verifyEmail(email: string) {
    try {
        // Axios throws for non-2xx responses
        const response = await axios.post<AuthInitResponse>("https://y9ok4f5yja.execute-api.eu-west-1.amazonaws.com/v1/auth/init", { email });
        console.log("VerifyEmail response:", response);

        const data = response.data;

        // Only return valid response
        if (data && data._id && data.authSalt && typeof data.mfaEnabled === 'boolean') {
            return data;
        }
        else{
            return null;
        }
    }
    catch (error) {
        console.error("Error verifying email:", error);
        throw error;
    }
}

export async function login(userId: string, authVerifier: string) {
    try {
        const response = await axios.post<AuthVerifyResponse>("https://y9ok4f5yja.execute-api.eu-west-1.amazonaws.com/v1/auth/verify", { userId, authVerifier });
        console.log("Login response:", response);
        return response.data;
    }
    catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}