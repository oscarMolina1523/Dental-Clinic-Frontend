import BaseModel from "./BaseModel";

export default class PatientAttachment extends BaseModel {
  clinicalProgressId: string;
  patientId: string;
  fileType: string;
  fileUrl: string;
  fileName: string;
  description: string;
  uploadedBy: string;
  createdAt: string;

  constructor({
    id,
    clinicalProgressId,
    patientId,
    fileType,
    fileUrl,
    fileName,
    description,
    uploadedBy,
    createdAt,
  }: {
    id: string;
    clinicalProgressId: string;
    patientId: string;
    fileType: string;
    fileUrl: string;
    fileName: string;
    description: string;
    uploadedBy: string;
    createdAt: string;
  }) {
    super(id);
    this.clinicalProgressId = clinicalProgressId;
    this.patientId = patientId;
    this.fileType = fileType;
    this.fileUrl = fileUrl;
    this.fileName = fileName;
    this.description = description;
    this.uploadedBy = uploadedBy;
    this.createdAt = createdAt;
  }
}

export interface PatientAttachmentDto {
  clinicalProgressId: string;
  patientId: string;
  fileType: string;
  fileUrl: string;
  fileName: string;
  description: string;
  uploadedBy: string;
  createdAt: string;
}
