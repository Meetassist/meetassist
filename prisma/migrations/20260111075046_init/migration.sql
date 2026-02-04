/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `RecordingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `duration` on the `meeting_recording` table. All the data in the column will be lost.
  - You are about to drop the column `meetingTitle` on the `meeting_recording` table. All the data in the column will be lost.
  - You are about to drop the column `participants` on the `meeting_recording` table. All the data in the column will be lost.
  - You are about to drop the column `recordingUrl` on the `meeting_recording` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledTime` on the `meeting_recording` table. All the data in the column will be lost.
  - You are about to drop the column `skribbyBotId` on the `meeting_recording` table. All the data in the column will be lost.
  - You are about to drop the column `skribbyRecordingId` on the `meeting_recording` table. All the data in the column will be lost.
  - You are about to drop the column `transcriptUrl` on the `meeting_recording` table. All the data in the column will be lost.
  - You are about to drop the column `googleGrantId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[notetakerId]` on the table `meeting_recording` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecordingStatus_new" AS ENUM ('PENDING', 'WAITING_FOR_ENTRY', 'RECORDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');
ALTER TABLE "public"."meeting_recording" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "meeting_recording" ALTER COLUMN "status" TYPE "RecordingStatus_new" USING ("status"::text::"RecordingStatus_new");
ALTER TYPE "RecordingStatus" RENAME TO "RecordingStatus_old";
ALTER TYPE "RecordingStatus_new" RENAME TO "RecordingStatus";
DROP TYPE "public"."RecordingStatus_old";
ALTER TABLE "meeting_recording" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropIndex
DROP INDEX "meeting_recording_skribbyBotId_key";

-- DropIndex
DROP INDEX "meeting_recording_skribbyRecordingId_key";

-- AlterTable
ALTER TABLE "meeting_recording" DROP COLUMN "duration",
DROP COLUMN "meetingTitle",
DROP COLUMN "participants",
DROP COLUMN "recordingUrl",
DROP COLUMN "scheduledTime",
DROP COLUMN "skribbyBotId",
DROP COLUMN "skribbyRecordingId",
DROP COLUMN "transcriptUrl",
ADD COLUMN     "grantId" TEXT,
ADD COLUMN     "notetakerId" TEXT,
ADD COLUMN     "provider" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "googleGrantId";

-- CreateIndex
CREATE UNIQUE INDEX "meeting_recording_notetakerId_key" ON "meeting_recording"("notetakerId");

-- CreateIndex
CREATE INDEX "meeting_recording_notetakerId_idx" ON "meeting_recording"("notetakerId");
