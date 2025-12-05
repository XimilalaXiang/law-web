import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  BookOpenIcon, 
  AlertTriangleIcon, 
  LightbulbIcon, 
  ArrowRightIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from 'lucide-react';

// 3D波浪粒子背景组件 - 类似Skal Ventures效果
const WaveParticlesBackground = () => {
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
      
      // 中心点
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.35; // 波浪位置偏上

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
        const waveZ = Math.sin(distance * waveFrequency + time) * waveAmplitude;
        const waveZ2 = Math.cos(distance * waveFrequency * 0.5 + time * 0.7) * waveAmplitude * 0.5;
        
        // 旋转变换 - 倾斜视角
        const rotateX = -0.6; // 向后倾斜
        const rotateY = 0.1;
        
        // 应用旋转
        let x = p.baseX;
        let y = p.baseY * Math.cos(rotateX) - (waveZ + waveZ2) * Math.sin(rotateX);
        let z = p.baseY * Math.sin(rotateX) + (waveZ + waveZ2) * Math.cos(rotateX);
        
        // Y轴旋转
        const tempX = x * Math.cos(rotateY) - z * Math.sin(rotateY);
        z = x * Math.sin(rotateY) + z * Math.cos(rotateY);
        x = tempX;
        
        // 透视投影
        const scale = perspective / (perspective + z + 200);
        const projX = centerX + x * scale;
        const projY = centerY + y * scale;
        
        // 基于深度的大小和透明度
        const size = Math.max(0.5, 2.5 * scale);
        const opacity = Math.max(0.1, Math.min(0.9, 0.6 * scale + 0.2));
        
        // 只渲染可见区域内的粒子
        if (projX > -50 && projX < canvas.width + 50 && projY > -50 && projY < canvas.height + 50) {
          projectedParticles.push({
            x: projX,
            y: projY,
            z: z,
            size,
            opacity,
          });
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
};

// Pill 标签组件
const Pill = ({ 
  children, 
  variant = 'default' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'danger' | 'success';
}) => {
  const variantClasses = {
    default: '',
    danger: 'pill-danger',
    success: 'pill-success',
  };

  return (
    <div className={`pill ${variantClasses[variant]}`}>
      {children}
    </div>
  );
};

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: BookOpenIcon,
      title: '真实案例分析',
      description: '收集整理真实的求职诈骗案例，深入分析诈骗手法和特征，让你提前了解风险。',
      color: 'blue'
    },
    {
      icon: AlertTriangleIcon,
      title: '风险预警提示',
      description: '总结常见诈骗手段的典型特征和预警信号，帮助你在求职过程中提高警惕。',
      color: 'amber'
    },
    {
      icon: LightbulbIcon,
      title: '防骗实用策略',
      description: '提供针对大学生的切实可行的防诈骗策略和方法，保护你的求职安全。',
      color: 'green'
    }
  ];

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // 触发入场动画
    setTimeout(() => setIsVisible(true), 100);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  const prevSlide = () => setActiveSlide(prev => prev === 0 ? features.length - 1 : prev - 1);
  const nextSlide = () => setActiveSlide(prev => prev === features.length - 1 ? 0 : prev + 1);

  return (
    <div className="bg-black min-h-screen w-full">
      {/* ========== Hero Section ========== */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        {/* 背景效果层 */}
        <div className="absolute inset-0">
          {/* 3D波浪粒子背景 */}
          <WaveParticlesBackground />
          
          {/* 渐晕效果 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </div>

        {/* Hero 内容 */}
        <div className="relative z-10 pb-16 md:pb-24 px-4 sm:px-6 text-center">
          {/* Pill 标签 */}
          <div className={`mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Pill variant="danger">求职防骗平台</Pill>
          </div>

          {/* 主标题 */}
          <h1 className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            保护你的 <br className="sm:hidden" />
            <span className="italic font-light">求职</span> 安全
          </h1>

          {/* 副标题 */}
          <p className={`font-mono text-sm sm:text-base text-white/50 max-w-md mx-auto mt-6 md:mt-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            SafeCareer 致力于帮助大学生识别和防范求职诈骗风险
          </p>

          {/* CTA 按钮 */}
          <div className={`mt-10 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link to="/guide" className="btn-primary">
              [防骗攻略]
            </Link>
            <Link to="/cases" className="btn-secondary">
              [查看案例]
            </Link>
          </div>
        </div>

        {/* 向下滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-[var(--primary)] rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ========== Features Section ========== */}
      <section className="relative py-24 md:py-32">
        {/* 背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
        <div className="absolute inset-0 grid-bg opacity-50" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <Pill>核心功能</Pill>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mt-6">
              为什么选择 <span className="italic font-light">SafeCareer</span>？
            </h2>
            <p className="font-mono text-sm text-white/50 mt-4 max-w-lg mx-auto">
              我们提供全面的求职防诈骗资源，帮助你安全开启职业生涯
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group"
              >
                {/* 状态指示灯 */}
                <div className={`absolute top-6 right-6 w-2 h-2 rounded-full ${
                  feature.color === 'blue' ? 'bg-blue-500' :
                  feature.color === 'amber' ? 'bg-amber-500' : 'bg-green-500'
                } shadow-lg`} style={{
                  boxShadow: `0 0 10px ${
                    feature.color === 'blue' ? 'rgba(59, 130, 246, 0.5)' :
                    feature.color === 'amber' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(34, 197, 94, 0.5)'
                  }`
                }} />

                {/* 图标 */}
                <div className="mb-6">
                  <feature.icon className="h-8 w-8 text-[var(--primary)]" strokeWidth={1.5} />
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[var(--primary)] transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* 描述 */}
                <p className="text-white/50 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* 底部装饰线 */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div 
            className="md:hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {features.map((feature, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="feature-card">
                      <div className={`absolute top-6 right-6 w-2 h-2 rounded-full ${
                        feature.color === 'blue' ? 'bg-blue-500' :
                        feature.color === 'amber' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                      <div className="mb-6">
                        <feature.icon className="h-8 w-8 text-[var(--primary)]" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <div className="flex justify-between items-center mt-8 px-2">
                <button
                  onClick={prevSlide}
                  className="p-3 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)' }}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <div className="flex space-x-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSlide === index 
                          ? 'bg-[var(--primary)] w-6' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="p-3 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] to-black" />
        <div className="glow-orb glow-orb-3" />
        <div className="absolute inset-0 grid-bg opacity-30" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* 左侧内容 */}
            <div className="card bg-white/5 backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--primary)]/10 mb-6">
                <ShieldCheckIcon className="h-7 w-7 text-[var(--primary)]" />
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl text-white">
                准备好保护自己了吗？
              </h2>
              
              <div className="mt-4 h-px w-20 bg-gradient-to-r from-[var(--primary)] to-transparent" />
              
              <p className="mt-6 text-white/60 leading-relaxed">
                立即了解求职防骗知识，掌握必要的防护技能，让你的求职之路更加安全顺畅。
              </p>
            </div>

            {/* 右侧按钮 */}
            <div className="flex flex-col sm:flex-row lg:justify-end gap-4">
              <Link to="/guide" className="btn-primary group">
                <span>防骗攻略</span>
                <ArrowRightIcon className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link to="/cases" className="btn-secondary">
                查看案例库
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
