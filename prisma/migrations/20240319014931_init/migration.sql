-- CreateTable
CREATE TABLE "UserImageResult" (
    "uid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "UserImageResult_id_key" ON "UserImageResult"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserImageResult_filename_key" ON "UserImageResult"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "UserImageResult_url_key" ON "UserImageResult"("url");

-- AddForeignKey
ALTER TABLE "UserImageResult" ADD CONSTRAINT "UserImageResult_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
