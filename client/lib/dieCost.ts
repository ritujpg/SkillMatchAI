import { MaterialKey, RateSet } from "./rates";

export interface PartDetails {
  drawingNumber: string;
  partName: string;
  qtyPerAnnum: number;
  length: number;
  width: number;
  height: number;
}

export const EMPTY_PART: PartDetails = {
  drawingNumber: "",
  partName: "",
  qtyPerAnnum: 0,
  length: 0,
  width: 0,
  height: 0,
};

export interface DieInsertResult {
  length: number;
  width: number;
  height: number;
  material: MaterialKey;
  materialRate: number;
  materialWeight: number;
  materialCost: number;
}

export interface ManufacturingResult {
  miscWeight: number;
  miscCost: number;
  standardPartCost: number;
  machiningHours: number;
  machiningRate: number;
  machiningCost: number;
  heatTreatmentHours: number;
  heatTreatmentRate: number;
  heatTreatmentCost: number;
  assemblyHours: number;
  assemblyRate: number;
  assemblyCost: number;
}

export interface SandCoreBoxResult {
  length: number;
  width: number;
  height: number;
  material: MaterialKey;
  rate: number;
  weight: number;
  cost: number;
}

export interface CostSummary {
  dieMaterialCost: number;
  miscellaneousCost: number;
  standardPartCost: number;
  machiningCost: number;
  heatTreatmentCost: number;
  assemblyCost: number;
  sandCoreBoxCost: number;
  subtotal: number;
  overhead: number;
  total: number;
}

export interface DieCostResult {
  dieInsert: DieInsertResult;
  manufacturing: ManufacturingResult;
  sandCoreBox: SandCoreBoxResult;
  summary: CostSummary;
}

const OVERHEAD_RATE = 0.15;

function volumetricWeight(length: number, width: number, height: number) {
  return (length * width * height * 7.81) / 1_000_000;
}

export function calculateDieCost(
  part: PartDetails,
  rates: RateSet,
  dieMaterial: MaterialKey,
  sandMaterial: MaterialKey,
): DieCostResult {
  const dieLength = part.length + 150;
  const dieWidth = part.width + 150;
  const dieHeight = part.height + 50;
  const dieMaterialRate = rates[dieMaterial];
  const dieMaterialWeight = volumetricWeight(dieLength, dieWidth, dieHeight);
  const dieMaterialCost = dieMaterialWeight * dieMaterialRate;

  const dieInsert: DieInsertResult = {
    length: dieLength,
    width: dieWidth,
    height: dieHeight,
    material: dieMaterial,
    materialRate: dieMaterialRate,
    materialWeight: dieMaterialWeight,
    materialCost: dieMaterialCost,
  };

  const miscWeight = dieMaterialWeight / 2;
  const miscCost = miscWeight * dieMaterialRate;
  const standardPartCost = miscCost / 2;
  const machiningHours = dieMaterialWeight / 2;
  const machiningCost = machiningHours * rates.machining;
  const heatTreatmentHours = machiningHours / 4;
  const heatTreatmentCost = heatTreatmentHours * rates.heatTreatment;
  const assemblyHours = machiningHours / 2;
  const assemblyCost = assemblyHours * rates.assembly;

  const manufacturing: ManufacturingResult = {
    miscWeight,
    miscCost,
    standardPartCost,
    machiningHours,
    machiningRate: rates.machining,
    machiningCost,
    heatTreatmentHours,
    heatTreatmentRate: rates.heatTreatment,
    heatTreatmentCost,
    assemblyHours,
    assemblyRate: rates.assembly,
    assemblyCost,
  };

  const sandLength = part.length + 40;
  const sandWidth = part.width + 40;
  const sandHeight = part.height + 20;
  const sandRate = rates[sandMaterial];
  const sandWeight = volumetricWeight(sandLength, sandWidth, sandHeight);
  const sandCost = sandWeight * sandRate;

  const sandCoreBox: SandCoreBoxResult = {
    length: sandLength,
    width: sandWidth,
    height: sandHeight,
    material: sandMaterial,
    rate: sandRate,
    weight: sandWeight,
    cost: sandCost,
  };

  const subtotal =
    dieMaterialCost +
    miscCost +
    standardPartCost +
    machiningCost +
    heatTreatmentCost +
    assemblyCost +
    sandCost;
  const overhead = subtotal * OVERHEAD_RATE;
  const total = subtotal + overhead;

  const summary: CostSummary = {
    dieMaterialCost,
    miscellaneousCost: miscCost,
    standardPartCost,
    machiningCost,
    heatTreatmentCost,
    assemblyCost,
    sandCoreBoxCost: sandCost,
    subtotal,
    overhead,
    total,
  };

  return { dieInsert, manufacturing, sandCoreBox, summary };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
