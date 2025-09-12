# 🚀 Guia de Deploy - Analisador Ergonômico

Este documento contém instruções detalhadas para fazer deploy do Analisador Ergonômico no GitHub e Vercel.

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Vercel (opcional, mas recomendado)
- Git instalado localmente

## 🔧 Preparação dos Arquivos

O projeto já está preparado com todos os arquivos necessários:

```
ergonomic-analyzer/
├── .gitignore          # Arquivos a serem ignorados pelo Git
├── README.md           # Documentação principal
├── DEPLOY.md           # Este arquivo de instruções
├── package.json        # Metadados do projeto
├── vercel.json         # Configuração do Vercel
├── index.html          # Página principal
├── styles.css          # Estilos globais
└── js/                 # Scripts JavaScript
    ├── main.js
    ├── ui-controller.js
    ├── pose-detection-fixed.js
    ├── pose-simulation.js
    ├── ergonomic-algorithms.js
    └── demo-image.js
```

## 🐙 Deploy no GitHub

### Passo 1: Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Clique em "New repository"
3. Nome sugerido: `ergonomic-analyzer`
4. Descrição: "Aplicativo web para análise ergonômica RULA, REBA e OWAS"
5. Marque como "Public"
6. **NÃO** inicialize com README (já temos um)
7. Clique em "Create repository"

### Passo 2: Fazer Upload dos Arquivos

#### Opção A: Via Interface Web do GitHub
1. No repositório criado, clique em "uploading an existing file"
2. Arraste todos os arquivos do projeto
3. Commit message: "Initial commit - Ergonomic Analyzer v1.0"
4. Clique em "Commit changes"

#### Opção B: Via Git (Linha de Comando)
```bash
# No diretório do projeto
git init
git add .
git commit -m "Initial commit - Ergonomic Analyzer v1.0"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/ergonomic-analyzer.git
git push -u origin main
```

### Passo 3: Ativar GitHub Pages

1. No repositório, vá em "Settings"
2. Role até "Pages" no menu lateral
3. Em "Source", selecione "Deploy from a branch"
4. Branch: "main"
5. Folder: "/ (root)"
6. Clique em "Save"
7. Aguarde alguns minutos
8. Acesse: `https://SEU-USUARIO.github.io/ergonomic-analyzer`

## ⚡ Deploy no Vercel (Recomendado)

### Passo 1: Conectar GitHub ao Vercel

1. Acesse [Vercel](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione o repositório `ergonomic-analyzer`
5. Clique em "Import"

### Passo 2: Configurar Deploy

1. **Project Name**: `ergonomic-analyzer`
2. **Framework Preset**: "Other" (site estático)
3. **Root Directory**: `./` (raiz)
4. **Build Command**: Deixe vazio (não precisa build)
5. **Output Directory**: Deixe vazio
6. **Install Command**: Deixe vazio

### Passo 3: Deploy

1. Clique em "Deploy"
2. Aguarde o processo (1-2 minutos)
3. Acesse a URL fornecida (ex: `https://ergonomic-analyzer.vercel.app`)

### Passo 4: Configurar Domínio Personalizado (Opcional)

1. No dashboard do Vercel, vá em "Settings"
2. Clique em "Domains"
3. Adicione seu domínio personalizado
4. Configure DNS conforme instruções

## 🔧 Configurações Avançadas

### Variáveis de Ambiente (se necessário)
No Vercel:
1. Settings > Environment Variables
2. Adicione variáveis se necessário (atualmente não há nenhuma)

### Headers de Segurança
O arquivo `vercel.json` já inclui headers de segurança:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### Cache Configuration
- Arquivos CSS/JS: Cache de 1 ano
- HTML: Cache padrão do Vercel

## 🧪 Teste do Deploy

### Checklist de Funcionalidades
- [ ] Página carrega corretamente
- [ ] Seleção de metodologias (RULA, REBA, OWAS)
- [ ] Botão "Ativar Câmera" funciona
- [ ] Imagem de demonstração aparece
- [ ] Controles de análise respondem
- [ ] Botão "Analisar Postura" funciona
- [ ] Interface responsiva em mobile

### URLs de Teste
- **GitHub Pages**: `https://SEU-USUARIO.github.io/ergonomic-analyzer`
- **Vercel**: `https://ergonomic-analyzer.vercel.app`

## 🔄 Atualizações Futuras

### GitHub Pages
1. Faça alterações nos arquivos
2. Commit e push para o repositório
3. GitHub Pages atualiza automaticamente

### Vercel
1. Faça alterações nos arquivos
2. Commit e push para o repositório
3. Vercel faz deploy automático

## 🐛 Solução de Problemas

### Problema: Página não carrega
- Verifique se `index.html` está na raiz
- Confirme se GitHub Pages está ativado
- Aguarde alguns minutos para propagação

### Problema: JavaScript não funciona
- Verifique console do navegador (F12)
- Confirme se todos os arquivos JS estão presentes
- Teste em navegador diferente

### Problema: Câmera não funciona
- Normal em HTTP (use HTTPS)
- GitHub Pages e Vercel usam HTTPS automaticamente
- Imagem de demonstração deve aparecer como fallback

### Problema: Deploy falha no Vercel
- Verifique se `vercel.json` está correto
- Confirme se não há arquivos corrompidos
- Tente reimportar o projeto

## 📊 Monitoramento

### Analytics (Opcional)
Para adicionar Google Analytics:
1. Crie conta no Google Analytics
2. Adicione código de tracking no `index.html`
3. Faça commit das alterações

### Performance
- Use Lighthouse para auditoria
- Monitore Core Web Vitals
- Teste em diferentes dispositivos

## 🔒 Segurança

### HTTPS
- GitHub Pages: HTTPS automático
- Vercel: HTTPS automático
- Necessário para acesso à câmera

### Headers de Segurança
Já configurados no `vercel.json`:
- Proteção contra XSS
- Prevenção de clickjacking
- Política de referrer restritiva

## 📞 Suporte

Se encontrar problemas:
1. Verifique este guia novamente
2. Consulte documentação do GitHub Pages
3. Consulte documentação do Vercel
4. Abra issue no repositório

---

**✅ Deploy concluído com sucesso!**

Seu Analisador Ergonômico está agora disponível online e pronto para uso por engenheiros de segurança em todo o mundo.

