# Configuração do Supabase - CarbonCar

## Conexão Estabelecida

O CarbonCar está agora conectado ao Supabase com a seguinte estrutura:

### Banco de Dados Criado

- **8 Tabelas** com RLS habilitado
- **Dados de exemplo** já populados
- **Índices** otimizados para performance

### Estrutura de Tabelas

1. **studios** - Dados dos estúdios (multi-tenant)
2. **customers** - Clientes e dados de fidelidade
3. **vehicles** - Veículos dos clientes
4. **services** - Catálogo de serviços
5. **appointments** - Agendamentos e status
6. **expenses** - Controle de despesas
7. **portfolio_items** - Galeria de fotos
8. **reviews** - Avaliações e reputação

### Configuração das Variáveis de Ambiente

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em **Settings > API**
3. Copie as credenciais:
   - `Project URL`
   - `anon/public key`

4. Edite o arquivo `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### Dados de Demonstração

O banco já possui:
- 1 estúdio demo: **Carbon Detail** (slug: `carbon`)
- 2 clientes com veículos
- 4 serviços padrão
- 2 agendamentos ativos
- 1 despesa
- 2 itens no portfólio
- 1 review

### Segurança

- RLS habilitado em todas as tabelas
- Políticas baseadas em `studio_id` para isolamento multi-tenant
- Autenticação nativa do Supabase

### Service Layer

Todas as operações do banco são gerenciadas pelo `services/databaseService.ts`:

```typescript
import { databaseService } from './services/databaseService';

// Buscar estúdio
const studio = await databaseService.getStudioBySlug('carbon');

// Buscar clientes
const customers = await databaseService.getCustomers(studioId);

// Criar agendamento
const appointment = await databaseService.createAppointment(studioId, data);
```

### Próximos Passos

Para integrar completamente o Supabase na aplicação:

1. Substituir o `localStorage` nos componentes pelo `databaseService`
2. Implementar autenticação real com Supabase Auth
3. Atualizar o App.tsx para carregar dados do banco
4. Adicionar listeners em tempo real para updates

### Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

### Estrutura de Autenticação

O sistema suporta dois tipos de usuários:
- **ADMIN** - Gerentes do estúdio (acesso total)
- **CLIENT** - Clientes (agendamento público)

### Migrations Aplicadas

1. ✅ `create_carboncar_schema` - Estrutura principal
2. ✅ `seed_initial_data` - Dados de exemplo

Todas as migrações incluem:
- Comentários detalhados
- IF EXISTS para segurança
- RLS configurado
- Índices de performance
