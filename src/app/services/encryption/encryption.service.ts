// @ts-nocheck
import { Injectable } from '@angular/core';

export class aesEncryptionMethod {

    constructor() { }

    // Function to convert a UTF-8 string to an ArrayBuffer
    private stringToArrayBuffer(str: string): ArrayBuffer {
        return new TextEncoder().encode(str);
    }

    // Function to convert an ArrayBuffer to a base64 string
    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        const uint8Array = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return btoa(binary);
    }

    /**
      * this is common method to encrypt any object/json object using AES-GCM method
     */

    // Function to encrypt data
    async encryptData(data: any, key: CryptoKey): Promise<any> {
        const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate random IV
        const encodedData = this.stringToArrayBuffer(JSON.stringify(data));
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encodedData
        );

        // Convert the ArrayBuffer to a Uint8Array
        const encryptedArray = new Uint8Array(encryptedData);

        // Extract the ciphertext and the authentication tag
        const cipherText = encryptedArray.slice(0, encryptedArray.length - 16);
        const authTag = encryptedArray.slice(encryptedArray.length - 16);

        return {
            iv: this.arrayBufferToBase64(iv),
            data: this.arrayBufferToBase64(cipherText),
            authTag: this.arrayBufferToBase64(authTag),
            key: this.arrayBufferToBase64(await crypto.subtle.exportKey('raw', key)) // Export the key for server decryption
        };
    }

    async aesGenerateKey(): Promise<CryptoKey> {
        return await crypto.subtle.generateKey(
            {
                name: 'AES-GCM',
                length: 256
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    // Function to encrypt data
    async aesEncryptData(data: any, key: CryptoKey): Promise<any> {
        const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate random IV
        const encodedData = this.stringToArrayBuffer(JSON.stringify(data));
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encodedData
        );

        // Convert the ArrayBuffer to a Uint8Array
        const encryptedArray = new Uint8Array(encryptedData);

        // Extract the ciphertext and the authentication tag
        const cipherText = encryptedArray.slice(0, encryptedArray.length - 16);
        const authTag = encryptedArray.slice(encryptedArray.length - 16);

        return {  // format - data-iv-authTag-key
            data: `${this.arrayBufferToBase64(cipherText)}#&${this.arrayBufferToBase64(iv)}#&${this.arrayBufferToBase64(authTag)}#&${this.arrayBufferToBase64(await crypto.subtle.exportKey('raw', key))}`,
            isEncryption: true,
        };
    }

    // Function to decrypt data

    base64ToArrayBuffer(base64: string): Uint8Array {
        const binaryString = atob(base64);
        const length = binaryString.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    async importKey(keyData: Uint8Array): Promise<CryptoKey> {
        return await crypto.subtle.importKey(
            "raw", // Raw format
            keyData,
            { name: "AES-GCM" },
            true, // Extractable
            ["decrypt"] // Key usage
        );
    }

    async decryptData(encryptedText: any): Promise<any> {
        try {
            const encryptedData = encryptedText?.data?.split('#&');
            if (encryptedData.length !== 4) {
                throw new Error('Invalid encrypted data format');
            }

            const dataBuffer = this.base64ToArrayBuffer(encryptedData[0]);
            const ivBuffer = this.base64ToArrayBuffer(encryptedData[1]);
            const authTagBuffer = this.base64ToArrayBuffer(encryptedData[2]);
            const keyBuffer = this.base64ToArrayBuffer(encryptedData[3]);

            const key = await this.importKey(keyBuffer);

            const encryptedArray = new Uint8Array(dataBuffer.length + authTagBuffer.length);
            encryptedArray.set(dataBuffer, 0);
            encryptedArray.set(authTagBuffer, dataBuffer.length);

            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: ivBuffer },
                key,
                encryptedArray
            );

            const decodedData = new TextDecoder().decode(decrypted);
            return JSON.parse(decodedData);
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    private aesEncryption = new aesEncryptionMethod();

    constructor() { }

    async encryptAndLog(data: any): Promise<any> {
        const key = await this.aesEncryption.aesGenerateKey();
        const encrypted = await this.aesEncryption.aesEncryptData(data, key);

        const decrypted = await this.aesEncryption.decryptData(encrypted);

        return encrypted;
    }

    async decrypt(encryptedData: any): Promise<any> {
        const decrypted = await this.aesEncryption.decryptData(encryptedData);
        return decrypted;
    }
}
