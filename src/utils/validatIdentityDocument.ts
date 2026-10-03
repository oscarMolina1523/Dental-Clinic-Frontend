export const validateIdentityDocument = (value: string): boolean => {
    const document = value.trim().toUpperCase();

    // Cédula nicaragüense: 000-000000-0000A
    const cedulaRegex = /^\d{3}-\d{6}-\d{4}[A-Z]$/;

    // Pasaporte: letras y números, entre 6 y 20 caracteres
    const passportRegex = /^[A-Z0-9]{6,20}$/;

    return cedulaRegex.test(document) || passportRegex.test(document);
};