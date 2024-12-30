import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto';

export class E2EEncryption {
    private static readonly ALGORITHM = 'AES-GCM';
    private static readonly KEY_LENGTH = 256;
    private static readonly SALT_LENGTH = 16;
    private static readonly IV_LENGTH = 12;

    static async generateRandomBytes(length: number): Promise<Uint8Array> {
        const bytes = await Crypto.getRandomBytesAsync(length);
        return new Uint8Array(bytes);
    }

    static async generateKey(): Promise<string> {
        const key = await this.generateRandomBytes(this.KEY_LENGTH / 8);
        return Buffer.from(key).toString('base64');
    }

    static async encryptMessage(message: string, key: string): Promise<string> {
        try {
            // Convert base64 key back to bytes
            const keyBytes = Buffer.from(key, 'base64');
            
            // Generate IV
            const iv = await this.generateRandomBytes(this.IV_LENGTH);
            
            // Convert message to bytes
            const messageBytes = new TextEncoder().encode(message);
            
            // Generate encryption key
            const digest = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                key,
                { encoding: Crypto.CryptoEncoding.BASE64 }
            );
            
            // Combine IV and encrypted data
            const encrypted = await this.aesEncrypt(messageBytes, keyBytes, iv);
            const combined = new Uint8Array(iv.length + encrypted.length);
            combined.set(iv);
            combined.set(encrypted, iv.length);
            
            return Buffer.from(combined).toString('base64');
        } catch (err: unknown) {
            const error = err as Error;
            throw new Error(`Failed to encrypt message: ${error.message}`);
        }
    }

    static async decryptMessage(encryptedMessage: string, key: string): Promise<string> {
        try {
            // Convert base64 key back to bytes
            const keyBytes = Buffer.from(key, 'base64');
            
            // Split IV and encrypted data
            const combined = Buffer.from(encryptedMessage, 'base64');
            const iv = combined.slice(0, this.IV_LENGTH);
            const encrypted = combined.slice(this.IV_LENGTH);
            
            // Generate decryption key
            const digest = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                key,
                { encoding: Crypto.CryptoEncoding.BASE64 }
            );
            
            // Decrypt
            const decrypted = await this.aesDecrypt(encrypted, keyBytes, iv);
            return new TextDecoder().decode(decrypted);
        } catch (err: unknown) {
            const error = err as Error;
            throw new Error(`Failed to decrypt message: ${error.message}`);
        }
    }

    private static async aesEncrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Promise<Uint8Array> {
        // Implementation note: Since expo-crypto doesn't provide direct AES encryption,
        // we're using a combination of SHA-256 for key derivation and XOR for encryption
        // This is a simplified implementation and should be replaced with proper AES-GCM
        // when available in expo-crypto or when using a different crypto library
        const keyString = Buffer.from(key).toString('base64');
        const keyHash = Buffer.from(
            await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                keyString,
                { encoding: Crypto.CryptoEncoding.BASE64 }
            ),
            'base64'
        );
        
        const result = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            result[i] = data[i] ^ keyHash[i % keyHash.length] ^ iv[i % iv.length];
        }
        
        return result;
    }

    private static async aesDecrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Promise<Uint8Array> {
        // Decryption is the same operation as encryption in this implementation
        return this.aesEncrypt(data, key, iv);
    }
}
