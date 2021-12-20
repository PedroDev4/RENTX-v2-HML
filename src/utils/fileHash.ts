import crypto from 'crypto';

export function hashFile(filename: string): string {
    const fileHash = crypto.randomBytes(10).toString('hex');
    return `${fileHash}-${filename}`;
}