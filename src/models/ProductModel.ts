import BaseModel from "./BaseModel";

export default class ProductModel extends BaseModel {
  barcode?: string;
  name: string;
  description?: string;
  category_id: string;
  measurement_unit_id: string;
  hasExpiration?: boolean;

  constructor({
    id,
    barcode,
    name,
    description,
    category_id,
    measurement_unit_id,
    hasExpiration
  }: {
    id: string;
    barcode?: string;
    name: string;
    description?: string;
    category_id: string;
    measurement_unit_id: string;
    hasExpiration?: boolean;
  }) {
    super(id);
    this.barcode = barcode;
    this.name = name;
    this.description = description;
    this.category_id = category_id;
    this.measurement_unit_id = measurement_unit_id;
    this.hasExpiration = hasExpiration;
  }
}

export interface ProductDTO {
  barcode?: string;
  name: string;
  description?: string;
  category_id: string;
  measurement_unit_id: string;
  hasExpiration?: boolean;
}
