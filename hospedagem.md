# Instruções de Hospedagem - PWA Gestão Financeira

Este documento detalha como hospedar o backend (Node.js/Express) e o frontend (React) da sua aplicação PWA de Gestão Financeira. Recomendamos o uso de serviços com planos gratuitos como Render para o backend e Netlify/Vercel para o frontend, mas também incluímos instruções para sua VM Oracle.

## Visão Geral

A aplicação consiste em duas partes principais:

1.  **Backend:** Uma API Node.js/Express que lida com a lógica de negócios, autenticação e interação com o banco de dados MongoDB.
2.  **Frontend:** Uma aplicação React (PWA) que consome a API do backend e apresenta a interface ao usuário.

Ambas as partes precisam ser hospedadas para que a aplicação funcione online.

## 1. Hospedagem do Backend (Node.js/Express)

O backend precisa rodar em um ambiente Node.js e conectar-se ao seu banco de dados MongoDB Atlas.

### Opção A: Render (Recomendado - Plano Gratuito)

Render é uma plataforma que facilita a hospedagem de web services, bancos de dados e sites estáticos.

1.  **Pré-requisito:** Coloque o código do projeto completo (incluindo as pastas `frontend` e `backend`) em um repositório Git (GitHub, GitLab, Bitbucket).
2.  **Cadastro/Login:** Acesse [Render](https://render.com/) e crie uma conta ou faça login.
3.  **Novo Web Service:** No dashboard, clique em "New +" e selecione "Web Service".
4.  **Conectar Repositório:** Conecte sua conta Git e selecione o repositório do projeto.
5.  **Configurações do Serviço:**
    *   **Name:** Dê um nome único (ex: `gestao-financeira-backend`).
    *   **Region:** Escolha uma região (ex: Frankfurt ou Ohio).
    *   **Branch:** Selecione a branch principal (ex: `main`).
    *   **Root Directory:** `backend` (Importante: especifica que o serviço deve usar a pasta backend).
    *   **Runtime:** `Node`.
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start` (ou `node server.js`)
    *   **Plan:** Selecione o plano `Free`.
6.  **Variáveis de Ambiente:** Clique em "Advanced" ou procure a seção "Environment Variables". Adicione as seguintes variáveis:
    *   `MONGODB_URI`: Cole a sua string de conexão completa do MongoDB Atlas (`mongodb+srv://gestaoUser:iAs2S3oJK30h4heJ@cluster0.t80d46m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).
    *   `JWT_SECRET`: Cole o segredo que definimos (`uma_chave_secreta_muito_forte_e_aleatoria_para_jwt_1234567890`).
    *   `NODE_VERSION`: (Opcional, mas recomendado) Verifique a versão do Node.js usada no desenvolvimento (ex: `20.18.0`) e defina-a aqui para garantir compatibilidade.
7.  **Criar Serviço:** Clique em "Create Web Service". O Render fará o build e o deploy automaticamente.
8.  **URL do Backend:** Após o deploy, o Render fornecerá uma URL pública para o seu backend (ex: `https://gestao-financeira-backend.onrender.com`). **Anote esta URL, você precisará dela para configurar o frontend.**

### Opção B: VM Oracle Cloud (Ubuntu ARM)

Esta opção requer mais configuração manual.

1.  **Pré-requisitos:**
    *   Acesso SSH à sua VM Ubuntu ARM.
    *   Node.js e npm instalados (verifique a versão compatível).
    *   Git instalado (`sudo apt update && sudo apt install git`).
2.  **Clonar Repositório:**
    *   Conecte-se à VM via SSH.
    *   Clone o repositório: `git clone <URL_DO_SEU_REPOSITORIO>`
    *   Navegue até a pasta do backend: `cd nome-do-repo/backend`
3.  **Instalar Dependências:** `npm install`
4.  **Configurar Variáveis de Ambiente:**
    *   Crie um arquivo `.env`: `nano .env`
    *   Adicione as variáveis:
        ```
        MONGODB_URI=mongodb+srv://gestaoUser:iAs2S3oJK30h4heJ@cluster0.t80d46m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
        JWT_SECRET=uma_chave_secreta_muito_forte_e_aleatoria_para_jwt_1234567890
        PORT=5000 # Ou outra porta de sua escolha
        ```
    *   Salve e feche o arquivo (Ctrl+X, depois Y, depois Enter).
5.  **Executar com PM2 (Gerenciador de Processos):**
    *   Instale o PM2 globalmente: `sudo npm install -g pm2`
    *   Inicie a aplicação com PM2: `pm2 start server.js --name gestao-backend`
    *   Verifique se está rodando: `pm2 list`
    *   Configure o PM2 para iniciar com o sistema: `pm2 startup` (siga as instruções exibidas)
    *   Salve a configuração atual do PM2: `pm2 save`
6.  **Configurar Firewall:** Permita tráfego na porta que você definiu (ex: 5000):
    *   `sudo ufw allow 5000/tcp`
    *   `sudo ufw enable` (se ainda não estiver ativo)
    *   `sudo ufw status`
7.  **URL do Backend:** A URL será `http://SEU_IP_PUBLICO_DA_VM:5000`. **Anote esta URL.** (Para HTTPS, você precisará configurar um reverse proxy como Nginx ou Caddy).

## 2. Hospedagem do Frontend (React Build)

O frontend consiste em arquivos estáticos gerados pelo comando `npm run build`. Eles podem ser hospedados em qualquer serviço de hospedagem de sites estáticos.

### Opção A: Netlify (Recomendado - Plano Gratuito)

Netlify é excelente para hospedar sites estáticos e PWAs.

1.  **Pré-requisito:** Código no repositório Git.
2.  **Cadastro/Login:** Acesse [Netlify](https://netlify.com/) e crie uma conta ou faça login.
3.  **Novo Site:** No dashboard, clique em "Add new site" > "Import an existing project".
4.  **Conectar Repositório:** Conecte sua conta Git e selecione o repositório do projeto.
5.  **Configurações de Build:**
    *   **Branch to deploy:** `main` (ou sua branch principal).
    *   **Base directory:** `frontend` (Importante: se o repo tem ambas as pastas).
    *   **Build command:** `npm run build`
    *   **Publish directory:** `frontend/build` (Importante: caminho para a pasta gerada pelo build).
6.  **Configurar Proxy/Redirecionamento (Crucial):** Para que as chamadas `/api/...` do frontend cheguem ao seu backend hospedado, crie um arquivo chamado `netlify.toml` **dentro da pasta `frontend`** com o seguinte conteúdo:
    ```toml
    [[redirects]]
      from = "/api/*"
      to = "URL_DO_SEU_BACKEND/:splat" # Substitua pela URL do Render ou da VM
      status = 200
      force = true # Garante que a regra seja aplicada
    
    # Regra fallback para o React Router funcionar corretamente
    [[redirects]]
      from = "/*"
      to = "/index.html"
      status = 200
    ```
    *   **Substitua `URL_DO_SEU_BACKEND` pela URL que você anotou no passo 1** (ex: `https://gestao-financeira-backend.onrender.com` ou `http://SEU_IP_PUBLICO_DA_VM:5000`).
    *   Faça o commit e push deste arquivo `netlify.toml` para o seu repositório Git.
7.  **Deploy:** Clique em "Deploy site". O Netlify fará o build e o deploy.
8.  **URL do Frontend:** O Netlify fornecerá uma URL pública (ex: `https://nome-aleatorio.netlify.app`). Você pode configurar um domínio personalizado se desejar.

### Opção B: Vercel (Alternativa - Plano Gratuito)

Similar ao Netlify.

1.  **Pré-requisito:** Código no repositório Git.
2.  **Cadastro/Login:** Acesse [Vercel](https://vercel.com/) e crie uma conta ou faça login.
3.  **Novo Projeto:** Importe o projeto do seu repositório Git.
4.  **Configurações do Projeto:**
    *   **Framework Preset:** Selecione `Create React App`.
    *   **Root Directory:** Selecione `frontend` (se o repo tem ambas as pastas).
    *   Verifique se o Build Command (`npm run build`) e Output Directory (`frontend/build`) estão corretos.
5.  **Configurar Proxy/Redirecionamento (Crucial):** Crie um arquivo chamado `vercel.json` **dentro da pasta `frontend`** com o seguinte conteúdo:
    ```json
    {
      "rewrites": [
        {
          "source": "/api/(.*)",
          "destination": "URL_DO_SEU_BACKEND/api/$1" 
        }
      ]
    }
    ```
    *   **Substitua `URL_DO_SEU_BACKEND` pela URL que você anotou no passo 1.**
    *   Faça o commit e push deste arquivo `vercel.json` para o seu repositório Git.
6.  **Deploy:** Clique em "Deploy".
7.  **URL do Frontend:** O Vercel fornecerá uma URL pública.

### Opção C: VM Oracle Cloud (com Nginx/Caddy)

1.  **Pré-requisito:** Backend já hospedado na VM (Opção B do passo 1).
2.  **Copiar Build:** Copie o conteúdo da pasta `frontend/build` (gerada localmente ou no ambiente de desenvolvimento) para um diretório na sua VM (ex: `/var/www/gestao-financeira`). Você pode usar `scp` ou clonar o repo e fazer o build na VM (`cd frontend && npm run build`).
3.  **Instalar Web Server (Nginx):**
    *   `sudo apt update && sudo apt install nginx`
4.  **Configurar Nginx:**
    *   Crie um arquivo de configuração para seu site: `sudo nano /etc/nginx/sites-available/gestao-financeira`
    *   Adicione a seguinte configuração (ajuste `server_name` e caminhos se necessário):
        ```nginx
        server {
            listen 80;
            server_name seu_dominio_ou_ip; # Substitua pelo IP público da VM ou seu domínio

            root /var/www/gestao-financeira; # Caminho para os arquivos do build
            index index.html index.htm;

            location / {
                try_files $uri /index.html;
            }

            location /api/ {
                proxy_pass http://localhost:5000; # Proxy para o backend rodando na porta 5000
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
            }
        }
        ```
    *   Salve e feche (Ctrl+X, Y, Enter).
    *   Crie um link simbólico para habilitar o site: `sudo ln -s /etc/nginx/sites-available/gestao-financeira /etc/nginx/sites-enabled/`
    *   Teste a configuração: `sudo nginx -t`
    *   Reinicie o Nginx: `sudo systemctl restart nginx`
5.  **Configurar Firewall:** Permita tráfego HTTP (e HTTPS se configurar): `sudo ufw allow 'Nginx Full'`
6.  **Acesso:** Acesse a aplicação pelo IP público da VM ou domínio configurado.

## 3. Verificação Final

Após hospedar o backend e o frontend, acesse a URL pública do frontend e teste todas as funcionalidades (registro, login, adição/visualização de transações) para garantir que a comunicação entre frontend e backend está funcionando corretamente através do proxy/redirecionamento configurado.

