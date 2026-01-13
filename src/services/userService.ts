import axios from "axios";
import type { AuthInitResponse } from "../models/authInitResponse";
import type { AuthVerifyResponse } from "../models/authVerifyResponse";
import { hash } from "argon2-wasm";

export async function generateAuthVerifier(
  masterPassword: string,
  authSalt: string
): Promise<string> {
const saltBytes = Uint8Array.from(atob(authSalt), c => c.charCodeAt(0));

    const result = await hash({
        pass: masterPassword,
        salt: saltBytes,
        hashLen: 32,
        time: 10,
        mem: 32768,
        parallelism: 5,
        type: "id",
    });

  // hash.hash is a Uint8Array; convert to Base64
  return btoa(String.fromCharCode(...result.hash));
}

export async function verifyEmail(email: string) {
  try {
    const response = await axios.post<AuthInitResponse>("https://y9ok4f5yja.execute-api.eu-west-1.amazonaws.com/v1/auth/init", { email });

    const data =response.data;

    if(data && data._id && data.auth_salt && typeof data.mfa_enabled === 'boolean') {
      return data;
    }
    else{
      return null;
    }
  } 
  catch (error) {
    console.error("Error during email verification:", error);
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