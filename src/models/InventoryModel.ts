import BaseModel from "./BaseModel";

export default class Inventory extends BaseModel {
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;

  constructor({
    id,
    productId,
    productName,
    currentStock,
    minimumStock,
  }: {
    id: string;
    productId: string;
    productName: string;
    currentStock: number;
    minimumStock: number;
  }) {
    super(id);
    this.productId = productId;
    this.productName = productName;
    this.currentStock = currentStock;
    this.minimumStock = minimumStock;
  }

}

export interface CreateInventoryDTO {
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
}

export interface UpdateInventoryDTO {
  minimumStock: number;
}