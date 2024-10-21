-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "data_nasc" TIMESTAMP(3),
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rota" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "coordenadas" JSONB NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seguir" (
    "id" SERIAL NOT NULL,
    "usuarioSeguidorId" INTEGER NOT NULL,
    "usuarioSeguidoId" INTEGER NOT NULL,

    CONSTRAINT "Seguir_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Seguir_usuarioSeguidorId_usuarioSeguidoId_key" ON "Seguir"("usuarioSeguidorId", "usuarioSeguidoId");

-- AddForeignKey
ALTER TABLE "Rota" ADD CONSTRAINT "Rota_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seguir" ADD CONSTRAINT "Seguir_usuarioSeguidorId_fkey" FOREIGN KEY ("usuarioSeguidorId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seguir" ADD CONSTRAINT "Seguir_usuarioSeguidoId_fkey" FOREIGN KEY ("usuarioSeguidoId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
