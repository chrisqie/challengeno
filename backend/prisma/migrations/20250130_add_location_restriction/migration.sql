-- CreateEnum
CREATE TYPE "LocationRestriction" AS ENUM ('NONE', 'LOCAL', 'CUSTOM');

-- AlterTable
ALTER TABLE "bet_games" ADD COLUMN     "custom_location" TEXT,
ADD COLUMN     "location_restriction" "LocationRestriction" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "max_distance" INTEGER;
