# GCP Backend

Esse repositório guarda todo o backend do **Gerenciador de Controle de Produção**.

#### [Repositório geral do GCP](https://github.com/GrupoDu/gerenciador_de_controle_de_producao?tab=GPL-3.0-1-ov-file#readme).

## Stack de desenvolvimento

- Node.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Express.js

## Rodando o projeto

Primeiro é necessário configura o `.env` com as variáveis necessárias:

- PORT - Porta do servidor
- DATABASE_URL - URL do banco de dados
- DIRECT_URL - URL do banco de dados

Depois de configuras as variáveis de ambiente, execute o comando `npm install` para instalar as dependências.
Apos instalar as dependências, execute o comando `npx prisma migrate dev` para criar o banco de dados e o comando `npm run dev` para rodar o projeto.

> [!NOTE]
> Se o banco de dados do prisma estiver desatualizado, use `npx prisma db pull` para atualizar o banco de dados e `npx prisma generate` para gerar o prisma client.
