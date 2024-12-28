// src/app/page.js
import { PrismaClient } from '@prisma/client';

// Inicializa o Prisma Client
const prisma = new PrismaClient();

export default async function Home() {
  // Consulta para buscar todas as máquinas no servidor
  const machines = await prisma.machines.findMany();

  return (
    <div>
      <h1>Lista de Máquinas</h1>
    </div>
  );
}
