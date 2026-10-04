# 🌑 The Raven's Nebula — Plano Completo de Implementação

## GitHub Stats Dashboard — Gótico-Cósmico (Edgar Allan Poe)

> *"Deep into that darkness peering, long I stood there wondering, fearing,*
> *Doubting, dreaming dreams no mortal ever dared to dream before..."*
> — Edgar Allan Poe, **The Raven**

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Conceito Visual](#2-conceito-visual-a-nebulosa-do-corvo)
3. [Stack Tecnológica](#3-stack-tecnológica)
4. [Arquitetura & Segurança](#4-arquitetura--segurança)
5. [Estrutura de Diretórios](#5-estrutura-de-diretórios-completa)
6. [Serverless Functions (API)](#6-serverless-functions-api-proxy-seguro)
7. [Componentes Compartilhados](#7-componentes-compartilhados-shared)
8. [Features Detalhadas](#8-features-detalhadas)
9. [Estilos & Design System](#9-estilos--design-system)
10. [Configuração do Projeto](#10-configuração-do-projeto)
11. [Fluxo de Deploy na Vercel](#11-fluxo-de-deploy-na-vercel)
12. [Plano de Verificação](#12-plano-de-verificação)
13. [Checklist de Execução](#13-checklist-de-execução)

---

## 0. Mapeamento: README.md Atual → The Raven's Nebula

> Cada stat/card que você usa hoje no README será substituído por uma seção equivalente no painel cósmico.

### Stats que o README.md usa atualmente (serviços de terceiros):

| # | O que o README mostra hoje | Serviço terceiro | → Equivalente no Raven's Nebula |
|---|---------------------------|-----------------|--------------------------------|
| 1 | **Troféus GitHub** (trophy) | `github-profile-trophy` | ❌ **Removido** — troféus são genéricos, o dashboard já mostra tudo melhor |
| 2 | **GitHub Stats** (stars, commits, PRs, issues, contribs) | `github-readme-stats` | ✅ **O Corvo Central** — `ProfileCard` com todos os counters |
| 3 | **GitHub Streak** (current/longest streak) | `github-readme-streak-stats` | ✅ **Olho do Corvo** — `StreakCounter` com pulsação vermelha |
| 4 | **Stats Summary Card** | `github-profile-summary-cards` | ✅ **O Corvo Central** — integrado no `ProfileCard` |
| 5 | **Productive Time** (commits por hora) | `github-profile-summary-cards` | ✅ **Ondas no Vácuo** — `ActivityWaves` mostra atividade temporal |
| 6 | **Repos per Language** | `github-profile-summary-cards` | ✅ **Astros Órfãos** — `LanguagePlanets` com contagem de repos |
| 7 | **Most Commit Language** | `github-profile-summary-cards` | ✅ **Astros Órfãos** — linguagem maior = planeta maior |
| 8 | **Activity Graph** (gráfico de contribuições) | `github-readme-activity-graph` | ✅ **Poeira Cósmica** — `ContributionNebula` (heatmap constelação) |
| 9 | **Top Languages** (donut chart) | `github-readme-stats` | ✅ **Astros Órfãos** — `LanguagePlanets` com % de cada linguagem |
| 10 | **Followers badge** | `shields.io` | ✅ **O Corvo Central** — counter de followers |
| 11 | **Stars badge** | `shields.io` | ✅ **O Corvo Central** — counter de total stars |
| 12 | **Visitors badge** | `visitorbadge.io` | ❌ **Removido** — não é possível rastrear via API do GitHub |

### Stats NOVOS que o Raven's Nebula adiciona:

| Novo | Descrição |
|------|-----------|
| 🏠 **Top Repos** (O Grimório) | Top 6 repositórios com stars, forks, linguagem — estilo grimório medieval |
| 📅 **Heatmap Constelação** | Contribuições de 365 dias como estrelas com brilho variado |
| 🔴 **Streak Visual** | Animação pulsante com citação de Poe |
| 🪐 **Planetas Orbitando** | Linguagens como planetas animados em órbita |
| ✨ **Background Partículas** | Canvas com partículas cósmicas interativas |

### Dados puxados da API GraphQL do GitHub:

```
Da query principal (/api/github-stats):
├── name, login, bio, avatarUrl, location, createdAt
├── followers.totalCount
├── following.totalCount
├── repositories.totalCount
├── totalStars (calculado: Σ stargazerCount)
├── totalForks (calculado: Σ forkCount)
├── totalCommitContributions
├── totalPullRequestContributions
├── totalIssueContributions
├── totalRepositoryContributions
├── contributionCalendar (365 dias, por dia)
├── currentStreak (calculado dos últimos dias consecutivos)
├── longestStreak (calculado do calendário)
└── topRepos (top 6 por stars, com linguagem)

Da query de linguagens (/api/github-languages):
├── languages[] (nome, cor, size em bytes, %)
└── repoCount por linguagem
```

---

## 1. Visão Geral

### O que é?
Um **painel de estatísticas GitHub personalizado** para o usuário **wmakeouthill**, deployado na **Vercel**, que puxa dados da API GraphQL do GitHub usando **serverless functions como proxy seguro** (token nunca exposto no frontend).

### Por que não usar os cards open source?
- Customização total da estética (gótico-cósmico)
- Dados centralizados em uma única página
- Controle completo sobre quais stats mostrar
- Sem dependência de serviços terceiros que podem cair
- Performance otimizada (uma query GraphQL vs múltiplas REST)

### É possível sem backend?
**Sim**, mas com um detalhe: usamos as **serverless functions da Vercel** (pasta `/api`). Elas rodam no servidor da Vercel e têm acesso às env vars secretas. O frontend nunca vê o token.

---

## 2. Conceito Visual: A Nebulosa do Corvo

### Paleta de Cores

```
╔════════════════════════════════════════════════════════════╗
║  TOKEN              HEX        USO                        ║
╠════════════════════════════════════════════════════════════╣
║  --void-black       #0a0a0f    Background principal       ║
║  --abyss            #0d0d14    Background dos cards       ║
║  --deep-purple      #6b21a8    Destaque primário          ║
║  --midnight-blue    #1e1b4b    Gradientes, bordas         ║
║  --crimson           #991b1b    Streak, alertas            ║
║  --blood-red        #dc2626    Hover em streak            ║
║  --faded-gold       #d4a574    Títulos góticos, acentos   ║
║  --starlight        #c0c0c0    Texto secundário           ║
║  --spectral-green   #22c55e    Contribuições ativas       ║
║  --nebula-purple    #7c3aed    Glow effects               ║
║  --phantom-white    #e8e6e3    Texto principal             ║
║  --ash-gray         #6b7280    Texto terciário             ║
╚════════════════════════════════════════════════════════════╝
```

### Tipografia

| Fonte | Uso | Estilo |
|-------|-----|--------|
| **Cinzel Decorative** | Título principal ("The Raven's Nebula") | Gótico, serifado, elegante |
| **EB Garamond** | Subtítulos, citações de Poe, labels | Serifado clássico literário |
| **JetBrains Mono** | Números, dados, stats, código | Monospace técnico |
| **Inter** | Texto corpo, descrições | Sans-serif limpa |

### Seções Visuais do Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  ✦ ✦  ✦     ✦  ✦ ✦   ✦     PARTÍCULAS FLUTUANTES      │
│     ✦    ✦ ✦          ✦  ✦    (Canvas animado)          │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │          🌑 O CORVO CENTRAL                  │        │
│  │    Avatar + Nome + Bio + Stats Gerais        │        │
│  │    (Nebulosa animada ao redor do avatar)      │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
│  ┌──────────────┐  ┌──────────────────────────┐         │
│  │ 👁 OLHO DO   │  │  ✦ POEIRA CÓSMICA        │         │
│  │   CORVO      │  │  Heatmap de contribuições │         │
│  │  Streak:     │  │  como constelação         │         │
│  │  "Nevermore" │  │  (365 dias)               │         │
│  └──────────────┘  └──────────────────────────┘         │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │  🪐 ASTROS ÓRFÃOS                           │        │
│  │  Linguagens orbitando como planetas          │        │
│  │  (animação CSS orbital)                      │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────┐        │
│  │ 📖 GRIMÓRIO  │  │ 📖 GRIMÓRIO  │  │ 📖 ... │        │
│  │ repo-name    │  │ repo-name    │  │        │        │
│  │ ⭐ 42 🍴 12  │  │ ⭐ 38 🍴 8   │  │        │        │
│  └──────────────┘  └──────────────┘  └────────┘        │
│                                                          │
│  ┌─────────────────────────────────────────────┐        │
│  │  〰 ONDAS NO VÁCUO                           │        │
│  │  Gráfico SVG de atividade recente            │        │
│  │  (wave animation)                            │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
│     ✦    ✦ ✦   ✦       ✦  ✦     ✦                      │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Stack Tecnológica

### Core (conforme `regras-frontend.md`)

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 19+ | Biblioteca UI |
| **TypeScript** | 5.6+ | Linguagem principal |
| **Vite** | 6+ | Build tool + dev server |
| **TanStack Query** | 5+ | Data fetching, cache, retry |
| **CSS Modules** | nativo | Estilos isolados por componente |

### Bibliotecas Auxiliares

| Biblioteca | Propósito |
|------------|-----------|
| `@tanstack/react-query` | Hooks de data fetching com cache inteligente |
| Nenhum framework CSS | CSS puro com Modules + variáveis CSS |

### Serverless (Vercel)

| Tecnologia | Propósito |
|------------|-----------|
| Vercel Serverless Functions | Proxy seguro para GitHub API |
| Node.js runtime | Execução das functions no servidor |

### Decisões Arquiteturais

| Decisão | Justificativa |
|---------|---------------|
| **CSS Modules** (sem Tailwind) | Animações `@keyframes` complexas, gradientes, pseudo-elementos são mais legíveis em CSS puro |
| **Sem Server Actions** | App read-only, sem formulários de mutação |
| **Sem Zustand** | Apenas uma página, sem estado global complexo (TanStack Query já cacheia) |
| **Sem React Router** | Single page dashboard, sem navegação |
| **GraphQL** (não REST) | Uma query = todos os dados (menos requests, menos rate limiting) |

---

## 4. Arquitetura & Segurança

### ⚠️ Princípio de Segurança

> **O token GitHub (Personal Access Token) NUNCA é exposto no frontend.**
>
> - NÃO usa prefixo `VITE_` (que exporia ao browser)
> - NÃO está no bundle JavaScript
> - NÃO aparece no Network tab do browser
> - APENAS acessível via `process.env.GITHUB_TOKEN` dentro das serverless functions

### Diagrama de Fluxo

```
┌─────────────────┐       ┌──────────────────────┐       ┌──────────────────┐
│   Browser        │       │  Vercel Serverless   │       │  GitHub GraphQL  │
│   (React App)    │       │  Function (/api)     │       │  API             │
│                  │       │                      │       │                  │
│  1. Monta o app  │       │                      │       │                  │
│                  │       │                      │       │                  │
│  2. TanStack     │──────>│  3. Recebe request   │       │                  │
│     Query faz    │  GET  │                      │       │                  │
│     fetch para   │ /api/ │  4. Lê GITHUB_TOKEN  │       │                  │
│     /api/github  │github │     de process.env   │       │                  │
│     -stats       │-stats │                      │       │                  │
│                  │       │  5. Faz POST para    │──────>│  6. Valida token │
│                  │       │     api.github.com/  │  POST │                  │
│                  │       │     graphql com       │graphql│  7. Executa query│
│                  │       │     Bearer token      │       │                  │
│                  │       │                      │<──────│  8. Retorna JSON │
│  10. Renderiza   │<──────│  9. Retorna dados    │       │                  │
│      dashboard   │  JSON │     sanitizados      │       │                  │
│      com os      │       │     (sem token)      │       │                  │
│      dados       │       │                      │       │                  │
└─────────────────┘       └──────────────────────┘       └──────────────────┘
```

### Variáveis de Ambiente

| Variável | Onde é definida | Quem acessa | Prefixo VITE_? |
|----------|----------------|-------------|----------------|
| `GITHUB_TOKEN` | Vercel Dashboard (Sensitive) | Serverless functions (`process.env`) | ❌ NÃO |
| `VITE_GITHUB_USERNAME` | `.env` + Vercel Dashboard | Frontend (`import.meta.env`) | ✅ SIM |

### GitHub Token: Permissões Necessárias

Ao criar o Personal Access Token (PAT) no GitHub:

```
Permissões mínimas necessárias:
✅ read:user          — Ler perfil do usuário
✅ repo (public_repo) — Acessar repos públicos
✅ read:org           — Ler contribuições em organizações (opcional)
```

---

## 5. Estrutura de Diretórios Completa

```
d:\github_stats_wmakeouthill\
│
├── api/                                    # 🔒 Serverless functions (Vercel)
│   ├── github-stats.ts                     #    Proxy principal: profile + contributions + streak
│   └── github-languages.ts                 #    Proxy de linguagens (paginado)
│
├── src/
│   ├── features/                           # 📦 Módulos por feature (Clean Architecture)
│   │   │
│   │   ├── profile/                        # 🌑 O Corvo Central
│   │   │   ├── components/
│   │   │   │   └── ProfileCard/
│   │   │   │       ├── ProfileCard.tsx          # JSX puro: avatar, nome, bio, counters
│   │   │   │       ├── ProfileCard.module.css   # Estilos: nebulosa no avatar, fonte gótica
│   │   │   │       ├── ProfileCard.hooks.ts     # Lógica local do componente
│   │   │   │       ├── ProfileCard.types.ts     # Props e tipos locais
│   │   │   │       └── index.ts                 # Export barrel
│   │   │   ├── hooks/
│   │   │   │   └── useProfile.ts                # TanStack Query → GET /api/github-stats
│   │   │   ├── services/
│   │   │   │   └── profile.service.ts           # fetch('/api/github-stats')
│   │   │   ├── types/
│   │   │   │   └── profile.types.ts             # GitHubProfile, ProfileStats
│   │   │   └── index.ts
│   │   │
│   │   ├── contributions/                  # ✨ Poeira Cósmica (Heatmap)
│   │   │   ├── components/
│   │   │   │   └── ContributionNebula/
│   │   │   │       ├── ContributionNebula.tsx       # Grid de "estrelas" (divs circulares)
│   │   │   │       ├── ContributionNebula.module.css # Brilho proporcional, glow effects
│   │   │   │       ├── ContributionNebula.hooks.ts   # Cálculos de intensidade
│   │   │   │       ├── ContributionNebula.types.ts
│   │   │   │       └── index.ts
│   │   │   ├── hooks/
│   │   │   │   └── useContributions.ts
│   │   │   ├── types/
│   │   │   │   └── contributions.types.ts      # ContributionDay, ContributionWeek
│   │   │   └── index.ts
│   │   │
│   │   ├── languages/                      # 🪐 Astros Órfãos (Planetas)
│   │   │   ├── components/
│   │   │   │   └── LanguagePlanets/
│   │   │   │       ├── LanguagePlanets.tsx          # Planetas em órbita CSS
│   │   │   │       ├── LanguagePlanets.module.css   # @keyframes orbit, tamanhos variados
│   │   │   │       ├── LanguagePlanets.hooks.ts
│   │   │   │       ├── LanguagePlanets.types.ts
│   │   │   │       └── index.ts
│   │   │   ├── hooks/
│   │   │   │   └── useLanguages.ts                  # TanStack Query → GET /api/github-languages
│   │   │   ├── services/
│   │   │   │   └── languages.service.ts
│   │   │   ├── types/
│   │   │   │   └── languages.types.ts          # LanguageStat, LanguageColor
│   │   │   └── index.ts
│   │   │
│   │   ├── streak/                         # 👁 Olho do Corvo (Streak)
│   │   │   ├── components/
│   │   │   │   └── StreakCounter/
│   │   │   │       ├── StreakCounter.tsx            # Contador + citação Poe pulsante
│   │   │   │       ├── StreakCounter.module.css     # @keyframes pulse, glow vermelho
│   │   │   │       ├── StreakCounter.types.ts
│   │   │   │       └── index.ts
│   │   │   ├── types/
│   │   │   │   └── streak.types.ts             # StreakData
│   │   │   └── index.ts
│   │   │
│   │   ├── repositories/                   # 📖 O Grimório (Top Repos)
│   │   │   ├── components/
│   │   │   │   └── RepoGrimoire/
│   │   │   │       ├── RepoGrimoire.tsx            # Cards de repo estilo livro antigo
│   │   │   │       ├── RepoGrimoire.module.css     # Bordas ornamentadas, textura papel
│   │   │   │       ├── RepoGrimoire.types.ts
│   │   │   │       └── index.ts
│   │   │   ├── types/
│   │   │   │   └── repositories.types.ts       # Repository, RepoStats
│   │   │   └── index.ts
│   │   │
│   │   └── activity/                       # 〰 Ondas no Vácuo (Atividade)
│   │       ├── components/
│   │       │   └── ActivityWaves/
│   │       │       ├── ActivityWaves.tsx            # SVG com path animado
│   │       │       ├── ActivityWaves.module.css     # @keyframes wave
│   │       │       ├── ActivityWaves.types.ts
│   │       │       └── index.ts
│   │       ├── types/
│   │       │   └── activity.types.ts           # ActivityData
│   │       └── index.ts
│   │
│   ├── shared/                             # 🔧 Infraestrutura compartilhada
│   │   ├── components/
│   │   │   ├── ParticleField/              # Canvas com partículas flutuantes
│   │   │   │   ├── ParticleField.tsx
│   │   │   │   ├── ParticleField.module.css
│   │   │   │   ├── ParticleField.hooks.ts       # useCanvas, useAnimationFrame
│   │   │   │   └── index.ts
│   │   │   ├── GothicCard/                 # Card wrapper reutilizável
│   │   │   │   ├── GothicCard.tsx               # Bordas ornamentadas, glow on hover
│   │   │   │   ├── GothicCard.module.css
│   │   │   │   ├── GothicCard.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── CosmicLoader/               # Loading spinner temático
│   │   │   │   ├── CosmicLoader.tsx
│   │   │   │   ├── CosmicLoader.module.css
│   │   │   │   └── index.ts
│   │   │   └── ErrorState/                 # Estado de erro com citação Poe
│   │   │       ├── ErrorState.tsx
│   │   │       ├── ErrorState.module.css
│   │   │       └── index.ts
│   │   ├── hooks/
│   │   │   └── useParallax.ts              # Parallax sutil no mousemove
│   │   ├── services/
│   │   │   └── api.ts                      # Wrapper fetch para /api/*
│   │   ├── types/
│   │   │   └── github.types.ts             # Tipos base compartilhados
│   │   ├── utils/
│   │   │   └── formatters.ts               # formatNumber, formatDate, etc.
│   │   └── styles/
│   │       ├── global.css                  # Reset CSS + import das fontes Google
│   │       ├── variables.css               # CSS custom properties (tokens)
│   │       └── animations.css              # @keyframes compartilhados
│   │
│   ├── config/
│   │   └── env.ts                          # Validação e tipagem das env vars
│   │
│   ├── App.tsx                             # Layout principal (single page)
│   ├── App.module.css                      # Grid layout do dashboard
│   ├── main.tsx                            # Entry point, QueryClientProvider
│   └── vite-env.d.ts                       # Tipagem do import.meta.env
│
├── public/
│   └── favicon.svg                         # Ícone do corvo
│
├── .env.example                            # Template de env vars
├── .gitignore
├── vercel.json                             # Config de rewrites + SPA fallback
├── tsconfig.json                           # TypeScript config
├── tsconfig.node.json                      # TS config para API functions
├── vite.config.ts                          # Vite config com path aliases
├── package.json
├── regras-frontend.md                      # Regras (já existe)
└── PLANO-COMPLETO.md                       # Este arquivo
```

---

## 6. Serverless Functions (API — Proxy Seguro)

### 6.1 `api/github-stats.ts` — Query Principal

**Responsabilidades:**
- Receber GET request do frontend
- Ler `process.env.GITHUB_TOKEN`
- Executar query GraphQL que busca TUDO em uma request
- Calcular streak a partir do contributionsCollection
- Retornar JSON formatado

**Query GraphQL planejada:**

```graphql
query GitHubStats($username: String!) {
  user(login: $username) {
    # --- Profile ---
    name
    login
    bio
    avatarUrl
    location
    company
    websiteUrl
    createdAt

    # --- Counters ---
    followers { totalCount }
    following { totalCount }
    repositories(first: 0, ownerAffiliations: OWNER) { totalCount }
    
    # --- Stars recebidas (via repositórios) ---
    repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        name
        description
        url
        stargazerCount
        forkCount
        primaryLanguage { name color }
        updatedAt
        isArchived
      }
    }
    
    # --- Contribuições (último ano) ---
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoryContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            color
          }
        }
      }
    }
  }
}
```

**Response formatada do endpoint:**

```typescript
// GET /api/github-stats → Response
{
  profile: {
    name: string;
    login: string;
    bio: string;
    avatarUrl: string;
    location: string;
    createdAt: string;
    followers: number;
    following: number;
    publicRepos: number;
    totalStars: number;       // calculado: soma de stargazerCount
    totalForks: number;       // calculado: soma de forkCount
  },
  contributions: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalRepos: number;
    calendar: Array<{
      date: string;
      count: number;
      level: 0 | 1 | 2 | 3 | 4;   // calculado por quartis
    }>;
  },
  streak: {
    current: number;          // dias consecutivos com contribuição
    longest: number;          // maior streak do ano
    todayContributed: boolean;
  },
  topRepos: Array<{
    name: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    language: string;
    languageColor: string;
  }>;
}
```

### 6.2 `api/github-languages.ts` — Agregação de Linguagens

**Query GraphQL (paginada, busca linguagens de todos os repos):**

```graphql
query Languages($username: String!, $after: String) {
  user(login: $username) {
    repositories(first: 100, ownerAffiliations: OWNER, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node { name color }
          }
        }
      }
    }
  }
}
```

**Response formatada:**

```typescript
// GET /api/github-languages → Response
{
  languages: Array<{
    name: string;
    color: string;
    size: number;        // bytes totais
    percentage: number;  // calculado
    repoCount: number;   // em quantos repos aparece
  }>;
  totalSize: number;
}
```

### 6.3 Código da Serverless Function (estrutura)

```typescript
// api/github-stats.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Validar método
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Ler token do environment (NUNCA exposto ao frontend)
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  // 3. Username (pode vir de query param ou env)
  const username = (req.query.username as string) || process.env.GITHUB_USERNAME || 'wmakeouthill';

  try {
    // 4. Executar GraphQL query
    const response = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GITHUB_STATS_QUERY,
        variables: { username },
      }),
    });

    const { data, errors } = await response.json();
    
    if (errors) {
      return res.status(502).json({ error: 'GitHub API error', details: errors });
    }

    // 5. Transformar e sanitizar dados
    const formatted = transformGitHubData(data.user);

    // 6. Cache por 5 minutos (Vercel Edge Cache)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(formatted);
    
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

---

## 7. Componentes Compartilhados (Shared)

### 7.1 `ParticleField` — Background de Partículas

**Descrição:** Canvas HTML5 fullscreen no background com partículas brancas/roxas flutuando lentamente. Efeito de profundidade com parallax sutil no mousemove.

**Detalhes técnicos:**
- Canvas API com `requestAnimationFrame`
- ~100 partículas com velocidades aleatórias
- Opacidade variada (0.1 a 0.6) para profundidade
- Tamanho variado (0.5px a 2px)
- Cor: branco com variações roxas
- Conexões sutis (linhas) entre partículas próximas (< 100px)
- `position: fixed` no z-index 0

### 7.2 `GothicCard` — Card Base Reutilizável

**Descrição:** Wrapper de card com estética gótica para todas as seções.

**Detalhes visuais:**
- Background: gradiente `#0d0d14` → `#111827` com `backdrop-filter: blur()`
- Borda: `1px solid` com gradiente roxo/dourado sutil
- Cantos: decorações ornamentadas em CSS (pseudo-elementos `::before` e `::after`)
- Hover: glow roxo sutil (`box-shadow` com transição)
- Padding interno generoso

```css
/* Conceito da borda ornamentada */
.card::before {
  content: '✦';
  position: absolute;
  top: -8px;
  left: 50%;
  color: var(--faded-gold);
  font-size: 12px;
}
```

### 7.3 `CosmicLoader` — Loading State

**Descrição:** Spinner animado com estética de buraco negro / portal dimensional.

**Detalhes:**
- Anéis concêntricos girando em direções opostas
- Gradientes cônicos em roxo e dourado
- Texto pulsando: *"Consultando o abismo..."*

### 7.4 `ErrorState` — Estado de Erro

**Descrição:** Fallback de erro com citação aleatória de Poe.

**Citações disponíveis:**
- *"All that we see or seem is but a dream within a dream."*
- *"I became insane, with long intervals of horrible sanity."*
- *"The boundaries which divide Life from Death are at best shadowy and vague."*

---

## 8. Features Detalhadas

### 8.1 Profile — O Corvo Central 🌑

**Componente:** `ProfileCard`

**Layout:**
```
┌────────────────────────────────────────────────┐
│                                                 │
│         ╭─────────╮                             │
│         │ ◉ AVATAR│  ← Borda circular com      │
│         │         │    gradiente nebulosa        │
│         ╰─────────╯    (animated border)         │
│                                                 │
│      ═══ NOME DO USUÁRIO ═══                    │
│         @username                                │
│     "bio do perfil aqui..."                     │
│                                                 │
│   ┌────┐  ┌─────┐  ┌─────┐  ┌─────┐           │
│   │ 42 │  │ 128 │  │ 356 │  │ 89  │           │
│   │repos│  │stars│  │forks│  │flws │           │
│   └────┘  └─────┘  └─────┘  └─────┘           │
│                                                 │
│   Membro desde Janeiro 2020 · São Paulo         │
└────────────────────────────────────────────────┘
```

**Hook:** `useProfile`
```typescript
// Usa TanStack Query para fetch + cache
const { data, isLoading, isError } = useQuery({
  queryKey: ['github-stats'],
  queryFn: () => profileService.getStats(),
  staleTime: 5 * 60 * 1000,  // 5 min
  retry: 2,
});
```

### 8.2 Contributions — Poeira Cósmica ✨

**Componente:** `ContributionNebula`

**Conceito:** O heatmap de contribuições do GitHub, mas ao invés de quadrados verdes, são **pontos de luz** em uma grade que simula o céu noturno.

**Intensidade visual:**

| Contribuições | Visual |
|---------------|--------|
| 0 | Ponto invisível (apenas sombra sutil) |
| 1-3 | Estrela fraca (roxo escuro, opacity 0.3) |
| 4-7 | Estrela média (roxo médio, opacity 0.5) |
| 8-15 | Estrela brilhante (roxo claro, opacity 0.8) |
| 16+ | Estrela intensa com glow (dourado, opacity 1.0, box-shadow) |

**Legenda:** "Nas trevas, cada commit é uma estrela" + escala de intensidade

### 8.3 Languages — Astros Órfãos 🪐

**Componente:** `LanguagePlanets`

**Conceito:** Linguagens como planetas orbitando um centro gravitacional. Cada planeta:
- **Tamanho** proporcional ao % de uso
- **Cor** = cor oficial da linguagem no GitHub
- **Velocidade orbital** inversamente proporcional ao tamanho (planetas grandes orbitam devagar)
- **Label** com nome + percentual

**CSS Animation:**
```css
@keyframes orbit {
  from { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
}
```

### 8.4 Streak — Olho do Corvo 👁

**Componente:** `StreakCounter`

**Layout:**
```
┌──────────────────────────────────┐
│        👁                         │
│    (olho vermelho pulsante)       │
│                                   │
│        ██  42  ██                 │
│      dias consecutivos            │
│                                   │
│   "O pulso ininterrupto ecoa     │
│    há 42 dias... Nevermore."      │
│                                   │
│   Maior streak: 87 dias          │
│   Hoje: ✓ já contribuiu          │
└──────────────────────────────────┘
```

**Animação:** 
- O número pulsa com `scale` e `text-shadow` vermelho
- Efeito de respiração: `opacity` oscilando entre 0.7 e 1.0
- Quando streak = 0: texto cinza, citação muda para *"Once upon a midnight dreary..."*

### 8.5 Repositories — O Grimório 📖

**Componente:** `RepoGrimoire`

**Conceito:** Top 6 repos estilizados como páginas de um grimório medieval.

**Visual de cada card-repo:**
- Background com textura de pergaminho (gradient CSS simulando papel amarelado sobre fundo escuro)
- Borda com cantos ornamentados
- Nome do repo em fonte `Cinzel`
- Descrição em `EB Garamond` itálico
- Stars mostradas como ✦ dourados
- Forks como 🜂 (símbolo alquímico)
- Linguagem como badge colorido
- Hover: card levita com `translateY(-4px)` e glow aumenta

### 8.6 Activity — Ondas no Vácuo 〰

**Componente:** `ActivityWaves`

**Conceito:** Gráfico SVG que mostra contribuições dos últimos 30 dias como uma onda sonora/cardíaca no vácuo cósmico.

**Detalhes:**
- SVG `<path>` suave (curvas Bézier) conectando os pontos de contribuição
- Gradiente de preenchimento de baixo para cima (roxo → transparente)
- Animação de "drawn line" (`stroke-dasharray` + `stroke-dashoffset`)
- Labels dos dias embaixo em fonte `JetBrains Mono` pequena

---

## 9. Estilos & Design System

### 9.1 `global.css` — Reset + Fontes

```css
/* Google Fonts imports */
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');

/* CSS Reset mínimo */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  font-family: 'Inter', sans-serif;
  background-color: var(--void-black);
  color: var(--phantom-white);
  min-height: 100vh;
  overflow-x: hidden;
}
```

### 9.2 `variables.css` — Design Tokens

Todas as cores, espaçamentos, font-sizes como CSS custom properties globais.

### 9.3 `animations.css` — Keyframes Compartilhados

```css
@keyframes float    { /* partículas flutuando */ }
@keyframes pulse    { /* brilho pulsante (streak, erros) */ }
@keyframes glow     { /* box-shadow oscilante */ }
@keyframes fadeIn   { /* entrada suave dos cards */ }
@keyframes orbit    { /* planetas de linguagem orbitando */ }
@keyframes breathe  { /* opacidade oscilante sutil */ }
@keyframes drawLine { /* SVG path sendo "desenhado" */ }
@keyframes shimmer  { /* loading skeleton shimmer */ }
```

---

## 10. Configuração do Projeto

### 10.1 `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 10.2 `vercel.json`

```json
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

### 10.3 `tsconfig.json` (paths)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 10.4 `.env.example`

```env
# Username do GitHub (público, vai pro bundle)
VITE_GITHUB_USERNAME=seu-username-aqui

# Token do GitHub (SOMENTE na Vercel, NUNCA commit!)
# GITHUB_TOKEN=ghp_xxxx
```

### 10.5 `package.json` (dependências)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.x"
  },
  "devDependencies": {
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "@vercel/node": "^3.x",
    "typescript": "^5.6",
    "vite": "^6.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

---

## 11. Fluxo de Deploy na Vercel

### Passo a Passo

```
1. Push do código para o GitHub
   └── git push origin main

2. Conectar o repo na Vercel
   └── vercel.com → New Project → Import Git Repository

3. Configurar Environment Variables na Vercel Dashboard
   ├── GITHUB_TOKEN     = ghp_xxxx... (marcar como SENSITIVE ⚠️)
   ├── GITHUB_USERNAME  = wmakeouthill
   └── VITE_GITHUB_USERNAME = wmakeouthill

4. Deploy automático
   └── Vercel detecta Vite, roda `npm run build`, serve o SPA
   └── Pasta /api é deployada como serverless functions automaticamente

5. Verificar
   └── Acessar https://seu-projeto.vercel.app
   └── Verificar Network tab: requests vão para /api/* (token oculto)
```

### Estrutura na Vercel após deploy

```
Vercel Project:
├── Static Files (dist/)        → CDN global
│   ├── index.html
│   ├── assets/
│   │   ├── index-xxxx.js       ← NÃO contém GITHUB_TOKEN
│   │   └── index-xxxx.css
│   └── favicon.svg
│
├── Serverless Functions (api/) → Node.js runtime
│   ├── github-stats.ts         ← TEM acesso a process.env.GITHUB_TOKEN
│   └── github-languages.ts     ← TEM acesso a process.env.GITHUB_TOKEN
```

---

## 12. Plano de Verificação

### 12.1 Desenvolvimento Local

| Passo | Comando/Ação | Resultado Esperado |
|-------|-------------|-------------------|
| 1 | `npm install` | Dependências instaladas sem erros |
| 2 | `npm run dev` | Vite dev server na porta 5173 |
| 3 | Abrir browser | Dashboard renderiza com loading state |
| 4 | `npm run build` | Build sem erros TypeScript |

### 12.2 Verificação Visual (Browser)

| Item | Como verificar |
|------|---------------|
| Partículas | Canvas animado no background |
| Cards góticos | Bordas ornamentadas, glow no hover |
| Profile | Avatar com borda nebulosa, stats numéricos |
| Heatmap | Grid de estrelas com intensidades variadas |
| Linguagens | Planetas orbitando com cores corretas |
| Streak | Número pulsante, citação Poe |
| Repos | Cards estilo grimório com stars/forks |
| Activity | Onda SVG animada |
| Responsivo | Funciona em 320px a 1920px+ |
| Loading | CosmicLoader aparece enquanto dados carregam |
| Erro | ErrorState com citação Poe se API falhar |

### 12.3 Verificação de Segurança

| Item | Como verificar | Esperado |
|------|---------------|----------|
| Token no bundle | DevTools → Sources → buscar "ghp_" | NÃO encontrado |
| Token no network | DevTools → Network → headers de cada request | NÃO presente |
| Endpoint correto | Network tab → ver URLs das requests | `/api/github-stats` |
| CORS | Console → erros de CORS | Nenhum erro |

### 12.4 Após Deploy na Vercel

| Passo | Resultado Esperado |
|-------|--------------------|
| Acessar URL da Vercel | Dashboard carrega com dados reais |
| Checar `/api/github-stats` direto | JSON com dados formatados (sem token visível) |
| Testar mobile | Layout responsivo funcional |
| Testar performance (Lighthouse) | Performance > 80 |

---

## 13. Checklist de Execução

### Fase 1: Scaffold do Projeto
- [ ] Inicializar Vite + React 19 + TypeScript
- [ ] Configurar path aliases (`@/`)
- [ ] Instalar TanStack Query e `@vercel/node`
- [ ] Criar `.env.example`, `.gitignore`, `vercel.json`
- [ ] Criar estrutura de diretórios

### Fase 2: Serverless API
- [ ] Implementar `api/github-stats.ts`
- [ ] Implementar `api/github-languages.ts`
- [ ] Testar queries no GitHub GraphQL Explorer

### Fase 3: Design System
- [ ] Criar `global.css` (reset + fontes)
- [ ] Criar `variables.css` (tokens de design)
- [ ] Criar `animations.css` (keyframes)

### Fase 4: Shared Components
- [ ] `ParticleField` (Canvas API)
- [ ] `GothicCard` (wrapper)
- [ ] `CosmicLoader` (loading)
- [ ] `ErrorState` (erro)

### Fase 5: Features
- [ ] Profile → `ProfileCard`
- [ ] Contributions → `ContributionNebula`
- [ ] Languages → `LanguagePlanets`
- [ ] Streak → `StreakCounter`
- [ ] Repositories → `RepoGrimoire`
- [ ] Activity → `ActivityWaves`

### Fase 6: Layout & Polish
- [ ] `App.tsx` — grid layout integrando tudo
- [ ] Responsividade (mobile-first)
- [ ] Micro-animações de entrada
- [ ] Parallax no mouse

### Fase 7: Verificação
- [ ] Dev server sem erros
- [ ] Build produção sem erros
- [ ] Verificação visual no browser
- [ ] Verificação de segurança (token oculto)

### Fase 8: Deploy
- [ ] Push para GitHub
- [ ] Conectar na Vercel
- [ ] Configurar env vars (GITHUB_TOKEN como Sensitive)
- [ ] Validar em produção

---

> *"I have great faith in fools — self-confidence my friends will call it."*
> — Edgar Allan Poe
