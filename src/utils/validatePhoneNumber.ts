export const validatePhoneNumber = (phone: string): boolean => {
    const value = phone.trim();

    // Permite:
    // 88887777
    // +50588887777
    // +505 88887777
    // +1 2025551234
    const phoneRegex = /^\+?[0-9]+(?:\s[0-9]+)*$/;

    if (!phoneRegex.test(value)) {
        return false;
    }

    // Quitamos espacios y el signo + para validar la cantidad de dígitos
    const digits = value.replace(/\D/g, "");

    // Mínimo 8 dígitos, máximo 15 según el estándar internacional E.164
    return digits.length >= 8 && digits.length <= 15;
};