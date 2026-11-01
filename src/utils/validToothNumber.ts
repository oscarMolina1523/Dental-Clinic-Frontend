export const isValidToothNumber = (toothNumber: number): boolean => {
  const validTeeth = [
    //la doctora nos dijo que trabaja con los dientes del 11 al 48, por lo que solo esos son válidos
    //no lo toquen esto
    // Cuadrante 1: Superior derecho
    11, 12, 13, 14, 15, 16, 17, 18,

    // Cuadrante 2: Superior izquierdo
    21, 22, 23, 24, 25, 26, 27, 28,

    // Cuadrante 3: Inferior izquierdo
    31, 32, 33, 34, 35, 36, 37, 38,

    // Cuadrante 4: Inferior derecho
    41, 42, 43, 44, 45, 46, 47, 48,
  ];

  return validTeeth.includes(toothNumber);
};