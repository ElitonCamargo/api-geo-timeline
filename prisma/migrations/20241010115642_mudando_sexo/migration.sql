/*
  Warnings:

  - Made the column `sexo` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "sexo" SET NOT NULL,
ALTER COLUMN "sexo" SET DEFAULT '';
