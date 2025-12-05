import React, { useState } from 'react';
import { SearchIcon, FilterIcon, AlertCircleIcon, ShieldCheckIcon, BookOpenIcon } from 'lucide-react';

// Real case data (keeping existing data)
const realCases = [
  {
    id: 1,
    title: '特大招聘诈骗案：涉案8000万元',
    summary: '犯罪嫌疑人于某以能办理央企、国企等单位正式员工入职为由，对400多名大学毕业生实施招工、招干诈骗，涉案金额超8000万元。',
    type: '央企国企诈骗',
    date: '2024-06-15',
    warning_signs: ['声称能办理央企国企入职', '要求缴纳高额费用', '提供虚假劳动合同', '组织虚假培训和考试']
  },
  {
    id: 2,
    title: '"央企内推""直签保录"骗局',
    summary: '不法分子以"央企内推""直签保录"等形式向应聘者承诺安排到知名企业工作，并以此收取费用，实际上无任何内推能力。',
    type: '内推诈骗',
    date: '2025-01-20',
    warning_signs: ['承诺央企内推', '要求支付内推费用', '无法提供官方证明', '通过非正规渠道联系']
  },
  {
    id: 3,
    title: '横琴刷单诈骗案：两人被骗43万',
    summary: '澳门在读大学生和金融岛上班族因轻信网络"刷单"骗局，在所谓"做任务"的过程中分别被骗走32万元和11万元。',
    type: '刷单诈骗',
    date: '2025-02-26',
    warning_signs: ['以求职为名诱导刷单', '要求垫付资金做任务', '声称操作失误需继续转账', '要求线下交付现金']
  },
  {
    id: 4,
    title: '"培训贷"套路大学生案例',
    summary: '培训机构以"边学边赚钱""先学后付"等承诺，诱导学生向网络借贷平台贷款支付培训费用，但课程质量低劣且无法提供承诺的兼职机会。',
    type: '培训贷诈骗',
    date: '2023-07-15',
    warning_signs: ['承诺培训后包找工作', '要求分期付款或贷款', '声称边学边赚钱', '退费困难重重']
  },
  {
    id: 5,
    title: '"共享经济创业"圈钱骗局',
    summary: '某公司打着"共享经济创业"幌子，以"回报快、回报高"诱饵吸引大学生投资，承诺推荐他人可获高额佣金，最终人去楼空。',
    type: '创业诈骗',
    date: '2025-03-29',
    warning_signs: ['打着共享经济旗号', '承诺高额快速回报', '要求发展下线', '办公地点突然人去楼空']
  },
  {
    id: 6,
    title: '"高薪招聘"培训诈骗陷阱',
    summary: '四川某教育科技公司针对大学生发布虚假高薪招聘信息，诱导求职者参加培训并收取费用，诈骗400余名求职大学生131万元。',
    type: '招聘培训诈骗',
    date: '2024-08-10',
    warning_signs: ['发布虚假高薪招聘', '要求持证上岗', '收取培训费用', '岗位根本不存在']
  },
  {
    id: 7,
    title: '"托关系""付费内推"诈骗',
    summary: '不法分子谎称认识某国企领导，以30万元保证安排正式编制工作为由实施诈骗，收取费用后以各种理由推脱。',
    type: '关系诈骗',
    date: '2023-11-05',
    warning_signs: ['声称认识企业领导', '承诺安排正式编制', '要求支付巨额费用', '无法提供具体进展']
  },
  {
    id: 8,
    title: '网络传销"线上创业"骗局',
    summary: '犯罪分子搭建"名鸽派MGP"APP平台，以"线上创业""发展团队"为名，形成18级以上传销网络结构，涉案金额9亿余元。',
    type: '网络传销',
    date: '2024-12-20',
    warning_signs: ['承诺线上创业机会', '要求发展下线', '形成多级返利结构', '投资门槛不断提高']
  },
  {
    id: 9,
    title: '求职遭遇刷单诈骗案',
    summary: '女子求职时收到陌生邮件邀请面试，被要求完成"入职测试"刷单任务，险些被骗5.4万元，幸被警方及时劝阻。',
    type: '求职刷单诈骗',
    date: '2025-04-20',
    warning_signs: ['以入职测试为名', '要求完成刷单任务', '先给小额返利获取信任', '要求大额线下充值']
  },
  {
    id: 10,
    title: '暑期兼职"黑中介"陷阱',
    summary: '大学生暑期兼职遭遇"黑中介"，被要求交纳保证金和培训费，承诺的高薪工作变成低薪保安，最终被无故开除。',
    type: '黑中介诈骗',
    date: '2024-07-25',
    warning_signs: ['要求交纳保证金', '承诺高薪工作', '实际工作与承诺不符', '随意解除劳动关系']
  },
  {
    id: 11,
    title: '海外高薪务工诈骗案',
    summary: '诈骗团伙以高薪招聘赴东南亚工作为名，诱骗多名大学生出境，抵达后扣押护照强迫从事电信诈骗活动，有学生被限制人身自由长达半年。',
    type: '海外务工诈骗',
    date: '2024-09-12',
    warning_signs: ['承诺海外高薪工作', '要求先交护照办理费', '抵达后扣押证件', '强迫从事违法活动']
  },
  {
    id: 12,
    title: '网络主播招聘陷阱',
    summary: '某传媒公司以招聘网络主播为名，要求应聘者缴纳形象设计费、平台入驻费等，承诺月入过万，实际平台无流量支持，所谓"保底收入"从未兑现。',
    type: '主播诈骗',
    date: '2025-01-08',
    warning_signs: ['要求缴纳形象设计费', '承诺保底收入', '平台无实际流量', '拒绝退还费用']
  }
];

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

  const caseTypes = ['全部', ...Array.from(new Set(realCases.map(c => c.type)))];

  const filteredCases = realCases.filter(c => {
    const matchesSearch = c.title.includes(searchTerm) || c.summary.includes(searchTerm) || c.warning_signs.some(sign => sign.includes(searchTerm));
    const matchesType = filterType === '全部' || c.type === filterType;
    return matchesSearch && matchesType;
  });

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
            <div className="relative min-w-[200px] group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FilterIcon className="h-4 w-4 text-white/40 group-focus-within:text-[var(--primary)] transition-colors duration-200" />
              </div>
              <select
                className="block w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[var(--primary)]/50 focus:ring-1 focus:ring-[var(--primary)]/30 transition-all duration-200 font-mono text-sm appearance-none cursor-pointer"
                style={{
                  clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
                }}
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                {caseTypes.map(type => (
                  <option key={type} value={type} className="bg-black text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-4 w-4 text-[var(--primary)]" />
              <span className="font-mono text-xs text-white/50">
                共收录 <span className="text-[var(--primary)]">{realCases.length}</span> 个案例
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
                  {caseItem.type}
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
