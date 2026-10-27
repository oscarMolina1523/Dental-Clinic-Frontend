import type InventoryLoteModel from "../models/InventoryLote";

export const generateLoteNumber = (inventoryLotes: InventoryLoteModel[]) => {
    const maxNumber = inventoryLotes.reduce((max, lote) => {
        const match = String(lote.loteNumber).match(/^LOTE-(\d+)$/i);

        if (!match) return max;

        const number = Number(match[1]);

        return number > max ? number : max;
    }, 0);

    return `LOTE-${String(maxNumber + 1).padStart(3, "0")}`;
};
