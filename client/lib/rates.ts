export type MaterialKey = "sgIron" | "en8" | "p20" | "hds";

export interface RateSet {
  sgIron: number;
  en8: number;
  p20: number;
  hds: number;
  machining: number;
  heatTreatment: number;
  assembly: number;
}

export const DEFAULT_RATES: RateSet = {
  sgIron: 150,
  en8: 120,
  p20: 0,
  hds: 500,
  machining: 600,
  heatTreatment: 250,
  assembly: 400,
};

export const MATERIAL_OPTIONS: { key: MaterialKey; label: string }[] = [
  { key: "sgIron", label: "SG Iron" },
  { key: "en8", label: "EN8" },
  { key: "p20", label: "P20" },
  { key: "hds", label: "HDS" },
];

export interface RateFieldMeta {
  key: keyof RateSet;
  label: string;
  unit: string;
}

export const RATE_FIELDS: RateFieldMeta[] = [
  { key: "sgIron", label: "SG Iron", unit: "/kg" },
  { key: "en8", label: "EN8", unit: "/kg" },
  { key: "p20", label: "P20", unit: "/kg" },
  { key: "hds", label: "HDS", unit: "/kg" },
  { key: "machining", label: "Machining", unit: "/hr" },
  { key: "heatTreatment", label: "Heat Treatment", unit: "/hr" },
  { key: "assembly", label: "Assembly", unit: "/hr" },
];

export function materialLabel(key: MaterialKey): string {
  return MATERIAL_OPTIONS.find((m) => m.key === key)?.label ?? key;
}
