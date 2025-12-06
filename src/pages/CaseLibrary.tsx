import React, { useEffect, useRef, useState } from 'react';
import { SearchIcon, FilterIcon, AlertCircleIcon, ShieldCheckIcon, BookOpenIcon } from 'lucide-react';
import { realCases, CASE_COUNT } from '../data/cases';

// Pill 标签组件
const Pill = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'danger' | 'success' }) => {
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

const CaseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('全部');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const caseTypes = ['全部', ...Array.from(new Set(realCases.map(c => c.category)))];

  const filteredCases = realCases.filter(c => {
    const matchesSearch = c.title.includes(searchTerm) || c.summary.includes(searchTerm) || c.warning_signs.some(sign => sign.includes(searchTerm));
    const matchesType = filterType === '全部' || c.category === filterType;
    return matchesSearch && matchesType;
  });

  // 点击外部关闭下拉
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="bg-black min-h-screen w-full pt-20">
      {/* 背景效果 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="grid-bg" />
        <div className="glow-orb glow-orb-2" />
        <div className="vignette" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Pill variant="danger">真实案例</Pill>
          
          <h1 className="font-display text-4xl sm:text-5xl text-white mt-6">
            求职诈骗 <span className="italic font-light">案例库</span>
            </h1>
          
          <p className="font-mono text-sm text-white/50 mt-4 max-w-lg mx-auto">
              了解真实的求职诈骗案例，提高警惕，保护自己的权益
            </p>
          </div>

        {/* Search and Filter */}
        <div className="card mb-12">
              <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
                <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-white/40 group-focus-within:text-[var(--primary)] transition-colors duration-200" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[var(--primary)]/50 focus:ring-1 focus:ring-[var(--primary)]/30 transition-all duration-200 font-mono text-sm"
                style={{
                  clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
                }}
                placeholder="搜索案例关键词..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
                  </div>

            {/* Filter Select */}
            <div className="relative min-w-[220px]" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="filter-button group"
              >
                <FilterIcon className="h-4 w-4 text-white/60 group-hover:text-[var(--primary)] transition-colors duration-200" />
                <span className="truncate">{filterType}</span>
                <span className={`chevron ${open ? 'rotate-180' : ''}`}>▾</span>
                <span className="filter-active-bar" />
              </button>

              {open && (
                <div className="filter-dropdown">
                  {caseTypes.map((type, idx) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setOpen(false);
                      }}
                      className={`filter-item ${filterType === type ? 'is-active' : ''}`}
                      style={{ transitionDelay: `${idx * 12}ms` }}
                    >
                      <span className="filter-bullet" />
                      <span className="truncate">{type}</span>
                      {filterType === type && <span className="filter-indicator" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
                </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-4 w-4 text-[var(--primary)]" />
              <span className="font-mono text-xs text-white/50">
                共收录 <span className="text-[var(--primary)]">{CASE_COUNT}</span> 个案例
              </span>
            </div>
            <span className="font-mono text-xs text-white/50">
              当前显示 <span className="text-white">{filteredCases.length}</span> 个
            </span>
          </div>
        </div>

        {/* Case List */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredCases.map(caseItem => (
            <div
              key={caseItem.id}
              className="feature-card group cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-white group-hover:text-[var(--primary)] transition-colors duration-300 leading-tight">
                    {caseItem.title}
                  </h3>
                <span 
                  className="pill text-[10px] px-2 py-1 flex-shrink-0"
                  style={{ fontSize: '10px' }}
                >
                    {caseItem.category}
                  </span>
                </div>

              {/* Date */}
              <p className="font-mono text-xs text-white/30 mb-3">{caseItem.date}</p>

              {/* Summary */}
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                {caseItem.summary}
              </p>

              {/* Warning Signs */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircleIcon className="h-4 w-4 text-red-500" />
                  <h4 className="font-mono text-xs text-white/70 uppercase tracking-wider">
                    预警信号
                    </h4>
                </div>
                <ul className="space-y-2">
                  {caseItem.warning_signs.slice(0, 3).map((sign, index) => (
                    <li key={index} className="flex items-start text-sm text-white/50">
                      <span className="inline-block w-1.5 h-1.5 bg-red-500/80 rounded-full mt-1.5 mr-2 flex-shrink-0 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                      {sign}
                    </li>
                  ))}
                  {caseItem.warning_signs.length > 3 && (
                    <li className="text-xs text-white/30 font-mono pl-3.5">
                      +{caseItem.warning_signs.length - 3} 更多预警信号
                    </li>
                  )}
                </ul>
              </div>

              {/* Bottom decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCases.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 border border-white/10 mb-6"
              style={{
                clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
              }}
            >
              <SearchIcon className="h-8 w-8 text-white/30" />
            </div>
            <p className="font-mono text-white/50 text-sm">
              未找到匹配的案例，请尝试其他搜索条件
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseLibrary;
