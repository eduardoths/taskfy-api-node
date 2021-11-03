/*
  Warnings:

  - You are about to drop the column `boardId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_boardId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "boardId";

-- CreateTable
CREATE TABLE "virtual_boards" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "virtual_boards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "virtual_boards" ADD CONSTRAINT "virtual_boards_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "virtual_boards" ADD CONSTRAINT "virtual_boards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
