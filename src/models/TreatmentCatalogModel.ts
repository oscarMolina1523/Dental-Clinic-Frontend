import BaseModel from "./BaseModel";

export default class TreatmentCatalogModel extends BaseModel {
  code: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDurationMinutes: number;
  active: boolean;

  constructor({
    id,
    code,
    name,
    description,
    basePrice,
    estimatedDurationMinutes,
    active,
  }: {
    id: string;
    code: string;
    name: string;
    description: string;
    basePrice: number;
    estimatedDurationMinutes: number;
    active: boolean;
  }) {
    super(id);
    this.code = code;
    this.name = name;
    this.description = description;
    this.basePrice = basePrice;
    this.estimatedDurationMinutes = estimatedDurationMinutes;
    this.active = active;
  }
}