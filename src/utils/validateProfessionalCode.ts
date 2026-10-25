export const validateProfessionalCode = (code: string): boolean => {
  return /^\d{3,5}$/.test(code.trim());
};