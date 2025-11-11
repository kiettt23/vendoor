-- AlterTable
ALTER TABLE "User" ADD COLUMN     "displayUsername" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");
