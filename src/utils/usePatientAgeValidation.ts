import { useMemo } from "react";

const MIN_AGE = 6; //edad minima a la que ya le salen los dientes permanentes, para poder hacer un tratamiento de ortodoncia
const MAX_AGE = 100; //edad maxima que puede tener un paciente, para evitar errores de digitación al ingresar la fecha de nacimiento

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const usePatientAgeValidation = () => {
    const dates = useMemo(() => {
        const today = new Date();

        const minBirthdate = new Date(
            today.getFullYear() - MAX_AGE,
            today.getMonth(),
            today.getDate()
        );

        const maxBirthdate = new Date(
            today.getFullYear() - MIN_AGE,
            today.getMonth(),
            today.getDate()
        );

        return {
            minBirthdate,
            maxBirthdate,
            minBirthdateString: formatDate(minBirthdate),
            maxBirthdateString: formatDate(maxBirthdate),
        };
    }, []);

    const validateBirthdate = (birthdate: string): boolean => {
        if (!birthdate) return false;

        const birthdateDate = new Date(`${birthdate}T00:00:00`);

        return (
            birthdateDate >= dates.minBirthdate &&
            birthdateDate <= dates.maxBirthdate
        );
    };

    return {
        minAge: MIN_AGE,
        maxAge: MAX_AGE,
        minBirthdate: dates.minBirthdateString,
        maxBirthdate: dates.maxBirthdateString,
        validateBirthdate,
    };
};