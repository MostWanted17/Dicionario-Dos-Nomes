# Contribuindo para Dicionário dos Nomes


Obrigado por querer contribuir! 👋


## Como começar
1. Faça um fork do repositório
2. Cria um branch: `git checkout -b feat/minha-feature`
3. Instala dependências: `npm i`
4. Corre os testes e lints: `npm run lint && npm test && npm run typecheck`
5. Abre um Pull Request com descrição clara do que mudou e screenshots (se UI)


## Commits e PRs
- Usa mensagens de commit descritivas (ex.: `feat: busca offline com índice pré-gerado`)
- Mantém PRs pequenos e focados
- Inclui testes sempre que possível


## Código
- Segue ESLint/Prettier do projeto
- Evita *any* no TypeScript; cria tipos em `src/types/`
- Componentes devem ser funcionais e usar hooks


## Testes
- `__tests__/` para unit/UI
- Foca em comportamento observável (testing-library)


## Segurança e dados
- Não submete dados sensíveis
- Reporta vulnerabilidades via [`SECURITY.md`](SECURITY.md)