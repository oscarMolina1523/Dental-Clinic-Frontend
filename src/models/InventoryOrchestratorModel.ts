import type { InventoryMovementStatus } from "../utils/InventoryMovementStatus.enum";

export interface CreateInventoryOrchestratorRequest {
    productId: string;
    supplierId: string;
    loteNumber: string;
    quantity: number;
    dueDate?: Date;
    entryDate: Date;
    userId: string;
    observation: string;
}

export interface UpdateAmountInventoryOrchestratorRequest {
    quantity: number;
    userId: string;
    observation?: string;
}

export interface ExpireInventoryOrchestratorLoteRequest {
    userId: string;
    observation?: string;
}

export interface InventoryOrchestratorResponse {
    inventory: InventoryMinimumDataModel;
    lote: InventoryLoteMinimumDataModel;
    movement: InventoryMovementMinimumDataModel;
}

//ESTOS MODELOS SON INTERNOS , NO SON LOS ESTANDAR PARA USAR EN LA APP
//SINO EL FORMATO DE RESPUESTA QUE DEVUELVE EL BACKEND
interface InventoryMinimumDataModel {
    id: string;
    productId: string;
    minimumStock: number;
}

interface InventoryLoteMinimumDataModel {
    id: string;
    productId: string;
    supplierId: string;
    loteNumber: string;
    quantity: number;
    dueDate: Date;
    entryDate: Date;
}

interface InventoryMovementMinimumDataModel {
    id: string;
    productId: string;
    type: InventoryMovementStatus;
    quantity: number;
    userId: string;
    observation: string;
}