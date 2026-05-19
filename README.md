# 📄 Resume API — Express + PostgreSQL

REST API completa para um aplicativo de currículos, com 12 entidades e todos os relacionamentos.

---

## 🗂️ Entidades e Relacionamentos

```
users (1) ──────────── (N) resumes
resumes (1) ──────────── (1) personal_info
resumes (1) ──────────── (N) work_experiences
resumes (1) ──────────── (N) education
resumes (1) ──────────── (N) skills
resumes (1) ──────────── (N) languages
resumes (1) ──────────── (N) projects
resumes (1) ──────────── (N) certifications
resumes (1) ──────────── (N) awards
resumes (1) ──────────── (N) volunteer_experiences
resumes (1) ──────────── (N) publications
resumes (1) ──────────── (N) references_list
```

---

## ⚙️ Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar ambiente
```bash
cp .env.example .env
# Editar .env com suas credenciais do PostgreSQL
```

### 3. Criar o banco e rodar migrations
```sql
-- No psql:
CREATE DATABASE resume_db;
```
```bash
npm run migrate
```

### 4. Iniciar o servidor
```bash
npm run dev    # desenvolvimento (nodemon)
npm start      # produção
```

---

## 📡 Endpoints

### Base URL: `http://localhost:3000/api/v1`

---

### 👤 Users

| Método | Endpoint             | Descrição                    |
|--------|----------------------|------------------------------|
| GET    | `/users`             | Listar todos os usuários     |
| GET    | `/users/:id`         | Buscar usuário por ID        |
| GET    | `/users/:id/resumes` | Listar currículos do usuário |
| POST   | `/users`             | Criar usuário                |
| PUT    | `/users/:id`         | Atualizar usuário            |
| DELETE | `/users/:id`         | Remover usuário              |

**POST /users** — body:
```json
{
  "email": "joao@email.com",
  "name": "João Silva",
  "password": "senha123"
}
```

---

### 📋 Resumes

| Método | Endpoint        | Descrição                              |
|--------|-----------------|----------------------------------------|
| GET    | `/resumes`      | Listar currículos públicos             |
| GET    | `/resumes/:id`  | Buscar currículo completo (all sections)|
| POST   | `/resumes`      | Criar currículo                        |
| PUT    | `/resumes/:id`  | Atualizar currículo                    |
| DELETE | `/resumes/:id`  | Remover currículo (cascade)            |

**POST /resumes** — body:
```json
{
  "user_id": "uuid",
  "title": "Meu Currículo Dev",
  "summary": "Desenvolvedor fullstack com 5 anos de experiência",
  "is_public": true,
  "slug": "joao-silva-dev",
  "template": "modern"
}
```

---

### 🧍 Personal Info (1:1 com Resume)

| Método | Endpoint                            | Descrição          |
|--------|-------------------------------------|--------------------|
| GET    | `/resumes/:resumeId/personal-info`  | Buscar info pessoal|
| POST   | `/resumes/:resumeId/personal-info`  | Criar info pessoal |
| PUT    | `/resumes/:resumeId/personal-info`  | Atualizar          |
| DELETE | `/resumes/:resumeId/personal-info`  | Remover            |

---

### 💼 Work Experiences / 🎓 Education / 🛠️ Skills / 🌍 Languages / 🚀 Projects / 📜 Certifications / 🏆 Awards / 🤝 Volunteer Experiences / 📖 Publications / 👥 References

Todas as seções seguem o mesmo padrão de rotas:

| Método | Endpoint                               | Descrição         |
|--------|----------------------------------------|-------------------|
| GET    | `/resumes/:resumeId/<section>`         | Listar todos      |
| GET    | `/resumes/:resumeId/<section>/:id`     | Buscar por ID     |
| POST   | `/resumes/:resumeId/<section>`         | Criar             |
| PUT    | `/resumes/:resumeId/<section>/:id`     | Atualizar         |
| DELETE | `/resumes/:resumeId/<section>/:id`     | Remover           |
| PATCH  | `/resumes/:resumeId/<section>/reorder` | Reordenar itens   |

**Seções disponíveis:**
- `work-experiences`
- `education`
- `skills`
- `languages`
- `projects`
- `certifications`
- `awards`
- `volunteer-experiences`
- `publications`
- `references`

---

### PATCH `/<section>/reorder` — body:
```json
{
  "order": [
    { "id": "uuid-1", "order_index": 0 },
    { "id": "uuid-2", "order_index": 1 },
    { "id": "uuid-3", "order_index": 2 }
  ]
}
```

---

## 📦 Campos por Entidade

### work_experiences
```json
{
  "company": "Empresa XPTO",
  "job_title": "Desenvolvedor Senior",
  "location": "Recife, PE",
  "start_date": "2021-01-01",
  "end_date": null,
  "is_current": true,
  "description": "Desenvolvimento de APIs REST com Node.js",
  "order_index": 0
}
```

### education
```json
{
  "institution": "UFPE",
  "degree": "Bacharel",
  "field_of_study": "Ciência da Computação",
  "start_date": "2016-01-01",
  "end_date": "2020-12-01",
  "grade": "8.5",
  "description": "..."
}
```

### skills
```json
{ "name": "Node.js", "level": "advanced", "category": "Backend" }
```
> `level`: `beginner` | `intermediate` | `advanced` | `expert`

### languages
```json
{ "name": "Inglês", "proficiency": "professional" }
```
> `proficiency`: `basic` | `conversational` | `professional` | `native`

### certifications
```json
{
  "name": "AWS Solutions Architect",
  "issuing_org": "Amazon Web Services",
  "issue_date": "2023-06-01",
  "expiry_date": "2026-06-01",
  "credential_id": "ABC123",
  "credential_url": "https://aws.amazon.com/verify/ABC123"
}
```

---

## 🔍 GET /resumes/:id — Resposta completa

```json
{
  "data": {
    "id": "uuid",
    "title": "Meu Currículo",
    "personal_info": { ... },
    "work_experiences": [ ... ],
    "education": [ ... ],
    "skills": [ ... ],
    "languages": [ ... ],
    "projects": [ ... ],
    "certifications": [ ... ],
    "awards": [ ... ],
    "volunteer_experiences": [ ... ],
    "publications": [ ... ],
    "references": [ ... ]
  }
}
```

---

## 🛡️ Respostas de Erro

| Código | Significado                   |
|--------|-------------------------------|
| 400    | Dados inválidos               |
| 404    | Recurso não encontrado        |
| 409    | Conflito (duplicidade)        |
| 422    | Falha de validação            |
| 500    | Erro interno do servidor      |

---

## 📂 Estrutura do Projeto

```
resume-api/
├── src/
│   ├── config/
│   │   └── database.js          # Pool de conexão PostgreSQL
│   ├── controllers/
│   │   ├── users.controller.js
│   │   ├── resumes.controller.js
│   │   ├── personalInfo.controller.js
│   │   └── section.factory.js   # Factory CRUD para todas as seções
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── migrations/
│   │   ├── schema.sql            # Todas as tabelas e índices
│   │   └── run.js
│   ├── routes/
│   │   └── index.js              # Todas as rotas
│   └── index.js                  # Entry point
├── .env.example
├── package.json
└── README.md
```
