// Validation utilities

export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length === 10;
  },

  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8 || password.length > 16) {
      errors.push("Password must be 8-16 characters");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Must contain at least one special character");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  pin: (pin: string): boolean => {
    return /^\d{4}$/.test(pin);
  },

  rollNo: (rollNo: string): boolean => {
    return rollNo.trim().length > 0;
  },

  name: (name: string): boolean => {
    return name.trim().length >= 2;
  },

  required: (value: any): boolean => {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  percentage: (value: number): boolean => {
    return value >= 0 && value <= 100;
  },

  time: (time: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  },
};

export function validateStudent(student: any): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!validators.name(student.name || "")) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!validators.rollNo(student.rollNo || "")) {
    errors.rollNo = "Roll number is required";
  }

  if (!validators.required(student.regNo)) {
    errors.regNo = "Registration number is required";
  }

  if (student.phone && !validators.phone(student.phone)) {
    errors.phone = "Invalid phone number (10 digits required)";
  }

  if (student.email && !validators.email(student.email)) {
    errors.email = "Invalid email address";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
