export const getAge = (birthdate: string | Date): number => {
    const today = new Date();
    const birth = new Date(birthdate);

    let age = today.getFullYear() - birth.getFullYear();

    const hasHadBirthdayThisYear =
        today.getMonth() > birth.getMonth() ||
        (today.getMonth() === birth.getMonth() &&
            today.getDate() >= birth.getDate());

    if (!hasHadBirthdayThisYear) {
        age--;
    }

    return age;
};