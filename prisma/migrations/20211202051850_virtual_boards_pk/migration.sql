/*
  Warnings:

  - The primary key for the `virtual_boards` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `virtual_boards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "virtual_boards" DROP CONSTRAINT "virtual_boards_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "virtual_boards_pkey" PRIMARY KEY ("userId", "boardId");
