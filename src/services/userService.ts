import axios from "axios";
import type { AuthInitResponse } from "../models/authInitResponse";
import type { AuthVerifyResponse } from "../models/authVerifyResponse";
import { hash } from "argon2-wasm";

export async function generateAuthVerifier(
  masterPassword: string,
  authSaltBase64: string
): Promise<string> {

  const salt = Uint8Array.from(
    atob(authSaltBase64),
    c => c.charCodeAt(0)
  );

  await new Promise(requestAnimationFrame);

  const result = await hash({
    pass: masterPassword,
    salt,
    hashLen: 32,
    time: 10,
    mem: 32768,
    parallelism: 5,
    type: "id", // Argon2id == C# DataIndependentAddressing
  });

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

export async function login(_id: string, auth_verifier: string) {
  alert("Logging in with UserID: " + _id + " and AuthVerifier: " + auth_verifier); // For debugging purposes
    try {
        const response = await axios.post<AuthVerifyResponse>("https://y9ok4f5yja.execute-api.eu-west-1.amazonaws.com/v1/auth/verify", {
           _id, 
           auth_verifier 
          }
        );
        alert("Login Response: " + JSON.stringify(response)); // For debugging purposes
        return response.data;
    }
    catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}