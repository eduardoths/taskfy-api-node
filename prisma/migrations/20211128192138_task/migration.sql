/*
  Warnings:

  - Added the required column `dueDate` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stressPoints` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stressPoints" INTEGER NOT NULL;
