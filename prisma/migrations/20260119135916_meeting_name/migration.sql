/*
  Warnings:

  - You are about to drop the column `endedAt` on the `meeting_recording` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `meeting_recording` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "meeting_recording" DROP COLUMN "endedAt",
DROP COLUMN "startedAt",
ADD COLUMN     "actionItems" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "meetingName" TEXT;
