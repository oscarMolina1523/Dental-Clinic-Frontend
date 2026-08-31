import BaseModel from "./BaseModel";

export default class Category extends BaseModel {
  name: string;

  constructor({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) {
    super(id);
    this.name = name;
  }
}

export interface CategoryDTO{
    name:string;
}