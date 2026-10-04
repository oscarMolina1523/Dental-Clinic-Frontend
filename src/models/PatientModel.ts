import BaseModel from "./BaseModel";

export default class PatientModel extends BaseModel {
  patientCode: string;
  image: string;
  name: string;
  lastName: string;
  idCard: string;
  birthdate: Date;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  maritalStatus: string;
  active: boolean;
  isSelfPayer: boolean;
  payerName: string;
  payerIdCard: string;
  payerPhoneNumber: string;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    patientCode,
    image,
    name,
    lastName,
    idCard,
    birthdate,
    gender,
    phoneNumber,
    email,
    address,
    emergencyContactName,
    emergencyContactPhone,
    maritalStatus,
    active,
    isSelfPayer,
    payerName,
    payerIdCard,
    payerPhoneNumber,
    createdAt,
    updatedAt,
  }: {
    id: string;
    patientCode: string;
    image: string;
    name: string;
    lastName: string;
    idCard: string;
    birthdate: Date;
    gender: string;
    phoneNumber: string;
    email: string;
    address: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    maritalStatus: string;
    active: boolean;
    isSelfPayer: boolean;
    payerName: string;
    payerIdCard: string;
    payerPhoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super(id);
    this.patientCode = patientCode;
    this.image = image;
    this.name = name;
    this.lastName = lastName;
    this.idCard = idCard;
    this.birthdate = birthdate;
    this.gender = gender;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.address = address;
    this.emergencyContactName = emergencyContactName;
    this.emergencyContactPhone = emergencyContactPhone;
    this.maritalStatus = maritalStatus;
    this.active = active;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isSelfPayer = isSelfPayer;
    this.payerName = payerName;
    this.payerIdCard = payerIdCard;
    this.payerPhoneNumber = payerPhoneNumber;
  }

}

export interface CreatePatientDTO {
  image?: string;
  name: string;
  lastName: string;
  idCard: string;
  birthdate: Date;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  maritalStatus: string;
  isSelfPayer: boolean;
  payerName: string;
  payerIdCard: string;
  payerPhoneNumber: string;
}

export interface UpdatePatientDTO {
  name: string;
  lastName: string;
  birthdate: Date;
  gender: string;
  isSelfPayer: boolean;
  payerName: string;
  payerIdCard: string;
  payerPhoneNumber: string;
}

export interface UpdatePatientVariables {
  id: string;
  patient: UpdatePatientDTO;
}

export interface ChangePatientPhoneNumberVariables {
  id: string;
  phoneNumber: string;
}

export interface ChangePatientEmailVariables {
  id: string;
  email: string;
}

export interface ChangePatientAddressVariables {
  id: string;
  address: string;
}

export interface UpdateEmergencyContactVariables {
  id: string;
  name: string;
  phone: string;
}

export interface ChangePatientImageVariables {
  id: string;
  image: string;
}