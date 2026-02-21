# Regras de Desenvolvimento Frontend - Stack React

Este documento estabelece as regras, princípios e padrões para o desenvolvimento frontend de aplicações React.

---

---

## 📋 ÍNDICE

1. [Clean Architecture no Frontend](#1-clean-architecture-no-frontend)
2. [Sintaxe Moderna Obrigatória (React 19)](#2-sintaxe-moderna-obrigatória-react-19)
3. [Separação de Arquivos](#3-separação-de-arquivos-obrigatória)
4. [Limites de Tamanho](#4-limites-de-tamanho-manutenibilidade)
5. [Stack Tecnológica](#5-stack-tecnológica)
6. [Padrões de Código](#6-padrões-de-código)
7. [API Base](#7-api-base)
8. [Estado Reativo](#8-estado-reativo)
9. [Roteamento](#9-roteamento)
10. [Utilitários](#10-utilitários-equivalente-a-pipes)
11. [Boas Práticas](#11-boas-práticas)
12. [Checklist de Revisão](#12-checklist-de-revisão)
13. [Princípios SOLID no React](#13-princípios-solid-no-react)
14. [Testes Frontend](#14-testes-frontend)
15. [Anti-Patterns](#15-anti-patterns)
16. [Padrões de Nomenclatura](#16-padrões-de-nomenclatura)
17. [SSR e Hidratação](#17-ssr-e-hidratação-react-19--nextjs)
18. [Ordem de Membros no Componente](#18-ordem-de-membros-no-componente)
19. [Acessibilidade (a11y)](#19-acessibilidade-a11y)
20. [Performance e Otimização](#20-performance-e-otimização)

---

## 1. Clean Architecture no Frontend

### 1.1 Princípios

A arquitetura frontend segue uma adaptação da Clean Architecture para React:

- **Separação por Feature**: Cada funcionalidade em seu próprio módulo
- **Separação de Responsabilidades**: Template (JSX), estilos (CSS/SCSS) e lógica (hooks/funções) em arquivos separados
- **Componentes Reutilizáveis**: Componentes UI isolados em shared
- **Hooks como Camada de Dados**: Abstração para comunicação com backend
- **Types como Domínio**: Tipos e interfaces representam entidades do negócio

### 1.2 Camadas da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                          PAGES                                   │
│  (Componentes de Página / Smart Components)                     │
│  - Coordena fluxo da tela                                       │
│  - Usa hooks para dados e estado                                │
│  - Gerencia estado da página                                    │
├─────────────────────────────────────────────────────────────────┤
│                        HOOKS / SERVICES                          │
│  (Hooks React Query / Serviços HTTP)                            │
│  - Comunicação com backend                                      │
│  - Transformação de dados                                       │
│  - Lógica de orquestração                                       │
├─────────────────────────────────────────────────────────────────┤
│                         TYPES                                    │
│  (Interfaces / Classes TypeScript)                              │
│  - Representação do domínio                                     │
│  - Tipagem forte                                                │
│  - Contratos de dados                                           │
├─────────────────────────────────────────────────────────────────┤
│                    SHARED (Infraestrutura)                       │
│  (Components, Hooks, Utils, Formatters)                         │
│  - Componentes reutilizáveis                                    │
│  - Funções de formatação                                        │
│  - Hooks utilitários                                            │
│  - Interceptors HTTP                                            │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Estrutura de Diretórios

```
src/
├── features/                          # Módulos de feature
│   └── {feature}/                     # Ex: operacao
│       ├── components/                # Componentes específicos da feature
│       │   └── {Component}/
│       │       ├── {Component}.tsx           # Apenas JSX (template)
│       │       ├── {Component}.styles.ts     # Styled-components ou CSS Modules
│       │       ├── {Component}.module.css    # CSS Modules (alternativa)
│       │       ├── {Component}.hooks.ts      # Hooks específicos do componente
│       │       ├── {Component}.types.ts      # Tipos/Props do componente
│       │       └── index.ts                  # Export barrel
│       ├── hooks/                     # Hooks da feature (React Query)
│       │   └── use{Feature}.ts
│       ├── pages/                     # Páginas da feature
│       │   └── {Page}/
│       │       ├── {Page}.tsx
│       │       ├── {Page}.styles.ts
│       │       └── {Page}.hooks.ts
│       ├── services/                  # Serviços API
│       │   └── {feature}.service.ts
│       ├── types/                     # Tipos da feature
│       │   └── {feature}.types.ts
│       └── index.ts
│
├── shared/                            # Compartilhado
│   ├── components/                    # Componentes UI reutilizáveis
│   │   └── {Component}/
│   │       ├── {Component}.tsx
│   │       ├── {Component}.styles.ts
│   │       └── index.ts
│   ├── hooks/                         # Hooks utilitários
│   ├── services/                      # Cliente HTTP base
│   │   └── api.ts
│   ├── types/                         # Tipos compartilhados
│   ├── utils/                         # Funções utilitárias
│   │   └── formatters.ts              # Equivalente a Pipes do Angular
│   └── styles/                        # Estilos globais
│
├── stores/                            # Estado global (Zustand)
├── config/                            # Configurações
└── main.tsx
```

### 1.4 Regra de Dependência

```
pages → hooks/services → types ← shared
```

- **pages** pode importar de: `hooks`, `services`, `types`, `shared`, `stores`
- **hooks** pode importar de: `services`, `types`, `shared`
- **services** pode importar de: `types`, `shared`
- **types** são independentes
- **shared** pode importar de: `types` compartilhados

- **shared** pode importar de: `types` compartilhados

---

## 2. SINTAXE MODERNA OBRIGATÓRIA (REACT 19)

### 2.1 Server Actions (Substitui API Calls manuais em Forms)

```typescript
// ✅ CORRETO - Server Action (actions/produto.ts)
'use server';

export async function criarProduto(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData);
  try {
    await db.produto.create({ data });
    revalidatePath('/produtos');
    return { message: 'Criado com sucesso' };
  } catch (e) {
    return { error: 'Erro ao criar' };
  }
}

// ✅ CORRETO - Consumo em Componente
export function ProdutoForm() {
  const [state, action, isPending] = useActionState(criarProduto, null);
  
  return (
    <form action={action}>
      <input name="nome" />
      <button disabled={isPending}>Salvar</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}

// ❌ PROIBIDO - onSubmit manual com preventDefault (exceto casos complexos)
const handleSubmit = async (e) => {
  e.preventDefault();
  await api.post('/produtos', data); // Use Server Actions preferencialmente
}
```

### 2.2 Hook use()

```typescript
// ✅ CORRETO - use() para Context
const theme = use(ThemeContext);

// ✅ CORRETO - use() para Promises (suspendable)
function ProdutoDetalhe({ produtoPromise }: { produtoPromise: Promise<Produto> }) {
  const produto = use(produtoPromise); // Suspende até resolver
  return <h1>{produto.nome}</h1>;
}

// ❌ PROIBIDO - useContext ou useEffect para data fetching simples
const [data, setData] = useState(null);
useEffect(() => { ... }, []);
```

### 2.3 UI Otimista

```typescript
// ✅ CORRETO - useOptimistic
export function LikeButton({ likes, produtoId }: { likes: number }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (state, newLike: number) => state + newLike
  );

  return (
    <form action={async () => {
      addOptimisticLike(1);
      await likeProdutoAction(produtoId);
    }}>
      <button>Likes: {optimisticLikes}</button>
    </form>
  );
}
```

---

## 3. Separação de Arquivos (OBRIGATÓRIA)

### 3.1 Regra de Ouro

> **NUNCA misture template (JSX), estilos (CSS) e lógica (funções/hooks) no mesmo arquivo.**

Esta regra é **OBRIGATÓRIA** para todos os componentes com mais de 50 linhas. A separação garante:

```typescript
// ❌ RUIM: Tudo junto em um único arquivo (300+ linhas)
export function OperacaoTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({});
  
  // 50 linhas de lógica...
  
  const styles = {
    container: { display: 'flex', padding: '20px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    // 30 linhas de estilos inline...
  };
  
  return (
    <div style={styles.container}>
      {/* 100+ linhas de JSX */}
    </div>
  );
}

// ✅ BOM: Separado em múltiplos arquivos
// OperacaoTable/
// ├── OperacaoTable.tsx        # Apenas JSX
// ├── OperacaoTable.styles.ts  # Apenas estilos
// ├── OperacaoTable.hooks.ts   # Apenas lógica
// ├── OperacaoTable.types.ts   # Apenas tipos
// └── index.ts                 # Export barrel
```

### 3.2 Estrutura de Componente Separado

**OperacaoTable.types.ts** - Tipos e interfaces:

```typescript
// features/operacao/components/OperacaoTable/OperacaoTable.types.ts
import { Operacao } from '../../types/operacao.types';

export interface OperacaoTableProps {
  operacoes: Operacao[];
  isLoading?: boolean;
  onRowClick?: (operacao: Operacao) => void;
  onDelete?: (id: string) => void;
}

export interface OperacaoTableState {
  selectedRows: Set<string>;
  sortColumn: keyof Operacao | null;
  sortDirection: 'asc' | 'desc';
}
```

**OperacaoTable.styles.ts** - Estilos isolados:

```typescript
// features/operacao/components/OperacaoTable/OperacaoTable.styles.ts
import styled from 'styled-components';
// OU usando CSS Modules: import styles from './OperacaoTable.module.css';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  tr:hover {
    background-color: var(--hover-bg);
  }
`;

export const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;
```

**OperacaoTable.hooks.ts** - Lógica do componente:

```typescript
// features/operacao/components/OperacaoTable/OperacaoTable.hooks.ts
import { useState, useCallback, useMemo } from 'react';
import { Operacao } from '../../types/operacao.types';
import { OperacaoTableState } from './OperacaoTable.types';

export function useOperacaoTable(operacoes: Operacao[]) {
  const [state, setState] = useState<OperacaoTableState>({
    selectedRows: new Set(),
    sortColumn: null,
    sortDirection: 'asc',
  });

  const toggleRowSelection = useCallback((id: string) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedRows);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return { ...prev, selectedRows: newSelected };
    });
  }, []);

  const handleSort = useCallback((column: keyof Operacao) => {
    setState(prev => ({
      ...prev,
      sortColumn: column,
      sortDirection: prev.sortColumn === column && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const sortedOperacoes = useMemo(() => {
    if (!state.sortColumn) return operacoes;
    
    return [...operacoes].sort((a, b) => {
      const aVal = a[state.sortColumn!];
      const bVal = b[state.sortColumn!];
      const direction = state.sortDirection === 'asc' ? 1 : -1;
      return aVal < bVal ? -direction : direction;
    });
  }, [operacoes, state.sortColumn, state.sortDirection]);

  return {
    ...state,
    sortedOperacoes,
    toggleRowSelection,
    handleSort,
  };
}
```

**OperacaoTable.tsx** - Apenas template JSX:

```typescript
// features/operacao/components/OperacaoTable/OperacaoTable.tsx
import { OperacaoTableProps } from './OperacaoTable.types';
import { useOperacaoTable } from './OperacaoTable.hooks';
import * as S from './OperacaoTable.styles';
import { formatDate, formatCurrency } from '@/shared/utils/formatters';
import { Skeleton, Badge, Checkbox } from '@/shared/components';

export function OperacaoTable({ operacoes, isLoading, onRowClick, onDelete }: OperacaoTableProps) {
  const { 
    selectedRows, 
    sortedOperacoes, 
    toggleRowSelection, 
    handleSort 
  } = useOperacaoTable(operacoes);

  if (isLoading) {
    return (
      <S.LoadingOverlay>
        <Skeleton rows={5} />
      </S.LoadingOverlay>
    );
  }

  if (operacoes.length === 0) {
    return <EmptyState message="Nenhuma operação encontrada" />;
  }

  return (
    <S.Container>
      <S.Table>
        <thead>
          <tr>
            <th><Checkbox /></th>
            <th onClick={() => handleSort('numeroOperacao')}>Número</th>
            <th onClick={() => handleSort('dataMovimento')}>Data</th>
            <th onClick={() => handleSort('valorFinanceiro')}>Valor</th>
            <th onClick={() => handleSort('situacao')}>Situação</th>
          </tr>
        </thead>
        <tbody>
          {sortedOperacoes.map((op) => (
            <tr key={op.id} onClick={() => onRowClick?.(op)}>
              <td>
                <Checkbox 
                  checked={selectedRows.has(op.id)}
                  onChange={() => toggleRowSelection(op.id)}
                />
              </td>
              <td>{op.numeroOperacao}</td>
              <td>{formatDate(op.dataMovimento)}</td>
              <td>{formatCurrency(op.valorFinanceiro)}</td>
              <td><Badge variant={op.situacao}>{op.situacao}</Badge></td>
            </tr>
          ))}
        </tbody>
      </S.Table>
    </S.Container>
  );
}
```

**index.ts** - Export barrel:

```typescript
// features/operacao/components/OperacaoTable/index.ts
export { OperacaoTable } from './OperacaoTable';
export type { OperacaoTableProps } from './OperacaoTable.types';
```

### 3.3 Quando Não Separar

Componentes muito simples (< 50 linhas) podem ficar em arquivo único:

```typescript
// ✅ OK: Componente simples, menos de 50 linhas
interface BadgeProps {
  variant: 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
}
```

---

## 4. Limites de Tamanho (Manutenibilidade)

### 4.1 Regras de Tamanho

| Tipo de Arquivo       | Limite Máximo  | Ação se Exceder                                      |
| --------------------- | -------------- | ---------------------------------------------------- |
| Componente (.tsx)     | **200 linhas** | Extrair lógica para hooks, quebrar em subcomponentes |
| Hook (.hooks.ts)      | **400 linhas** | Dividir em hooks menores e mais específicos          |
| Service (.service.ts) | **400 linhas** | Dividir por responsabilidade/entidade                |
| Estilos (.styles.ts)  | **300 linhas** | Extrair estilos comuns para shared                   |
| Types (.types.ts)     | **200 linhas** | Dividir por contexto/entidade                        |
| Página (Page.tsx)     | **150 linhas** | Delegar para componentes filhos                      |

### 4.2 Exemplos de Refatoração

**Antes (componente com 350 linhas):**

```typescript
// ❌ RUIM: Componente muito grande
export function ConsultaOperacao() {
  // 50 linhas de state e hooks
  const [filtro, setFiltro] = useState({});
  const [data, setData] = useState([]);
  // ... mais estados
  
  // 100 linhas de funções handler
  const handleSearch = () => { /* ... */ };
  const handleExport = () => { /* ... */ };
  const handlePrint = () => { /* ... */ };
  // ... mais handlers
  
  // 200 linhas de JSX
  return (
    <div>
      {/* Filtros, tabela, paginação, modais, tudo junto */}
    </div>
  );
}
```

**Depois (componente com 80 linhas):**

```typescript
// ✅ BOM: Componente enxuto, lógica delegada
// ConsultaOperacao/
// ├── ConsultaOperacao.tsx      # ~80 linhas
// ├── ConsultaOperacao.hooks.ts # Lógica extraída
// ├── ConsultaOperacao.styles.ts
// └── components/
//     ├── FiltrosOperacao/
//     ├── TabelaOperacao/
//     └── ModalDetalhe/

export function ConsultaOperacao() {
  const { 
    filtro, 
    resultado, 
    isLoading,
    handlers 
  } = useConsultaOperacao();

  return (
    <S.PageContainer>
      <S.Header>
        <h1>Consulta de Operações</h1>
        <ExportButtons onExport={handlers.export} onPrint={handlers.print} />
      </S.Header>
      
      <FiltrosOperacao 
        filtro={filtro} 
        onFiltrar={handlers.search} 
      />
      
      <TabelaOperacao 
        dados={resultado.dados} 
        isLoading={isLoading}
        onRowClick={handlers.openDetail}
      />
      
      <Pagination 
        {...resultado.paginacao} 
        onPageChange={handlers.paginate} 
      />
    </S.PageContainer>
  );
}
```

### 4.3 Métricas de Complexidade

Além do número de linhas, monitore:

- **Número de props**: Máximo 7-8 props por componente
- **Número de estados**: Máximo 5-6 useState por componente (considere useReducer)
- **Profundidade de nesting JSX**: Máximo 4 níveis
- **Número de hooks customizados**: Se > 3, considere combinar em um único hook

```typescript
// ❌ RUIM: Muitos estados, difícil de manter
function Component() {
  const [a, setA] = useState();
  const [b, setB] = useState();
  const [c, setC] = useState();
  const [d, setD] = useState();
  const [e, setE] = useState();
  const [f, setF] = useState();
  const [g, setG] = useState();
  const [h, setH] = useState();
  // ...
}

// ✅ BOM: Estado consolidado
function Component() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // OU
  const componentState = useComponentState(); // Hook customizado
}
```

---

## 5. Stack Tecnológica

| Tecnologia            | Versão | Propósito                 |
| --------------------- | ------ | ------------------------- |
| React                 | 19+    | Biblioteca UI (RC/Stable) |
| TypeScript            | 5.6+   | Linguagem principal       |
| Vite                  | 6+     | Build tool                |
| TanStack Query        | 5+     | Data fetching (Client)    |
| Zustand               | 5+     | Estado global (Client)    |
| React Hook Form + Zod | latest | Formulários e validação   |
| Tailwind CSS          | 4+     | Estilização utilitária    |
| Shadcn/UI             | latest | Componentes UI base       |
| Vitest                | 2+     | Framework de testes       |

### 4.1 Recursos Obrigatórios (React 19)

```typescript
// ✅ SEMPRE usar estas features (React 19+)
use()               // Consumo de Promises e Context
"use server"        // Server Actions
"use client"        // Client Components
useOptimistic()     // UI Otimista
useActionState()    // Estado de Form Actions
useFormStatus()     // Loading de Form Actions

// ✅ SEMPRE usar esta sintaxe
<form action={action}>    // Server Actions em Forms
<Suspense>                // Boundaries para Promises
```

### 5.2 Escolha de Estilização

| Abordagem             | Quando Usar                              | Arquivo                |
| --------------------- | ---------------------------------------- | ---------------------- |
| **Tailwind CSS**      | Componentes simples, prototipação rápida | Classes no JSX         |
| **Styled Components** | Componentes complexos, temas dinâmicos   | `Component.styles.ts`  |
| **CSS Modules**       | Isolamento estrito, projetos legados     | `Component.module.css` |

---

## 6. Padrões de Código

### 6.1 Types (Domínio)

```typescript
// features/operacao/types/operacao.types.ts
export interface Operacao {
  id: string;
  numeroOperacao: string;
  dataMovimento: string;
  situacao: SituacaoOperacao;
  valorFinanceiro?: number;
}

export interface FiltroOperacao {
  numeroOperacao?: string;
  situacao?: SituacaoOperacao;
}

export interface ResultadoPaginado<T> {
  dados: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

// Enums para valores fixos
export enum SituacaoOperacao {
  PENDENTE = 'PEN',
  ATIVA = 'ATU',
  CANCELADA = 'CAN',
}
```

### 6.2 Service (API)

```typescript
// features/operacao/services/operacao.service.ts
import { api } from '@/shared/services/api';
import { Operacao, FiltroOperacao, ResultadoPaginado } from '../types/operacao.types';

const BASE_URL = '/api/v1/operacao';

export const operacaoService = {
  async listar(filtro: FiltroOperacao, page = 1): Promise<ResultadoPaginado<Operacao>> {
    const { data } = await api.get<ResultadoPaginado<Operacao>>(
      BASE_URL, 
      { params: { ...filtro, page } }
    );
    return data;
  },

  async buscarPorId(id: string): Promise<Operacao> {
    const { data } = await api.get<Operacao>(`${BASE_URL}/${id}`);
    return data;
  },

  async criar(dto: CreateOperacaoDTO): Promise<Operacao> {
    const { data } = await api.post<Operacao>(BASE_URL, dto);
    return data;
  },

  async atualizar(id: string, dto: UpdateOperacaoDTO): Promise<Operacao> {
    const { data } = await api.put<Operacao>(`${BASE_URL}/${id}`, dto);
    return data;
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },
};
```

### 6.3 Hooks (React Query)

```typescript
// features/operacao/hooks/useOperacoes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operacaoService } from '../services/operacao.service';
import { FiltroOperacao } from '../types/operacao.types';

export const operacaoKeys = {
  all: ['operacoes'] as const,
  list: (filtro: FiltroOperacao, page: number) => [...operacaoKeys.all, 'list', filtro, page],
  detail: (id: string) => [...operacaoKeys.all, 'detail', id],
};

export function useOperacoes(filtro: FiltroOperacao, page = 1) {
  return useQuery({
    queryKey: operacaoKeys.list(filtro, page),
    queryFn: () => operacaoService.listar(filtro, page),
    staleTime: 5 * 60 * 1000,
  });
}

export function useOperacao(id: string) {
  return useQuery({
    queryKey: operacaoKeys.detail(id),
    queryFn: () => operacaoService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useCreateOperacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: operacaoService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operacaoKeys.all });
      toast.success('Operação criada com sucesso');
    },
  });
}

export function useDeleteOperacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: operacaoService.excluir,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operacaoKeys.all });
      toast.success('Operação excluída com sucesso');
    },
  });
}
```

### 6.4 Page Component (Smart Component)

```typescript
// features/operacao/pages/OperacaoListPage/OperacaoListPage.tsx
import { useOperacaoListPage } from './OperacaoListPage.hooks';
import * as S from './OperacaoListPage.styles';
import { OperacaoFilters, OperacaoTable } from '../../components';
import { PageContainer, Pagination, ErrorState } from '@/shared/components';

export function OperacaoListPage() {
  const { 
    filtro, 
    page, 
    data, 
    isLoading, 
    isError,
    handlers 
  } = useOperacaoListPage();

  if (isError) return <ErrorState />;

  return (
    <PageContainer title="Operações">
      <OperacaoFilters filtro={filtro} onFiltrar={handlers.setFiltro} />
      <OperacaoTable operacoes={data?.dados ?? []} isLoading={isLoading} />
      {data && <Pagination {...data} onPageChange={handlers.setPage} />}
    </PageContainer>
  );
}
```

```typescript
// features/operacao/pages/OperacaoListPage/OperacaoListPage.hooks.ts
import { useState } from 'react';
import { useOperacoes } from '../../hooks/useOperacoes';
import { FiltroOperacao } from '../../types/operacao.types';

export function useOperacaoListPage() {
  const [filtro, setFiltro] = useState<FiltroOperacao>({});
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useOperacoes(filtro, page);

  return {
    filtro,
    page,
    data,
    isLoading,
    isError,
    handlers: {
      setFiltro,
      setPage,
    },
  };
}
```

### 6.5 State Management (Zustand)

```typescript
// stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/shared/types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

### 6.6 Formulários (React Hook Form + Zod)

```typescript
// features/operacao/components/OperacaoForm/OperacaoForm.tsx
import { useOperacaoForm } from './OperacaoForm.hooks';
import * as S from './OperacaoForm.styles';
import { OperacaoFormProps } from './OperacaoForm.types';

export function OperacaoForm({ onSubmit, defaultValues }: OperacaoFormProps) {
  const { form, handleSubmit } = useOperacaoForm({ onSubmit, defaultValues });

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.FormField>
        <label>Número da Operação</label>
        <input {...form.register('numeroOperacao')} />
        {form.formState.errors.numeroOperacao && (
          <S.ErrorMessage>{form.formState.errors.numeroOperacao.message}</S.ErrorMessage>
        )}
      </S.FormField>
      
      <S.FormField>
        <label>Data do Movimento</label>
        <input type="date" {...form.register('dataMovimento')} />
      </S.FormField>
      
      <S.FormField>
        <label>Valor Financeiro</label>
        <input type="number" {...form.register('valorFinanceiro', { valueAsNumber: true })} />
      </S.FormField>
      
      <S.Button type="submit" disabled={form.formState.isSubmitting}>
        Salvar
      </S.Button>
    </S.Form>
  );
}
```

```typescript
// features/operacao/components/OperacaoForm/OperacaoForm.hooks.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { OperacaoFormData, OperacaoFormProps } from './OperacaoForm.types';

const schema = z.object({
  numeroOperacao: z.string().min(1, 'Obrigatório').max(20, 'Máximo 20 caracteres'),
  dataMovimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  valorFinanceiro: z.number().min(0, 'Valor deve ser positivo').optional(),
});

export function useOperacaoForm({ onSubmit, defaultValues }: OperacaoFormProps) {
  const form = useForm<OperacaoFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return { form, handleSubmit };
}
```

---

## 7. API Base

```typescript
// shared/services/api.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de Request - Adiciona token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Response - Tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 8. Estado Reativo

O React moderno oferece ferramentas poderosas para gerenciamento de estado. Com React 19, Server Actions e Hooks modernizam o gerenciamento de formulários.

### 8.1 Hierarquia de Ferramentas de Estado

| Tipo de Estado                | Ferramenta        | Exemplo                          |
| ----------------------------- | ----------------- | -------------------------------- |
| Estado local do componente    | `useState`        | Formulário, toggle, contador     |
| Valores derivados/calculados  | `useMemo`         | Soma, filtro local, formatação   |
| Efeitos colaterais            | `useEffect`       | Sync com localStorage, analytics |
| Dados do servidor (CRUD)      | TanStack Query    | Listagens, detalhes, mutations   |
| Estado global de UI           | Zustand           | Tema, sidebar, modais            |
| Estado global de autenticação | Zustand + persist | User, token, roles               |
| Cache de dados do servidor    | TanStack Query    | Evita refetch desnecessário      |
| Estado de formulários         | React Hook Form   | Validação, submissão             |

### 8.2 Estado Local com useState

```typescript
// ✅ CORRETO - Estado local simples
export function Contador() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(0);
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// ✅ CORRETO - Estado com objeto
interface FormState {
  nome: string;
  email: string;
  telefone: string;
}

export function FormularioContato() {
  const [form, setForm] = useState<FormState>({
    nome: '',
    email: '',
    telefone: '',
  });
  
  const updateField = (field: keyof FormState) => (
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
    }
  );
  
  return (
    <form>
      <input value={form.nome} onChange={updateField('nome')} />
      <input value={form.email} onChange={updateField('email')} />
      <input value={form.telefone} onChange={updateField('telefone')} />
    </form>
  );
}
```

### 8.3 Valores Derivados com useMemo

```typescript
// ✅ CORRETO - Derivar valores do estado existente
export function ListaProdutos({ produtos }: { produtos: Produto[] }) {
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState<'asc' | 'desc'>('asc');
  
  // Valor derivado - recalcula apenas quando dependências mudam
  const produtosFiltrados = useMemo(() => {
    return produtos
      .filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
      .sort((a, b) => {
        const comparacao = a.nome.localeCompare(b.nome);
        return ordenacao === 'asc' ? comparacao : -comparacao;
      });
  }, [produtos, filtro, ordenacao]);
  
  const totalValor = useMemo(() => (
    produtosFiltrados.reduce((acc, p) => acc + p.preco, 0)
  ), [produtosFiltrados]);
  
  const temProdutos = produtosFiltrados.length > 0;
  
  return (
    <div>
      <span>Total: {formatCurrency(totalValor)}</span>
      {temProdutos ? (
        <ul>{produtosFiltrados.map(p => <li key={p.id}>{p.nome}</li>)}</ul>
      ) : (
        <EmptyState message="Nenhum produto encontrado" />
      )}
    </div>
  );
}

// ❌ ERRADO - Estado duplicado (anti-pattern)
const [produtos, setProdutos] = useState([]);
const [produtosFiltrados, setProdutosFiltrados] = useState([]); // Duplicação!

useEffect(() => {
  setProdutosFiltrados(produtos.filter(p => p.ativo)); // Estado derivado como effect
}, [produtos]);
```

### 8.4 Efeitos Colaterais com useEffect

```typescript
// ✅ CORRETO - Side effect com cleanup
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    
    // Cleanup - restaura título anterior
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

// ✅ CORRETO - Sincronizar com localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
}

// ✅ CORRETO - Subscription com cleanup automático
export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element: Window | HTMLElement = window
) {
  useEffect(() => {
    element.addEventListener(eventName, handler);
    
    return () => {
      element.removeEventListener(eventName, handler);
    };
  }, [eventName, handler, element]);
}
```

### 8.5 Dados do Servidor com TanStack Query

```typescript
// ✅ CORRETO - Query para listagem
export function useOperacoes(filtro: FiltroOperacao, page = 1) {
  return useQuery({
    queryKey: ['operacoes', 'list', filtro, page],
    queryFn: () => operacaoService.listar(filtro, page),
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    placeholderData: keepPreviousData, // Mantém dados anteriores durante refetch
  });
}

// ✅ CORRETO - Query para detalhe
export function useOperacao(id: string) {
  return useQuery({
    queryKey: ['operacoes', 'detail', id],
    queryFn: () => operacaoService.buscarPorId(id),
    enabled: !!id, // Só executa se id existir
  });
}

// ✅ CORRETO - Mutation com invalidação
export function useDeleteOperacao() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => operacaoService.excluir(id),
    onSuccess: () => {
      // Invalida cache para forçar refetch
      queryClient.invalidateQueries({ queryKey: ['operacoes'] });
      toast.success('Operação excluída com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao excluir operação');
      console.error(error);
    },
  });
}

// ✅ CORRETO - Optimistic update
export function useUpdateOperacao() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOperacaoDTO }) => (
      operacaoService.atualizar(id, data)
    ),
    onMutate: async ({ id, data }) => {
      // Cancela queries em andamento
      await queryClient.cancelQueries({ queryKey: ['operacoes', 'detail', id] });
      
      // Snapshot do estado anterior
      const previousData = queryClient.getQueryData(['operacoes', 'detail', id]);
      
      // Atualização otimista
      queryClient.setQueryData(['operacoes', 'detail', id], (old: Operacao) => ({
        ...old,
        ...data,
      }));
      
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback em caso de erro
      if (context?.previousData) {
        queryClient.setQueryData(
          ['operacoes', 'detail', variables.id],
          context.previousData
        );
      }
    },
    onSettled: (data, error, { id }) => {
      // Refetch para garantir sincronização
      queryClient.invalidateQueries({ queryKey: ['operacoes', 'detail', id] });
    },
  });
}
```

### 8.6 Estado Global com Zustand

```typescript
// stores/auth.store.ts
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    subscribeWithSelector((set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
    })),
    { name: 'auth-storage' }
  )
);

// ✅ CORRETO - Uso em componente (cleanup automático)
export function Navbar() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  
  return (
    <nav>
      {user ? (
        <>
          <span>Olá, {user.name}</span>
          <button onClick={logout}>Sair</button>
        </>
      ) : (
        <Link to="/login">Entrar</Link>
      )}
    </nav>
  );
}
```

### 8.7 Selectors e Valores Derivados com Zustand

```typescript
// stores/operacao.store.ts
interface OperacaoState {
  operacoes: Operacao[];
  filtro: FiltroOperacao;
  selectedIds: Set<string>;
  setOperacoes: (ops: Operacao[]) => void;
  setFiltro: (filtro: FiltroOperacao) => void;
  toggleSelection: (id: string) => void;
}

export const useOperacaoStore = create<OperacaoState>((set) => ({
  operacoes: [],
  filtro: {},
  selectedIds: new Set(),
  setOperacoes: (operacoes) => set({ operacoes }),
  setFiltro: (filtro) => set({ filtro }),
  toggleSelection: (id) => set((state) => {
    const newIds = new Set(state.selectedIds);
    if (newIds.has(id)) {
      newIds.delete(id);
    } else {
      newIds.add(id);
    }
    return { selectedIds: newIds };
  }),
}));

// ✅ CORRETO - Selector customizado (valor derivado do store)
export function useOperacoesFiltradas() {
  const operacoes = useOperacaoStore(s => s.operacoes);
  const filtro = useOperacaoStore(s => s.filtro);
  
  return useMemo(() => {
    return operacoes.filter(op => {
      if (filtro.situacao && op.situacao !== filtro.situacao) return false;
      if (filtro.numero && !op.numero.includes(filtro.numero)) return false;
      return true;
    });
  }, [operacoes, filtro]);
}

// ✅ CORRETO - Selector simples
export function useOperacoesCount() {
  return useOperacaoStore(s => s.operacoes.length);
}
```

### 8.8 Subscriptions Externas

```typescript
// Em api.ts - interceptor que reage a mudanças de auth
useAuthStore.subscribe(
  (state) => state.token,
  (token) => {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
    }
  }
);

// Em analytics.ts - tracking de eventos
useAuthStore.subscribe(
  (state) => state.user,
  (user, prevUser) => {
    if (user && !prevUser) {
      analytics.track('user_logged_in', { userId: user.id });
    }
    if (!user && prevUser) {
      analytics.track('user_logged_out');
    }
  }
);
```

### 8.9 Combinando TanStack Query + Zustand

```typescript
// ✅ CORRETO - Server State (Query) + Client State (Zustand)
export function useOperacoesPage() {
  // Server state via TanStack Query
  const filtro = useOperacaoStore(s => s.filtro);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['operacoes', filtro],
    queryFn: () => operacaoService.listar(filtro),
  });
  
  // Client state via Zustand
  const selectedIds = useOperacaoStore(s => s.selectedIds);
  const toggleSelection = useOperacaoStore(s => s.toggleSelection);
  
  // Valor derivado combinando ambos
  const selectedOperacoes = useMemo(
    () => data?.filter(op => selectedIds.has(op.id)) ?? [],
    [data, selectedIds]
  );
  
  return {
    operacoes: data ?? [],
    isLoading,
    isError,
    selectedOperacoes,
    toggleSelection,
  };
}
```

### 8.10 Regras para Escolha de Ferramenta

| Cenário                 | Ferramenta        | Justificativa              |
| ----------------------- | ----------------- | -------------------------- |
| Contador, toggle, input | `useState`        | Estado local efêmero       |
| Lista filtrada/ordenada | `useMemo`         | Derivar, não duplicar      |
| Sync com API externa    | `useEffect`       | Side effect controlado     |
| CRUD de entidades       | TanStack Query    | Cache, refetch, mutations  |
| Tema, sidebar, layout   | Zustand           | Estado compartilhado de UI |
| Autenticação            | Zustand + persist | Persistência entre sessões |
| Form Actions (Server)   | `useActionState`  | Feedback de Server Actions |

> **REGRA**: Use sempre a ferramenta mais simples. `useActionState` para forms modernos.

---

## 9. Roteamento

```typescript
// app/routes.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/shared/layouts/RootLayout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { Loading } from '@/shared/components/Loading';

// Lazy loading de páginas
const OperacaoListPage = lazy(() => import('@/features/operacao/pages/OperacaoListPage'));
const OperacaoDetailPage = lazy(() => import('@/features/operacao/pages/OperacaoDetailPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'operacoes',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <OperacaoListPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'operacoes/:id',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <OperacaoDetailPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
```

---

## 10. Utilitários (Equivalente a Pipes)

```typescript
// shared/utils/formatters.ts

// Formatação de data (equivalente a DatePipe)
export const formatDate = (date: string | Date): string =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(date));

export const formatDateTime = (date: string | Date): string =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));

// Formatação de moeda (equivalente a CurrencyPipe)
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);

// Formatação de CNPJ/CPF (equivalente a CnpjCpfPipe)
export const formatCnpjCpf = (value: string): string => {
  const documento = value.replace(/\D/g, '');
  if (documento.length === 11) {
    return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (documento.length === 14) {
    return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return value;
};

// Formatação de conta (equivalente a ContaSelicPipe)
export const formatConta = (value: string): string => {
  const conta = value.replace(/\D/g, '');
  return conta.replace(/(\d{2})(\d{4})(\d{3})(\d{2})/, '$1-$2-$3-$4');
};
```

```typescript
// shared/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

---

## 11. Boas Práticas

### 11.1 Clean Code

- **Componentes < 300 linhas** - Extrair lógica para hooks se necessário
- **Nomes descritivos** - Componentes, funções e variáveis com nomes claros
- **Evitar lógica em JSX** - Extrair para funções ou hooks
- **Single Responsibility** - Cada arquivo tem uma responsabilidade

**Exemplo - Componente focado e legível:**

```typescript
// ✅ BOM: Componente pequeno, responsabilidade única
export function FiltroOperacao({ filtro, onFiltrar }: FiltroOperacaoProps) {
  const { form, handleSubmit } = useFiltroOperacao({ filtro, onFiltrar });
  
  return (
    <S.FilterContainer>
      <S.FilterForm onSubmit={handleSubmit}>
        <InputField {...form.register('numeroOperacao')} placeholder="Número" />
        <SelectField {...form.register('situacao')} options={situacaoOptions} />
        <Button type="submit">Pesquisar</Button>
      </S.FilterForm>
    </S.FilterContainer>
  );
}

// ❌ RUIM: Componente faz muitas coisas
export function OperacaoComponent() {
  // Filtro, listagem, detalhe, edição, exclusão tudo junto
  // 500+ linhas de código
}
```

### 11.2 DRY (Don't Repeat Yourself)

- **Componentes reutilizáveis** em `shared/components/`
- **Formatters** para formatação comum em `shared/utils/formatters.ts`
- **Hooks utilitários** em `shared/hooks/`
- **Serviço base** para lógica comum de HTTP

**Exemplo - Reutilização:**

```typescript
// ✅ BOM: Usa formatter compartilhado
<td>{formatConta(operacao.contaCedente)}</td>
<td>{formatCnpjCpf(operacao.cnpj)}</td>

// ❌ RUIM: Formata manualmente em cada componente
<td>{formatarContaCustom(operacao.contaCedente)}</td>
```

### 11.3 TypeScript

- **Sem `any`** - Sempre tipar corretamente
- **Interfaces para props** - Definir contratos claros
- **Types para entidades** - Representar domínio de negócio
- **Enums para valores fixos** - Melhor que strings literais

**Exemplo - Tipagem adequada:**

```typescript
// ✅ BOM: Tipagem forte
async function consultar(filtro: FiltroOperacao): Promise<ResultadoPaginado<Operacao>> {
  const { data } = await api.get<ResultadoPaginado<Operacao>>(url, { params: filtro });
  return data;
}

// ❌ RUIM: Uso de any
async function consultar(filtro: any): Promise<any> {
  const { data } = await api.get(url, { params: filtro });
  return data;
}
```

### 11.4 React Query

- **Query keys estruturadas** - Factory pattern para keys
- **Invalidar após mutations** - Manter cache sincronizado
- **staleTime apropriado** - Balance entre performance e freshness
- **Prefetching** - Antecipar dados quando possível

### 11.5 Performance

- **Lazy loading de rotas** - Carregar páginas sob demanda
- **useMemo/useCallback** - Apenas quando necessário (não premature optimization)
- **React.memo** - Para componentes puros pesados
- **Virtualização** - Para listas grandes (react-virtual)
- **Code splitting** - Separar bundles por feature

### 11.6 Clean Architecture no React

**Regra de Dependência:**

```
pages → hooks/services → types ← shared
```

As dependências apontam para o centro (types). Pages conhecem hooks, hooks conhecem services, services conhecem types.

**Smart Components vs Dumb Components:**

| Aspecto            | Smart (Pages)               | Dumb (Shared)            |
| ------------------ | --------------------------- | ------------------------ |
| Localização        | `features/{feature}/pages/` | `shared/components/`     |
| Usa hooks de dados | ✅ Sim (React Query)         | ❌ Não                    |
| Conhece o negócio  | ✅ Sim                       | ❌ Não                    |
| Comunicação        | Chama hooks/services        | Props + Callbacks        |
| Reutilização       | Específico da feature       | Reutilizável em todo app |

**Anti-patterns a evitar:**

```typescript
// ❌ RUIM: Lógica de negócio em componente shared
export function TabelaOperacao() {
  const { mutate: excluir } = useDeleteOperacao();  // Shared não deve usar hooks de negócio!
  
  const handleExcluir = (id: string) => excluir(id);
}

// ❌ RUIM: Service com lógica de apresentação
export const operacaoService = {
  formatarParaExibicao(op: Operacao): string {  // Isso é responsabilidade de formatter!
    return `${op.numero} - ${op.situacao}`;
  }
};

// ❌ RUIM: Componente de página usando api diretamente
export function ConsultaOperacaoPage() {
  useEffect(() => {
    api.get('/operacao').then(setData);  // Deveria usar hooks/services!
  }, []);
}
```

---

## 12. Checklist de Revisão

### 12.1 Arquitetura e Separação

- [ ] Componentes seguem estrutura: `Component.tsx`, `Component.styles.ts`, `Component.hooks.ts`
- [ ] Feature segue estrutura: `pages/`, `components/`, `hooks/`, `services/`, `types/`
- [ ] Lógica complexa extraída para hooks customizados
- [ ] Estilos em arquivo separado (não inline)
- [ ] Types/Props em arquivo `.types.ts` para componentes complexos

### 12.2 Limites de Tamanho

- [ ] Componentes com menos de 200 linhas
- [ ] Hooks com menos de 400 linhas
- [ ] Services com menos de 400 linhas
- [ ] Máximo 7-8 props por componente
- [ ] Máximo 5-6 useState (considerar useReducer se mais)

### 12.3 Código

- [ ] Tipagem TypeScript adequada (sem `any`)
- [ ] Nomes descritivos e consistentes
- [ ] Sem console.log em código de produção
- [ ] Sem lógica complexa em templates JSX

### 12.4 Data Fetching

- [ ] React Query para server state
- [ ] Zustand para client state global
- [ ] Query keys estruturadas com factory
- [ ] Loading, error e empty states tratados

### 12.5 UI/UX

- [ ] Lazy loading de rotas
- [ ] Formulários com validação Zod
- [ ] Feedback visual de loading/erro
- [ ] Formatação via utilitários compartilhados

### 12.6 Organização

- [ ] Componentes reutilizáveis em `shared/`
- [ ] Formatters em `shared/utils/formatters.ts`
- [ ] Export barrels (`index.ts`) em cada pasta de componente
- [ ] Imports absolutos configurados (`@/`)

---

## 13. Princípios SOLID no React

### 13.1 S - Single Responsibility (Responsabilidade Única)

```typescript
// ✅ CORRETO - Componente faz apenas uma coisa
function ProdutoCard({ produto, onSelecionar }: ProdutoCardProps) {
  // Apenas exibe e emite evento
  return (
    <S.Card onClick={() => onSelecionar(produto)}>
      <S.Image src={produto.imagem} alt={produto.nome} />
      <S.Title>{produto.nome}</S.Title>
      <S.Price>{formatCurrency(produto.preco)}</S.Price>
    </S.Card>
  );
}

// ❌ ERRADO - Múltiplas responsabilidades
function ProdutoComponent() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [usuario, setUsuario] = useState(null);
  
  // Lógica de listagem, filtro, carrinho, autenticação...
  // 500+ linhas de código misturado
}
```

### 13.2 O - Open/Closed (Aberto/Fechado)

```typescript
// ✅ CORRETO - Extensível via composição
interface ValidadorProduto {
  validar(produto: Produto): ValidationResult;
}

const validadorPreco: ValidadorProduto = {
  validar: (produto) => ({
    valido: produto.preco > 0,
    mensagem: 'Preço deve ser positivo',
  }),
};

const validadorEstoque: ValidadorProduto = {
  validar: (produto) => ({
    valido: produto.estoque >= 0,
    mensagem: 'Estoque não pode ser negativo',
  }),
};

// Adicionar novos validadores sem modificar existentes
function useValidacao(validadores: ValidadorProduto[]) {
  return (produto: Produto) => {
    return validadores.map(v => v.validar(produto));
  };
}
```

### 13.3 L - Liskov Substitution (Substituição de Liskov)

```typescript
// ✅ CORRETO - Componentes substituíveis via props padronizadas
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function PrimaryButton({ onClick, disabled, children }: ButtonProps) {
  return (
    <button className="primary" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, disabled, children }: ButtonProps) {
  return (
    <button className="secondary" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// Ambos podem ser usados de forma intercambiável
function Form({ ButtonComponent = PrimaryButton }: { ButtonComponent?: React.FC<ButtonProps> }) {
  return <ButtonComponent onClick={handleSubmit}>Enviar</ButtonComponent>;
}
```

### 13.4 I - Interface Segregation (Segregação de Interfaces)

```typescript
// ✅ CORRETO - Interfaces pequenas e focadas
interface Listavel<T> {
  itens: T[];
  isLoading: boolean;
}

interface Paginavel {
  paginaAtual: number;
  totalPaginas: number;
  irParaPagina: (pagina: number) => void;
}

interface Filtravel<F> {
  filtro: F;
  aplicarFiltro: (filtro: F) => void;
}

// Componente usa apenas as interfaces necessárias
function TabelaOperacoes({ itens, isLoading }: Listavel<Operacao>) {
  // ...
}

function Paginacao({ paginaAtual, totalPaginas, irParaPagina }: Paginavel) {
  // ...
}

// ❌ ERRADO - Interface muito grande
interface CrudCompleto<T, F> {
  itens: T[];
  isLoading: boolean;
  criar: (item: T) => void;
  editar: (item: T) => void;
  excluir: (id: string) => void;
  filtrar: (filtro: F) => void;
  paginar: (pagina: number) => void;
  ordenar: (campo: string) => void;
  // ... mais 20 propriedades
}
```

### 13.5 D - Dependency Inversion (Inversão de Dependência)

```typescript
// ✅ CORRETO - Depende de abstrações (interfaces/hooks)
function ProdutoLista() {
  // Depende de abstração, não de implementação específica
  const { data, isLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: produtoService.listar, // Injetável/mockável
  });
  
  return <TabelaProdutos produtos={data} isLoading={isLoading} />;
}

// Service pode ser mockado facilmente para testes
// test/mocks/handlers.ts
export const handlers = [
  http.get('/api/produtos', () => {
    return HttpResponse.json([mockProduto]);
  }),
];
```

---

## 14. Testes Frontend

### 14.1 Stack de Testes

| Tecnologia                  | Propósito               |
| --------------------------- | ----------------------- |
| Vitest                      | Framework de testes     |
| React Testing Library       | Testes de componentes   |
| MSW (Mock Service Worker)   | Mocking de APIs         |
| @testing-library/user-event | Simulação de interações |
| Playwright                  | Testes E2E              |

### 14.2 Estrutura de Testes

```
src/
├── features/
│   └── operacao/
│       ├── components/
│       │   └── OperacaoTable/
│       │       ├── OperacaoTable.tsx
│       │       ├── OperacaoTable.test.tsx    # Teste unitário
│       │       └── ...
│       ├── hooks/
│       │   └── useOperacoes.ts
│       │   └── useOperacoes.test.ts          # Teste de hook
│       └── pages/
│           └── OperacaoListPage/
│               └── OperacaoListPage.test.tsx # Teste de integração
├── tests/
│   ├── mocks/
│   │   ├── handlers.ts                       # MSW handlers
│   │   └── server.ts                         # MSW server
│   ├── utils/
│   │   └── test-utils.tsx                    # Render customizado
│   └── e2e/
│       └── operacao.spec.ts                  # Testes E2E
└── vitest.setup.ts
```

### 14.3 Configuração

**vitest.config.ts:**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'tests/', '**/*.d.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**vitest.setup.ts:**

```typescript
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './tests/mocks/server';

// MSW setup
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
```

### 14.4 MSW (Mock Service Worker)

**tests/mocks/handlers.ts:**

```typescript
import { http, HttpResponse } from 'msw';
import { mockOperacoes, mockOperacao } from './data';

export const handlers = [
  // GET - Listar operações
  http.get('/api/operacoes', ({ request }) => {
    const url = new URL(request.url);
    const situacao = url.searchParams.get('situacao');
    
    let resultado = mockOperacoes;
    if (situacao) {
      resultado = resultado.filter(op => op.situacao === situacao);
    }
    
    return HttpResponse.json({
      dados: resultado,
      total: resultado.length,
      pagina: 1,
      totalPaginas: 1,
    });
  }),
  
  // GET - Buscar por ID
  http.get('/api/operacoes/:id', ({ params }) => {
    const operacao = mockOperacoes.find(op => op.id === params.id);
    
    if (!operacao) {
      return HttpResponse.json(
        { message: 'Operação não encontrada' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(operacao);
  }),
  
  // POST - Criar
  http.post('/api/operacoes', async ({ request }) => {
    const body = await request.json();
    const novaOperacao = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    return HttpResponse.json(novaOperacao, { status: 201 });
  }),
  
  // DELETE - Excluir
  http.delete('/api/operacoes/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
```

**tests/mocks/server.ts:**

```typescript
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### 14.5 Render Customizado

**tests/utils/test-utils.tsx:**

```typescript
import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Cria QueryClient para testes (sem retry, sem cache)
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface WrapperProps {
  children: ReactNode;
}

function AllTheProviders({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### 14.6 Testes de Componentes

```typescript
// features/operacao/components/OperacaoTable/OperacaoTable.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@/tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { OperacaoTable } from './OperacaoTable';
import { mockOperacoes } from '@/tests/mocks/data';

describe('OperacaoTable', () => {
  // Arrange (setup comum)
  const defaultProps = {
    operacoes: mockOperacoes,
    isLoading: false,
    onRowClick: vi.fn(),
    onDelete: vi.fn(),
  };

  it('deve renderizar a tabela com operações', () => {
    // Arrange
    render(<OperacaoTable {...defaultProps} />);
    
    // Assert
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(mockOperacoes.length + 1); // +1 header
  });

  it('deve exibir loading quando isLoading é true', () => {
    // Arrange
    render(<OperacaoTable {...defaultProps} isLoading={true} />);
    
    // Assert
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('deve chamar onRowClick ao clicar em uma linha', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<OperacaoTable {...defaultProps} onRowClick={onRowClick} />);
    
    // Act
    const primeiraLinha = screen.getAllByRole('row')[1]; // Pula header
    await user.click(primeiraLinha);
    
    // Assert
    expect(onRowClick).toHaveBeenCalledWith(mockOperacoes[0]);
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it('deve formatar valores corretamente', () => {
    // Arrange
    render(<OperacaoTable {...defaultProps} />);
    
    // Assert
    const celulas = screen.getAllByRole('cell');
    expect(celulas[2]).toHaveTextContent('R$'); // Valor formatado
    expect(celulas[3]).toHaveTextContent(/\d{2}\/\d{2}\/\d{4}/); // Data formatada
  });

  it('deve exibir mensagem quando lista está vazia', () => {
    // Arrange
    render(<OperacaoTable {...defaultProps} operacoes={[]} />);
    
    // Assert
    expect(screen.getByText(/nenhuma operação encontrada/i)).toBeInTheDocument();
  });
});
```

### 14.7 Testes de Hooks

```typescript
// features/operacao/hooks/useOperacoes.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useOperacoes } from './useOperacoes';
import { wrapper } from '@/tests/utils/test-utils';
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from 'msw';

describe('useOperacoes', () => {
  it('deve retornar lista de operações', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useOperacoes(), { wrapper });
    
    // Assert - inicial
    expect(result.current.isLoading).toBe(true);
    
    // Assert - após carregar
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.data).toHaveLength(2);
  });

  it('deve lidar com erro de API', async () => {
    // Arrange - override handler para erro
    server.use(
      http.get('/api/operacoes', () => {
        return HttpResponse.json(
          { message: 'Erro interno' },
          { status: 500 }
        );
      })
    );
    
    // Act
    const { result } = renderHook(() => useOperacoes(), { wrapper });
    
    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('deve aplicar filtros na query', async () => {
    // Arrange
    const filtro = { situacao: 'ATIVA' };
    
    // Act
    const { result } = renderHook(
      () => useOperacoes(filtro),
      { wrapper }
    );
    
    // Assert
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
    
    // Verifica que todas operações retornadas têm situação correta
    result.current.data?.forEach(op => {
      expect(op.situacao).toBe('ATIVA');
    });
  });
});
```

### 14.8 Testes de Página (Integração)

```typescript
// features/operacao/pages/OperacaoListPage/OperacaoListPage.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { OperacaoListPage } from './OperacaoListPage';
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from 'msw';

describe('OperacaoListPage', () => {
  it('deve carregar e exibir operações', async () => {
    // Arrange
    render(<OperacaoListPage />);
    
    // Assert - loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Assert - dados carregados
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
    
    expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
  });

  it('deve filtrar operações por situação', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<OperacaoListPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
    
    // Act
    const selectSituacao = screen.getByLabelText(/situação/i);
    await user.selectOptions(selectSituacao, 'ATIVA');
    await user.click(screen.getByRole('button', { name: /pesquisar/i }));
    
    // Assert
    await waitFor(() => {
      const linhas = screen.getAllByRole('row').slice(1); // Remove header
      linhas.forEach(linha => {
        expect(within(linha).getByText('ATIVA')).toBeInTheDocument();
      });
    });
  });

  it('deve navegar para detalhe ao clicar em linha', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<OperacaoListPage />);
    
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
    
    // Act
    const primeiraLinha = screen.getAllByRole('row')[1];
    await user.click(primeiraLinha);
    
    // Assert - verifica navegação (mock do router ou verificação de URL)
    expect(window.location.pathname).toContain('/operacoes/');
  });

  it('deve exibir erro quando API falha', async () => {
    // Arrange
    server.use(
      http.get('/api/operacoes', () => {
        return HttpResponse.json({ message: 'Erro' }, { status: 500 });
      })
    );
    
    render(<OperacaoListPage />);
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar/i)).toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });
});
```

### 14.9 Padrão AAA (Arrange, Act, Assert)

```typescript
it('deve adicionar item ao carrinho', async () => {
  // ============ ARRANGE ============
  // Setup do ambiente de teste
  const user = userEvent.setup();
  const produto = { id: '1', nome: 'Produto', preco: 100 };
  render(<ProdutoCard produto={produto} />);
  
  // ============ ACT ============
  // Executa a ação sendo testada
  const botaoAdicionar = screen.getByRole('button', { name: /adicionar/i });
  await user.click(botaoAdicionar);
  
  // ============ ASSERT ============
  // Verifica o resultado esperado
  expect(screen.getByText(/adicionado ao carrinho/i)).toBeInTheDocument();
  expect(useCarrinhoStore.getState().itens).toHaveLength(1);
});
```

### 14.10 Boas Práticas de Testes

| Prática                                     | Descrição                                     |
| ------------------------------------------- | --------------------------------------------- |
| **Testar comportamento, não implementação** | Foque no que o usuário vê e faz               |
| **Usar queries semânticas**                 | `getByRole`, `getByLabelText` > `getByTestId` |
| **Um assert por conceito**                  | Testes focados e legíveis                     |
| **Mocks apenas quando necessário**          | Prefira MSW para APIs                         |
| **Evitar snapshots**                        | Testes frágeis e difíceis de manter           |
| **Testes independentes**                    | Cada teste deve rodar isoladamente            |

---

## 15. Anti-Patterns

### 15.1 Anti-Patterns de Código

```typescript
// ❌ 1. God Components - Componente fazendo muitas coisas
function DashboardGod() {
  // 500+ linhas com CRUD, filtros, gráficos, modais...
}

// ❌ 2. Props Drilling - Passar props por muitos níveis
<App user={user}>
  <Layout user={user}>
    <Header user={user}>
      <UserMenu user={user} /> // 4 níveis!
    </Header>
  </Layout>
</App>

// ✅ Usar Context ou Zustand para estado global

// ❌ 3. Lógica no JSX
{items.filter(i => i.active).sort((a, b) => b.date - a.date).map(i => (
  <Item key={i.id} {...i} onClick={() => {
    setSelected(i);
    trackEvent('item_click', i.id);
    navigate(`/items/${i.id}`);
  }} />
))}

// ✅ Extrair para hooks/funções
const sortedItems = useSortedItems(items);
const handleItemClick = useCallback((item) => {
  setSelected(item);
  trackEvent('item_click', item.id);
  navigate(`/items/${item.id}`);
}, []);

// ❌ 4. Uso de any
const handleData = (data: any) => { ... }

// ✅ Tipar corretamente
const handleData = (data: OperacaoResponse) => { ... }

// ❌ 5. useEffect para tudo
useEffect(() => {
  const total = items.reduce((sum, i) => sum + i.price, 0);
  setTotal(total);
}, [items]);

// ✅ Usar useMemo para valores derivados
const total = useMemo(() => 
  items.reduce((sum, i) => sum + i.price, 0), 
  [items]
);

// ❌ 6. Estado duplicado
const [nome, setNome] = useState('');
const [nomeValido, setNomeValido] = useState(true);

useEffect(() => {
  setNomeValido(nome.length > 0);
}, [nome]);

// ✅ Derivar do estado existente
const [nome, setNome] = useState('');
const nomeValido = nome.length > 0;
```

### 15.2 Anti-Patterns de Arquitetura

```typescript
// ❌ 7. Dependências invertidas - Page importando implementação direta
import axios from 'axios';

function OperacaoPage() {
  useEffect(() => {
    axios.get('/api/operacoes').then(setData);
  }, []);
}

// ✅ Usar hooks/services como abstração
function OperacaoPage() {
  const { data } = useOperacoes();
}

// ❌ 8. Lógica de negócio no componente
function FormularioOperacao() {
  const calcularJuros = (valor, taxa, dias) => {
    // 50 linhas de cálculo...
  };
  
  const validarOperacao = (op) => {
    // 30 linhas de validação...
  };
}

// ✅ Extrair para hooks ou services
function FormularioOperacao() {
  const { calcularJuros, validarOperacao } = useOperacaoLogic();
}

// ❌ 9. Componentes shared com lógica de negócio
// shared/components/TabelaOperacao.tsx
function TabelaOperacao() {
  const { mutate: excluir } = useDeleteOperacao(); // ❌ Hook de negócio!
}

// ✅ Shared components são apenas UI
function TabelaOperacao({ onDelete }: TabelaOperacaoProps) {
  // Recebe handler via props
}

// ❌ 10. Estado global para tudo
const useStore = create((set) => ({
  // 50 propriedades para toda a aplicação
}));

// ✅ Stores por domínio/feature
const useAuthStore = create(...);
const useOperacaoStore = create(...);
const useUIStore = create(...);
```

### 15.3 Anti-Patterns de Estado

```typescript
// ❌ 11. useState para dados do servidor
const [operacoes, setOperacoes] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  api.get('/operacoes')
    .then(r => setOperacoes(r.data))
    .catch(e => setError(e))
    .finally(() => setLoading(false));
}, []);

// ✅ Usar React Query
const { data: operacoes, isLoading, error } = useQuery({
  queryKey: ['operacoes'],
  queryFn: () => api.get('/operacoes').then(r => r.data),
});

// ❌ 12. Sem invalidação após mutation
const excluir = async (id) => {
  await api.delete(`/operacoes/${id}`);
  // Lista fica desatualizada!
};

// ✅ Invalidar cache
const { mutate: excluir } = useMutation({
  mutationFn: (id) => api.delete(`/operacoes/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['operacoes'] });
  },
});

// ❌ 13. Muitos useState relacionados
const [nome, setNome] = useState('');
const [email, setEmail] = useState('');
const [telefone, setTelefone] = useState('');
const [endereco, setEndereco] = useState('');
const [cidade, setCidade] = useState('');
const [estado, setEstado] = useState('');

// ✅ Agrupar em objeto ou usar useReducer/form library
const [formData, setFormData] = useState({
  nome: '', email: '', telefone: '', endereco: '', cidade: '', estado: ''
});
// OU usar React Hook Form
const { register, handleSubmit } = useForm<ClienteForm>();
```

### 15.4 Anti-Patterns de TypeScript

```typescript
// ❌ 14. Assertions desnecessárias
const data = response.data as Operacao[]; // Pode estar errado!

// ✅ Validar com type guards ou Zod
const data = operacoesSchema.parse(response.data);

// ❌ 15. Types muito genéricos
interface Props {
  data: object;
  onAction: Function;
}

// ✅ Types específicos
interface OperacaoTableProps {
  operacoes: Operacao[];
  onRowClick: (operacao: Operacao) => void;
}

// ❌ 16. Ignorar erros TypeScript
// @ts-ignore
// @ts-expect-error

// ✅ Corrigir o problema de tipagem
```

### 15.5 Anti-Patterns de Performance

```typescript
// ❌ 17. Criar funções/objetos no render
function Lista({ items }) {
  return items.map(item => (
    <Item 
      key={item.id}
      style={{ color: 'blue' }} // Objeto novo a cada render
      onClick={() => handleClick(item.id)} // Função nova a cada render
    />
  ));
}

// ✅ Memoizar ou extrair
const itemStyle = { color: 'blue' }; // Fora do componente

function Lista({ items }) {
  const handleClick = useCallback((id) => { ... }, []);
  
  return items.map(item => (
    <Item 
      key={item.id}
      style={itemStyle}
      onClick={() => handleClick(item.id)}
    />
  ));
}

// ❌ 18. Re-renders desnecessários
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <HeavyComponent /> {/* Re-renderiza mesmo sem mudar */}
    </>
  );
}

// ✅ Usar React.memo para componentes pesados
const HeavyComponent = memo(function HeavyComponent() {
  // ...
});
```

### 15.6 Resumo de Anti-Patterns

| #   | Anti-Pattern            | Solução                       |
| --- | ----------------------- | ----------------------------- |
| 1   | God Components          | Dividir em subcomponentes     |
| 2   | Props Drilling          | Context API ou Zustand        |
| 3   | Lógica no JSX           | Extrair para hooks/funções    |
| 4   | Uso de `any`            | Tipar corretamente            |
| 5   | useEffect para derivar  | useMemo                       |
| 6   | Estado duplicado        | Derivar do estado existente   |
| 7   | Dependências invertidas | Hooks/services como abstração |
| 8   | Lógica no componente    | Extrair para hooks            |
| 9   | Shared com negócio      | Apenas UI, handlers via props |
| 10  | Store monolítico        | Stores por domínio            |
| 11  | useState para server    | React Query                   |
| 12  | Sem invalidação         | invalidateQueries             |
| 13  | Muitos useState         | useReducer ou form library    |
| 14  | Type assertions         | Type guards ou Zod            |
| 15  | Types genéricos         | Types específicos             |
| 16  | @ts-ignore              | Corrigir tipagem              |
| 17  | Objetos no render       | Memoizar ou extrair           |
| 18  | Re-renders              | React.memo                    |

---

## 16. Padrões de Nomenclatura

### 16.1 Arquivos e Pastas

| Tipo        | Padrão                   | Exemplo                         |
| ----------- | ------------------------ | ------------------------------- |
| Componentes | PascalCase               | `OperacaoTable.tsx`             |
| Hooks       | camelCase com `use`      | `useOperacoes.ts`               |
| Services    | camelCase                | `operacao.service.ts`           |
| Types       | camelCase                | `operacao.types.ts`             |
| Estilos     | PascalCase + `.styles`   | `OperacaoTable.styles.ts`       |
| Testes      | `.test.tsx`              | `OperacaoTable.test.tsx`        |
| Pastas      | kebab-case ou PascalCase | `operacao/` ou `OperacaoTable/` |

### 16.2 Código

| Tipo             | Padrão               | Exemplo                         |
| ---------------- | -------------------- | ------------------------------- |
| Componentes      | PascalCase           | `OperacaoTable`                 |
| Hooks            | camelCase com `use`  | `useOperacoes()`                |
| Funções          | camelCase (verbo)    | `handleClick()`, `formatDate()` |
| Variáveis        | camelCase            | `operacaoSelecionada`           |
| Constantes       | UPPER_SNAKE_CASE     | `MAX_PAGE_SIZE`                 |
| Types/Interfaces | PascalCase           | `OperacaoResponse`              |
| Props            | PascalCase + `Props` | `OperacaoTableProps`            |
| Enums            | PascalCase           | `SituacaoOperacao`              |
| Query Keys       | camelCase array      | `['operacoes', filtro]`         |

### 16.3 Proibições

```typescript
// ❌ Abreviações
prod, cat, op, btn, usr, cfg

// ❌ Nomes genéricos
data, info, item, util, helper, manager

// ❌ Prefixos desnecessários
IOperacao, TOperacao, OperacaoInterface

// ❌ Sufixos inconsistentes
OperacaoComponent, OperacaoComp

// ✅ Nomes descritivos
operacaoSelecionada, listaOperacoes, handleOperacaoClick
```

---

## 17. SSR e Hidratação (React 19 / Next.js)

### 17.1 Server Components vs Client Components

O React 19 e frameworks como Next.js usam **Server Components (RSC)** por padrão.

#### Verificação de Ambiente

```typescript
// ✅ CORRETO - "use client" para componentes interativos
'use client';

import { useState } from 'react';

export function Contador() {
  const [count, setCount] = useState(0); // OK no Client
  // ...
}

// ❌ ERRADO - Hooks em Server Components
// app/page.tsx (Server Component por padrão)
export default function Page() {
  const [state, setState] = useState(); // ERRO: useState não funciona no Server
}
```

### 17.2 Regras Críticas para Server-Side Rendering

Quando usar SSR (Next.js, Remix), a aplicação é renderizada no servidor antes de ser enviada ao browser. A **hidratação** é o processo de "ativar" o HTML estático no cliente.

#### Verificação de Ambiente

```typescript
// ✅ CORRETO - Verificar se está no browser antes de acessar APIs do navegador
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    // Verificação obrigatória para SSR
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue] as const;
}

// ❌ ERRADO - Acessar localStorage sem verificação
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const stored = localStorage.getItem(key); // ⚠️ Erro no servidor!
  const [value, setValue] = useState(stored ? JSON.parse(stored) : initialValue);
  // ...
}
```

#### Componentes Client-Only

```typescript
// ✅ CORRETO - Componente que só roda no client (Next.js)
'use client';

import dynamic from 'next/dynamic';

// Lazy load sem SSR
const ChartComponent = dynamic(() => import('./ChartComponent'), {
  ssr: false,
  loading: () => <Skeleton height={300} />,
});

export function DashboardWithChart() {
  return (
    <div>
      <h1>Dashboard</h1>
      <ChartComponent />
    </div>
  );
}

// ✅ CORRETO - Hook para verificar se está no client
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return isMounted;
}

// Uso
export function ComponenteQueUsaWindow() {
  const isMounted = useIsMounted();
  
  if (!isMounted) {
    return <Skeleton />;
  }
  
  return <div>Largura da janela: {window.innerWidth}px</div>;
}
```

### 17.3 Evitando Hydration Mismatches

```typescript
// ❌ ERRADO - Conteúdo diferente entre server e client
export function DataComponent() {
  return <span>{new Date().toLocaleString()}</span>; // ⚠️ Horário diferente!
}

// ✅ CORRETO - Renderizar após hidratação
export function DataComponent() {
  const [dataAtual, setDataAtual] = useState<string | null>(null);
  
  useEffect(() => {
    setDataAtual(new Date().toLocaleString());
  }, []);
  
  if (!dataAtual) {
    return <span>Carregando...</span>;
  }
  
  return <span>{dataAtual}</span>;
}

// ❌ ERRADO - Condicional baseado em Math.random()
export function RandomComponent() {
  const showBanner = Math.random() > 0.5; // ⚠️ Diferente no server vs client!
  return showBanner ? <Banner /> : null;
}

// ✅ CORRETO - Usar estado do cliente
export function RandomComponent() {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    setShowBanner(Math.random() > 0.5);
  }, []);
  
  return showBanner ? <Banner /> : null;
}
```

### 17.4 Data Fetching em SSR

```typescript
// ✅ CORRETO (Next.js App Router) - Server Component para dados
// app/operacoes/page.tsx
async function OperacoesPage() {
  const operacoes = await operacaoService.listar();
  
  return (
    <div>
      <h1>Operações</h1>
      <OperacoesTable operacoes={operacoes} />
    </div>
  );
}

// ✅ CORRETO (Vite/SPA) - TanStack Query com prefetch
// pages/_app.tsx
export function App() {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}
```

### 17.5 Checklist SSR

- [ ] Verificar `typeof window !== 'undefined'` antes de acessar APIs do browser
- [ ] Usar `dynamic()` do Next.js com `ssr: false` para componentes client-only
- [ ] Não usar `Math.random()`, `Date.now()` ou IDs gerados em renderização
- [ ] Usar `useEffect` para conteúdo que depende do ambiente cliente
- [ ] Evitar acessar `document`, `window`, `localStorage`, `navigator` sem verificação
- [ ] Usar Suspense + React Query para loading states consistentes

---

## 18. Ordem de Membros no Componente

### 18.1 Ordem Obrigatória em Hooks/Componentes

```typescript
// ✅ CORRETO - Ordem consistente e previsível
export function MeuComponente({ prop1, prop2 }: MeuComponenteProps) {
  // 1. Hooks de contexto/stores (primeiro pois podem ser usados em outros hooks)
  const theme = useTheme();
  const { user } = useAuthStore();
  
  // 2. Hooks de dados (React Query)
  const { data, isLoading, error } = useOperacoes();
  const { mutate: excluir } = useDeleteOperacao();
  
  // 3. Estado local (useState)
  const [isOpen, setIsOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  
  // 4. Referencias (useRef)
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 5. Valores derivados (useMemo)
  const itensFiltrados = useMemo(() => 
    data?.filter(item => item.nome.includes(filtro)) ?? [],
    [data, filtro]
  );
  
  // 6. Callbacks memorizados (useCallback)
  const handleSubmit = useCallback(() => {
    // ...
  }, [dependency]);
  
  // 7. Effects (useEffect) - sempre por último antes do return
  useEffect(() => {
    document.title = `Operações (${itensFiltrados.length})`;
  }, [itensFiltrados.length]);
  
  // 8. Handlers simples (funções que não precisam de memoização)
  const handleToggle = () => setIsOpen(!isOpen);
  
  // 9. Early returns (loading, error, empty states)
  if (isLoading) return <Loading />;
  if (error) return <ErrorState error={error} />;
  if (!data?.length) return <EmptyState />;
  
  // 10. Return principal
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 18.2 Justificativa da Ordem

| Posição | Tipo             | Motivo                                        |
| ------- | ---------------- | --------------------------------------------- |
| 1       | Contextos/Stores | Dependências para outros hooks                |
| 2       | React Query      | Dados que afetam o render                     |
| 3       | useState         | Estado local após dados externos              |
| 4       | useRef           | Referências que não causam re-render          |
| 5       | useMemo          | Derivar de dados/estado já definidos          |
| 6       | useCallback      | Funções que dependem de valores anteriores    |
| 7       | useEffect        | Side effects após toda lógica definida        |
| 8       | Handlers         | Funções simples que usam estados já definidos |
| 9       | Early returns    | Prevenir renderização desnecessária           |
| 10      | Return           | JSX principal                                 |

### 18.3 Ordem em Arquivos de Hook Customizado

```typescript
// ✅ CORRETO - Estrutura de hook customizado
export function useOperacoesPage() {
  // 1. Injeção de dependências (outros hooks)
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // 2. Estado local
  const [filtro, setFiltro] = useState<FiltroOperacao>({});
  const [page, setPage] = useState(1);
  
  // 3. Queries
  const { data, isLoading, isError } = useOperacoes(filtro, page);
  
  // 4. Mutations
  const { mutate: excluir, isPending: isExcluindo } = useDeleteOperacao();
  
  // 5. Valores derivados
  const operacoesFormatadas = useMemo(() =>
    data?.map(op => ({ ...op, valorFormatado: formatCurrency(op.valor) })) ?? [],
    [data]
  );
  
  // 6. Callbacks
  const handleFiltrar = useCallback((novoFiltro: FiltroOperacao) => {
    setFiltro(novoFiltro);
    setPage(1); // Reset page ao filtrar
  }, []);
  
  const handleExcluir = useCallback((id: string) => {
    excluir(id, {
      onSuccess: () => navigate('/operacoes'),
    });
  }, [excluir, navigate]);
  
  // 7. Effects
  useEffect(() => {
    // Prefetch da próxima página
    if (data?.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: ['operacoes', filtro, page + 1],
        queryFn: () => operacaoService.listar(filtro, page + 1),
      });
    }
  }, [data, filtro, page, queryClient]);
  
  // 8. Return - API pública do hook
  return {
    // Estado
    operacoes: operacoesFormatadas,
    filtro,
    page,
    isLoading,
    isError,
    isExcluindo,
    
    // Ações
    setFiltro: handleFiltrar,
    setPage,
    excluir: handleExcluir,
  };
}
```

---

## 19. Acessibilidade (a11y)

### 19.1 Princípios WCAG 2.2

| Princípio | Regra |
|-----------|-------|
| Perceptível | Todo conteúdo não-textual deve ter alternativa textual (`alt`, `aria-label`) |
| Operável | Toda funcionalidade deve ser acessível via teclado |
| Compreensível | Interface deve ser previsível e ajudar a evitar erros |
| Robusto | Conteúdo deve ser interpretável por tecnologias assistivas |

### 19.2 Regras Obrigatórias

```tsx
// ✅ CORRETO — Imagens com alt significativo
<img src={produto.imagem} alt={`${produto.nome} - ${produto.categoria}`} />

// ✅ CORRETO — Ícone-only buttons precisam de aria-label
<button onClick={() => excluir(item)} aria-label={`Excluir item ${item.nome}`}>
  <TrashIcon />
</button>

// ✅ CORRETO — Formulários com labels associados via htmlFor
<label htmlFor="email">E-mail</label>
<input id="email" {...register('email')} type="email"
       aria-describedby="email-error" aria-invalid={!!errors.email} />
{errors.email && (
  <span id="email-error" role="alert">{errors.email.message}</span>
)}

// ✅ CORRETO — Headings hierárquicos (nunca pular níveis)
<h1>Cardápio</h1>
<h2>Lanches</h2>
<h3>Hamburgers</h3>

// ✅ CORRETO — Live regions para conteúdo dinâmico
<div aria-live="polite" aria-atomic="true">
  {mensagem && <span>{mensagem}</span>}
</div>

// ✅ CORRETO — Skip navigation link
<a className="skip-link" href="#main-content">Pular para conteúdo principal</a>
<main id="main-content">...</main>
```

### 19.3 Navegação por Teclado

```tsx
// ✅ CORRETO — Focus management em modais/diálogos
function Dialog({ titulo, onClose, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    return () => previousFocus.current?.focus();
  }, []);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <h2 id="dialog-title">{titulo}</h2>
      {children}
    </div>
  );
}
```

### 19.4 Componentes Semânticos

```tsx
// ✅ CORRETO — Usar elementos semânticos do HTML5
<header>...</header>
<nav aria-label="Navegação principal">...</nav>
<main>...</main>
<aside aria-label="Filtros">...</aside>
<footer>...</footer>

// ✅ CORRETO — Listas de dados são <ul>/<ol>
<ul role="list">
  {produtos.map(p => <li key={p.id}><ProdutoCard produto={p} /></li>)}
</ul>

// ❌ ERRADO — Divs clicáveis sem semântica
<div onClick={handler}>Clique aqui</div>  // ❌
<button onClick={handler}>Clique aqui</button>  // ✅
```

### 19.5 Checklist a11y

- [ ] Toda imagem tem `alt` descritivo (ou `alt=""` se decorativa)
- [ ] Todo controle interativo é acessível via teclado (Tab, Enter, Escape)
- [ ] Formulários têm labels associados (`htmlFor`/`id` ou `aria-label`)
- [ ] Erros de validação são anunciados (`role="alert"` ou `aria-live`)
- [ ] Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
- [ ] Focus visible em todos os elementos interativos (`:focus-visible`)
- [ ] Headings em ordem hierárquica (h1 → h2 → h3)
- [ ] Sem `tabIndex` > 0 (altera ordem natural)
- [ ] Elementos interativos usam tags semânticas (`button`, `a`, `input`)
- [ ] Testar com screen reader (VoiceOver/NVDA) e navegação apenas via teclado

---

## 20. Performance e Otimização

### 20.1 Code Splitting e Lazy Loading

```tsx
// ✅ CORRETO — Lazy loading de rotas (React.lazy + Suspense)
const AdminPage = lazy(() => import('./pages/AdminPage'));
const RelatoriosPage = lazy(() => import('./pages/RelatoriosPage'));

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 20.2 Memoização e Re-renders

```tsx
// ✅ CORRETO — useMemo para cálculos caros
const totalPedidos = useMemo(
  () => pedidos.reduce((acc, p) => acc + p.total, 0),
  [pedidos]
);

// ✅ CORRETO — useCallback para funções passadas como props
const handleExcluir = useCallback((id: string) => {
  mutation.mutate(id);
}, [mutation]);

// ✅ CORRETO — memo() para componentes puros com props estáveis
const ProdutoCard = memo(function ProdutoCard({ produto }: ProdutoCardProps) {
  return <div>{produto.nome} - R$ {produto.preco}</div>;
});

// ⚠️ NÃO memoizar tudo — apenas quando há re-render desnecessário mensurável
// Usar React DevTools Profiler para identificar gargalos ANTES de otimizar
```

### 20.3 Imagens e Assets

```tsx
// ✅ CORRETO — Lazy loading de imagens
<img src={produto.imagem} alt={produto.nome} loading="lazy" />

// ✅ CORRETO — Formatos modernos com fallback
<picture>
  <source srcSet={produto.imagemAvif} type="image/avif" />
  <source srcSet={produto.imagemWebp} type="image/webp" />
  <img src={produto.imagemJpg} alt={produto.nome} loading="lazy" />
</picture>
```

### 20.4 Virtualização de Listas Longas

```tsx
// ✅ CORRETO — TanStack Virtual para listas com 100+ itens
import { useVirtualizer } from '@tanstack/react-virtual';

function ProdutosList({ produtos }: { produtos: Produto[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: produtos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div key={virtualItem.key} style={{
            position: 'absolute',
            top: virtualItem.start,
            height: virtualItem.size,
            width: '100%',
          }}>
            <ProdutoCard produto={produtos[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 20.5 Regras de Performance

- ✅ **SEMPRE** use `React.lazy()` + `Suspense` para rotas
- ✅ **SEMPRE** use `loading="lazy"` em imagens abaixo do fold
- ✅ **SEMPRE** virtualize listas com 100+ itens (`@tanstack/react-virtual`)
- ✅ **SEMPRE** configure `staleTime` adequado no TanStack Query (evitar refetch desnecessário)
- ✅ **SEMPRE** use `useMemo`/`useCallback` quando houver re-render mensurável
- ❌ **NUNCA** memoize tudo prematuramente — medir antes com React DevTools Profiler
- ❌ **NUNCA** importe bibliotecas inteiras quando só precisa de partes (`import { debounce } from 'lodash-es'`)
- ❌ **NUNCA** use `useEffect` para derivar estado — use `useMemo`

---

**🚨 LEMBRE-SE: Código React moderno é declarativo, reativo e altamente tipado!**
