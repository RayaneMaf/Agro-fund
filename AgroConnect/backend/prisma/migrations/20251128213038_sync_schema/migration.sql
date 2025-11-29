-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InvestStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "IrrigationType" AS ENUM ('DRIP', 'SPRINKLER', 'FLOOD', 'NONE');

-- CreateEnum
CREATE TYPE "Zone" AS ENUM ('Coastal', 'Highlands', 'Steppe', 'Sahara');

-- CreateEnum
CREATE TYPE "Soil" AS ENUM ('poor', 'average', 'good', 'excelent');

-- CreateTable
CREATE TABLE "Investor" (
    "investor_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" TEXT,
    "investor_type" "UserType",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("investor_id")
);

-- CreateTable
CREATE TABLE "Farmer" (
    "farmer_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" TEXT,
    "wilaya" TEXT NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("farmer_id")
);

-- CreateTable
CREATE TABLE "JobSeeker" (
    "job_seeker_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" TEXT,
    "wilaya" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSeeker_pkey" PRIMARY KEY ("job_seeker_id")
);

-- CreateTable
CREATE TABLE "ProjectPost" (
    "project_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget_required" DOUBLE PRECISION NOT NULL,
    "duration_months" INTEGER NOT NULL,
    "profit_share" DOUBLE PRECISION NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "crop_type" TEXT NOT NULL,
    "farm_size_ha" DOUBLE PRECISION,
    "soil_quality" "Soil" NOT NULL DEFAULT 'average',
    "soil_quality_score" DOUBLE PRECISION,
    "soil_salinity" DOUBLE PRECISION,
    "rainfall_mm" DOUBLE PRECISION,
    "altitude_m" DOUBLE PRECISION,
    "et0_mm" DOUBLE PRECISION,
    "drought_index" DOUBLE PRECISION,
    "zone" "Zone" NOT NULL DEFAULT 'Coastal',
    "irrigation_type" "IrrigationType",
    "experience_years" INTEGER,
    "farmer_id" INTEGER NOT NULL,

    CONSTRAINT "ProjectPost_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "EmploymentPost" (
    "job_id" SERIAL NOT NULL,
    "job_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "payment" DOUBLE PRECISION NOT NULL,
    "workers_needed" INTEGER NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "wilaya" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "farmer_id" INTEGER NOT NULL,

    CONSTRAINT "EmploymentPost_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "ApplicationForProjects" (
    "application_id" SERIAL NOT NULL,
    "message" TEXT,
    "status" "AppStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" INTEGER NOT NULL,
    "investor_id" INTEGER NOT NULL,

    CONSTRAINT "ApplicationForProjects_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "ApplicationForEmployment" (
    "application_id" SERIAL NOT NULL,
    "message" TEXT,
    "status" "AppStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "job_id" INTEGER NOT NULL,
    "job_seeker_id" INTEGER NOT NULL,

    CONSTRAINT "ApplicationForEmployment_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "investment_id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "status" "InvestStatus" NOT NULL DEFAULT 'ACTIVE',
    "project_id" INTEGER NOT NULL,
    "investor_id" INTEGER NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("investment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Investor_email_key" ON "Investor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_email_key" ON "Farmer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "JobSeeker_email_key" ON "JobSeeker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Investment_project_id_key" ON "Investment"("project_id");

-- AddForeignKey
ALTER TABLE "ProjectPost" ADD CONSTRAINT "ProjectPost_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "Farmer"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentPost" ADD CONSTRAINT "EmploymentPost_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "Farmer"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationForProjects" ADD CONSTRAINT "ApplicationForProjects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ProjectPost"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationForProjects" ADD CONSTRAINT "ApplicationForProjects_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("investor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationForEmployment" ADD CONSTRAINT "ApplicationForEmployment_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "EmploymentPost"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationForEmployment" ADD CONSTRAINT "ApplicationForEmployment_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "JobSeeker"("job_seeker_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "ProjectPost"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "Investor"("investor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
