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

  const testimonials = [
    {
      name: '李晨',
      title: '大四学生 · 计算机',
      company: '中大 · 校园求职',
      quote: '原本差点交了“岗前培训费”，用 SafeCareer 一对照，就识别出套路，少走了弯路。',
      rating: 5,
    },
    {
      name: '王同学',
      title: '实习生 · 产品',
      company: '华工 · 互联网实习',
      quote: '在校招群里碰到“高薪兼职”，平台的案例库让我迅速判断是骗押金的老套路，避免了损失。',
      rating: 5,
    },
    {
      name: '刘老师',
      title: '就业指导中心',
      company: '高校就业服务',
      quote: '把常见骗局和预警信号整理给学生，咨询量下降但命中率更高，大家更有安全感。',
      rating: 5,
    },
    {
      name: '赵同学',
      title: '研一 · 数据分析',
      company: '暨大 · 校招面试',
      quote: '面试后对方让先买设备，查了防骗攻略才知道这是典型“设备采购”骗局，及时止损。',
      rating: 5,
    },
    {
      name: '陈学姐',
      title: '应届毕业生 · 市场',
      company: '华师 · 求职过渡',
      quote: '多看了真实案例，知道“培训贷”“包装简历”这类都是坑，避免了被收取高额手续费。',
      rating: 5,
    },
    {
      name: '周同学',
      title: '大三 · 设计',
      company: '华农 · 兼职接单',
      quote: '以前接单会被压价甚至卷款，平台教的核验流程和合同要点，让我敢拒绝风险订单。',
      rating: 5,
    },
    {
      name: '何辅导员',
      title: '学院辅导员',
      company: '学生事务',
      quote: '用预警清单做班会分享，学生反馈“终于知道哪些话术最危险”，防范意识明显提升。',
      rating: 5,
    },
    {
      name: '黄同学',
      title: '双非院校 · 求职转码',
      company: '转行准备',
      quote: '有人让我先交“内推费”，看了案例库发现这类多数是假内推，果断拒绝，感谢！',
      rating: 5,
    },
    {
      name: '宋同学',
      title: '实习 · 新媒体',
      company: '远程面试',
      quote: '远程面试后要求“保证金”，平台提示这就是经典骗局，成功保住生活费。',
      rating: 5,
    },
    {
      name: '朱同学',
      title: '校社联志愿者',
      company: '校园宣讲',
      quote: '把 SafeCareer 的材料做成宣讲 PPT，现场举例“培训贷”“冒充官方”骗局，反响很好。',
      rating: 5,
    },
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

      {/* ========== Testimonials Section ========== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="glow-orb glow-orb-2" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <Pill>用户反馈</Pill>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mt-6">
              来自用户的<span className="italic font-light">真实口碑</span>
            </h2>
            <p className="font-mono text-sm text-white/50 mt-4 max-w-2xl mx-auto">
              稳定可靠的防护能力，帮助团队与个人快速提升安全水平
            </p>
          </div>

          <div className="mt-12 md:mt-16 space-y-8">
            {[0, 1].map((row) => (
              <div key={row} className="testimonial-marquee">
                <div
                  className={`testimonial-track ${row === 0 ? 'animate-marquee-left' : 'animate-marquee-right'}`}
                  style={{ ['--marquee-duration' as any]: row === 0 ? '42s' : '50s' }}
                >
                  {[...testimonials, ...testimonials].map((item, idx) => (
                    <div key={`${row}-${idx}`} className="testimonial-card">
                      <div className="flex flex-col h-full gap-4">
                        <div className="flex items-center gap-2 text-[var(--primary)] text-sm font-mono">
                          <span>“</span>
                          <span className="uppercase tracking-wide">Feedback</span>
                        </div>
                        <p className="text-white text-base leading-relaxed">
                          {item.quote}
                        </p>
                        <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-white font-semibold truncate">{item.name}</div>
                            <div className="text-white/60 text-xs truncate">{item.title}</div>
                            <div className="text-white/40 text-xs truncate">{item.company}</div>
                          </div>
                          <div className="flex items-center text-[var(--primary)] text-xs font-mono gap-1">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
