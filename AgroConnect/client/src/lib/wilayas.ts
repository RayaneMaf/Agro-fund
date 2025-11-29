import type { ZoneType } from "@shared/schema";

export interface wilayaData {
  wilaya: string;
  altitude_m: number;
  zone: ZoneType;
}

export const wilayasDetailed: readonly wilayaData[] = [
  { wilaya: "Adrar", altitude_m: 273, zone: "Sahara" },
  { wilaya: "Chlef", altitude_m: 114, zone: "Coastal" },
  { wilaya: "Laghouat", altitude_m: 760, zone: "Steppe" },
  { wilaya: "Oum El Bouaghi", altitude_m: 1000, zone: "Highlands" },
  { wilaya: "Batna", altitude_m: 1050, zone: "Highlands" },
  { wilaya: "Béjaïa", altitude_m: 28, zone: "Coastal" },
  { wilaya: "Biskra", altitude_m: 88, zone: "Steppe" },
  { wilaya: "Béchar", altitude_m: 805, zone: "Sahara" },
  { wilaya: "Blida", altitude_m: 257, zone: "Highlands" },
  { wilaya: "Bouira", altitude_m: 580, zone: "Highlands" },
  { wilaya: "Tamanrasset", altitude_m: 1320, zone: "Sahara" },
  { wilaya: "Tébessa", altitude_m: 620, zone: "Steppe" },
  { wilaya: "Tlemcen", altitude_m: 800, zone: "Highlands" },
  { wilaya: "Tiaret", altitude_m: 989, zone: "Highlands" },
  { wilaya: "Tizi Ouzou", altitude_m: 350, zone: "Highlands" },
  { wilaya: "Alger", altitude_m: 7, zone: "Coastal" },
  { wilaya: "Djelfa", altitude_m: 1130, zone: "Steppe" },
  { wilaya: "Jijel", altitude_m: 78, zone: "Coastal" },
  { wilaya: "Sétif", altitude_m: 1100, zone: "Highlands" },
  { wilaya: "Saïda", altitude_m: 980, zone: "Highlands" },
  { wilaya: "Skikda", altitude_m: 18, zone: "Coastal" },
  { wilaya: "Sidi Bel Abbès", altitude_m: 260, zone: "Steppe" },
  { wilaya: "Annaba", altitude_m: 10, zone: "Coastal" },
  { wilaya: "Guelma", altitude_m: 290, zone: "Steppe" },
  { wilaya: "Constantine", altitude_m: 640, zone: "Highlands" },
  { wilaya: "Médéa", altitude_m: 1045, zone: "Highlands" },
  { wilaya: "Mostaganem", altitude_m: 5, zone: "Coastal" },
  { wilaya: "M'Sila", altitude_m: 471, zone: "Steppe" },
  { wilaya: "Mascara", altitude_m: 436, zone: "Steppe" },
  { wilaya: "Ouargla", altitude_m: 138, zone: "Sahara" },
  { wilaya: "Oran", altitude_m: 15, zone: "Coastal" },
  { wilaya: "El Bayadh", altitude_m: 1082, zone: "Steppe" },
  { wilaya: "Illizi", altitude_m: 582, zone: "Sahara" },
  { wilaya: "Bordj Bou Arreridj", altitude_m: 916, zone: "Highlands" },
  { wilaya: "Boumerdès", altitude_m: 18, zone: "Coastal" },
  { wilaya: "El Tarf", altitude_m: 11, zone: "Coastal" },
  { wilaya: "Tindouf", altitude_m: 456, zone: "Sahara" },
  { wilaya: "Tissemsilt", altitude_m: 954, zone: "Highlands" },
  { wilaya: "El Oued", altitude_m: 75, zone: "Sahara" },
  { wilaya: "Khenchela", altitude_m: 1150, zone: "Highlands" },
  { wilaya: "Souk Ahras", altitude_m: 687, zone: "Highlands" },
  { wilaya: "Tipaza", altitude_m: 12, zone: "Coastal" },
  { wilaya: "Mila", altitude_m: 430, zone: "Steppe" },
  { wilaya: "Aïn Defla", altitude_m: 198, zone: "Steppe" },
  { wilaya: "Naâma", altitude_m: 1178, zone: "Steppe" },
  { wilaya: "Aïn Témouchent", altitude_m: 48, zone: "Coastal" },
  { wilaya: "Ghardaïa", altitude_m: 496, zone: "Sahara" },
  { wilaya: "Relizane", altitude_m: 28, zone: "Coastal" },
  { wilaya: "Timimoun", altitude_m: 266, zone: "Sahara" },
  { wilaya: "Bordj Badji Mokhtar", altitude_m: 250, zone: "Sahara" },
  { wilaya: "Ouled Djellal", altitude_m: 320, zone: "Steppe" },
  { wilaya: "Béni Abbès", altitude_m: 276, zone: "Sahara" },
  { wilaya: "In Salah", altitude_m: 273, zone: "Sahara" },
  { wilaya: "In Guezzam", altitude_m: 502, zone: "Sahara" },
  { wilaya: "Touggourt", altitude_m: 85, zone: "Sahara" },
  { wilaya: "Djanet", altitude_m: 1200, zone: "Sahara" },
  { wilaya: "El M'Ghair", altitude_m: 50, zone: "Sahara" },
  { wilaya: "El Meniaa", altitude_m: 45, zone: "Sahara" },
] as const;

export function getwilayaBywilaya(wilaya: string): wilayaData | undefined {
  return wilayasDetailed.find((r) => r.wilaya === wilaya);
}

export function getwilayasByZone(zone: ZoneType): wilayaData[] {
  return wilayasDetailed.filter((r) => r.zone === zone);
}

export function getwilayaList(): string[] {
  return wilayasDetailed.map((r) => r.wilaya);
}

export function getZoneColor(zone: ZoneType): string {
  switch (zone) {
    case "Coastal":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Highlands":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "Steppe":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    case "Sahara":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}

function randomUniform(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomBeta(alpha: number, beta: number): number {
  const u = Math.random();
  const v = Math.random();
  const x = Math.pow(u, 1 / alpha);
  const y = Math.pow(v, 1 / beta);
  return x / (x + y);
}

export function calculateEnvironmentalMetrics(zone: ZoneType): {
  rainfall_mm: number;
  et0_mm: number;
  drought_index: number;
  soil_quality_score: number;
} {
  let rainfall: number;
  let et0: number;

  switch (zone) {
    case "Coastal":
      rainfall = randomUniform(400, 800);
      et0 = randomUniform(900, 1400);
      break;
    case "Highlands":
      rainfall = randomUniform(200, 400);
      et0 = randomUniform(1200, 1600);
      break;
    case "Steppe":
      rainfall = randomUniform(80, 200);
      et0 = randomUniform(1400, 1800);
      break;
    case "Sahara":
    default:
      rainfall = randomUniform(0, 80);
      et0 = randomUniform(1700, 2300);
      break;
  }

  const drought_index = Math.max(0, Math.min(1, (et0 / 2500.0) + (1 - (rainfall / 800.0))));
  const soil_quality_score = randomBeta(2.2, 2.0);

  return {
    rainfall_mm: Math.round(rainfall * 10) / 10,
    et0_mm: Math.round(et0 * 10) / 10,
    drought_index: Math.round(drought_index * 1000) / 1000,
    soil_quality_score: Math.round(soil_quality_score * 1000) / 1000,
  };
}

export function calculateAIRiskScore(project: {
  drought_index?: number;
  soil_quality_score?: number;
  experience_years?: number;
  irrigation_type?: string;
  budget_required: number;
  duration_months: number;
}): number {
  let riskScore = 50;

  if (project.drought_index !== undefined) {
    riskScore += project.drought_index * 20;
  }

  if (project.soil_quality_score !== undefined) {
    riskScore -= project.soil_quality_score * 15;
  }

  if (project.experience_years !== undefined) {
    riskScore -= Math.min(project.experience_years * 2, 15);
  }

  if (project.irrigation_type && project.irrigation_type !== "NONE") {
    riskScore -= 10;
  }

  if (project.budget_required > 500000) {
    riskScore += 5;
  }

  if (project.duration_months > 12) {
    riskScore += 5;
  }

  return Math.max(0, Math.min(100, Math.round(riskScore)));
}

export function getRiskLevel(score: number): { label: string; color: string } {
  if (score < 35) {
    return { label: "Low Risk", color: "text-green-600 dark:text-green-400" };
  } else if (score < 65) {
    return { label: "Medium Risk", color: "text-amber-600 dark:text-amber-400" };
  } else {
    return { label: "High Risk", color: "text-red-600 dark:text-red-400" };
  }
}
