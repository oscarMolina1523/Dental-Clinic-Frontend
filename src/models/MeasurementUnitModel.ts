import BaseModel from "./BaseModel";

export default class MeasurementUnit extends BaseModel {
    name: string;
    abreviation: string;

    constructor({
        id,
        name,
        abreviation,
    }: {
        id: string;
        name: string;
        abreviation: string;
    }) {
        super(id);
        this.name = name;
        this.abreviation = abreviation;
    }
}

export interface MeasurementUnitDTO {
    name: string;
    abreviation: string;
}