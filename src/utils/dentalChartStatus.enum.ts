export type DentalChartDetailsStatus =
  | "HEALTHY"
  | "CARIES"
  | "FILLED"
  | "FRACTURED"
  | "WORN"
  | "MISSING"
  | "EXTRACTED"
  | "ROOT_CANAL_TREATED"
  | "CROWN"
  | "IMPLANT"
  | "BRIDGE"
  | "PROSTHETIC"
  | "IMPACTED"
  | "MOBILE"
  | "INFECTED"
  | "ABSCESS"
  | "PERIODONTAL_AFFECTATION"
  | "SENSITIVITY"
  | "DISCOLORATION"
  | "DEVELOPMENTAL_ANOMALY"
  | "OTHER";


export const dentalChartStatusSpanishOptions: {
    value: DentalChartDetailsStatus;
    label: string;
}[] = [
    { value: "HEALTHY", label: "Sano" },
    { value: "CARIES", label: "Caries" },
    { value: "FILLED", label: "Obturado" },
    { value: "FRACTURED", label: "Fracturado" },
    { value: "WORN", label: "Desgastado" },
    { value: "MISSING", label: "Ausente" },
    { value: "EXTRACTED", label: "Extraído" },
    { value: "ROOT_CANAL_TREATED", label: "Tratamiento de conducto" },
    { value: "CROWN", label: "Corona" },
    { value: "IMPLANT", label: "Implante" },
    { value: "BRIDGE", label: "Puente" },
    { value: "PROSTHETIC", label: "Prótesis" },
    { value: "IMPACTED", label: "Impactado" },
    { value: "MOBILE", label: "Móvil" },
    { value: "INFECTED", label: "Infectado" },
    { value: "ABSCESS", label: "Absceso" },
    {
        value: "PERIODONTAL_AFFECTATION",
        label: "Afectación periodontal",
    },
    { value: "SENSITIVITY", label: "Sensibilidad" },
    { value: "DISCOLORATION", label: "Decoloración" },
    {
        value: "DEVELOPMENTAL_ANOMALY",
        label: "Anomalía del desarrollo",
    },
    { value: "OTHER", label: "Otro" },
];