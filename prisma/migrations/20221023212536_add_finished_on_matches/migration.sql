/*
  Warnings:

  - Added the required column `finished` to the `matches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "finished" BOOLEAN NOT NULL;
