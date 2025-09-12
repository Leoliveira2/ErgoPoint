/**
 * Pose Simulation - Simulador de detecção de pose para demonstração
 * Este módulo simula a detecção de pose quando o TensorFlow.js não está disponível
 */
class PoseSimulator {
    constructor() {
        this.isLoaded = true;
        this.keypoints = [];
        this.confidence = 0.5;
        this.simulationModes = ['normal', 'flexed', 'extended', 'twisted'];
        this.currentMode = 'normal';
    }

    async init() {
        console.log('Simulador de pose inicializado');
        return Promise.resolve();
    }

    async detectPose(imageElement, confidence = 0.5) {
        this.confidence = confidence;
        
        // Simular delay de processamento
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Gerar keypoints simulados baseados na imagem
        this.keypoints = this.generateSimulatedKeypoints(imageElement);
        
        console.log(`Pose simulada detectada com ${this.keypoints.length} keypoints`);
        
        return {
            keypoints: this.keypoints,
            score: 0.85,
            boundingBox: this.calculateBoundingBox(this.keypoints)
        };
    }

    generateSimulatedKeypoints(imageElement) {
        const width = imageElement.width || 640;
        const height = imageElement.height || 480;
        
        // Posições base para uma pessoa em pé (proporções aproximadas)
        const baseKeypoints = [
            { name: 'nose', x: 0.5, y: 0.15 },
            { name: 'left_eye', x: 0.48, y: 0.13 },
            { name: 'right_eye', x: 0.52, y: 0.13 },
            { name: 'left_ear', x: 0.46, y: 0.15 },
            { name: 'right_ear', x: 0.54, y: 0.15 },
            { name: 'left_shoulder', x: 0.42, y: 0.25 },
            { name: 'right_shoulder', x: 0.58, y: 0.25 },
            { name: 'left_elbow', x: 0.38, y: 0.4 },
            { name: 'right_elbow', x: 0.62, y: 0.4 },
            { name: 'left_wrist', x: 0.35, y: 0.55 },
            { name: 'right_wrist', x: 0.65, y: 0.55 },
            { name: 'left_hip', x: 0.45, y: 0.6 },
            { name: 'right_hip', x: 0.55, y: 0.6 },
            { name: 'left_knee', x: 0.44, y: 0.8 },
            { name: 'right_knee', x: 0.56, y: 0.8 },
            { name: 'left_ankle', x: 0.43, y: 0.95 },
            { name: 'right_ankle', x: 0.57, y: 0.95 }
        ];

        // Aplicar variações baseadas no modo de simulação
        const adjustedKeypoints = baseKeypoints.map((kp, index) => {
            let adjustedKp = { ...kp };
            
            switch (this.currentMode) {
                case 'flexed':
                    adjustedKp = this.applyFlexedPosture(adjustedKp, kp.name);
                    break;
                case 'extended':
                    adjustedKp = this.applyExtendedPosture(adjustedKp, kp.name);
                    break;
                case 'twisted':
                    adjustedKp = this.applyTwistedPosture(adjustedKp, kp.name);
                    break;
                default:
                    // Adicionar pequenas variações aleatórias
                    adjustedKp.x += (Math.random() - 0.5) * 0.02;
                    adjustedKp.y += (Math.random() - 0.5) * 0.02;
            }

            return {
                x: adjustedKp.x * width,
                y: adjustedKp.y * height,
                score: Math.random() * 0.3 + 0.7, // Score entre 0.7 e 1.0
                name: kp.name
            };
        });

        return adjustedKeypoints;
    }

    applyFlexedPosture(kp, name) {
        // Simular postura flexionada (curvada para frente)
        switch (name) {
            case 'nose':
                kp.x += 0.05;
                kp.y += 0.03;
                break;
            case 'left_shoulder':
            case 'right_shoulder':
                kp.y += 0.02;
                break;
            case 'left_elbow':
                kp.x += 0.08;
                kp.y -= 0.05;
                break;
            case 'right_elbow':
                kp.x -= 0.08;
                kp.y -= 0.05;
                break;
            case 'left_wrist':
                kp.x += 0.12;
                kp.y -= 0.1;
                break;
            case 'right_wrist':
                kp.x -= 0.12;
                kp.y -= 0.1;
                break;
            case 'left_hip':
            case 'right_hip':
                kp.y -= 0.02;
                break;
        }
        return kp;
    }

    applyExtendedPosture(kp, name) {
        // Simular postura estendida (braços levantados)
        switch (name) {
            case 'left_elbow':
                kp.x -= 0.1;
                kp.y -= 0.15;
                break;
            case 'right_elbow':
                kp.x += 0.1;
                kp.y -= 0.15;
                break;
            case 'left_wrist':
                kp.x -= 0.15;
                kp.y -= 0.25;
                break;
            case 'right_wrist':
                kp.x += 0.15;
                kp.y -= 0.25;
                break;
        }
        return kp;
    }

    applyTwistedPosture(kp, name) {
        // Simular postura torcida
        switch (name) {
            case 'left_shoulder':
                kp.x -= 0.03;
                break;
            case 'right_shoulder':
                kp.x += 0.03;
                break;
            case 'left_elbow':
                kp.x -= 0.05;
                kp.y += 0.03;
                break;
            case 'right_elbow':
                kp.x += 0.08;
                kp.y += 0.03;
                break;
            case 'left_hip':
                kp.x += 0.02;
                break;
            case 'right_hip':
                kp.x -= 0.02;
                break;
        }
        return kp;
    }

    calculateBoundingBox(keypoints) {
        if (keypoints.length === 0) return null;

        const xs = keypoints.map(kp => kp.x);
        const ys = keypoints.map(kp => kp.y);

        return {
            minX: Math.min(...xs),
            minY: Math.min(...ys),
            maxX: Math.max(...xs),
            maxY: Math.max(...ys),
            width: Math.max(...xs) - Math.min(...xs),
            height: Math.max(...ys) - Math.min(...ys)
        };
    }

    getKeypointByName(name) {
        const keypoint = this.keypoints.find(kp => kp.name === name);
        return keypoint && keypoint.score >= this.confidence ? keypoint : null;
    }

    calculateAngle(point1, point2, point3) {
        if (!point1 || !point2 || !point3) return 0;
        
        const vector1 = {
            x: point1.x - point2.x,
            y: point1.y - point2.y
        };
        
        const vector2 = {
            x: point3.x - point2.x,
            y: point3.y - point2.y
        };

        const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
        const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
        const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);

        if (magnitude1 === 0 || magnitude2 === 0) return 0;

        const cosAngle = dotProduct / (magnitude1 * magnitude2);
        const clampedCos = Math.max(-1, Math.min(1, cosAngle));
        const angleRad = Math.acos(clampedCos);
        const angleDeg = (angleRad * 180) / Math.PI;

        return isNaN(angleDeg) ? 0 : angleDeg;
    }

    calculateBodyAngles() {
        const angles = {};

        try {
            // Ângulos dos braços
            const leftShoulder = this.getKeypointByName('left_shoulder');
            const leftElbow = this.getKeypointByName('left_elbow');
            const leftWrist = this.getKeypointByName('left_wrist');
            
            const rightShoulder = this.getKeypointByName('right_shoulder');
            const rightElbow = this.getKeypointByName('right_elbow');
            const rightWrist = this.getKeypointByName('right_wrist');

            if (leftShoulder && leftElbow && leftWrist) {
                angles.leftElbow = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
                
                // Ângulo do braço superior esquerdo
                const leftHip = this.getKeypointByName('left_hip');
                if (leftHip) {
                    const shoulderToElbow = Math.sqrt(
                        Math.pow(leftElbow.x - leftShoulder.x, 2) + 
                        Math.pow(leftElbow.y - leftShoulder.y, 2)
                    );
                    const shoulderToHip = Math.sqrt(
                        Math.pow(leftHip.x - leftShoulder.x, 2) + 
                        Math.pow(leftHip.y - leftShoulder.y, 2)
                    );
                    
                    if (shoulderToElbow > 0 && shoulderToHip > 0) {
                        const dotProduct = (leftElbow.x - leftShoulder.x) * 0 + 
                                         (leftElbow.y - leftShoulder.y) * (leftHip.y - leftShoulder.y);
                        angles.leftUpperArm = Math.acos(Math.abs(dotProduct) / (shoulderToElbow * shoulderToHip)) * (180 / Math.PI);
                    }
                }
            }
            
            if (rightShoulder && rightElbow && rightWrist) {
                angles.rightElbow = this.calculateAngle(rightShoulder, rightElbow, rightWrist);
                
                // Ângulo do braço superior direito
                const rightHip = this.getKeypointByName('right_hip');
                if (rightHip) {
                    const shoulderToElbow = Math.sqrt(
                        Math.pow(rightElbow.x - rightShoulder.x, 2) + 
                        Math.pow(rightElbow.y - rightShoulder.y, 2)
                    );
                    const shoulderToHip = Math.sqrt(
                        Math.pow(rightHip.x - rightShoulder.x, 2) + 
                        Math.pow(rightHip.y - rightShoulder.y, 2)
                    );
                    
                    if (shoulderToElbow > 0 && shoulderToHip > 0) {
                        const dotProduct = (rightElbow.x - rightShoulder.x) * 0 + 
                                         (rightElbow.y - rightShoulder.y) * (rightHip.y - rightShoulder.y);
                        angles.rightUpperArm = Math.acos(Math.abs(dotProduct) / (shoulderToElbow * shoulderToHip)) * (180 / Math.PI);
                    }
                }
            }

            // Ângulos das pernas
            const leftHip = this.getKeypointByName('left_hip');
            const leftKnee = this.getKeypointByName('left_knee');
            const leftAnkle = this.getKeypointByName('left_ankle');
            
            const rightHip = this.getKeypointByName('right_hip');
            const rightKnee = this.getKeypointByName('right_knee');
            const rightAnkle = this.getKeypointByName('right_ankle');

            if (leftHip && leftKnee && leftAnkle) {
                angles.leftKnee = this.calculateAngle(leftHip, leftKnee, leftAnkle);
            }
            
            if (rightHip && rightKnee && rightAnkle) {
                angles.rightKnee = this.calculateAngle(rightHip, rightKnee, rightAnkle);
            }

            // Ângulo do tronco
            if (leftShoulder && rightShoulder && leftHip && rightHip) {
                const shoulderCenter = {
                    x: (leftShoulder.x + rightShoulder.x) / 2,
                    y: (leftShoulder.y + rightShoulder.y) / 2
                };
                
                const hipCenter = {
                    x: (leftHip.x + rightHip.x) / 2,
                    y: (leftHip.y + rightHip.y) / 2
                };

                const trunkVector = {
                    x: shoulderCenter.x - hipCenter.x,
                    y: shoulderCenter.y - hipCenter.y
                };
                
                const verticalVector = { x: 0, y: -1 };
                
                const dotProduct = trunkVector.x * verticalVector.x + trunkVector.y * verticalVector.y;
                const magnitude = Math.sqrt(trunkVector.x * trunkVector.x + trunkVector.y * trunkVector.y);
                
                if (magnitude > 0) {
                    const cosAngle = dotProduct / magnitude;
                    const clampedCos = Math.max(-1, Math.min(1, cosAngle));
                    angles.trunk = Math.acos(clampedCos) * (180 / Math.PI);
                }
            }

            // Ângulo do pescoço
            const nose = this.getKeypointByName('nose');
            if (nose && leftShoulder && rightShoulder) {
                const shoulderCenter = {
                    x: (leftShoulder.x + rightShoulder.x) / 2,
                    y: (leftShoulder.y + rightShoulder.y) / 2
                };

                const neckVector = {
                    x: nose.x - shoulderCenter.x,
                    y: nose.y - shoulderCenter.y
                };
                
                const verticalVector = { x: 0, y: -1 };
                
                const dotProduct = neckVector.x * verticalVector.x + neckVector.y * verticalVector.y;
                const magnitude = Math.sqrt(neckVector.x * neckVector.x + neckVector.y * neckVector.y);
                
                if (magnitude > 0) {
                    const cosAngle = dotProduct / magnitude;
                    const clampedCos = Math.max(-1, Math.min(1, cosAngle));
                    angles.neck = Math.acos(clampedCos) * (180 / Math.PI);
                }
            }

            // Adicionar variações baseadas no modo de simulação
            this.adjustAnglesForMode(angles);

        } catch (error) {
            console.error('Erro ao calcular ângulos simulados:', error);
        }

        return angles;
    }

    adjustAnglesForMode(angles) {
        switch (this.currentMode) {
            case 'flexed':
                if (angles.trunk) angles.trunk += 25; // Tronco mais flexionado
                if (angles.neck) angles.neck += 15; // Pescoço mais flexionado
                if (angles.leftElbow) angles.leftElbow -= 20; // Cotovelos mais fechados
                if (angles.rightElbow) angles.rightElbow -= 20;
                break;
            case 'extended':
                if (angles.leftUpperArm) angles.leftUpperArm += 45; // Braços levantados
                if (angles.rightUpperArm) angles.rightUpperArm += 45;
                if (angles.leftElbow) angles.leftElbow += 30; // Cotovelos mais abertos
                if (angles.rightElbow) angles.rightElbow += 30;
                break;
            case 'twisted':
                if (angles.trunk) angles.trunk += 20; // Tronco torcido
                if (angles.neck) angles.neck += 10; // Pescoço torcido
                break;
        }
    }

    drawPose(canvas, imageWidth, imageHeight) {
        if (!this.keypoints || this.keypoints.length === 0) {
            console.warn('Nenhum keypoint simulado para desenhar');
            return;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scaleX = canvas.width / imageWidth;
        const scaleY = canvas.height / imageHeight;

        console.log(`Desenhando pose simulada: ${this.keypoints.length} keypoints`);

        // Conexões entre keypoints
        const connections = [
            ['nose', 'left_eye'], ['nose', 'right_eye'],
            ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
            ['left_shoulder', 'right_shoulder'],
            ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
            ['left_hip', 'right_hip'],
            ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
            ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
            ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
            ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
        ];

        // Desenhar conexões
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        connections.forEach(([name1, name2]) => {
            const kp1 = this.getKeypointByName(name1);
            const kp2 = this.getKeypointByName(name2);
            
            if (kp1 && kp2) {
                ctx.beginPath();
                ctx.moveTo(kp1.x * scaleX, kp1.y * scaleY);
                ctx.lineTo(kp2.x * scaleX, kp2.y * scaleY);
                ctx.stroke();
            }
        });

        // Desenhar keypoints
        this.keypoints.forEach((kp) => {
            if (kp.score >= this.confidence) {
                const x = kp.x * scaleX;
                const y = kp.y * scaleY;

                ctx.fillStyle = '#EF4444';
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, 2 * Math.PI);
                ctx.fill();

                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });

        // Desenhar ângulos
        this.drawAngles(ctx, scaleX, scaleY);
    }

    drawAngles(ctx, scaleX, scaleY) {
        const angles = this.calculateBodyAngles();
        
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.font = '12px Arial';
        ctx.fillStyle = '#F59E0B';

        // Ângulo do cotovelo esquerdo
        if (angles.leftElbow && angles.leftElbow > 0) {
            const elbow = this.getKeypointByName('left_elbow');
            if (elbow) {
                const x = elbow.x * scaleX;
                const y = elbow.y * scaleY;
                
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, Math.PI / 4);
                ctx.stroke();
                
                ctx.fillText(`${Math.round(angles.leftElbow)}°`, x + 25, y - 10);
            }
        }

        // Ângulo do cotovelo direito
        if (angles.rightElbow && angles.rightElbow > 0) {
            const elbow = this.getKeypointByName('right_elbow');
            if (elbow) {
                const x = elbow.x * scaleX;
                const y = elbow.y * scaleY;
                
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, Math.PI / 4);
                ctx.stroke();
                
                ctx.fillText(`${Math.round(angles.rightElbow)}°`, x - 50, y - 10);
            }
        }

        // Ângulo do tronco
        if (angles.trunk && angles.trunk > 0) {
            const leftShoulder = this.getKeypointByName('left_shoulder');
            const rightShoulder = this.getKeypointByName('right_shoulder');
            
            if (leftShoulder && rightShoulder) {
                const centerX = ((leftShoulder.x + rightShoulder.x) / 2) * scaleX;
                const centerY = ((leftShoulder.y + rightShoulder.y) / 2) * scaleY;
                
                ctx.fillText(`Tronco: ${Math.round(angles.trunk)}°`, centerX - 30, centerY - 30);
            }
        }
    }

    getPostureData() {
        return {
            keypoints: this.keypoints,
            angles: this.calculateBodyAngles(),
            confidence: this.confidence,
            timestamp: Date.now(),
            simulated: true,
            mode: this.currentMode
        };
    }

    setSimulationMode(mode) {
        if (this.simulationModes.includes(mode)) {
            this.currentMode = mode;
            console.log(`Modo de simulação alterado para: ${mode}`);
        }
    }

    getAvailableModes() {
        return this.simulationModes;
    }
}

// Exportar para uso global
window.PoseSimulator = PoseSimulator;

