import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

export class CredentialEncryptionService {
  private key() {
    if (!process.env.APP_ENCRYPTION_KEY) throw new Error('APP_ENCRYPTION_KEY belum dikonfigurasi.');
    return createHash('sha256').update(process.env.APP_ENCRYPTION_KEY).digest();
  }
  encrypt(value: string) {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key(), iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    return [iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), encrypted.toString('base64url')].join('.');
  }
  decrypt(value: string) {
    const [iv, tag, encrypted] = value.split('.');
    if (!iv || !tag || !encrypted) throw new Error('Credential terenkripsi tidak valid.');
    const decipher = createDecipheriv('aes-256-gcm', this.key(), Buffer.from(iv, 'base64url'));
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64url')), decipher.final()]).toString('utf8');
  }
}
