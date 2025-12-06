import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  AlertCircleIcon, 
  CheckIcon, 
  DollarSignIcon, 
  BuildingIcon, 
  BriefcaseIcon, 
  MessageCircleIcon,
  PhoneIcon,
  FileTextIcon,
  EyeIcon,
  LockIcon
} from 'lucide-react';

// Warning categories data
const warningCategories = [
  {
  id: 'financial',
  title: '金钱相关预警',
  icon: DollarSignIcon,
    color: '#ef4444',
    warnings: [
      '要求预先支付培训费、押金、材料费等',
      '承诺不合理的高薪或回报',
      '要求使用个人银行账户进行资金周转',
      '以任何理由索要银行卡信息或转账'
    ]
  },
  {
  id: 'company',
  title: '公司背景预警',
  icon: BuildingIcon,
    color: '#f59e0b',
    warnings: [
      '公司信息模糊，无法在官方渠道查证',
      '工作地点频繁变更或在非正规场所',
      '招聘信息过于简单，缺少具体岗位描述',
      '只提供手机联系方式，无固定电话或邮箱'
    ]
  },
  {
  id: 'process',
  title: '招聘流程预警',
  icon: BriefcaseIcon,
    color: '#a855f7',
    warnings: [
      '无需面试或简单聊天后立即录用',
      '要求提供过多的个人敏感信息',
      '急切催促做决定，制造紧迫感',
      '招聘信息长期存在，不限招聘人数'
    ]
  },
  {
  id: 'communication',
  title: '沟通方式预警',
  icon: MessageCircleIcon,
    color: '#3b82f6',
    warnings: [
      '只通过非正规渠道如个人社交账号联系',
      '拒绝视频面试或当面交流',
      '邮件地址使用免费邮箱而非企业邮箱',
      '要求添加私人社交账号并发送敏感信息'
    ]
  }
];

// Protection strategies
const protectionStrategies = [
  {
    icon: EyeIcon,
    title: '核实企业信息',
    description: '通过国家企业信用信息公示系统、天眼查等渠道核实企业真实性',
  },
  {
    icon: FileTextIcon,
    title: '签订正规合同',
    description: '入职前签订正式劳动合同，明确工作内容、薪资待遇等条款',
  },
  {
    icon: LockIcon,
    title: '保护个人信息',
    description: '不轻易提供身份证、银行卡等敏感信息，不随意签署空白文件',
  },
  {
    icon: PhoneIcon,
    title: '保持警惕沟通',
    description: '优先选择正规招聘平台，警惕私人联系方式和非官方渠道',
  },
];

// Pill component
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

const AntiScamGuide = () => {
  const [reviewedWarnings, setReviewedWarnings] = useState<Record<string, boolean>>({});

  const toggleWarning = (categoryId: string, index: number) => {
      const key = `${categoryId}-${index}`;
    setReviewedWarnings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalWarnings = warningCategories.reduce((sum, cat) => sum + cat.warnings.length, 0);
    const reviewedCount = Object.values(reviewedWarnings).filter(Boolean).length;
  const progress = Math.round((reviewedCount / totalWarnings) * 100);

  return (
    <div className="bg-black min-h-screen w-full pt-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="grid-bg" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="vignette" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Pill variant="success">防骗攻略</Pill>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mt-6">
            大学生求职 <br className="sm:hidden" />
            <span className="italic font-light">防骗</span> 指南
          </h1>
          
          <p className="font-mono text-sm text-white/50 mt-6 max-w-lg mx-auto">
            掌握这些防骗技巧，让你的求职之路更加安全顺畅
          </p>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="font-display text-3xl text-[var(--primary)]">100+</div>
              <div className="font-mono text-xs text-white/40 mt-1">真实案例</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl text-[var(--primary)]">20+</div>
              <div className="font-mono text-xs text-white/40 mt-1">防骗策略</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl text-[var(--primary)]">1000+</div>
              <div className="font-mono text-xs text-white/40 mt-1">学生受益</div>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="card mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-center"
                style={{ clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)' }}
              >
                <CheckIcon className="h-5 w-5 text-[var(--primary)]" />
                </div>
              <div>
                <h3 className="text-white font-semibold">学习进度</h3>
                <p className="font-mono text-xs text-white/40">点击预警项标记为已学习</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl text-[var(--primary)]">{progress}%</div>
              <div className="font-mono text-xs text-white/40">{reviewedCount}/{totalWarnings}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/5 overflow-hidden"
            style={{ clipPath: 'polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)' }}
          >
            <div 
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[#ffdb4d] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
                </div>

        {/* Warning Categories */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <Pill variant="danger">预警信号</Pill>
            <h2 className="font-display text-3xl text-white mt-6">
              求职诈骗 <span className="italic font-light">预警信号</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {warningCategories.map(category => {
              const CategoryIcon = category.icon;
              const categoryReviewed = category.warnings.filter((_, i) => reviewedWarnings[`${category.id}-${i}`]).length;
              
              return (
                <div key={category.id} className="feature-card group">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-12 h-12 flex items-center justify-center border"
                      style={{ 
                        borderColor: `${category.color}50`,
                        backgroundColor: `${category.color}10`,
                        clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
                      }}
                    >
                      <CategoryIcon className="h-6 w-6" style={{ color: category.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                      <div className="font-mono text-xs text-white/40">
                        {categoryReviewed}/{category.warnings.length} 已学习
                      </div>
                    </div>
                  </div>

                  {/* Warning Items */}
                  <div className="space-y-3">
                    {category.warnings.map((warning, index) => {
                      const isChecked = reviewedWarnings[`${category.id}-${index}`];
                      return (
                        <button
                          key={index}
                          type="button"
                          role="checkbox"
                          aria-checked={isChecked}
                          onClick={() => toggleWarning(category.id, index)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleWarning(category.id, index);
                            }
                          }}
                          className={`w-full flex items-start gap-3 p-3 text-left transition-all duration-200 border ${
                            isChecked 
                              ? 'bg-white/5 border-[var(--primary)]/30' 
                              : 'bg-black/30 border-white/5 hover:border-white/20'
                          }`}
                          style={{
                            clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)'
                          }}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isChecked ? 'bg-[var(--primary)]' : 'border border-white/20'
                          }`}>
                            {isChecked && <CheckIcon className="h-3 w-3 text-black" />}
                          </div>
                          <span className={`text-sm ${isChecked ? 'text-white' : 'text-white/60'}`}>
                            {warning}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category Progress */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="h-1 bg-white/5 overflow-hidden rounded-full">
                      <div 
                        className="h-full transition-all duration-500 rounded-full"
                        style={{ 
                          width: `${(categoryReviewed / category.warnings.length) * 100}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Protection Strategies */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <Pill variant="success">安全策略</Pill>
            <h2 className="font-display text-3xl text-white mt-6">
              求职安全 <span className="italic font-light">防护策略</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {protectionStrategies.map((strategy, index) => {
              const StrategyIcon = strategy.icon;
              return (
                <div key={index} className="feature-card group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0"
                      style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
                    >
                      <StrategyIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-[var(--primary)] transition-colors">
                        {strategy.title}
                      </h3>
                      <p className="text-white/50 text-sm mt-2 leading-relaxed">
                        {strategy.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Emergency Response */}
        <section>
          <div className="card bg-red-500/5 border-red-500/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 flex items-center justify-center"
                style={{ clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)' }}
              >
                <AlertCircleIcon className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">遇到诈骗怎么办？</h3>
                <p className="font-mono text-xs text-white/40">紧急应对措施</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { num: '01', text: '立即停止转账和支付行为' },
                { num: '02', text: '保留所有聊天记录和证据' },
                { num: '03', text: '拨打110或12315举报' },
                { num: '04', text: '向学校就业指导中心反映' },
              ].map((item, index) => (
                <div key={index} className="bg-black/30 border border-white/5 p-4"
                  style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
                >
                  <div className="font-mono text-red-500 text-lg mb-2">{item.num}</div>
                  <p className="text-white/70 text-sm">{item.text}</p>
        </div>
              ))}
        </div>

            {/* Emergency Contacts */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-6 justify-center">
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-red-500" />
                <span className="font-mono text-sm text-white/60">报警电话：</span>
                <span className="font-mono text-[var(--primary)]">110</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-red-500" />
                <span className="font-mono text-sm text-white/60">消费维权：</span>
                <span className="font-mono text-[var(--primary)]">12315</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-red-500" />
                <span className="font-mono text-sm text-white/60">反诈热线：</span>
                <span className="font-mono text-[var(--primary)]">96110</span>
              </div>
            </div>
        </div>
        </section>
      </div>
    </div>
  );
};

export default AntiScamGuide;
