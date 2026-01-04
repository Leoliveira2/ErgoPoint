/**
 * UI Controller - Gerencia todas as interações da interface do usuário
 */
class UIController {
    constructor() {
        this.currentMethod = 'rula';
        this.isCapturing = false;
        this.hasImage = false;
        this.analysisResults = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateMethodUI();
    }

    initializeElements() {
        // Tabs de metodologia
        this.methodTabs = document.querySelectorAll('.tab');
        
        // Elementos de captura
        this.cameraPlaceholder = document.getElementById('cameraPlaceholder');
        this.videoElement = document.getElementById('videoElement');
        this.captureCanvas = document.getElementById('captureCanvas');
        this.poseCanvas = document.getElementById('poseCanvas');
        this.fileInput = document.getElementById('fileInput');
        this.captureArea = document.querySelector('.capture-area');
        
        // Botões
        this.activateCameraBtn = document.getElementById('activateCameraBtn');
        this.uploadImageBtn = document.getElementById('uploadImageBtn');
        this.captureBtn = document.getElementById('captureBtn');
        this.retakeBtn = document.getElementById('retakeBtn');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.helpBtn = document.getElementById('helpBtn');
        
        // Controles
        this.imageControls = document.getElementById('imageControls');
        this.processingStatus = document.getElementById('processingStatus');
        this.progressFill = document.getElementById('progressFill');
        
        // Controles de ajuste
        this.poseConfidence = document.getElementById('poseConfidence');
        this.imageContrast = document.getElementById('imageContrast');
        this.imageBrightness = document.getElementById('imageBrightness');
        
        // Parâmetros adicionais
        this.forceLoad = document.getElementById('forceLoad');
        this.activityFreq = document.getElementById('activityFreq');
        this.postureDuration = document.getElementById('postureDuration');
        this.coupling = document.getElementById('coupling');
        this.additionalParams = document.getElementById('additionalParams');
        
        // Resultados
        this.resultsPanel = document.getElementById('resultsPanel');
        this.scoreLabel = document.getElementById('scoreLabel');
        this.scoreValue = document.getElementById('scoreValue');
        this.riskLevel = document.getElementById('riskLevel');
        this.riskValue = document.getElementById('riskValue');
        this.riskFill = document.getElementById('riskFill');
        this.detailedScores = document.getElementById('detailedScores');
        this.recommendationsList = document.getElementById('recommendationsList');
        
        // Status
        this.statusIndicator = document.getElementById('statusIndicator');
        
        // Range value displays
        this.setupRangeValueDisplays();
    }

    setupRangeValueDisplays() {
        const ranges = [this.poseConfidence, this.imageContrast, this.imageBrightness];
        ranges.forEach(range => {
            const valueDisplay = range.parentElement.querySelector('.range-value');
            if (valueDisplay) {
                range.addEventListener('input', (e) => {
                    valueDisplay.textContent = e.target.value;
                });
            }
        });
    }

    bindEvents() {
        // Tabs de metodologia
        this.methodTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchMethod(e.target.dataset.method);
            });
        });

        // Botões de captura
        this.activateCameraBtn.addEventListener('click', () => {
            this.activateCamera();
        });

        this.uploadImageBtn.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.captureBtn.addEventListener('click', () => {
            this.captureImage();
        });

        this.retakeBtn.addEventListener('click', () => {
            this.retakeImage();
        });

        // Upload de arquivo
        this.fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });

        // Análise
        this.analyzeBtn.addEventListener('click', () => {
            this.startAnalysis();
        });

        // Controles de imagem
        this.imageContrast.addEventListener('input', () => {
            this.updateImageFilters();
        });

        this.imageBrightness.addEventListener('input', () => {
            this.updateImageFilters();
        });

        // Export e ajuda
        this.exportBtn.addEventListener('click', () => {
            this.exportResults();
        });

        this.helpBtn.addEventListener('click', () => {
            this.showHelp();
        });
    }

    switchMethod(method) {
        if (method === this.currentMethod) return;
        
        this.currentMethod = method;
        this.updateMethodUI();
        this.clearResults();
        
        // Atualizar status
        this.updateStatus(`Metodologia alterada para ${method.toUpperCase()}`);
    }

    updateMethodUI() {
        // Atualizar tabs ativas
        this.methodTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.method === this.currentMethod);
        });

        // Mostrar/ocultar controles específicos da metodologia
        const rebaOnlyElements = document.querySelectorAll('.reba-only');
        rebaOnlyElements.forEach(element => {
            element.style.display = this.currentMethod === 'reba' ? 'block' : 'none';
        });

        // Atualizar label da pontuação
        if (this.scoreLabel) {
            this.scoreLabel.textContent = `Pontuação ${this.currentMethod.toUpperCase()}`;
        }
    }

    async activateCamera() {
        try {
            this.updateStatus('Ativando câmera...');
            
            // Tentar acessar a câmera
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                } 
            });
            
            this.videoElement.srcObject = stream;
            this.videoElement.style.display = 'block';
            this.captureArea.style.display = 'block';
            
            this.updateStatus('Câmera ativada com sucesso');
            console.log('Câmera ativada');
            
        } catch (error) {
            console.error('Erro ao ativar câmera:', error);
            
            // Usar imagem de demonstração como fallback
            this.useDemoImage();
        }
    }

    useDemoImage() {
        try {
            this.updateStatus('Usando imagem de demonstração...');
            
            // Gerar imagem de demonstração
            const demoGenerator = new DemoImageGenerator();
            const demoCanvas = demoGenerator.generateDemoImage(640, 480);
            
            // Copiar para o canvas de captura
            this.captureCanvas.width = 640;
            this.captureCanvas.height = 480;
            const ctx = this.captureCanvas.getContext('2d');
            ctx.drawImage(demoCanvas, 0, 0);
            
            // Mostrar área de captura
            this.captureArea.style.display = 'block';
            this.videoElement.style.display = 'none';
            
            // Mostrar canvas em vez do vídeo
            this.captureCanvas.style.display = 'block';
            
            // Marcar que temos uma imagem carregada
            this.hasImage = true;
            this.analyzeBtn.disabled = false;
            
            this.updateStatus('Imagem de demonstração carregada');
            console.log('Imagem de demonstração ativada');
            
        } catch (error) {
            console.error('Erro ao gerar imagem de demonstração:', error);
            this.updateStatus('Erro ao carregar imagem de demonstração');
        }
    }

    showCameraView() {
        this.cameraPlaceholder.style.display = 'none';
        this.videoElement.style.display = 'block';
        this.imageControls.style.display = 'flex';
        this.isCapturing = true;
    }

    captureImage() {
        const canvas = this.captureCanvas;
        const video = this.videoElement;
        const ctx = canvas.getContext('2d');

        // Configurar canvas com as dimensões do vídeo
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Desenhar frame atual do vídeo no canvas
        ctx.drawImage(video, 0, 0);

        // Parar stream da câmera
        const stream = video.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        // Mostrar imagem capturada
        this.showCapturedImage();
        this.updateStatus('Imagem capturada');
    }

    showCapturedImage() {
        this.videoElement.style.display = 'none';
        this.captureCanvas.style.display = 'block';
        this.poseCanvas.style.display = 'block';
        
        // Configurar pose canvas com as mesmas dimensões
        this.poseCanvas.width = this.captureCanvas.width;
        this.poseCanvas.height = this.captureCanvas.height;
        
        this.hasImage = true;
        this.analyzeBtn.disabled = false;
        this.isCapturing = false;
        
        // Atualizar controles
        this.captureBtn.style.display = 'none';
        this.retakeBtn.style.display = 'inline-flex';
    }

    retakeImage() {
        // Limpar canvas
        const ctx = this.captureCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.captureCanvas.width, this.captureCanvas.height);
        
        const poseCtx = this.poseCanvas.getContext('2d');
        poseCtx.clearRect(0, 0, this.poseCanvas.width, this.poseCanvas.height);

        // Resetar interface
        this.captureCanvas.style.display = 'none';
        this.poseCanvas.style.display = 'none';
        this.cameraPlaceholder.style.display = 'flex';
        this.imageControls.style.display = 'none';
        
        this.hasImage = false;
        this.analyzeBtn.disabled = true;
        this.activateCameraBtn.disabled = false;
        
        // Resetar botões
        this.captureBtn.style.display = 'inline-flex';
        this.retakeBtn.style.display = 'none';
        
        this.clearResults();
        this.updateStatus('Pronto para nova captura');
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showError('Por favor, selecione um arquivo de imagem válido.');
            return;
        }

        try {
            this.updateStatus('Carregando imagem...');
            
            const img = new Image();
            img.onload = () => {
                this.loadImageToCanvas(img);
                this.updateStatus('Imagem carregada');
            };
            
            img.onerror = () => {
                this.showError('Erro ao carregar a imagem.');
            };
            
            img.src = URL.createObjectURL(file);
            
        } catch (error) {
            console.error('Erro no upload:', error);
            this.showError('Erro ao processar a imagem.');
        }
    }

    loadImageToCanvas(img) {
        const canvas = this.captureCanvas;
        const ctx = canvas.getContext('2d');

        // Calcular dimensões mantendo proporção
        const maxWidth = 640;
        const maxHeight = 480;
        let { width, height } = img;

        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }

        // Configurar canvas
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem
        ctx.drawImage(img, 0, 0, width, height);
        
        // Mostrar imagem
        this.cameraPlaceholder.style.display = 'none';
        this.videoElement.style.display = 'none';
        this.captureCanvas.style.display = 'block';
        this.poseCanvas.style.display = 'block';
        
        // Configurar pose canvas
        this.poseCanvas.width = width;
        this.poseCanvas.height = height;
        
        this.hasImage = true;
        this.analyzeBtn.disabled = false;
        
        // Mostrar controle de retake
        this.imageControls.style.display = 'flex';
        this.captureBtn.style.display = 'none';
        this.retakeBtn.style.display = 'inline-flex';
    }

    updateImageFilters() {
        if (!this.hasImage) return;

        const contrast = this.imageContrast.value;
        const brightness = this.imageBrightness.value;
        
        this.captureCanvas.style.filter = `contrast(${contrast}) brightness(${brightness})`;
    }

    async startAnalysis() {
        if (!this.hasImage) return;

        try {
            this.showProcessing();
            this.analyzeBtn.disabled = true;
            
            // Simular progresso
            this.updateProgress(20);
            
            // Aqui será chamada a detecção de pose
            await this.performPoseDetection();
            
            this.updateProgress(60);
            
            // Aqui será chamado o cálculo ergonômico
            await this.performErgonomicAnalysis();
            
            this.updateProgress(100);
            
            setTimeout(() => {
                this.hideProcessing();
                this.showResults();
                this.analyzeBtn.disabled = false;
            }, 500);
            
        } catch (error) {
            console.error('Erro na análise:', error);
            this.hideProcessing();
            this.showError('Erro durante a análise. Tente novamente.');
            this.analyzeBtn.disabled = false;
        }
    }

    async performPoseDetection() {
        // Placeholder - será implementado na próxima fase
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    async performErgonomicAnalysis() {
        try {
            console.log('Iniciando análise ergonômica...');
            
            // Verificar se há imagem carregada
            if (!this.hasImage) {
                this.showError('Por favor, capture ou carregue uma imagem primeiro.');
                return;
            }
            
            this.showProcessing();
            this.updateProgress(10);
            
            // Simular detecção de pose (já que o simulador está ativo)
            await new Promise(resolve => setTimeout(resolve, 500));
            this.updateProgress(30);
            
            // Obter parâmetros da análise
            const method = this.currentMethod;
            const forceLoad = parseInt(this.forceLoad.value);
            const activityFreq = parseInt(this.activityFreq.value);
            const postureDuration = parseInt(this.postureDuration.value);
            const coupling = this.coupling ? parseInt(this.coupling.value) : 0;
            
            this.updateProgress(50);
            
            // Simular dados de pose (keypoints simulados)
            const simulatedPose = {
                keypoints: [
                    { name: 'nose', x: 320, y: 200, confidence: 0.9 },
                    { name: 'left_shoulder', x: 280, y: 250, confidence: 0.9 },
                    { name: 'right_shoulder', x: 360, y: 250, confidence: 0.9 },
                    { name: 'left_elbow', x: 240, y: 300, confidence: 0.9 },
                    { name: 'right_elbow', x: 400, y: 300, confidence: 0.9 },
                    { name: 'left_wrist', x: 200, y: 350, confidence: 0.9 },
                    { name: 'right_wrist', x: 440, y: 350, confidence: 0.9 },
                    { name: 'left_hip', x: 290, y: 380, confidence: 0.9 },
                    { name: 'right_hip', x: 350, y: 380, confidence: 0.9 },
                    { name: 'left_knee', x: 270, y: 450, confidence: 0.9 },
                    { name: 'right_knee', x: 370, y: 450, confidence: 0.9 },
                    { name: 'left_ankle', x: 260, y: 520, confidence: 0.9 },
                    { name: 'right_ankle', x: 380, y: 520, confidence: 0.9 }
                ]
            };
            
            this.updateProgress(70);
            
            // Calcular ângulos simulados
            const angles = {
                upperArm: 45,
                forearm: 60,
                wrist: 15,
                neck: 20,
                trunk: 10,
                legs: 0
            };
            
            this.updateProgress(90);
            
            // Executar análise ergonômica baseada no método selecionado
            let results;
            
            if (method === 'rula') {
                results = this.calculateRULA(angles, forceLoad, activityFreq);
            } else if (method === 'reba') {
                results = this.calculateREBA(angles, forceLoad, activityFreq, coupling);
            } else if (method === 'owas') {
                results = this.calculateOWAS(angles, forceLoad);
            }
            
            this.updateProgress(100);
            
            // Exibir resultados
            setTimeout(() => {
                this.hideProcessing();
                this.displayResults(results);
                this.showResults();
                console.log('Análise ergonômica concluída:', results);
            }, 500);
            
        } catch (error) {
            console.error('Erro na análise ergonômica:', error);
            this.hideProcessing();
            this.showError('Erro durante a análise: ' + error.message);
        }
    }
    
    calculateRULA(angles, forceLoad, activityFreq) {
        // Implementação simplificada do RULA
        let scoreA = Math.min(Math.floor(angles.upperArm / 20) + 1, 6);
        let scoreB = Math.min(Math.floor(angles.neck / 10) + 1, 6);
        
        // Ajustes por força e atividade
        if (forceLoad > 0) scoreA += 1;
        if (activityFreq > 0) scoreA += 1;
        
        const finalScore = Math.min(scoreA + scoreB - 1, 7);
        
        let riskLevel, riskText;
        if (finalScore <= 2) {
            riskLevel = 'low';
            riskText = 'Risco Baixo';
        } else if (finalScore <= 4) {
            riskLevel = 'medium';
            riskText = 'Risco Médio';
        } else if (finalScore <= 6) {
            riskLevel = 'high';
            riskText = 'Risco Alto';
        } else {
            riskLevel = 'critical';
            riskText = 'Risco Crítico';
        }
        
        return {
            score: finalScore,
            riskLevel,
            riskText,
            details: {
                'Braço Superior': Math.min(Math.floor(angles.upperArm / 20) + 1, 4),
                'Antebraço': Math.min(Math.floor(angles.forearm / 30) + 1, 3),
                'Punho': Math.min(Math.floor(angles.wrist / 15) + 1, 4),
                'Pescoço': Math.min(Math.floor(angles.neck / 10) + 1, 4),
                'Tronco': Math.min(Math.floor(angles.trunk / 20) + 1, 4),
                'Pernas': angles.legs > 0 ? 2 : 1
            },
            recommendations: this.getRULARecommendations(finalScore)
        };
    }
    
    calculateREBA(angles, forceLoad, activityFreq, coupling) {
        // Implementação simplificada do REBA
        let scoreA = Math.min(Math.floor(angles.trunk / 15) + 1, 5);
        let scoreB = Math.min(Math.floor(angles.upperArm / 20) + 1, 6);
        
        // Ajustes por força, atividade e acoplamento
        if (forceLoad > 1) scoreA += 1;
        if (activityFreq > 0) scoreA += 1;
        if (coupling > 1) scoreB += 1;
        
        const finalScore = Math.min(scoreA + scoreB, 15);
        
        let riskLevel, riskText;
        if (finalScore === 1) {
            riskLevel = 'negligible';
            riskText = 'Risco Negligível';
        } else if (finalScore <= 3) {
            riskLevel = 'low';
            riskText = 'Risco Baixo';
        } else if (finalScore <= 7) {
            riskLevel = 'medium';
            riskText = 'Risco Médio';
        } else if (finalScore <= 10) {
            riskLevel = 'high';
            riskText = 'Risco Alto';
        } else {
            riskLevel = 'critical';
            riskText = 'Risco Crítico';
        }
        
        return {
            score: finalScore,
            riskLevel,
            riskText,
            details: {
                'Tronco': Math.min(Math.floor(angles.trunk / 15) + 1, 5),
                'Pescoço': Math.min(Math.floor(angles.neck / 10) + 1, 3),
                'Pernas': angles.legs > 0 ? 2 : 1,
                'Braço Superior': Math.min(Math.floor(angles.upperArm / 20) + 1, 6),
                'Antebraço': Math.min(Math.floor(angles.forearm / 30) + 1, 2),
                'Punho': Math.min(Math.floor(angles.wrist / 15) + 1, 3)
            },
            recommendations: this.getREBARecommendations(finalScore)
        };
    }
    
    calculateOWAS(angles, forceLoad) {
        // Implementação simplificada do OWAS
        let category = 1;
        
        if (angles.trunk > 20 || angles.upperArm > 45) category = 2;
        if (angles.trunk > 60 || angles.upperArm > 90 || forceLoad > 2) category = 3;
        if (angles.trunk > 90 || forceLoad > 3) category = 4;
        
        const categoryTexts = [
            'Normal',
            'Levemente Prejudicial',
            'Prejudicial',
            'Extremamente Prejudicial'
        ];
        
        const riskLevels = ['low', 'medium', 'high', 'critical'];
        
        return {
            score: category,
            riskLevel: riskLevels[category - 1],
            riskText: `Categoria ${category}`,
            details: {
                'Postura das Costas': Math.min(Math.floor(angles.trunk / 30) + 1, 4),
                'Postura dos Braços': Math.min(Math.floor(angles.upperArm / 45) + 1, 3),
                'Postura das Pernas': angles.legs > 0 ? 2 : 1,
                'Categoria': `${category} - ${categoryTexts[category - 1]}`
            },
            recommendations: this.getOWASRecommendations(category)
        };
    }
    
    getRULARecommendations(score) {
        if (score <= 2) {
            return ['Postura aceitável', 'Nenhuma ação necessária'];
        } else if (score <= 4) {
            return [
                'Investigação necessária',
                'Mudanças podem ser requeridas',
                'Monitore a postura regularmente'
            ];
        } else if (score <= 6) {
            return [
                'Investigação e mudanças necessárias em breve',
                'Considere ajustar a altura da superfície de trabalho',
                'Implemente pausas regulares',
                'Avalie suporte para os braços'
            ];
        } else {
            return [
                'Mudanças imediatas necessárias',
                'Interrompa a atividade até correções',
                'Redesenhe completamente a estação de trabalho',
                'Consulte especialista em ergonomia'
            ];
        }
    }
    
    getREBARecommendations(score) {
        if (score === 1) {
            return ['Risco negligível', 'Nenhuma ação necessária'];
        } else if (score <= 3) {
            return [
                'Risco baixo',
                'Mudanças podem ser necessárias',
                'Monitore periodicamente'
            ];
        } else if (score <= 7) {
            return [
                'Investigação e mudanças necessárias',
                'Ajuste altura e ângulos de trabalho',
                'Implemente rotação de tarefas',
                'Forneça treinamento postural'
            ];
        } else if (score <= 10) {
            return [
                'Mudanças necessárias em breve',
                'Reduza cargas e frequência',
                'Melhore ferramentas e equipamentos',
                'Implemente pausas obrigatórias'
            ];
        } else {
            return [
                'Mudanças imediatas necessárias',
                'Interrompa atividade de alto risco',
                'Redesenhe completamente o processo',
                'Avaliação médica pode ser necessária'
            ];
        }
    }
    
    getOWASRecommendations(category) {
        switch (category) {
            case 1:
                return ['Postura normal', 'Nenhuma ação necessária'];
            case 2:
                return [
                    'Postura levemente prejudicial',
                    'Ação corretiva no futuro próximo',
                    'Monitore regularmente'
                ];
            case 3:
                return [
                    'Postura prejudicial',
                    'Ação corretiva o mais breve possível',
                    'Reduza tempo de exposição',
                    'Melhore métodos de trabalho'
                ];
            case 4:
                return [
                    'Postura extremamente prejudicial',
                    'Ação corretiva imediata',
                    'Interrompa a atividade',
                    'Redesenhe completamente o trabalho'
                ];
            default:
                return ['Avaliação necessária'];
        }
    }

    showProcessing() {
        this.processingStatus.style.display = 'block';
        this.updateProgress(0);
    }

    hideProcessing() {
        this.processingStatus.style.display = 'none';
    }

    updateProgress(percentage) {
        this.progressFill.style.width = `${percentage}%`;
    }

    showResults() {
        // Placeholder - será implementado com dados reais
        this.resultsPanel.style.display = 'block';
        this.resultsPanel.classList.add('fade-in');
        this.exportBtn.disabled = false;
        
        // Dados de exemplo
        this.displayResults({
            score: 4,
            riskLevel: 'medium',
            riskText: 'Risco Médio',
            details: {
                'Braço Superior': 3,
                'Antebraço': 2,
                'Punho': 2,
                'Pescoço': 3,
                'Tronco': 2,
                'Pernas': 1
            },
            recommendations: [
                'Investigação e mudança necessárias em breve',
                'Considere ajustar a altura da superfície de trabalho',
                'Implemente pausas regulares durante a atividade',
                'Avalie a necessidade de suporte para os braços'
            ]
        });
    }

    displayResults(results) {
        this.analysisResults = results;
        
        // Pontuação principal
        this.scoreValue.textContent = results.score;
        this.riskValue.textContent = results.riskText;
        
        // Barra de risco
        const riskPercentage = (results.score / 7) * 100; // Para RULA (max 7)
        this.riskFill.style.width = `${riskPercentage}%`;
        this.riskFill.className = `risk-fill ${results.riskLevel}`;
        
        // Pontuações detalhadas
        this.detailedScores.innerHTML = '';
        Object.entries(results.details).forEach(([label, score]) => {
            const item = document.createElement('div');
            item.className = 'score-item';
            item.innerHTML = `
                <span class="score-item-label">${label}</span>
                <span class="score-item-value">${score}</span>
            `;
            this.detailedScores.appendChild(item);
        });
        
        // Recomendações
        this.recommendationsList.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            this.recommendationsList.appendChild(li);
        });
    }

    clearResults() {
        this.resultsPanel.style.display = 'none';
        this.exportBtn.disabled = true;
        this.analysisResults = null;
    }

    exportResults() {
        if (!this.analysisResults) return;
        
        // Placeholder para exportação
        this.updateStatus('Exportando resultados...');
        
        setTimeout(() => {
            this.updateStatus('Resultados exportados');
        }, 1000);
    }

    showHelp() {
        const helpContent = `
        <h3>Como usar o Analisador Ergonômico</h3>
        <p><strong>1. Selecione a metodologia:</strong> Escolha entre RULA, REBA ou OWAS</p>
        <p><strong>2. Capture uma imagem:</strong> Use a câmera ou faça upload de uma foto</p>
        <p><strong>3. Ajuste os parâmetros:</strong> Configure força, frequência e duração</p>
        <p><strong>4. Analise:</strong> Clique em "Analisar Postura" para obter os resultados</p>
        <p><strong>5. Exporte:</strong> Salve os resultados em PDF ou imagem</p>
        `;
        
        alert(helpContent.replace(/<[^>]*>/g, ''));
    }

    showError(message) {
        this.updateStatus(`Erro: ${message}`, 'error');
        
        // Adicionar animação de shake
        document.body.classList.add('shake');
        setTimeout(() => {
            document.body.classList.remove('shake');
        }, 500);
    }

    updateStatus(message, type = 'info') {
        const statusText = this.statusIndicator.querySelector('span:last-child');
        if (statusText) {
            statusText.textContent = message;
        }
        
        const statusDot = this.statusIndicator.querySelector('.status-dot');
        if (statusDot) {
            statusDot.style.background = type === 'error' ? 'var(--danger-color)' : 'var(--secondary-color)';
        }
    }
}

// Exportar para uso global
window.UIController = UIController;
