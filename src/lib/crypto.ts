import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

// Password hashing utilities
export class PasswordManager {
  private static readonly SALT_ROUNDS = 12;

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verify(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

// Data encryption utilities
export class DataEncryption {
  private static readonly SECRET_KEY = 'size-platform-secret-2024';

  static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
  }

  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
  }

  static encryptObject<T>(obj: T): string {
    return this.encrypt(JSON.stringify(obj));
  }

  static decryptObject<T>(encryptedData: string): T | null {
    try {
      const decrypted = this.decrypt(encryptedData);
      return decrypted ? JSON.parse(decrypted) : null;
    } catch {
      return null;
    }
  }
}

// Secure session management
export class SessionManager {
  private static readonly SESSION_KEY = 'size_secure_session';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static createSession(userId: string): string {
    const sessionData = {
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.SESSION_DURATION,
      sessionId: this.generateSessionId()
    };
    
    const encryptedSession = DataEncryption.encryptObject(sessionData);
    localStorage.setItem(this.SESSION_KEY, encryptedSession);
    return sessionData.sessionId;
  }

  static validateSession(): string | null {
    const encryptedSession = localStorage.getItem(this.SESSION_KEY);
    if (!encryptedSession) return null;

    const sessionData = DataEncryption.decryptObject<{
      userId: string;
      createdAt: number;
      expiresAt: number;
      sessionId: string;
    }>(encryptedSession);

    if (!sessionData || Date.now() > sessionData.expiresAt) {
      this.clearSession();
      return null;
    }

    return sessionData.userId;
  }

  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  private static generateSessionId(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }
}

// Rate limiting utilities
export class RateLimiter {
  private static readonly ATTEMPT_KEY = 'size_auth_attempts';
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  static checkRateLimit(identifier: string): { allowed: boolean; remainingTime?: number } {
    const attempts = this.getAttempts(identifier);
    const now = Date.now();

    // Clean old attempts
    const recentAttempts = attempts.filter(attempt => 
      now - attempt < this.LOCKOUT_DURATION
    );

    if (recentAttempts.length >= this.MAX_ATTEMPTS) {
      const oldestAttempt = Math.min(...recentAttempts);
      const remainingTime = this.LOCKOUT_DURATION - (now - oldestAttempt);
      return { allowed: false, remainingTime };
    }

    return { allowed: true };
  }

  static recordAttempt(identifier: string): void {
    const attempts = this.getAttempts(identifier);
    attempts.push(Date.now());
    
    const encrypted = DataEncryption.encryptObject(attempts);
    localStorage.setItem(`${this.ATTEMPT_KEY}_${identifier}`, encrypted);
  }

  static clearAttempts(identifier: string): void {
    localStorage.removeItem(`${this.ATTEMPT_KEY}_${identifier}`);
  }

  private static getAttempts(identifier: string): number[] {
    const encrypted = localStorage.getItem(`${this.ATTEMPT_KEY}_${identifier}`);
    if (!encrypted) return [];
    
    return DataEncryption.decryptObject<number[]>(encrypted) || [];
  }
}