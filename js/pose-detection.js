/**
 * Pose Detection Module - Gerencia a detecção de pose humana usando TensorFlow.js
 */
class PoseDetector {
    constructor() {
        this.model = null;
        this.isLoaded = false;
        this.keypoints = [];
        this.confidence = 0.5;
        
        this.init();
    }

    async init() {
        try {
            console.log('Carregando modelo de detecção de pose...');
            
            // Carregar o modelo MoveNet (mais preciso que PoseNet)
            this.model = await poseDetection.createDetector(
                poseDetection.SupportedModels.MoveNet,
                {
                    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
                    enableSmoothing: true
                }
            );
            
            this.isLoaded = true;
            console.log('Modelo de pose carregado com sucesso');
            
        } catch (error) {
            console.error('Erro ao carregar modelo de pose:', error);
            
            // Fallback para PoseNet se MoveNet falhar
            try {
                console.log('Tentando carregar PoseNet como fallback...');
                this.model = await poseDetection.createDetector(
                    poseDetection.SupportedModels.PoseNet,
                    {
                        architecture: 'MobileNetV1',
                        outputStride: 16,
                        inputResolution: { width: 640, height: 480 },
                        multiplier: 0.75
                    }
                );
                this.isLoaded = true;
                console.log('PoseNet carregado como fallback');
            } catch (fallbackError) {
                console.error('Erro ao carregar fallback:', fallbackError);
                throw new Error('Não foi possível carregar nenhum modelo de detecção de pose');
            }
        }
    }

    async detectPose(imageElement, confidence = 0.5) {
        if (!this.isLoaded || !this.model) {
            throw new Error('Modelo de detecção de pose não está carregado');
        }

        try {
            this.confidence = confidence;
            
            // Detectar poses na imagem
            const poses = await this.model.estimatePoses(imageElement);
            
            if (poses.length === 0) {
                throw new Error('Nenhuma pose detectada na imagem');
            }

            // Usar a primeira pose detectada (single person)
            const pose = poses[0];
            this.keypoints = this.filterKeypoints(pose.keypoints, confidence);
            
            return {
                keypoints: this.keypoints,
                score: pose.score || 1.0,
                boundingBox: this.calculateBoundingBox(this.keypoints)
            };
            
        } catch (error) {
            console.error('Erro na detecção de pose:', error);
            throw error;
        }
    }

    filterKeypoints(keypoints, minConfidence) {
        return keypoints.filter(kp => kp.score >= minConfidence);
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
        const keypointMap = {
            'nose': 0,
            'left_eye': 1,
            'right_eye': 2,
            'left_ear': 3,
            'right_ear': 4,
            'left_shoulder': 5,
            'right_shoulder': 6,
            'left_elbow': 7,
            'right_elbow': 8,
            'left_wrist': 9,
            'right_wrist': 10,
            'left_hip': 11,
            'right_hip': 12,
            'left_knee': 13,
            'right_knee': 14,
            'left_ankle': 15,
            'right_ankle': 16
        };

        const index = keypointMap[name];
        if (index !== undefined && this.keypoints[index]) {
            return this.keypoints[index];
        }
        return null;
    }

    calculateAngle(point1, point2, point3) {
        // Calcular ângulo entre três pontos (point2 é o vértice)
        const vector1 = {
            x: point1.x - point2.x,
            y: point1.y - point2.y
        };
        
        const vector2 = {
            x: point3.x - point2.x,
            y: point3.y - point2.y
        };

        // Produto escalar
        const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
        
        // Magnitudes dos vetores
        const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
        const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);

        // Calcular ângulo em radianos e converter para graus
        const angleRad = Math.acos(dotProduct / (magnitude1 * magnitude2));
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
            }
            
            if (rightShoulder && rightElbow && rightWrist) {
                angles.rightElbow = this.calculateAngle(rightShoulder, rightElbow, rightWrist);
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

            // Ângulo do tronco (aproximação usando ombros e quadris)
            if (leftShoulder && rightShoulder && leftHip && rightHip) {
                const shoulderCenter = {
                    x: (leftShoulder.x + rightShoulder.x) / 2,
                    y: (leftShoulder.y + rightShoulder.y) / 2
                };
                
                const hipCenter = {
                    x: (leftHip.x + rightHip.x) / 2,
                    y: (leftHip.y + rightHip.y) / 2
                };

                // Ângulo do tronco em relação à vertical
                const trunkVector = {
                    x: shoulderCenter.x - hipCenter.x,
                    y: shoulderCenter.y - hipCenter.y
                };
                
                const verticalVector = { x: 0, y: -1 }; // Vetor vertical para cima
                
                const dotProduct = trunkVector.x * verticalVector.x + trunkVector.y * verticalVector.y;
                const magnitude = Math.sqrt(trunkVector.x * trunkVector.x + trunkVector.y * trunkVector.y);
                
                angles.trunk = Math.acos(dotProduct / magnitude) * (180 / Math.PI);
            }

            // Ângulo do pescoço (aproximação usando nariz e ombros)
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
                
                angles.neck = Math.acos(dotProduct / magnitude) * (180 / Math.PI);
            }

        } catch (error) {
            console.error('Erro ao calcular ângulos:', error);
        }

        return angles;
    }

    drawPose(canvas, imageWidth, imageHeight) {
        if (!this.keypoints || this.keypoints.length === 0) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Configurar escala
        const scaleX = canvas.width / imageWidth;
        const scaleY = canvas.height / imageHeight;

        // Definir conexões entre keypoints
        const connections = [
            // Cabeça
            [0, 1], [0, 2], [1, 3], [2, 4],
            // Tronco
            [5, 6], [5, 11], [6, 12], [11, 12],
            // Braço esquerdo
            [5, 7], [7, 9],
            // Braço direito
            [6, 8], [8, 10],
            // Perna esquerda
            [11, 13], [13, 15],
            // Perna direita
            [12, 14], [14, 16]
        ];

        // Desenhar conexões
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        connections.forEach(([i, j]) => {
            const kp1 = this.keypoints[i];
            const kp2 = this.keypoints[j];
            
            if (kp1 && kp2 && kp1.score > this.confidence && kp2.score > this.confidence) {
                ctx.beginPath();
                ctx.moveTo(kp1.x * scaleX, kp1.y * scaleY);
                ctx.lineTo(kp2.x * scaleX, kp2.y * scaleY);
                ctx.stroke();
            }
        });

        // Desenhar keypoints
        this.keypoints.forEach((kp, index) => {
            if (kp.score > this.confidence) {
                const x = kp.x * scaleX;
                const y = kp.y * scaleY;

                // Círculo do keypoint
                ctx.fillStyle = '#EF4444';
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, 2 * Math.PI);
                ctx.fill();

                // Borda branca
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Label do keypoint (opcional, para debug)
                if (false) { // Desabilitado por padrão
                    ctx.fillStyle = '#000000';
                    ctx.font = '10px Arial';
                    ctx.fillText(index.toString(), x + 8, y - 8);
                }
            }
        });

        // Desenhar ângulos importantes
        this.drawAngles(ctx, scaleX, scaleY);
    }

    drawAngles(ctx, scaleX, scaleY) {
        const angles = this.calculateBodyAngles();
        
        // Desenhar arcos para ângulos importantes
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.font = '12px Arial';
        ctx.fillStyle = '#F59E0B';

        // Ângulo do cotovelo esquerdo
        if (angles.leftElbow) {
            const elbow = this.getKeypointByName('left_elbow');
            if (elbow) {
                const x = elbow.x * scaleX;
                const y = elbow.y * scaleY;
                
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, (angles.leftElbow * Math.PI) / 180);
                ctx.stroke();
                
                ctx.fillText(`${Math.round(angles.leftElbow)}°`, x + 25, y - 10);
            }
        }

        // Ângulo do cotovelo direito
        if (angles.rightElbow) {
            const elbow = this.getKeypointByName('right_elbow');
            if (elbow) {
                const x = elbow.x * scaleX;
                const y = elbow.y * scaleY;
                
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, (angles.rightElbow * Math.PI) / 180);
                ctx.stroke();
                
                ctx.fillText(`${Math.round(angles.rightElbow)}°`, x - 50, y - 10);
            }
        }
    }

    getPostureData() {
        return {
            keypoints: this.keypoints,
            angles: this.calculateBodyAngles(),
            confidence: this.confidence,
            timestamp: Date.now()
        };
    }
}

// Exportar para uso global
window.PoseDetector = PoseDetector;

