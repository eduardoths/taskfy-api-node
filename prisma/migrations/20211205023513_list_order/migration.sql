/*
  Warnings:

  - Added the required column `order` to the `lists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "lists_order_idx" ON "lists"("order");
