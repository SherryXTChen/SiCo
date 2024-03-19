-- AlterTable
ALTER TABLE "Survey" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserImage" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserImageResult" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updatedAt" DROP NOT NULL;
