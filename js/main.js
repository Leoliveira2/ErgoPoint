/**
 * Main Application - Inicializa e coordena todos os módulos
 */
class ErgonomicAnalyzer {
    constructor() {
        this.uiController = null;
        this.poseDetector = null;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            console.log('Inicializando Analisador Ergonômico...');
            
            // Verificar suporte do navegador
            this.checkBrowserSupport();
            
            // Inicializar controlador de UI
            this.uiController = new UIController();
            console.log('UI Controller inicializado');
            
            // Inicializar algoritmos ergonômicos
            this.ergonomicAlgorithms = new ErgonomicAlgorithms();
            console.log('Algoritmos ergonômicos inicializados');
            
            // Tentar inicializar detector de pose real
            try {
                this.poseDetector = new PoseDetector();
                await this.waitForPoseDetector();
                console.log('Pose Detector real inicializado');
            } catch (poseError) {
                console.warn('Falha ao carregar detector real, usando simulador:', poseError);
                this.poseDetector = new PoseSimulator();
                await this.poseDetector.init();
                console.log('Simulador de pose inicializado como fallback');
            }
            
            // Conectar UI com detecção de pose
            this.connectModules();
            
            this.isInitialized = true;
            console.log('Analisador Ergonômico inicializado com sucesso');
            
            // Atualizar status na UI
            const detectorType = this.poseDetector instanceof PoseSimulator ? 'Simulador' : 'TensorFlow.js';
            this.uiController.updateStatus(`Sistema pronto (${detectorType})`);
            
        } catch (error) {
            console.error('Erro na inicialização:', error);
            this.handleInitializationError(error);
        }
    }

    checkBrowserSupport() {
        // Verificar getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn('Seu navegador não suporta acesso à câmera; recursos de captura serão limitados');
        }

        // Verificar Canvas
        const canvas = document.createElement('canvas');
        if (!canvas.getContext || !canvas.getContext('2d')) {
            throw new Error('Seu navegador não suporta Canvas 2D');
        }

        // Verificar WebGL (necessário para TensorFlow.js)
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            console.warn('WebGL não disponível, performance pode ser reduzida');
        }

        console.log('Verificação de compatibilidade do navegador concluída');
    }

    async waitForPoseDetector() {
        const maxAttempts = 30; // 30 segundos
        let attempts = 0;

        while (!this.poseDetector.isLoaded && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
            
            if (attempts % 5 === 0) {
                console.log(`Aguardando carregamento do modelo... (${attempts}s)`);
            }
        }

        if (!this.poseDetector.isLoaded) {
            throw new Error('Timeout ao carregar modelo de detecção de pose');
        }
    }

    connectModules() {
        // Sobrescrever método de detecção de pose na UI
        this.uiController.performPoseDetection = async () => {
            return await this.performPoseDetection();
        };

        // Sobrescrever método de análise ergonômica na UI
        this.uiController.performErgonomicAnalysis = async () => {
            return await this.performErgonomicAnalysis();
        };

        console.log('Módulos conectados');
    }

    async performPoseDetection() {
        try {
            const canvas = this.uiController.captureCanvas;
            const confidence = parseFloat(this.uiController.poseConfidence.value);
            
            console.log('Iniciando detecção de pose...');
            
            // Detectar pose na imagem
            const poseData = await this.poseDetector.detectPose(canvas, confidence);
            
            // Desenhar pose no canvas overlay
            this.poseDetector.drawPose(
                this.uiController.poseCanvas,
                canvas.width,
                canvas.height
            );
            
            console.log('Pose detectada:', poseData);
            
            // Armazenar dados da pose para análise ergonômica
            this.currentPoseData = poseData;
            
            return poseData;
            
        } catch (error) {
            console.error('Erro na detecção de pose:', error);
            throw new Error(`Falha na detecção de pose: ${error.message}`);
        }
    }

    async performErgonomicAnalysis() {
        if (!this.currentPoseData) {
            throw new Error('Nenhum dado de pose disponível para análise');
        }

        try {
            console.log('Iniciando análise ergonômica...');
            
            const method = this.uiController.currentMethod;
            const angles = this.poseDetector.calculateBodyAngles();
            
            // Obter parâmetros adicionais da UI
            const params = this.getAnalysisParameters();
            
            console.log('Ângulos calculados:', angles);
            console.log('Parâmetros:', params);
            
            // Realizar análise baseada na metodologia selecionada usando algoritmos completos
            let results;
            switch (method) {
                case 'rula':
                    results = this.ergonomicAlgorithms.calculateRULA(angles, params);
                    break;
                case 'reba':
                    results = this.ergonomicAlgorithms.calculateREBA(angles, params);
                    break;
                case 'owas':
                    results = this.ergonomicAlgorithms.calculateOWAS(angles, params);
                    break;
                default:
                    throw new Error(`Metodologia não suportada: ${method}`);
            }
            
            console.log('Análise ergonômica concluída:', results);
            
            // Atualizar UI com resultados
            this.uiController.displayResults(results);
            
            return results;
            
        } catch (error) {
            console.error('Erro na análise ergonômica:', error);
            throw new Error(`Falha na análise ergonômica: ${error.message}`);
        }
    }

    getAnalysisParameters() {
        return {
            forceLoad: parseInt(this.uiController.forceLoad.value),
            activityFreq: parseInt(this.uiController.activityFreq.value),
            postureDuration: parseInt(this.uiController.postureDuration.value),
            coupling: parseInt(this.uiController.coupling.value)
        };
    }

    handleInitializationError(error) {
        console.error('Erro crítico na inicialização:', error);
        
        // Mostrar mensagem de erro na interface
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #EF4444;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 9999;
            max-width: 400px;
        `;
        
        errorMessage.innerHTML = `
            <h3>Erro de Inicialização</h3>
            <p>${error.message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #EF4444;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                margin-top: 10px;
                cursor: pointer;
            ">Recarregar Página</button>
        `;
        
        document.body.appendChild(errorMessage);
    }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.ergonomicAnalyzer = new ErgonomicAnalyzer();
});

// Exportar para uso global
window.ErgonomicAnalyzer = ErgonomicAnalyzer;


// Ativação segura do botão de análise de postura
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("analyzeBtn");
  if (btn) {
    btn.addEventListener("click", function () {
      if (typeof analisarPostura === "function") {
        analisarPostura();
      } else {
        alert("A função 'analisarPostura' não está definida.");
        console.error("Função analisarPostura não encontrada no escopo global.");
      }
    });
  }
});
