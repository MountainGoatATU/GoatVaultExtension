import axios from "axios";
import type { AuthInitResponse } from "../models/authInitResponse";
import type { AuthVerifyResponse } from "../models/authVerifyResponse";
import argon2 from "argon2-browser";

export async function generateAuthVerifier(
  masterPassword: string,
  authSaltBase64: string
): Promise<string> {
  // Convert base64 salt to Uint8Array (handle both standard and URL-safe base64)
  let saltBase64Clean = authSaltBase64.trim();
  
  // Add padding if needed
  while (saltBase64Clean.length % 4) {
    saltBase64Clean += '=';
  }
  
  // Convert URL-safe base64 to standard base64
  saltBase64Clean = saltBase64Clean.replace(/-/g, '+').replace(/_/g, '/');
  
  try {
    const saltBinary = atob(saltBase64Clean);
    const salt = new Uint8Array(saltBinary.length);
    for (let i = 0; i < saltBinary.length; i++) {
      salt[i] = saltBinary.charCodeAt(i);
    }

    // Hash with argon2-browser
    const result = await argon2.hash({
      pass: masterPassword,
      salt: salt,
      type: argon2.ArgonType.Argon2id,
      hashLen: 32,
      time: 10,
      mem: 32768,
      parallelism: 5,
    });

    // Convert hash to base64
    const hashArray = new Uint8Array(result.hash);
    let binary = '';
    for (let i = 0; i < hashArray.length; i++) {
      binary += String.fromCharCode(hashArray[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error('Error decoding salt:', error);
    console.error('Salt value:', authSaltBase64);
    throw new Error('Invalid salt format received from server');
  }
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

