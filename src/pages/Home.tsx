import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, BookOpenIcon, AlertTriangleIcon, LightbulbIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import FluidWaveBackground from '../components/FluidWaveBackground';
const Home = () => {
  // State for mobile carousel
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  // Features data
  const features = [{
    icon: BookOpenIcon,
    title: '真实案例分析',
    description: '收集整理真实的求职诈骗案例，深入分析诈骗手法和特征，让你提前了解风险。',
    color: 'blue'
  }, {
    icon: AlertTriangleIcon,
    title: '风险预警提示',
    description: '总结常见诈骗手段的典型特征和预警信号，帮助你在求职过程中提高警惕。',
    color: 'amber'
  }, {
    icon: LightbulbIcon,
    title: '防骗实用策略',
    description: '提供针对大学生的切实可行的防诈骗策略和方法，保护你的求职安全。',
    color: 'green'
  }];
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  // Handle touch events for swiping
  const handleTouchStart = e => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = e => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left
        nextSlide();
      } else {
        // Swipe right
        prevSlide();
      }
    }
  };
  const prevSlide = () => {
    setActiveSlide(prev => prev === 0 ? features.length - 1 : prev - 1);
  };
  const nextSlide = () => {
    setActiveSlide(prev => prev === features.length - 1 ? 0 : prev + 1);
  };
  return <div className="bg-white dark:bg-gray-900 w-full transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 dark:from-gray-800/80 dark:via-gray-900 dark:to-blue-900/20"></div>
        {/* Fluid Wave Background */}
        <FluidWaveBackground variant="hero" />
        <div className="max-w-6xl mx-auto px-4 pt-28 pb-24 sm:px-6 md:pt-36 md:pb-32">
          <div className="text-center relative z-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block mb-2">保护你的求职安全</span>
              <span className="block gradient-text">远离就业诈骗陷阱</span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
              SafeCareer 致力于帮助大学生识别和防范求职过程中的诈骗风险，
              提供真实案例分析和防骗策略。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link to="/guide" className="btn-primary inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                防骗攻略
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/cases" className="btn-secondary inline-flex items-center justify-center px-6 py-3 border border-gray-200 dark:border-gray-700 text-base font-medium rounded-full shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                查看案例
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Redesigned */}
      <div className="py-24 bg-white dark:bg-gray-900 relative">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#3B82F6" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
          </svg>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              为什么选择 SafeCareer？
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400 mx-auto">
              我们提供全面的求职防诈骗资源，帮助你安全开启职业生涯
            </p>
          </div>
          {/* Desktop view - Grid layout */}
          <div className="mt-20 hidden md:grid md:grid-cols-3 md:gap-8">
            {features.map((feature, index) => <div key={index} className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-blue-100/20 dark:shadow-gray-900/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Color indicator dot */}
                <div className={`absolute top-6 right-6 w-3 h-3 rounded-full bg-${feature.color}-500`}></div>
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="p-8">
                  {/* Integrated icon container */}
                  <div className="mb-6 inline-flex">
                    <feature.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>)}
          </div>
          {/* Mobile view - Carousel */}
          <div className="mt-12 md:hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="relative overflow-hidden">
              <div className="flex transition-transform duration-300 ease-out" style={{
              transform: `translateX(-${activeSlide * 100}%)`
            }}>
                {features.map((feature, index) => <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-blue-100/20 dark:shadow-gray-900/50 overflow-hidden">
                      {/* Color indicator dot */}
                      <div className={`absolute top-6 right-6 w-3 h-3 rounded-full bg-${feature.color}-500`}></div>
                      <div className="p-8">
                        {/* Integrated icon container */}
                        <div className="mb-6 inline-flex">
                          <feature.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
              {/* Carousel controls */}
              <div className="flex justify-between items-center mt-6">
                <button onClick={prevSlide} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                {/* Pagination indicators */}
                <div className="flex space-x-2">
                  {features.map((_, index) => <button key={index} onClick={() => setActiveSlide(index)} className={`w-2.5 h-2.5 rounded-full transition-colors ${activeSlide === index ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`} aria-label={`Go to slide ${index + 1}`} />)}
                </div>
                <button onClick={nextSlide} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 dark:from-indigo-600/30 dark:to-purple-700/30"></div>
          {/* Fluid Wave Background for CTA section */}
          <FluidWaveBackground variant="cta" />
        </div>
        <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div className="bg-white/5 dark:bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 dark:border-white/20 shadow-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 dark:bg-indigo-500/30 mb-6">
                <ShieldCheckIcon className="h-6 w-6 text-indigo-400 dark:text-indigo-300" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                准备好保护自己了吗？
              </h2>
              <div className="mt-4 h-1 w-20 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-300 dark:to-purple-400 rounded-full"></div>
              <p className="mt-6 text-lg text-gray-300 dark:text-gray-200 max-w-3xl">
                立即了解求职防骗知识，掌握必要的防护技能，让你的求职之路更加安全顺畅。
              </p>
            </div>
            <div className="mt-12 lg:mt-0 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-5">
              <Link to="/guide" className="group relative inline-flex items-center justify-center px-7 py-3.5 overflow-hidden font-medium rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  防骗攻略
                  <ArrowRightIcon className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
              <Link to="/cases" className="group relative inline-flex items-center justify-center px-7 py-3.5 overflow-hidden font-medium rounded-full border-2 border-white/20 dark:border-white/30 text-white hover:bg-white/10 dark:hover:bg-white/20 transition-all duration-300">
                <span className="relative">查看案例库</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Home;