/*
  Warnings:

  - The primary key for the `UserImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `UserImage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserImage" DROP CONSTRAINT "UserImage_pkey",
ADD COLUMN     "id" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_id_key" ON "UserImage"("id");
