The Raven's Nebula — GitHub Stats Dashboard
Um painel de estatísticas GitHub com estética gótica-cósmica inspirada em Edgar Allan Poe. Frontend React 19 + Vite deployado na Vercel com serverless functions como proxy seguro para o token GitHub.

Conceito Visual: A Nebulosa do Corvo
"Deep into that darkness peering, long I stood there wondering, fearing..."

O dashboard é uma janela para o abismo cósmico, onde suas estatísticas GitHub emergem de uma nebulosa escura em forma de corvo. A paleta é dominada por:

Fundo: Vazio estelar (#0a0a0f) com partículas flutuantes
Primárias: Roxo profundo (#6b21a8), Azul meia-noite (#1e1b4b), Carmesim (#991b1b)
Acentos: Dourado fosco (#d4a574), Prata estelar (#c0c0c0), Verde espectral (#22c55e)
Tipografia: Fonte serifada gótica (Cinzel / EB Garamond) para títulos, mono (JetBrains Mono) para dados
Seções do Dashboard
O Corvo Central — Avatar + bio + stats gerais no centro de uma nebulosa animada com partículas
Os Astros Órfãos — Linguagens como planetas orbitando, cada um com a cor da linguagem
O Olho do Corvo — Streak counter com brilho vermelho pulsante, citação de Poe
Poeira Cósmica — Heatmap de contribuições como uma constelação
O Grimório — Top repositórios como páginas de um livro antigo
Ondas no Vácuo — Gráfico de atividade recente como ondas de choque
Arquitetura & Segurança
IMPORTANT

O token GitHub NUNCA será exposto no frontend. Usaremos serverless functions da Vercel (/api) como proxy seguro.

🐙 GitHub GraphQL API
⚡ Vercel Serverless (/api)
🌑 Frontend (React)
🐙 GitHub GraphQL API
⚡ Vercel Serverless (/api)
🌑 Frontend (React)
GET /api/github-stats
process.env.GITHUB_TOKEN
POST graphql (com Bearer token)
JSON response
Dados sanitizados
Fluxo de variáveis de ambiente
Variável	Onde	Acesso
GITHUB_TOKEN	Vercel Environment Variables (Sensitive)	Apenas serverless (process.env)
VITE_GITHUB_USERNAME	.env / Vercel Env	Frontend (import.meta.env)
User Review Required
WARNING

Decisão sobre estilização: Suas regras (
regras-frontend.md
) listam tanto Tailwind CSS 4+ quanto Styled Components e CSS Modules. Para a estética gótico-cósmica com animações pesadas, eu recomendo CSS Modules (sem Tailwind), pois teremos @keyframes complexos, gradientes customizados e pseudo-elementos estilizados que ficam mais legíveis em CSS puro. Confirme se concorda.

IMPORTANT

Decisão sobre Server Actions: Suas regras mandam usar use server e useActionState. Como esta app é read-only (apenas consulta a API do GitHub, sem formulários de mutação), não vamos usar Server Actions nem useActionState. Faz sentido?

IMPORTANT

Username GitHub: O plano assume que seu username é configurável via env var VITE_GITHUB_USERNAME. Qual é seu username no GitHub para eu configurar como default?

Proposed Changes
Inicialização do Projeto
[NEW] Projeto Vite + React 19 + TypeScript
Inicializar com npx -y create-vite@latest ./ --template react-ts.

Serverless API (Proxy Seguro)
[NEW] 
github-stats.ts
Vercel serverless function que:

Lê process.env.GITHUB_TOKEN (nunca exposto)
Faz query GraphQL para GitHub em uma única request
Retorna dados formatados: profile, contributions, languages, repos, streak
[NEW] 
github-languages.ts
Serverless function separada para agregar linguagens (mais pesada, precisa paginar repos).

Configuração
[NEW] 
vercel.json
Configuração de rewrites/routes para API e SPA fallback.

[NEW] 
.env.example
Template de variáveis de ambiente.

[NEW] 
.gitignore
Inclui .env.local, node_modules, dist.

Estrutura de Features (Clean Architecture, conforme 
regras-frontend.md
)
src/
├── features/
│   ├── profile/                    # Corvo Central — perfil + stats
│   │   ├── components/
│   │   │   └── ProfileCard/
│   │   │       ├── ProfileCard.tsx
│   │   │       ├── ProfileCard.module.css
│   │   │       ├── ProfileCard.hooks.ts
│   │   │       ├── ProfileCard.types.ts
│   │   │       └── index.ts
│   │   ├── hooks/
│   │   │   └── useProfile.ts
│   │   ├── services/
│   │   │   └── profile.service.ts
│   │   ├── types/
│   │   │   └── profile.types.ts
│   │   └── index.ts
│   │
│   ├── contributions/              # Poeira Cósmica — heatmap
│   │   ├── components/
│   │   │   └── ContributionNebula/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── languages/                  # Astros Órfãos — planetas
│   │   ├── components/
│   │   │   └── LanguagePlanets/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── streak/                     # Olho do Corvo — streak
│   │   ├── components/
│   │   │   └── StreakCounter/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── repositories/               # Grimório — top repos
│   │   ├── components/
│   │   │   └── RepoGrimoire/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── activity/                   # Ondas no Vácuo — atividade
│       ├── components/
│       │   └── ActivityWaves/
│       ├── hooks/
│       ├── types/
│       └── index.ts
│
├── shared/
│   ├── components/
│   │   ├── ParticleField/          # Background de partículas
│   │   ├── GothicCard/             # Card base com borda gótica
│   │   ├── CosmicLoader/           # Loading animado
│   │   └── ErrorState/             # Estado de erro temático
│   ├── hooks/
│   │   └── useParallax.ts          # Efeito parallax no mouse
│   ├── services/
│   │   └── api.ts                  # Fetch wrapper para /api
│   ├── types/
│   │   └── github.types.ts         # Tipos compartilhados GitHub
│   ├── utils/
│   │   └── formatters.ts           # Formatação de números, datas
│   └── styles/
│       ├── global.css              # Reset + variáveis CSS + fontes
│       ├── animations.css          # @keyframes compartilhados
│       └── gothic-theme.css        # Tokens de design gótico
│
├── config/
│   └── env.ts                      # Tipagem das env vars
│
├── App.tsx                         # Layout principal (single page)
├── App.module.css
└── main.tsx
Shared Components
[NEW] ParticleField — Background animado com partículas flutuantes (Canvas API)
[NEW] GothicCard — Card reutilizável com bordas ornamentadas em CSS
[NEW] CosmicLoader — Spinner com estética de buraco negro
[NEW] ErrorState — Estado de erro com citação de Poe
Feature: Profile (O Corvo Central)
[NEW] ProfileCard — Avatar circular com border de nebulosa, nome em fonte gótica, bio, counters (repos, followers, stars, forks)
[NEW] useProfile hook — TanStack Query para GET /api/github-stats
[NEW] profile.service.ts — Fetch para o endpoint serverless
Feature: Contributions (Poeira Cósmica)
[NEW] ContributionNebula — Heatmap de contribuições renderizado como constelação/nebulosa. Cada célula é uma "estrela" com brilho proporcional ao nº de contribuições do dia.
Feature: Languages (Astros Órfãos)
[NEW] LanguagePlanets — Linguagens como planetas animados em órbita (CSS animations). Tamanho proporcional ao uso. Cor = cor oficial da linguagem no GitHub.
Feature: Streak (Olho do Corvo)
[NEW] StreakCounter — Contador de streak com efeito de brilho pulsante vermelho. Citação de Poe: "O pulso que ecoa há [X] dias... Nevermore."
Feature: Repositories (O Grimório)
[NEW] RepoGrimoire — Lista dos top repos estilizados como páginas de um grimório antigo. Stars como pentagramas, forks como galhos.
Feature: Activity (Ondas no Vácuo)
[NEW] ActivityWaves — Gráfico SVG de atividade recente com animação de ondas.
Verificação
Testes Automatizados (Dev Server)
Rodar o projeto localmente:

bash
npm run dev
Verificar que o Vite inicia sem erros na porta padrão.

Build de produção:

bash
npm run build
Verificar que não há erros de TypeScript nem de build.

Verificação Visual (Browser)
Abrir no browser e verificar:
Partículas animadas no background
Cards com estética gótica carregando
Loading states funcionando (CosmicLoader)
Responsividade mobile (redimensionar browser)
Verificação de Segurança
Inspecionar Network tab do browser:
Confirmar que requests vão para /api/github-stats (proxy)
Confirmar que nenhum header contém o token GitHub
Confirmar que GITHUB_TOKEN não aparece no source code do bundle
Manual (Deploy na Vercel)
Após aprovação do plano, o deploy será feito pelo usuário via:
Push para GitHub → Vercel auto-deploy
Configurar GITHUB_TOKEN como Sensitive Environment Variable no dashboard Vercel
Configurar VITE_GITHUB_USERNAME como Environment Variable normal
Verificar que o site funciona em produção com dados reais