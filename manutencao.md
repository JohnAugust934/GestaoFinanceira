# Instruções de Manutenção e Atualização - PWA Gestão Financeira

Este documento descreve o fluxo de trabalho recomendado para fazer alterações no código (manutenção, novas funcionalidades) da sua aplicação PWA de Gestão Financeira e como implantar (deploy) essas atualizações no ambiente de produção que você configurou (Render/Netlify/Vercel ou VM Oracle).

## Visão Geral do Fluxo de Trabalho

O processo geral envolve fazer alterações localmente, testá-las e, em seguida, enviar essas alterações para o seu repositório Git, o que (na maioria dos casos) acionará automaticamente um novo deploy nas plataformas de hospedagem.

1.  **Obter o Código:** Certifique-se de ter a versão mais recente do código em sua máquina local.
2.  **Configurar Ambiente Local:** Prepare seu ambiente de desenvolvimento para rodar o frontend e o backend.
3.  **Fazer Alterações:** Modifique o código do frontend (React) ou do backend (Node.js) conforme necessário.
4.  **Testar Localmente:** Execute o frontend e o backend localmente para garantir que suas alterações funcionam e não introduziram novos problemas.
5.  **Commit e Push:** Salve suas alterações no Git e envie-as para o repositório remoto (GitHub, GitLab, etc.).
6.  **Deploy:** O processo de deploy varia dependendo da sua plataforma de hospedagem.

## 1. Obter o Código e Configurar Ambiente Local

*   **Clonar (se ainda não tiver):** Se você estiver em uma nova máquina, clone o repositório:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd nome-do-repo
    ```
*   **Atualizar:** Se você já tem o repositório, certifique-se de estar na branch principal (ex: `main`) e puxe as últimas alterações:
    ```bash
    git checkout main
    git pull origin main
    ```
*   **Instalar Dependências:** Instale as dependências para ambas as partes:
    ```bash
    # No diretório raiz do projeto
    cd backend
    npm install
    cd ../frontend
    npm install
    cd .. # Voltar para a raiz
    ```

## 2. Fazer Alterações no Código

*   **Backend:** Edite os arquivos dentro da pasta `backend` (controllers, models, routes, server.js, etc.).
*   **Frontend:** Edite os arquivos dentro da pasta `frontend/src` (components, services, App.js, etc.).
*   **Recomendação:** Use branches do Git para novas funcionalidades ou correções significativas (`git checkout -b minha-nova-feature`). Isso mantém a branch `main` estável.

## 3. Testar Localmente

É crucial testar suas alterações antes de enviá-las para produção.

1.  **Iniciar Backend:**
    *   Abra um terminal na pasta `backend`.
    *   Certifique-se de ter um arquivo `.env` com as variáveis `MONGODB_URI` (pode usar a do Atlas) e `JWT_SECRET`.
    *   Execute: `npm run dev` (usa nodemon para reiniciar automaticamente com as alterações).
2.  **Iniciar Frontend:**
    *   Abra **outro** terminal na pasta `frontend`.
    *   Execute: `npm start` (lembre-se que configuramos o proxy no `package.json` e a flag `DANGEROUSLY_DISABLE_HOST_CHECK` para desenvolvimento).
3.  **Testar no Navegador:** Abra o navegador em `http://localhost:3000` (ou a porta que o frontend indicar) e teste exaustivamente as partes que você modificou e as funcionalidades principais para garantir que nada quebrou (testes de regressão).

## 4. Commit e Push das Alterações

Quando estiver satisfeito com suas alterações e testes locais:

1.  **Adicionar Arquivos:** Adicione os arquivos modificados ao stage do Git:
    ```bash
    git add .
    ```
2.  **Commit:** Crie um commit descritivo:
    ```bash
    git commit -m "Descreva suas alterações aqui (ex: Adiciona funcionalidade X, Corrige bug Y)"
    ```
3.  **Push:** Envie suas alterações para o repositório remoto (substitua `main` pela sua branch se estiver usando uma):
    ```bash
    git push origin main
    ```
4.  **Merge (se usando branches):** Se você usou uma branch separada, crie um Pull Request (ou Merge Request) no GitHub/GitLab para mesclar suas alterações na branch `main` após a revisão (se aplicável).

## 5. Deploy das Atualizações

O processo exato depende de como você configurou a hospedagem:

### Plataformas com Deploy Automático (Render, Netlify, Vercel)

*   **Como funciona:** Essas plataformas geralmente monitoram a branch principal (`main`) do seu repositório Git.
*   **Ação:** Assim que você faz o `push` (ou merge) para a branch `main`, a plataforma detecta a alteração e **automaticamente** inicia um novo processo de build e deploy.
    *   **Render (Backend):** Irá puxar o código, rodar `npm install` e reiniciar o serviço com `npm start`.
    *   **Netlify/Vercel (Frontend):** Irá puxar o código, rodar `npm run build` no diretório `frontend` e publicar a nova pasta `build`.
*   **Verificação:** Você pode acompanhar o progresso do deploy nos dashboards do Render, Netlify ou Vercel. Após a conclusão, acesse a URL pública da sua aplicação para verificar se as alterações estão no ar.

### VM Oracle Cloud (Manual)

Se você hospedou na sua VM, o processo é manual:

1.  **Conectar à VM:** Acesse sua VM via SSH.
2.  **Navegar até o Projeto:** `cd nome-do-repo`
3.  **Puxar Alterações:**
    ```bash
    git checkout main
    git pull origin main
    ```
4.  **Atualizar Backend (se houver alterações):**
    *   Navegue até a pasta backend: `cd backend`
    *   Instale novas dependências (se houver): `npm install`
    *   Reinicie o processo PM2: `pm2 restart gestao-backend` (ou o nome que você deu)
    *   Verifique os logs: `pm2 logs gestao-backend`
    *   Volte para a raiz: `cd ..`
5.  **Atualizar Frontend (se houver alterações):**
    *   Navegue até a pasta frontend: `cd frontend`
    *   Instale novas dependências (se houver): `npm install`
    *   Gere o novo build: `npm run build`
    *   **Copie o novo build para o diretório do Nginx:**
        ```bash
        # Exemplo: remove o conteúdo antigo e copia o novo
        sudo rm -rf /var/www/gestao-financeira/*
        sudo cp -r build/* /var/www/gestao-financeira/
        ```
        *Certifique-se de que o caminho `/var/www/gestao-financeira` está correto.*
6.  **Verificar:** Acesse a URL pública da sua aplicação (IP da VM ou domínio) e limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R) para garantir que você está vendo a versão mais recente.

## Considerações Adicionais

*   **Variáveis de Ambiente:** Se você adicionar novas variáveis de ambiente necessárias para suas alterações, lembre-se de configurá-las também no ambiente de produção (nas configurações do Render ou no arquivo `.env` da VM) antes ou durante o deploy.
*   **Migrações de Banco de Dados:** Se suas alterações envolverem mudanças na estrutura do banco de dados (schema dos Models), você pode precisar executar scripts de migração manualmente ou usar ferramentas específicas (embora não tenhamos configurado nenhuma neste projeto inicial).
*   **Testes Automatizados:** Para projetos maiores, considere adicionar testes automatizados (unitários, integração, E2E) ao seu fluxo de trabalho para garantir a qualidade do código antes do deploy.

Seguindo este fluxo, você poderá manter e atualizar sua aplicação PWA de forma organizada e segura.

