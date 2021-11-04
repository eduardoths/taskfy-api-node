/*
  Warnings:

  - You are about to drop the `managers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `virtual_boards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "managers" DROP CONSTRAINT "managers_boardId_fkey";

-- DropForeignKey
ALTER TABLE "managers" DROP CONSTRAINT "managers_managerId_fkey";

-- DropForeignKey
ALTER TABLE "virtual_boards" DROP CONSTRAINT "virtual_boards_boardId_fkey";

-- DropForeignKey
ALTER TABLE "virtual_boards" DROP CONSTRAINT "virtual_boards_userId_fkey";

-- DropTable
DROP TABLE "managers";

-- DropTable
DROP TABLE "virtual_boards";

-- CreateTable
CREATE TABLE "manager" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "virtual_board" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "virtual_board_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "manager_managerId_key" ON "manager"("managerId");

-- AddForeignKey
ALTER TABLE "manager" ADD CONSTRAINT "manager_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manager" ADD CONSTRAINT "manager_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "virtual_board" ADD CONSTRAINT "virtual_board_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "virtual_board" ADD CONSTRAINT "virtual_board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
