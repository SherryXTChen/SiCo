/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Survey` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "id" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Survey_id_key" ON "Survey"("id");
