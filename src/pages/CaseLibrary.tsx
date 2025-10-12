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
}, {
  id: 11,
  title: '海外高薪务工诈骗案',
  summary: '诈骗团伙以高薪招聘赴东南亚工作为名，诱骗多名大学生出境，抵达后扣押护照强迫从事电信诈骗活动，有学生被限制人身自由长达半年。',
  type: '海外务工诈骗',
  date: '2024-09-12',
  warning_signs: ['承诺海外高薪工作', '要求先交护照办理费', '抵达后扣押证件', '强迫从事违法活动']
}, {
  id: 12,
  title: '网络主播招聘陷阱',
  summary: '某传媒公司以招聘网络主播为名，要求应聘者缴纳形象设计费、平台入驻费等，承诺月入过万，实际平台无流量支持，所谓"保底收入"从未兑现。',
  type: '主播诈骗',
  date: '2025-01-08',
  warning_signs: ['要求缴纳形象设计费', '承诺保底收入', '平台无实际流量', '拒绝退还费用']
}, {
  id: 13,
  title: '打字员高薪兼职骗局',
  summary: '女大学生看到"日薪300元打字员"招聘信息，交纳会员费后发现所谓工作内容是抄写小说，完成后对方以"质量不合格"为由拒绝结算并拉黑。',
  type: '打字员诈骗',
  date: '2024-10-20',
  warning_signs: ['宣称日薪过高', '要求先交会员费', '工作要求模糊', '以质量问题拒付工资']
}, {
  id: 14,
  title: '快递录单员诈骗陷阱',
  summary: '诈骗分子发布"快递录单员"招聘信息，声称工作简单每单结算，要求应聘者先交保证金和培训费，收钱后就失联。',
  type: '录单员诈骗',
  date: '2024-11-15',
  warning_signs: ['承诺按单结算', '要求交保证金', '声称零基础可做', '收费后失联']
}, {
  id: 15,
  title: '游戏代练诈骗案例',
  summary: '某游戏工作室招聘代练员，要求应聘者先租赁游戏账号并缴纳押金，承诺完成任务后返还。学生交钱后发现账号无法使用，对方已失联。',
  type: '游戏代练诈骗',
  date: '2024-12-03',
  warning_signs: ['要求租赁账号', '收取高额押金', '任务难度过高', '无法联系到雇主']
}, {
  id: 16,
  title: '虚假实习岗位诈骗',
  summary: '某咨询公司以提供知名企业实习机会为名，收取每人3-5万元的"实习安排费"，承诺实习后可转正，实际安排的是短期临时工作，转正承诺从未兑现。',
  type: '实习诈骗',
  date: '2024-05-18',
  warning_signs: ['收取高额实习安排费', '承诺100%转正', '无法提供企业确认', '实习内容与承诺不符']
}, {
  id: 17,
  title: '保险销售诱导贷款案',
  summary: '保险公司以招聘销售代表为名，要求新人自己先购买保险产品"体验"，诱导大学生贷款购买高额保险，造成学生背负数万元债务。',
  type: '保险诈骗',
  date: '2024-04-22',
  warning_signs: ['要求员工自购产品', '诱导贷款购买', '承诺可退款', '实际退款困难']
}, {
  id: 18,
  title: '微商代理囤货骗局',
  summary: '诈骗团伙以"零投入创业"为幌子招募微商代理，诱导学生大量囤货，承诺包销和高额返利，实际货物滞销且无法退货，造成学生经济损失。',
  type: '微商诈骗',
  date: '2025-02-10',
  warning_signs: ['承诺包销售', '要求大量囤货', '宣传暴利回报', '货物无法退换']
}, {
  id: 19,
  title: '电商客服培训骗局',
  summary: '某公司招聘电商客服，要求应聘者参加为期一周的付费培训，收取2000元培训费后，以"考核不合格"为由拒绝录用，培训费不予退还。',
  type: '客服培训诈骗',
  date: '2024-08-28',
  warning_signs: ['必须参加付费培训', '考核标准不明确', '大部分人考核不通过', '培训费不退还']
}, {
  id: 20,
  title: '家教中介诈骗案',
  summary: '家教中介收取大学生300-500元信息费，承诺提供多个家教机会，实际提供的联系方式多为无效信息，家长要么不存在要么早已找到老师。',
  type: '家教中介诈骗',
  date: '2024-09-05',
  warning_signs: ['收取信息费', '承诺大量家教机会', '提供虚假联系方式', '不承诺成功率']
}, {
  id: 21,
  title: '影视群演招聘陷阱',
  summary: '某影视公司招聘群众演员，要求应聘者缴纳档案费、拍摄费等，承诺每天有戏拍，实际一个月才安排1-2次拍摄，且报酬远低于承诺。',
  type: '群演诈骗',
  date: '2024-06-30',
  warning_signs: ['收取档案费', '承诺每天有工作', '实际工作量极少', '片酬远低于承诺']
}, {
  id: 22,
  title: '刷信誉兼职连环骗',
  summary: '诈骗分子以刷单兼职为名，先让受害者完成小额任务获得返利取得信任，随后以"系统升级""大额任务高返利"为由，诱导受害者垫付大额资金，涉案金额达15万元。',
  type: '刷单诈骗',
  date: '2025-03-15',
  warning_signs: ['先给小额返利', '逐步提高垫付金额', '以系统故障为由拖延', '要求继续充值解冻']
}, {
  id: 23,
  title: '网络兼职刷评论骗局',
  summary: '某电商平台招聘"评论员"，声称只需复制粘贴评论即可赚钱，要求先购买商品再返现，大学生购买后发现返现无法到账，商家也失去联系。',
  type: '刷评论诈骗',
  date: '2024-10-08',
  warning_signs: ['要求先购买商品', '承诺购买后返现', '返现迟迟不到账', '客服无法联系']
}, {
  id: 24,
  title: 'KTV招聘服务员陷阱',
  summary: '某KTV以招聘服务员为名，面试时要求女大学生试穿演出服装并拍照，以"形象不符"为由拒绝录用，照片却被用于其他用途，涉嫌侵犯肖像权。',
  type: 'KTV诈骗',
  date: '2024-07-12',
  warning_signs: ['要求穿特殊服装拍照', '工作内容含糊不清', '工作时间异常', '试用期无工资']
}, {
  id: 25,
  title: '虚假简历优化服务骗局',
  summary: '某职业咨询公司以提供简历优化、面试辅导为名，收取每人3000-8000元服务费，提供的都是网上可免费获取的模板和建议，毫无实际价值。',
  type: '简历服务诈骗',
  date: '2024-11-20',
  warning_signs: ['收费过高', '承诺显著提高成功率', '服务内容空洞', '无成功案例证明']
}, {
  id: 26,
  title: '网络写手招聘骗局',
  summary: '写作平台招聘网络写手，要求先交保证金防止"跳单"，承诺每千字30-50元，实际稿费结算时以各种理由扣款，最终所得远低于预期。',
  type: '写手诈骗',
  date: '2025-01-25',
  warning_signs: ['收取保证金', '稿费标准不透明', '扣款理由多样', '提现门槛高']
}, {
  id: 27,
  title: '"码商"兼职洗钱陷阱',
  summary: '诈骗团伙以"码商"兼职为名，要求大学生提供收款二维码帮助转账，声称是正常业务流程，实际是帮助诈骗团伙洗钱，多名学生因此被追究法律责任。',
  type: '洗钱诈骗',
  date: '2024-12-18',
  warning_signs: ['要求提供收款码', '转账频繁金额大', '收取高额佣金', '涉嫌违法洗钱']
}, {
  id: 28,
  title: '假冒名企招聘会骗局',
  summary: '诈骗团伙冒充知名企业举办招聘会，租赁高档写字楼营造正规氛围，收取每人200元简历筛选费，现场收取费用后就解散，企业证实从未委托其招聘。',
  type: '假招聘会诈骗',
  date: '2024-09-28',
  warning_signs: ['收取筛选费', '现场气氛异常匆忙', '无法提供企业授权', '收钱后匆忙结束']
}, {
  id: 29,
  title: '社交平台兼职诈骗',
  summary: '诈骗分子在社交平台发布"点赞转发赚钱"兼职信息，要求先关注多个账号并转发内容，完成后以"系统维护"为由拒绝支付，实际利用学生账号进行营销推广。',
  type: '社交平台诈骗',
  date: '2025-02-05',
  warning_signs: ['要求关注转发', '承诺简单任务高收益', '任务完成后拖延支付', '要求提供账号密码']
}, {
  id: 30,
  title: '"AI数字人"项目诈骗',
  summary: '某科技公司以招募"AI数字人模特"为名，要求应聘者录制多角度视频和声音素材，承诺每次使用付费，实际素材被用于各种商业用途，从未支付任何费用。',
  type: '数字人诈骗',
  date: '2025-03-08',
  warning_signs: ['要求录制个人影像', '承诺使用付费', '合同条款模糊', '肖像权无保障']
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