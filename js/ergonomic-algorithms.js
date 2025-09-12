/**
 * Ergonomic Algorithms - Implementação completa dos algoritmos RULA, REBA e OWAS
 */
class ErgonomicAlgorithms {
    constructor() {
        this.initializeTables();
    }

    initializeTables() {
        // Tabelas RULA
        this.rulaTableA = [
            [1, 2, 2, 2, 2, 3, 3, 3],
            [2, 2, 2, 2, 3, 3, 3, 3],
            [2, 3, 3, 3, 3, 3, 4, 4],
            [2, 3, 3, 3, 3, 4, 4, 4],
            [3, 3, 3, 3, 4, 4, 4, 4],
            [3, 4, 4, 4, 4, 4, 5, 5]
        ];

        this.rulaTableB = [
            [1, 2, 3, 3, 4, 5, 5],
            [2, 2, 3, 4, 4, 5, 5],
            [3, 3, 3, 4, 4, 5, 6],
            [3, 3, 3, 4, 5, 6, 6],
            [4, 4, 4, 5, 6, 7, 7],
            [4, 4, 5, 6, 6, 7, 7],
            [5, 5, 6, 6, 7, 7, 7],
            [5, 5, 6, 7, 7, 7, 7]
        ];

        this.rulaTableC = [
            [1, 1, 1, 2, 2, 2, 2],
            [1, 2, 2, 2, 2, 3, 3],
            [2, 2, 2, 2, 3, 3, 3],
            [2, 2, 2, 3, 3, 3, 4],
            [2, 3, 3, 3, 3, 4, 4],
            [3, 3, 3, 3, 4, 4, 4],
            [3, 3, 3, 4, 4, 4, 5]
        ];

        // Tabelas REBA
        this.rebaTableA = [
            [1, 2, 3, 4, 5, 9],
            [2, 3, 4, 5, 6, 9],
            [2, 4, 5, 6, 7, 9],
            [3, 5, 6, 7, 8, 9],
            [4, 6, 7, 8, 9, 9]
        ];

        this.rebaTableB = [
            [1, 2, 2],
            [1, 2, 3],
            [3, 4, 5],
            [4, 5, 5],
            [6, 7, 8],
            [7, 8, 8]
        ];

        this.rebaTableC = [
            [1, 1, 1, 2, 3, 3, 4, 5, 6, 7, 7, 7],
            [1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 8],
            [2, 3, 3, 3, 4, 5, 6, 7, 7, 8, 8, 8],
            [3, 4, 4, 4, 5, 6, 7, 8, 8, 9, 9, 9],
            [4, 4, 4, 5, 6, 7, 8, 8, 9, 9, 9, 9],
            [6, 6, 6, 7, 8, 8, 9, 9, 10, 10, 10, 10],
            [7, 7, 7, 8, 9, 9, 9, 10, 10, 11, 11, 11],
            [8, 8, 8, 9, 10, 10, 10, 10, 10, 11, 11, 11],
            [9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12],
            [10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 12],
            [11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12],
            [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
        ];

        // Tabela OWAS de categorias de ação
        this.owasActionTable = {
            '1111': 1, '1112': 1, '1113': 1, '1121': 1, '1122': 1, '1123': 1, '1131': 1, '1132': 1, '1133': 1,
            '1211': 1, '1212': 1, '1213': 1, '1221': 1, '1222': 1, '1223': 1, '1231': 1, '1232': 1, '1233': 1,
            '1311': 1, '1312': 1, '1313': 1, '1321': 1, '1322': 1, '1323': 1, '1331': 1, '1332': 1, '1333': 1,
            '2111': 2, '2112': 2, '2113': 2, '2121': 2, '2122': 2, '2123': 2, '2131': 2, '2132': 2, '2133': 2,
            '2211': 2, '2212': 2, '2213': 2, '2221': 2, '2222': 2, '2223': 2, '2231': 2, '2232': 2, '2233': 2,
            '2311': 2, '2312': 2, '2313': 2, '2321': 2, '2322': 2, '2323': 2, '2331': 2, '2332': 2, '2333': 2,
            '3111': 2, '3112': 2, '3113': 3, '3121': 2, '3122': 2, '3123': 3, '3131': 2, '3132': 2, '3133': 3,
            '3211': 2, '3212': 2, '3213': 3, '3221': 2, '3222': 2, '3223': 3, '3231': 2, '3232': 2, '3233': 3,
            '3311': 2, '3312': 2, '3313': 3, '3321': 2, '3322': 2, '3323': 3, '3331': 2, '3332': 2, '3333': 3,
            '4111': 3, '4112': 3, '4113': 4, '4121': 3, '4122': 3, '4123': 4, '4131': 3, '4132': 3, '4133': 4,
            '4211': 3, '4212': 3, '4213': 4, '4221': 3, '4222': 3, '4223': 4, '4231': 3, '4232': 3, '4233': 4,
            '4311': 3, '4312': 3, '4313': 4, '4321': 3, '4322': 3, '4323': 4, '4331': 3, '4332': 3, '4333': 4
        };
    }

    /**
     * Calcula a pontuação RULA baseada nos ângulos corporais e parâmetros
     */
    calculateRULA(angles, params) {
        try {
            // Grupo A: Braço e Punho
            const upperArmScore = this.scoreRULAUpperArm(angles.rightUpperArm || angles.leftUpperArm || 20);
            const lowerArmScore = this.scoreRULALowerArm(angles.rightElbow || angles.leftElbow || 90);
            const wristScore = this.scoreRULAWrist(angles.rightWrist || angles.leftWrist || 0);
            const wristTwistScore = this.scoreRULAWristTwist(angles.rightWristTwist || angles.leftWristTwist || 0);

            // Tabela A
            const tableAIndex = Math.min(5, Math.max(0, upperArmScore - 1));
            const tableACol = Math.min(7, Math.max(0, lowerArmScore + wristScore + wristTwistScore - 3));
            const scoreA = this.rulaTableA[tableAIndex][tableACol];

            // Grupo B: Pescoço, Tronco e Pernas
            const neckScore = this.scoreRULANeck(angles.neck || 0);
            const trunkScore = this.scoreRULATrunk(angles.trunk || 0);
            const legScore = this.scoreRULALegs(angles.leftKnee || angles.rightKnee || 180);

            // Tabela B
            const tableBIndex = Math.min(6, Math.max(0, neckScore - 1));
            const tableBCol = Math.min(6, Math.max(0, trunkScore + legScore - 2));
            const scoreB = this.rulaTableB[tableBIndex][tableBCol];

            // Ajustes de força e atividade muscular
            const forceScore = this.calculateRULAForceScore(params.forceLoad);
            const muscleScore = this.calculateRULAMuscleScore(params.activityFreq, params.postureDuration);

            // Pontuações finais dos grupos
            const finalScoreA = Math.min(7, scoreA + forceScore + muscleScore);
            const finalScoreB = Math.min(7, scoreB + forceScore + muscleScore);

            // Tabela C - Pontuação final
            const tableCIndex = Math.min(6, Math.max(0, finalScoreA - 1));
            const tableCCol = Math.min(6, Math.max(0, finalScoreB - 1));
            const finalScore = this.rulaTableC[tableCIndex][tableCCol];

            return {
                score: finalScore,
                riskLevel: this.getRULARiskLevel(finalScore),
                riskText: this.getRULARiskText(finalScore),
                details: {
                    'Braço Superior': upperArmScore,
                    'Antebraço': lowerArmScore,
                    'Punho': wristScore,
                    'Torção do Punho': wristTwistScore,
                    'Pescoço': neckScore,
                    'Tronco': trunkScore,
                    'Pernas': legScore,
                    'Grupo A': scoreA,
                    'Grupo B': scoreB,
                    'Força': forceScore,
                    'Atividade Muscular': muscleScore
                },
                recommendations: this.getRULARecommendations(finalScore)
            };

        } catch (error) {
            console.error('Erro no cálculo RULA:', error);
            return this.getErrorResult('RULA');
        }
    }

    /**
     * Calcula a pontuação REBA baseada nos ângulos corporais e parâmetros
     */
    calculateREBA(angles, params) {
        try {
            // Grupo A: Tronco, Pescoço e Pernas
            const trunkScore = this.scoreREBATrunk(angles.trunk || 0);
            const neckScore = this.scoreREBANeck(angles.neck || 0);
            const legScore = this.scoreREBALegs(angles.leftKnee || angles.rightKnee || 180);

            // Tabela A
            const tableAIndex = Math.min(4, Math.max(0, trunkScore - 1));
            const tableACol = Math.min(5, Math.max(0, neckScore + legScore - 2));
            const scoreA = this.rebaTableA[tableAIndex][tableACol];

            // Grupo B: Braço Superior, Antebraço e Punho
            const upperArmScore = this.scoreREBAUpperArm(angles.rightUpperArm || angles.leftUpperArm || 20);
            const lowerArmScore = this.scoreREBALowerArm(angles.rightElbow || angles.leftElbow || 90);
            const wristScore = this.scoreREBAWrist(angles.rightWrist || angles.leftWrist || 0);

            // Tabela B
            const tableBIndex = Math.min(5, Math.max(0, upperArmScore - 1));
            const tableBCol = Math.min(2, Math.max(0, lowerArmScore + wristScore - 2));
            const scoreB = this.rebaTableB[tableBIndex][tableBCol];

            // Tabela C
            const tableCIndex = Math.min(11, Math.max(0, scoreA - 1));
            const tableCCol = Math.min(11, Math.max(0, scoreB - 1));
            const scoreC = this.rebaTableC[tableCIndex][tableCCol];

            // Pontuação de atividade
            const activityScore = this.calculateREBAActivityScore(params);

            // Pontuação final
            const finalScore = Math.min(15, scoreC + activityScore);

            return {
                score: finalScore,
                riskLevel: this.getREBARiskLevel(finalScore),
                riskText: this.getREBARiskText(finalScore),
                details: {
                    'Tronco': trunkScore,
                    'Pescoço': neckScore,
                    'Pernas': legScore,
                    'Braço Superior': upperArmScore,
                    'Antebraço': lowerArmScore,
                    'Punho': wristScore,
                    'Grupo A': scoreA,
                    'Grupo B': scoreB,
                    'Tabela C': scoreC,
                    'Atividade': activityScore
                },
                recommendations: this.getREBARecommendations(finalScore)
            };

        } catch (error) {
            console.error('Erro no cálculo REBA:', error);
            return this.getErrorResult('REBA');
        }
    }

    /**
     * Calcula a categoria de ação OWAS baseada nos ângulos corporais e parâmetros
     */
    calculateOWAS(angles, params) {
        try {
            const trunkCode = this.getOWASTrunkCode(angles.trunk || 0);
            const armsCode = this.getOWASArmsCode(angles.rightUpperArm || angles.leftUpperArm || 20);
            const legsCode = this.getOWASLegsCode(angles.leftKnee || angles.rightKnee || 180);
            const loadCode = Math.min(4, Math.max(1, params.forceLoad + 1));

            const owasCode = `${trunkCode}${armsCode}${legsCode}${loadCode}`;
            const actionCategory = this.owasActionTable[owasCode] || 2;

            return {
                score: actionCategory,
                riskLevel: this.getOWASRiskLevel(actionCategory),
                riskText: this.getOWASRiskText(actionCategory),
                details: {
                    'Código OWAS': owasCode,
                    'Tronco': trunkCode,
                    'Braços': armsCode,
                    'Pernas': legsCode,
                    'Carga': loadCode
                },
                recommendations: this.getOWASRecommendations(actionCategory)
            };

        } catch (error) {
            console.error('Erro no cálculo OWAS:', error);
            return this.getErrorResult('OWAS');
        }
    }

    // Métodos de pontuação RULA
    scoreRULAUpperArm(angle) {
        if (angle < 20) return 1;
        if (angle <= 45) return 2;
        if (angle <= 90) return 3;
        return 4;
    }

    scoreRULALowerArm(angle) {
        if (angle >= 60 && angle <= 100) return 1;
        return 2;
    }

    scoreRULAWrist(angle) {
        if (Math.abs(angle) <= 15) return 1;
        return 2;
    }

    scoreRULAWristTwist(angle) {
        if (Math.abs(angle) <= 15) return 1;
        return 2;
    }

    scoreRULANeck(angle) {
        if (angle <= 10) return 1;
        if (angle <= 20) return 2;
        return 3;
    }

    scoreRULATrunk(angle) {
        if (angle <= 5) return 1;
        if (angle <= 20) return 2;
        if (angle <= 60) return 3;
        return 4;
    }

    scoreRULALegs(kneeAngle) {
        if (kneeAngle > 150) return 1; // Pernas retas/apoiadas
        return 2; // Pernas flexionadas
    }

    calculateRULAForceScore(forceLoad) {
        if (forceLoad === 0) return 0;
        if (forceLoad === 1) return 1;
        if (forceLoad === 2) return 2;
        return 3;
    }

    calculateRULAMuscleScore(frequency, duration) {
        let score = 0;
        if (frequency === 1) score += 1; // Repetitivo
        if (duration === 1) score += 1; // Estático
        return score;
    }

    // Métodos de pontuação REBA
    scoreREBATrunk(angle) {
        if (angle <= 5) return 1;
        if (angle <= 20) return 2;
        if (angle <= 60) return 3;
        if (angle <= 90) return 4;
        return 5;
    }

    scoreREBANeck(angle) {
        if (angle <= 20) return 1;
        return 2;
    }

    scoreREBALegs(kneeAngle) {
        if (kneeAngle > 150) return 1; // Apoio bilateral, andando
        if (kneeAngle > 90) return 2; // Apoio unilateral
        return 3; // Flexão dos joelhos
    }

    scoreREBAUpperArm(angle) {
        if (angle <= 20) return 1;
        if (angle <= 45) return 2;
        if (angle <= 90) return 3;
        return 4;
    }

    scoreREBALowerArm(angle) {
        if (angle >= 60 && angle <= 100) return 1;
        return 2;
    }

    scoreREBAWrist(angle) {
        if (Math.abs(angle) <= 15) return 1;
        return 2;
    }

    calculateREBAActivityScore(params) {
        let score = 0;
        if (params.postureDuration === 1) score += 1; // Postura estática
        if (params.activityFreq === 1) score += 1; // Repetitivo
        if (params.coupling >= 2) score += 1; // Acoplamento ruim
        return score;
    }

    // Métodos de pontuação OWAS
    getOWASTrunkCode(angle) {
        if (angle <= 5) return 1; // Reto
        if (angle <= 20) return 2; // Flexão leve
        if (angle <= 60) return 3; // Flexão acentuada
        return 4; // Flexão e torção
    }

    getOWASArmsCode(angle) {
        if (angle <= 20) return 1; // Abaixo do ombro
        if (angle <= 90) return 2; // No nível do ombro
        return 3; // Acima do ombro
    }

    getOWASLegsCode(kneeAngle) {
        if (kneeAngle > 150) return 1; // Sentado ou em pé
        if (kneeAngle > 90) return 2; // Em pé com peso em uma perna
        return 3; // Ajoelhado ou agachado
    }

    // Métodos de classificação de risco
    getRULARiskLevel(score) {
        if (score <= 2) return 'low';
        if (score <= 4) return 'medium';
        if (score <= 6) return 'high';
        return 'very-high';
    }

    getRULARiskText(score) {
        if (score <= 2) return 'Risco Baixo';
        if (score <= 4) return 'Risco Médio';
        if (score <= 6) return 'Risco Alto';
        return 'Risco Muito Alto';
    }

    getREBARiskLevel(score) {
        if (score === 1) return 'negligible';
        if (score <= 3) return 'low';
        if (score <= 7) return 'medium';
        if (score <= 10) return 'high';
        return 'very-high';
    }

    getREBARiskText(score) {
        if (score === 1) return 'Risco Insignificante';
        if (score <= 3) return 'Risco Baixo';
        if (score <= 7) return 'Risco Médio';
        if (score <= 10) return 'Risco Alto';
        return 'Risco Muito Alto';
    }

    getOWASRiskLevel(score) {
        if (score === 1) return 'low';
        if (score === 2) return 'medium';
        if (score === 3) return 'high';
        return 'very-high';
    }

    getOWASRiskText(score) {
        if (score === 1) return 'Postura Normal';
        if (score === 2) return 'Postura com Efeito Prejudicial';
        if (score === 3) return 'Postura Prejudicial';
        return 'Postura Extremamente Prejudicial';
    }

    // Métodos de recomendações
    getRULARecommendations(score) {
        if (score <= 2) {
            return [
                'Postura aceitável se não mantida ou repetida por longos períodos',
                'Nenhuma ação imediata necessária'
            ];
        }
        if (score <= 4) {
            return [
                'Investigação necessária',
                'Mudanças podem ser necessárias',
                'Considere pausas regulares',
                'Avalie a altura da superfície de trabalho'
            ];
        }
        if (score <= 6) {
            return [
                'Investigação e mudança necessárias em breve',
                'Implemente pausas regulares',
                'Ajuste a altura da superfície de trabalho',
                'Considere suporte para os braços',
                'Treinamento em postura adequada'
            ];
        }
        return [
            'Investigação e mudança imediatas',
            'Intervenção urgente necessária',
            'Redesenhe a estação de trabalho',
            'Implemente controles de engenharia',
            'Considere rotação de tarefas'
        ];
    }

    getREBARecommendations(score) {
        if (score === 1) {
            return ['Risco insignificante', 'Nenhuma ação necessária'];
        }
        if (score <= 3) {
            return [
                'Risco baixo',
                'Mudanças podem ser necessárias',
                'Monitore a postura regularmente'
            ];
        }
        if (score <= 7) {
            return [
                'Investigação e mudança necessárias em breve',
                'Implemente pausas regulares',
                'Considere ajustes ergonômicos',
                'Treinamento em técnicas de levantamento'
            ];
        }
        if (score <= 10) {
            return [
                'Investigação e mudança imediatas',
                'Redesenhe a tarefa',
                'Implemente controles de engenharia',
                'Considere equipamentos auxiliares'
            ];
        }
        return [
            'Investigação e mudança imediatas',
            'Risco muito alto',
            'Intervenção urgente necessária',
            'Suspenda a atividade até correção'
        ];
    }

    getOWASRecommendations(score) {
        if (score === 1) {
            return [
                'Postura normal',
                'Nenhuma ação necessária',
                'Continue monitoramento de rotina'
            ];
        }
        if (score === 2) {
            return [
                'Ações corretivas necessárias em um futuro próximo',
                'Monitore a frequência da postura',
                'Considere melhorias ergonômicas'
            ];
        }
        if (score === 3) {
            return [
                'Ações corretivas necessárias o mais rápido possível',
                'Implemente mudanças imediatas',
                'Considere redesenho da tarefa'
            ];
        }
        return [
            'Ações corretivas necessárias imediatamente',
            'Efeito prejudicial grave',
            'Suspenda a atividade',
            'Intervenção urgente obrigatória'
        ];
    }

    getErrorResult(method) {
        return {
            score: 0,
            riskLevel: 'unknown',
            riskText: 'Erro na Análise',
            details: {
                'Erro': 'Falha no cálculo'
            },
            recommendations: [
                'Erro durante a análise',
                'Verifique os dados de entrada',
                'Tente novamente'
            ]
        };
    }
}

// Exportar para uso global
window.ErgonomicAlgorithms = ErgonomicAlgorithms;

