import BaseModel from "./BaseModel";

export default class SupplierModel extends BaseModel {
    name: string;
    contact: string;
    phone: string;
    email: string;

    constructor({
        id,
        name,
        contact,
        phone,
        email,
    }: {
        id: string;
        name: string;
        contact: string;
        phone: string;
        email: string;
    }) {
        super(id);
        this.name = name;
        this.contact = contact;
        this.phone = phone;
        this.email = email;
    }
}

export interface SupplierDTO {
    name: string;
    contact: string;
    phone: string;
    email: string;
}