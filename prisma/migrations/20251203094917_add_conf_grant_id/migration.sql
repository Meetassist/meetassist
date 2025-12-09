/*
  Warnings:

  - You are about to drop the column `description` on the `event_type` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_type" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "confGrantId" TEXT;

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "updatedAt" DROP DEFAULT;
