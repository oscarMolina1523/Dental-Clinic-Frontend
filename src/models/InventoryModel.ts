import BaseModel from "./BaseModel";

export default class Inventory extends BaseModel {
  productId: string;
  currentStock: number;
  minimumStock: number;

  constructor({
    id,
    productId,
    currentStock,
    minimumStock,
  }: {
    id: string;
    productId: string;
    currentStock: number;
    minimumStock: number;
  }) {
    super(id);
    this.productId = productId;
    this.currentStock = currentStock;
    this.minimumStock = minimumStock;
  }

}

export interface CreateInventoryDTO {
  productId: string;
  currentStock: number;
  minimumStock: number;
}

export interface UpdateInventoryDTO {
  minimumStock: number;
}