/**
 * Validation Module - Barrel Export
 *
 * Centralized exports for validation utilities.
 * Usage: import { formatZodErrors, ValidationMessages } from "@/lib/validation"
 */

export {
  formatZodErrors,
  getFirstError,
  hasErrors,
  getFieldError,
  validateOnBlur,
  clearFieldErrors,
  ValidationMessages,
  validatePhone,
  validateEmail,
  validatePassword,
  validateSlug,
  uniqueCheck,
  debounceValidation,
} from "./form";
