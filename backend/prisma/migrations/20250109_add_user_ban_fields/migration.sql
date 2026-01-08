-- AlterTable
ALTER TABLE "users" ADD COLUMN "is_banned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "banned_until" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "ban_reason" TEXT;
ALTER TABLE "users" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "deleted_at" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "delete_reason" TEXT;

