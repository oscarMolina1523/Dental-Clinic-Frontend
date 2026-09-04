import BaseModel from "./BaseModel";
export default class InventoryLoteModel extends BaseModel {
    productId: string;
    productName: string;
    supplierId: string;
    loteNumber: string;
    quantity: number;
    dueDate?: Date;
    entryDate: Date;

    constructor({
        id,
        productId,
        productName,
        supplierId,
        loteNumber,
        quantity,
        dueDate,
        entryDate,
    }: {
        id: string;
        productId: string;
        productName: string;
        supplierId: string;
        loteNumber: string;
        quantity: number;
        dueDate?: Date;
        entryDate: Date;
    }) {
        super(id);
        this.productId = productId;
        this.productName = productName;
        this.supplierId = supplierId;
        this.loteNumber = loteNumber;
        this.quantity = quantity;
        this.dueDate = dueDate;
        this.entryDate = entryDate;
    }

}