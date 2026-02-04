/*
  Warnings:

  - You are about to drop the column `confGrantId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `grantEmail` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `grantId` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RecordingStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'PROCESSING', 'COMPLETED', 'FAILED');

-- DropIndex
DROP INDEX "user_grantId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "confGrantId",
DROP COLUMN "grantEmail",
DROP COLUMN "grantId",
ADD COLUMN     "googleEmail" TEXT,
ADD COLUMN     "googleGrantId" TEXT,
ADD COLUMN     "microsoftEmail" TEXT,
ADD COLUMN     "microsoftGrantId" TEXT,
ADD COLUMN     "zoomGrantId" TEXT;

-- CreateTable
CREATE TABLE "meeting_recording" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "meetingUrl" TEXT NOT NULL,
    "meetingTitle" TEXT,
    "scheduledTime" TIMESTAMP(3),
    "skribbyBotId" TEXT,
    "skribbyRecordingId" TEXT,
    "status" "RecordingStatus" NOT NULL DEFAULT 'PENDING',
    "recordingUrl" TEXT,
    "transcriptUrl" TEXT,
    "transcriptText" TEXT,
    "duration" INTEGER,
    "participants" JSONB,
    "summary" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meeting_recording_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meeting_recording_skribbyBotId_key" ON "meeting_recording"("skribbyBotId");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_recording_skribbyRecordingId_key" ON "meeting_recording"("skribbyRecordingId");

-- CreateIndex
CREATE INDEX "meeting_recording_userId_idx" ON "meeting_recording"("userId");

-- CreateIndex
CREATE INDEX "meeting_recording_status_idx" ON "meeting_recording"("status");

-- AddForeignKey
ALTER TABLE "meeting_recording" ADD CONSTRAINT "meeting_recording_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
