-- CreateEnum
CREATE TYPE "PenaltyType" AS ENUM ('DISPUTE_VIOLATION', 'MALICIOUS_DISPUTE', 'FRAUD', 'HARASSMENT', 'OTHER');

-- AlterTable BetParticipant - 添加惩罚字段
ALTER TABLE "bet_participants" ADD COLUMN "penalty_points" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "bet_participants" ADD COLUMN "penalty_reason" TEXT;
ALTER TABLE "bet_participants" ADD COLUMN "penalized_at" TIMESTAMP(3);

-- AlterTable Dispute - 添加惩罚记录字段
ALTER TABLE "disputes" ADD COLUMN "penalized_user_ids" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "disputes" ADD COLUMN "points_adjustments" JSONB;

-- CreateTable PenaltyRecord
CREATE TABLE "penalty_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "game_id" TEXT,
    "dispute_id" TEXT,
    "penalty_type" "PenaltyType" NOT NULL,
    "reason" TEXT NOT NULL,
    "trust_points_deduction" INTEGER NOT NULL,
    "game_points_deduction" INTEGER NOT NULL DEFAULT 0,
    "executed_by" TEXT,
    "executed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "penalty_records_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "penalty_records" ADD CONSTRAINT "penalty_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_records" ADD CONSTRAINT "penalty_records_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "bet_games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_records" ADD CONSTRAINT "penalty_records_executed_by_fkey" FOREIGN KEY ("executed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

