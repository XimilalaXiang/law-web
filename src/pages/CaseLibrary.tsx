import React, { useState } from 'react';
import { SearchIcon, FilterIcon, AlertCircleIcon, ShieldCheckIcon } from 'lucide-react';
// Real case data from 案例.md with additional cases
const realCases = [{
  id: 1,
  title: '特大招聘诈骗案：涉案8000万元',
  summary: '犯罪嫌疑人于某以能办理央企、国企等单位正式员工入职为由，对400多名大学毕业生实施招工、招干诈骗，涉案金额超8000万元。',
  type: '央企国企诈骗',
  date: '2024-06-15',
  warning_signs: ['声称能办理央企国企入职', '要求缴纳高额费用', '提供虚假劳动合同', '组织虚假培训和考试']
}, {
  id: 2,
  title: '"央企内推""直签保录"骗局',
  summary: '不法分子以"央企内推""直签保录"等形式向应聘者承诺安排到知名企业工作，并以此收取费用，实际上无任何内推能力。',
  type: '内推诈骗',
  date: '2025-01-20',
  warning_signs: ['承诺央企内推', '要求支付内推费用', '无法提供官方证明', '通过非正规渠道联系']
}, {
  id: 3,
  title: '横琴刷单诈骗案：两人被骗43万',
  summary: '澳门在读大学生和金融岛上班族因轻信网络"刷单"骗局，在所谓"做任务"的过程中分别被骗走32万元和11万元。',
  type: '刷单诈骗',
  date: '2025-02-26',
  warning_signs: ['以求职为名诱导刷单', '要求垫付资金做任务', '声称操作失误需继续转账', '要求线下交付现金']
}, {
  id: 4,
  title: '"培训贷"套路大学生案例',
  summary: '培训机构以"边学边赚钱""先学后付"等承诺，诱导学生向网络借贷平台贷款支付培训费用，但课程质量低劣且无法提供承诺的兼职机会。',
  type: '培训贷诈骗',
  date: '2023-07-15',
  warning_signs: ['承诺培训后包找工作', '要求分期付款或贷款', '声称边学边赚钱', '退费困难重重']
}, {
  id: 5,
  title: '"共享经济创业"圈钱骗局',
  summary: '某公司打着"共享经济创业"幌子，以"回报快、回报高"诱饵吸引大学生投资，承诺推荐他人可获高额佣金，最终人去楼空。',
  type: '创业诈骗',
  date: '2025-03-29',
  warning_signs: ['打着共享经济旗号', '承诺高额快速回报', '要求发展下线', '办公地点突然人去楼空']
}, {
  id: 6,
  title: '"高薪招聘"培训诈骗陷阱',
  summary: '四川某教育科技公司针对大学生发布虚假高薪招聘信息，诱导求职者参加培训并收取费用，诈骗400余名求职大学生131万元。',
  type: '招聘培训诈骗',
  date: '2024-08-10',
  warning_signs: ['发布虚假高薪招聘', '要求持证上岗', '收取培训费用', '岗位根本不存在']
}, {
  id: 7,
  title: '"托关系""付费内推"诈骗',
  summary: '不法分子谎称认识某国企领导，以30万元保证安排正式编制工作为由实施诈骗，收取费用后以各种理由推脱。',
  type: '关系诈骗',
  date: '2023-11-05',
  warning_signs: ['声称认识企业领导', '承诺安排正式编制', '要求支付巨额费用', '无法提供具体进展']
}, {
  id: 8,
  title: '网络传销"线上创业"骗局',
  summary: '犯罪分子搭建"名鸽派MGP"APP平台，以"线上创业""发展团队"为名，形成18级以上传销网络结构，涉案金额9亿余元。',
  type: '网络传销',
  date: '2024-12-20',
  warning_signs: ['承诺线上创业机会', '要求发展下线', '形成多级返利结构', '投资门槛不断提高']
}, {
  id: 9,
  title: '求职遭遇刷单诈骗案',
  summary: '女子求职时收到陌生邮件邀请面试，被要求完成"入职测试"刷单任务，险些被骗5.4万元，幸被警方及时劝阻。',
  type: '求职刷单诈骗',
  date: '2025-04-20',
  warning_signs: ['以入职测试为名', '要求完成刷单任务', '先给小额返利获取信任', '要求大额线下充值']
}, {
  id: 10,
  title: '暑期兼职"黑中介"陷阱',
  summary: '大学生暑期兼职遭遇"黑中介"，被要求交纳保证金和培训费，承诺的高薪工作变成低薪保安，最终被无故开除。',
  type: '黑中介诈骗',
  date: '2024-07-25',
  warning_signs: ['要求交纳保证金', '承诺高薪工作', '实际工作与承诺不符', '随意解除劳动关系']
}];
const CaseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('全部');
  // Filter types extracted from cases
  const caseTypes = ['全部', ...Array.from(new Set(realCases.map(c => c.type)))];
  // Filter cases based on search term and type
  const filteredCases = realCases.filter(c => {
    const matchesSearch = c.title.includes(searchTerm) || c.summary.includes(searchTerm) || c.warning_signs.some(sign => sign.includes(searchTerm));
    const matchesType = filterType === '全部' || c.type === filterType;
    return matchesSearch && matchesType;
  });
  return <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen w-full transition-colors duration-300">
      {/* Subtle pattern background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24 relative">
        {/* Neumorphic Header Card */}
        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-[20px_20px_60px_rgba(0,0,0,0.05),-20px_-20px_60px_rgba(255,255,255,0.8)] dark:shadow-[20px_20px_60px_rgba(0,0,0,0.4),-20px_-20px_60px_rgba(255,255,255,0.02)] border border-gray-100 dark:border-gray-700 mb-16 transform transition-all duration-300 hover:shadow-[15px_15px_30px_rgba(0,0,0,0.06),-15px_-15px_30px_rgba(255,255,255,0.9)] dark:hover:shadow-[15px_15px_30px_rgba(0,0,0,0.5),-15px_-15px_30px_rgba(255,255,255,0.03)]">
          {/* Floating 3D Shield Icon */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="relative w-20 h-20 transition-transform duration-300 hover:rotate-6 group">
              {/* Shadow layers for 3D effect */}
              <div className="absolute inset-0 bg-blue-600 rounded-full opacity-10 blur-md transform scale-90 translate-y-1"></div>
              <div className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-lg transform scale-95"></div>
              {/* Icon container with neumorphic effect */}
              <div className="absolute inset-0 bg-gray-50 dark:bg-gray-700 rounded-full shadow-[5px_5px_15px_rgba(0,0,0,0.1),-5px_-5px_15px_rgba(255,255,255,0.8)] dark:shadow-[5px_5px_15px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(255,255,255,0.02)] flex items-center justify-center border border-gray-100 dark:border-gray-600 group-hover:shadow-[3px_3px_10px_rgba(0,0,0,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)] dark:group-hover:shadow-[3px_3px_10px_rgba(0,0,0,0.5),-3px_-3px_10px_rgba(255,255,255,0.03)] transition-all duration-300">
                <ShieldCheckIcon className="h-10 w-10 text-blue-600 dark:text-blue-400 transform transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>
          </div>
          <div className="text-center pt-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4 text-shadow">
              求职诈骗案例库
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              了解真实的求职诈骗案例，提高警惕，保护自己的权益
            </p>
          </div>
          {/* Search and Filter with inner shadow */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.02)] border border-gray-100 dark:border-gray-600">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow group">
                  {/* Neumorphic search input */}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" aria-hidden="true" />
                  </div>
                  <input type="text" className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 sm:text-sm shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.5)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.02)] hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] dark:hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.03)]" placeholder="搜索案例关键词..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="relative inline-block min-w-[180px] group">
                  <div className="flex items-center">
                    <FilterIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" aria-hidden="true" />
                    <select className="block w-full pl-3 pr-10 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.5)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.02)] hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-3px_-3px_6px_rgba(255,255,255,0.6)] dark:hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(255,255,255,0.03)]" value={filterType} onChange={e => setFilterType(e.target.value)}>
                      {caseTypes.map(type => <option key={type} value={type}>
                          {type}
                        </option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Case List */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {filteredCases.map(caseItem => <div key={caseItem.id} className="bg-white dark:bg-gray-800 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 card-hover">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {caseItem.title}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {caseItem.type}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{caseItem.date}</p>
                <p className="mt-4 text-gray-600 dark:text-gray-400">{caseItem.summary}</p>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <AlertCircleIcon className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-2" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      预警信号:
                    </h4>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {caseItem.warning_signs.map((sign, index) => <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-block w-1.5 h-1.5 bg-amber-400 dark:bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        {sign}
                      </li>)}
                  </ul>
                </div>
              </div>
            </div>)}
        </div>
        {filteredCases.length === 0 && <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
              <SearchIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              未找到匹配的案例，请尝试其他搜索条件
            </p>
          </div>}
        <div className="mt-16 text-center"></div>
      </div>
    </div>;
};
export default CaseLibrary;