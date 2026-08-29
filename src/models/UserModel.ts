import BaseModel from "./BaseModel";

export default class User extends BaseModel {
  roleId: string;
  fullName: string;
  image: string;
  email: string;
  password: string;
  phoneNumber: string;
  membershipNumber?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    id,
    roleId,
    fullName,
    image,
    email,
    password,
    phoneNumber,
    membershipNumber,
    active,
    createdAt,
    updatedAt,
  }: {
    id: string;
    roleId: string;
    fullName: string;
    image: string;
    email: string;
    password: string;
    phoneNumber: string;
    membershipNumber?: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(id);
    this.roleId = roleId;
    this.fullName = fullName;
    this.image = image;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.membershipNumber = membershipNumber;
    this.active = active;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

}

export interface CreateUserDTO {
  roleId?: string; //el backend le da el role de viewer por default
  fullName: string;
  image?: string;
  email: string;
  password: string;
  phoneNumber: string;
  membershipNumber?: string;
  active?: boolean;
}

export interface UpdateUserDTO {
  fullName?: string;
  image?: string;
  phoneNumber: string;
  membershipNumber?: string;
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