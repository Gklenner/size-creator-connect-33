// Security utilities and validation
export class SecurityValidator {
  // Email validation with enhanced security
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Password strength validation
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Mínimo 8 caracteres');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Pelo menos uma letra minúscula');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Pelo menos uma letra maiúscula');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Pelo menos um número');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('Pelo menos um caractere especial');

    if (password.length >= 12) score += 1;

    return {
      isValid: score >= 4,
      score,
      feedback
    };
  }

  // XSS prevention
  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // SQL injection prevention (basic)
  static sanitizeSQL(input: string): string {
    const sqlKeywords = [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE',
      'ALTER', 'EXEC', 'UNION', 'SCRIPT', 'JAVASCRIPT'
    ];
    
    let sanitized = input;
    sqlKeywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      sanitized = sanitized.replace(regex, '');
    });
    
    return sanitized;
  }

  // File upload validation
  static validateFileUpload(file: File): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'text/plain'
    ];

    if (file.size > maxSize) {
      errors.push('Arquivo muito grande (máximo 10MB)');
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('Tipo de arquivo não permitido');
    }

    // Check for malicious filenames
    if (/[<>:"/\\|?*]/.test(file.name)) {
      errors.push('Nome do arquivo contém caracteres inválidos');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // CSRF token generation
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Content Security Policy helpers
export class CSPManager {
  static getCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.dicebear.com",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join('; ');
  }
}

// Environment validation
export class EnvironmentValidator {
  static validateEnvironment(): {
    isProduction: boolean;
    missingVars: string[];
    warnings: string[];
  } {
    const requiredVars = [
      'VITE_APP_TITLE',
      'VITE_APP_VERSION'
    ];

    const missingVars = requiredVars.filter(
      varName => !import.meta.env[varName]
    );

    const warnings: string[] = [];
    
    if (import.meta.env.DEV && !import.meta.env.VITE_DEV_TOOLS) {
      warnings.push('Dev tools não configurados');
    }

    return {
      isProduction: import.meta.env.PROD,
      missingVars,
      warnings
    };
  }
}