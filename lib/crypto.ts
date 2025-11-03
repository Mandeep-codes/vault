// This is used in client components. We use crypto-js for AES (simple for MVP).
import * as CryptoJS from "crypto-js";

/**
 * NOTE: In production, derive SECRET_KEY from user's master password on client.
 * For MVP we assume a session key (temp) - replace with PBKDF2/WebCrypto later.
 */
export function encryptData(plaintext: string, key = "temp_demo_key") {
  return CryptoJS.AES.encrypt(plaintext, key).toString();
}

export function decryptData(ciphertext: string, key = "temp_demo_key") {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return "";
  }
}

