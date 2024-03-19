-- AlterTable
ALTER TABLE "UserImage" ADD COLUMN     "firstSite" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UserImageResult" ADD COLUMN     "firstSite" BOOLEAN NOT NULL DEFAULT true;
