export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  checks: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  const checks = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\\/?]/.test(password),
  };

  if (!checks.minLength) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!checks.hasUpperCase) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!checks.hasLowerCase) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!checks.hasNumber) {
    errors.push("Password must contain at least one number");
  }
  if (!checks.hasSpecialChar) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
    checks,
  };
}
