-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'PLANNED';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "client" TEXT,
ADD COLUMN     "thumbnail" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PLANNED';
