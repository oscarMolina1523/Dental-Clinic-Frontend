
export const validatePassword = (password: string): boolean => {
    const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S{8,}$/;

    return passwordRegex.test(password);
};
