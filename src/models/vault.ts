export type VaultModel = {
  vaultSalt?: string;
  nonce?: string;
  encryptedBlob?: string;
  authTag?: string;
}