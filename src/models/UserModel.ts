import BaseModel from "./BaseModel";

export default class User extends BaseModel {
  roleId: string;
  fullName: string;
  userName: string;
  image: string;
  email: string;
  password: string;
  phoneNumber: string;
  membershipNumber?: string;
  specialties: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    id,
    roleId,
    fullName,
    userName,
    image,
    email,
    password,
    phoneNumber,
    membershipNumber,
    specialties,
    active,
    createdAt,
    updatedAt,
  }: {
    id: string;
    roleId: string;
    fullName: string;
    userName: string;
    image: string;
    email: string;
    password: string;
    phoneNumber: string;
    membershipNumber?: string;
    specialties: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(id);
    this.roleId = roleId;
    this.fullName = fullName;
    this.userName = userName;
    this.image = image;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.membershipNumber = membershipNumber;
    this.active = active;
    this.specialties = specialties;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

}

export interface CreateUserDTO {
  roleId?: string; //el backend le da el role de viewer por default
  fullName: string;
  userName: string;
  image?: string;
  email: string;
  password: string;
  phoneNumber: string;
  membershipNumber?: string;
  active?: boolean;
}

export interface UpdateUserDTO {
  fullName?: string;
  userName?: string;
  image?: string;
  phoneNumber: string;
  membershipNumber?: string;
  specialties?: string;
};

export interface ChangeEmailVariables {
  id: string;
  email: string;
}

export interface ChangePhoneNumberVariables {
  id: string;
  phoneNumber: string;
}

export interface ChangePasswordVariables {
  id: string;
  currentPassword: string;
  newPassword: string;
}

export interface ChangeRoleVariables {
  id: string;
  roleId: string;
}