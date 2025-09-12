# Analisador Ergonômico - RULA, REBA, OWAS

Um aplicativo web avançado para análise ergonômica em tempo real, desenvolvido especificamente para engenheiros de segurança na indústria farmacêutica.

## 🎯 Funcionalidades

### Metodologias Suportadas
- **RULA (Rapid Upper Limb Assessment)**: Análise focada em membros superiores
- **REBA (Rapid Entire Body Assessment)**: Avaliação completa do corpo
- **OWAS (Ovako Working Posture Analysis System)**: Análise de posturas de trabalho

### Recursos Principais
- ✅ **Captura de Imagem**: Webcam ou upload de arquivos
- ✅ **Detecção de Pose**: Usando TensorFlow.js com fallback para simulador
- ✅ **Análise em Tempo Real**: Algoritmos ergonômicos precisos
- ✅ **Interface Responsiva**: Compatível com desktop e mobile
- ✅ **Controles Avançados**: Ajustes de sensibilidade e parâmetros
- ✅ **Resultados Detalhados**: Pontuação e nível de risco
- ✅ **Exportação**: Relatórios em formato padrão

## 🚀 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **IA/ML**: TensorFlow.js, Pose Detection
- **Design**: CSS Grid, Flexbox, Responsive Design
- **Algoritmos**: Implementação completa RULA, REBA, OWAS

## 📋 Pré-requisitos

- Navegador moderno com suporte a:
  - WebRTC (para acesso à câmera)
  - Canvas API
  - ES6+ JavaScript
  - WebGL (opcional, para melhor performance)

## 🔧 Instalação e Uso

### Opção 1: Hospedagem Local
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ergonomic-analyzer.git

# Entre no diretório
cd ergonomic-analyzer

# Inicie um servidor HTTP local
python -m http.server 8080
# ou
npx serve .

# Acesse http://localhost:8080
```

### Opção 2: Deploy no Vercel
1. Faça fork deste repositório
2. Conecte sua conta Vercel ao GitHub
3. Importe o projeto no Vercel
4. Deploy automático será realizado

### Opção 3: GitHub Pages
1. Faça fork deste repositório
2. Vá em Settings > Pages
3. Selecione "Deploy from a branch"
4. Escolha "main" branch
5. Acesse via `https://seu-usuario.github.io/ergonomic-analyzer`

## 📖 Como Usar

### 1. Seleção da Metodologia
- Clique em uma das abas: RULA, REBA ou OWAS
- Cada metodologia tem parâmetros específicos

### 2. Captura de Imagem
- **Câmera**: Clique em "Ativar Câmera" para usar webcam
- **Upload**: Clique em "Upload Imagem" para enviar arquivo
- **Demo**: Sistema usa imagem de demonstração se câmera não disponível

### 3. Configuração de Parâmetros
- **Sensibilidade**: Ajusta precisão da detecção de pose
- **Contraste/Brilho**: Melhora qualidade da imagem
- **Força/Carga**: Define peso manipulado
- **Frequência**: Ocasional ou frequente
- **Duração**: Tempo de manutenção da postura

### 4. Análise
- Clique em "Analisar Postura"
- Aguarde processamento
- Visualize resultados com pontuação e nível de risco

### 5. Interpretação dos Resultados

#### RULA (1-7 pontos)
- **1-2**: Risco baixo - Postura aceitável
- **3-4**: Risco médio - Investigação necessária
- **5-6**: Risco alto - Mudanças necessárias em breve
- **7**: Risco muito alto - Mudanças imediatas

#### REBA (1-15 pontos)
- **1**: Risco negligível
- **2-3**: Risco baixo - Mudanças podem ser necessárias
- **4-7**: Risco médio - Investigação e mudanças necessárias
- **8-10**: Risco alto - Mudanças necessárias em breve
- **11-15**: Risco muito alto - Mudanças imediatas

#### OWAS (1-4 categorias)
- **Categoria 1**: Postura normal - Nenhuma ação
- **Categoria 2**: Postura levemente prejudicial - Ação corretiva no futuro próximo
- **Categoria 3**: Postura prejudicial - Ação corretiva o mais breve possível
- **Categoria 4**: Postura extremamente prejudicial - Ação corretiva imediata

## 🏗️ Arquitetura do Sistema

```
ergonomic-analyzer/
├── index.html              # Página principal
├── styles.css              # Estilos globais
├── js/
│   ├── main.js             # Controlador principal
│   ├── ui-controller.js    # Gerenciamento da interface
│   ├── pose-detection.js   # Detecção de pose (TensorFlow.js)
│   ├── pose-simulation.js  # Simulador de pose (fallback)
│   ├── ergonomic-algorithms.js # Algoritmos RULA, REBA, OWAS
│   └── demo-image.js       # Gerador de imagem de demonstração
└── README.md               # Documentação
```

## 🔬 Algoritmos Implementados

### RULA (Rapid Upper Limb Assessment)
- Tabela A: Braço, antebraço, punho
- Tabela B: Pescoço, tronco, pernas
- Tabela C: Pontuação final com ajustes de força e atividade muscular

### REBA (Rapid Entire Body Assessment)
- Grupo A: Tronco, pescoço, pernas
- Grupo B: Braços, antebraços, punhos
- Tabela C: Pontuação final com ajustes de carga e acoplamento

### OWAS (Ovako Working Posture Analysis System)
- Análise de costas, braços, pernas
- Classificação em 4 categorias de ação
- Baseado em combinações posturais específicas

## 🛠️ Desenvolvimento

### Estrutura de Classes
- `ErgonomicAnalyzer`: Classe principal do sistema
- `UIController`: Gerenciamento da interface do usuário
- `PoseDetector`: Detecção de pose humana
- `PoseSimulator`: Simulador para demonstração
- `ErgonomicAlgorithms`: Implementação dos algoritmos
- `DemoImageGenerator`: Geração de imagens de teste

### Fluxo de Funcionamento
1. Inicialização do sistema
2. Carregamento dos modelos de IA
3. Captura ou upload de imagem
4. Detecção de keypoints corporais
5. Cálculo de ângulos articulares
6. Aplicação dos algoritmos ergonômicos
7. Exibição dos resultados

## 🎨 Design e UX

- **Design System**: Cores temáticas para cada metodologia
- **Responsividade**: Adaptação automática para diferentes telas
- **Acessibilidade**: Contraste adequado e navegação por teclado
- **Feedback Visual**: Indicadores de progresso e status
- **Usabilidade**: Interface intuitiva para profissionais

## 🔒 Privacidade e Segurança

- **Processamento Local**: Todas as análises são feitas no navegador
- **Sem Upload**: Imagens não são enviadas para servidores externos
- **Dados Temporários**: Informações não são armazenadas permanentemente
- **HTTPS**: Recomendado para acesso à câmera

## 📊 Performance

- **Otimização**: Algoritmos otimizados para execução em tempo real
- **Fallback**: Sistema de backup quando IA não está disponível
- **Compatibilidade**: Funciona em navegadores modernos
- **Responsividade**: Interface fluida em diferentes dispositivos

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Desenvolvido por**: Manus AI
- **Especialização**: Engenharia de Segurança Industrial
- **Foco**: Indústria Farmacêutica

## 📞 Suporte

Para dúvidas, sugestões ou reportar problemas:
- Abra uma issue no GitHub
- Entre em contato através do email de suporte

## 🔄 Atualizações

### v1.0.0 (Atual)
- ✅ Implementação completa RULA, REBA, OWAS
- ✅ Interface responsiva e moderna
- ✅ Sistema de detecção de pose
- ✅ Simulador de fallback
- ✅ Controles avançados de análise
- ✅ Exportação de resultados

### Roadmap Futuro
- 🔄 Integração com bancos de dados
- 🔄 Relatórios avançados em PDF
- 🔄 Análise de vídeo em tempo real
- 🔄 Machine Learning personalizado
- 🔄 API para integração com sistemas

---

**Desenvolvido com ❤️ para a segurança no trabalho**

