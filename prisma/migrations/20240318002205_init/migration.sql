/*
  Warnings:

  - You are about to drop the column `id` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `UserImage` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Survey_id_key";

-- DropIndex
DROP INDEX "UserImage_id_key";

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "id";

-- AlterTable
ALTER TABLE "UserImage" DROP COLUMN "id";
