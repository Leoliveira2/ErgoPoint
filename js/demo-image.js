/**
 * Demo Image Generator - Gera uma imagem de demonstração para testes
 */
class DemoImageGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
    }

    generateDemoImage(width = 640, height = 480) {
        // Criar canvas temporário
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');

        // Fundo gradiente
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#E5E7EB');
        gradient.addColorStop(1, '#F3F4F6');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        // Desenhar figura humana simplificada
        this.drawSimplifiedHuman(width, height);

        // Adicionar texto informativo
        this.addDemoText(width, height);

        return this.canvas;
    }

    drawSimplifiedHuman(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = Math.min(width, height) / 600;

        this.ctx.strokeStyle = '#374151';
        this.ctx.lineWidth = 4 * scale;
        this.ctx.lineCap = 'round';

        // Cabeça
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY - 120 * scale, 30 * scale, 0, 2 * Math.PI);
        this.ctx.stroke();

        // Tronco
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - 90 * scale);
        this.ctx.lineTo(centerX, centerY + 60 * scale);
        this.ctx.stroke();

        // Braço esquerdo
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - 60 * scale);
        this.ctx.lineTo(centerX - 60 * scale, centerY - 20 * scale);
        this.ctx.lineTo(centerX - 90 * scale, centerY + 20 * scale);
        this.ctx.stroke();

        // Braço direito
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - 60 * scale);
        this.ctx.lineTo(centerX + 60 * scale, centerY - 20 * scale);
        this.ctx.lineTo(centerX + 90 * scale, centerY + 20 * scale);
        this.ctx.stroke();

        // Perna esquerda
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY + 60 * scale);
        this.ctx.lineTo(centerX - 30 * scale, centerY + 120 * scale);
        this.ctx.lineTo(centerX - 40 * scale, centerY + 180 * scale);
        this.ctx.stroke();

        // Perna direita
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY + 60 * scale);
        this.ctx.lineTo(centerX + 30 * scale, centerY + 120 * scale);
        this.ctx.lineTo(centerX + 40 * scale, centerY + 180 * scale);
        this.ctx.stroke();

        // Pontos de articulação
        this.ctx.fillStyle = '#EF4444';
        const joints = [
            // Ombros
            [centerX - 15 * scale, centerY - 60 * scale],
            [centerX + 15 * scale, centerY - 60 * scale],
            // Cotovelos
            [centerX - 60 * scale, centerY - 20 * scale],
            [centerX + 60 * scale, centerY - 20 * scale],
            // Punhos
            [centerX - 90 * scale, centerY + 20 * scale],
            [centerX + 90 * scale, centerY + 20 * scale],
            // Quadris
            [centerX - 15 * scale, centerY + 60 * scale],
            [centerX + 15 * scale, centerY + 60 * scale],
            // Joelhos
            [centerX - 30 * scale, centerY + 120 * scale],
            [centerX + 30 * scale, centerY + 120 * scale],
            // Tornozelos
            [centerX - 40 * scale, centerY + 180 * scale],
            [centerX + 40 * scale, centerY + 180 * scale]
        ];

        joints.forEach(([x, y]) => {
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6 * scale, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }

    addDemoText(width, height) {
        // Título
        this.ctx.fillStyle = '#1F2937';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('IMAGEM DE DEMONSTRAÇÃO', width / 2, 40);

        // Subtítulo
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#6B7280';
        this.ctx.fillText('Figura humana simulada para análise ergonômica', width / 2, 65);

        // Rodapé
        this.ctx.font = '14px Arial';
        this.ctx.fillText('Clique em "Analisar Postura" para testar o sistema', width / 2, height - 20);
    }

    getImageDataURL() {
        return this.canvas.toDataURL('image/png');
    }

    getImageBlob() {
        return new Promise(resolve => {
            this.canvas.toBlob(resolve, 'image/png');
        });
    }
}

// Exportar para uso global
window.DemoImageGenerator = DemoImageGenerator;

