import { z } from "zod";

export const ProjectStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
} as const;

export const AppStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

export const InvestStatus = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const JobStatus = {
  OPEN: "OPEN",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
} as const;

export const IrrigationType = {
  DRIP: "DRIP",
  SPRINKLER: "SPRINKLER",
  FLOOD: "FLOOD",
  NONE: "NONE",
} as const;

export const Zone = {
  Coastal: "Coastal",
  Highlands: "Highlands",
  Steppe: "Steppe",
  Sahara: "Sahara",
} as const;

export const Soil = {
  poor: "poor",
  average: "average",
  good: "good",
  excellent: "excellent",
} as const;

export const UserType = {
  INDIVIDUAL: "INDIVIDUAL",
  COMPANY: "COMPANY",
} as const;

export type ProjectStatusType = (typeof ProjectStatus)[keyof typeof ProjectStatus];
export type AppStatusType = (typeof AppStatus)[keyof typeof AppStatus];
export type InvestStatusType = (typeof InvestStatus)[keyof typeof InvestStatus];
export type JobStatusType = (typeof JobStatus)[keyof typeof JobStatus];
export type IrrigationTypeType = (typeof IrrigationType)[keyof typeof IrrigationType];
export type ZoneType = (typeof Zone)[keyof typeof Zone];
export type SoilType = (typeof Soil)[keyof typeof Soil];
export type UserTypeType = (typeof UserType)[keyof typeof UserType];

export interface Investor {
  investor_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  phone?: string;
  investor_type?: UserTypeType;
  created_at: string;
}

export interface Farmer {
  farmer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  phone?: string;
  wilaya: string;
  address?: string;
  created_at: string;
}

export interface JobSeeker {
  job_seeker_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  phone?: string;
  wilaya: string;
  created_at: string;
}

export interface ProjectPost {
  project_id: number;
  title: string;
  description: string;
  budget_required: number;
  duration_months: number;
  profit_share: number;
  status: ProjectStatusType;
  created_at: string;
  crop_type: string;
  farm_size_ha?: number;
  soil_quality: SoilType;
  soil_quality_score?: number;
  soil_salinity?: number;
  rainfall_mm?: number;
  altitude_m?: number;
  et0_mm?: number;
  drought_index?: number;
  zone: ZoneType;
  irrigation_type?: IrrigationTypeType;
  experience_years?: number;
  farmer_id: number;
  farmer?: Farmer;
  ai_risk_score?: number;
}

export interface EmploymentPost {
  job_id: number;
  job_type: string;
  description: string;
  payment: number;
  workers_needed: number;
  duration_days: number;
  wilaya: string;
  status: JobStatusType;
  created_at: string;
  farmer_id: number;
  farmer?: Farmer;
}

export interface ApplicationForProjects {
  application_id: number;
  message?: string;
  status: AppStatusType;
  created_at: string;
  project_id: number;
  project?: ProjectPost;
  investor_id: number;
  investor?: Investor;
}

export interface ApplicationForEmployment {
  application_id: number;
  message?: string;
  status: AppStatusType;
  created_at: string;
  job_id: number;
  job?: EmploymentPost;
  job_seeker_id: number;
  job_seeker?: JobSeeker;
}

export interface Investment {
  investment_id: number;
  amount: number;
  start_date: string;
  end_date?: string;
  status: InvestStatusType;
  project_id: number;
  project?: ProjectPost;
  investor_id: number;
  investor?: Investor;
}

export const insertInvestorSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  investor_type: z.enum(["INDIVIDUAL", "COMPANY"]).optional(),
});

export const insertFarmerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  wilaya: z.string().min(1, "wilaya is required"),
  address: z.string().optional(),
});

export const insertJobSeekerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  wilaya: z.string().min(1, "wilaya is required"),
});

export const insertProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget_required: z.number().positive("Budget must be positive"),
  duration_months: z.number().int().positive("Duration must be positive"),
  profit_share: z.number().min(0).max(100, "Profit share must be between 0 and 100"),
  crop_type: z.string().min(1, "Crop type is required"),
  farm_size_ha: z.number().positive().optional(),
  soil_quality: z.enum(["poor", "average", "good", "excellent"]),
  irrigation_type: z.enum(["DRIP", "SPRINKLER", "FLOOD", "NONE"]).optional(),
  experience_years: z.number().int().min(0).optional(),
  wilaya: z.string().min(1, "wilaya is required"),
});

export const insertEmploymentSchema = z.object({
  job_type: z.string().min(1, "Job type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  payment: z.number().positive("Payment must be positive"),
  workers_needed: z.number().int().positive("Workers needed must be positive"),
  duration_days: z.number().int().positive("Duration must be positive"),
  wilaya: z.string().min(1, "wilaya is required"),
});

export const insertApplicationForProjectSchema = z.object({
  project_id: z.number(),
  message: z.string().optional(),
});

export const insertApplicationForEmploymentSchema = z.object({
  job_id: z.number(),
  message: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type InsertInvestor = z.infer<typeof insertInvestorSchema>;
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
export type InsertJobSeeker = z.infer<typeof insertJobSeekerSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertEmployment = z.infer<typeof insertEmploymentSchema>;
export type InsertApplicationForProject = z.infer<typeof insertApplicationForProjectSchema>;
export type InsertApplicationForEmployment = z.infer<typeof insertApplicationForEmploymentSchema>;
export type LoginData = z.infer<typeof loginSchema>;
