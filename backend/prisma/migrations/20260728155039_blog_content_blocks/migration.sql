-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "content" JSONB NOT NULL DEFAULT '[]',
ALTER COLUMN "summary" SET DEFAULT '';
