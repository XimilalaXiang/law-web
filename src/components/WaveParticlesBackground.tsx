import React, { useEffect, useRef } from 'react';

// 3D波浪粒子背景组件 - 金色粒子动画效果
const WaveParticlesBackground: React.FC<{ position?: 'top' | 'bottom' | 'full' }> = ({ 
  position = 'full' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // 粒子网格参数
    const gridSpacingX = 20;
    const gridSpacingY = 20;
    const perspective = 800;
    const waveAmplitude = 60;
    const waveFrequency = 0.02;
    const waveSpeed = 0.015;

    interface Particle {
      baseX: number;
      baseY: number;
      baseZ: number;
    }

    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      const cols = Math.ceil(canvas.width / gridSpacingX) + 20;
      const rows = Math.ceil(canvas.height / gridSpacingY) + 10;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          particles.push({
            baseX: (col - cols / 2) * gridSpacingX,
            baseY: (row - rows / 2) * gridSpacingY,
            baseZ: 0,
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += waveSpeed;
      
      // 中心点 - 根据 position 调整
      const centerX = canvas.width / 2;
      let centerY: number;
      
      switch (position) {
        case 'top':
          centerY = canvas.height * 0.2;
          break;
        case 'bottom':
          centerY = canvas.height * 0.8;
          break;
        default:
          centerY = canvas.height * 0.35;
      }

      // 收集所有粒子的投影位置
      const projectedParticles: Array<{
        x: number;
        y: number;
        z: number;
        size: number;
        opacity: number;
      }> = [];

      particles.forEach(p => {
        // 计算波浪Z偏移
        const distance = Math.sqrt(p.baseX * p.baseX + p.baseY * p.baseY);
        const waveOffset = Math.sin(distance * waveFrequency + time) * waveAmplitude;
        
        const z = p.baseZ + waveOffset;
        
        // 3D到2D投影
        const scale = perspective / (perspective + z);
        const x = centerX + p.baseX * scale;
        const y = centerY + p.baseY * scale;
        
        // 只绘制可见区域内的粒子
        if (x >= -50 && x <= canvas.width + 50 && y >= -50 && y <= canvas.height + 50) {
          // 基于深度的大小和透明度
          const size = Math.max(0.5, 2 * scale);
          const opacity = Math.max(0.1, Math.min(0.8, scale * 0.8));
          
          projectedParticles.push({ x, y, z, size, opacity });
        }
      });

      // 按Z排序，远的先画
      projectedParticles.sort((a, b) => a.z - b.z);

      // 绘制粒子
      projectedParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // 金色粒子，根据位置添加一些颜色变化
        const brightness = Math.max(150, Math.min(255, 200 + p.z * 0.3));
        ctx.fillStyle = `rgba(${brightness}, ${Math.floor(brightness * 0.78)}, 0, ${p.opacity})`;
        ctx.fill();
      });

      // 绘制连线（只连接相近的粒子）
      ctx.strokeStyle = 'rgba(255, 199, 0, 0.05)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < projectedParticles.length; i++) {
        const p1 = projectedParticles[i];
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p2 = projectedParticles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 30 && Math.abs(p1.z - p2.z) < 50) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.globalAlpha = Math.max(0, 0.15 * (1 - dist / 30));
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [position]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default WaveParticlesBackground;




