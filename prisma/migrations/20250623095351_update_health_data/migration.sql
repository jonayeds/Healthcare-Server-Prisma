/*
  Warnings:

  - You are about to drop the column `immunixationStatus` on the `patientHealthdata` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patientHealthdata" DROP COLUMN "immunixationStatus",
ADD COLUMN     "hasDiabetes" BOOLEAN DEFAULT false,
ADD COLUMN     "immunizationStatus" TEXT,
ALTER COLUMN "hasAllergies" DROP NOT NULL,
ALTER COLUMN "hasAllergies" SET DEFAULT false,
ALTER COLUMN "smokingStatus" DROP NOT NULL,
ALTER COLUMN "smokingStatus" SET DEFAULT false,
ALTER COLUMN "dietaryPreferences" DROP NOT NULL,
ALTER COLUMN "pregnancyStatus" DROP NOT NULL,
ALTER COLUMN "pregnancyStatus" SET DEFAULT false,
ALTER COLUMN "mentalHealthStatus" DROP NOT NULL,
ALTER COLUMN "hasPastSergeries" DROP NOT NULL,
ALTER COLUMN "hasPastSergeries" SET DEFAULT false,
ALTER COLUMN "recentAnxity" DROP NOT NULL,
ALTER COLUMN "recentAnxity" SET DEFAULT false,
ALTER COLUMN "recentDepression" DROP NOT NULL,
ALTER COLUMN "recentDepression" SET DEFAULT false,
ALTER COLUMN "maritalStatus" SET DEFAULT 'SINGLE';
