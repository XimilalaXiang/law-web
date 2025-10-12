import { ShieldCheckIcon, BuildingIcon, BriefcaseIcon, DollarSignIcon, MessageCircleIcon, AlertCircleIcon } from 'lucide-react';

type ColorKey = 'green' | 'blue' | 'purple' | 'amber' | 'indigo' | 'rose';

const NeumorphicProtectionPanel = () => {
  const strategies: Array<{
    icon: typeof BuildingIcon;
    color: ColorKey;
    title: string;
    content: string;
  }> = [{
    icon: BuildingIcon,
    color: 'green',
    title: '公司背景调查',
    content: '通过官方企业信用信息网站查询公司注册信息，搜索公司口碑和评价，查看公司官网和社交媒体是否专业。'
  }, {
    icon: ShieldCheckIcon,
    color: 'blue',
    title: '保护个人信息',
    content: '不轻易提供身份证、银行卡等敏感信息，面试阶段只需提供基本联系方式和教育背景，入职后再提供必要证件。'
  }, {
    icon: BriefcaseIcon,
    color: 'purple',
    title: '使用正规求职平台',
    content: '选择知名的招聘网站和学校就业指导中心推荐的招聘信息，避免来路不明的招聘信息。'
  }, {
    icon: DollarSignIcon,
    color: 'amber',
    title: '警惕金钱要求',
    content: '正规企业不会要求应聘者预先支付费用，任何要求付款的招聘信息都应保持高度警惕。'
  }, {
    icon: MessageCircleIcon,
    color: 'indigo',
    title: '咨询求职顾问',
    content: '遇到可疑情况时，及时咨询学校就业指导中心或有经验的职场人士，获取专业意见。'
  }, {
    icon: AlertCircleIcon,
    color: 'rose',
    title: '保留证据',
    content: '保存所有沟通记录、招聘信息和合同文件，一旦发现问题，可作为举报证据。'
  }];
  
  // Color mapping for icon backgrounds
  const colorMap: Record<ColorKey, string> = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    amber: 'text-amber-600',
    indigo: 'text-indigo-600',
    rose: 'text-rose-600'
  };
  return <div className="relative bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-[20px_20px_60px_rgba(249,250,251,0.5),-20px_-20px_60px_rgba(255,255,255,0.8)] dark:shadow-[20px_20px_60px_rgba(0,0,0,0.3),-20px_-20px_60px_rgba(75,85,99,0.2)] border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-[15px_15px_30px_rgba(249,250,251,0.6),-15px_-15px_30px_rgba(255,255,255,0.9)] dark:hover:shadow-[15px_15px_30px_rgba(0,0,0,0.4),-15px_-15px_30px_rgba(75,85,99,0.3)]">
      {/* Header with pill-shaped embossed effect */}
      <div className="flex items-center mb-8">
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-full py-3 px-6 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.05),inset_-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-3px_-3px_6px_rgba(75,85,99,0.2)] border border-gray-100 dark:border-gray-700">
          <div className="mr-4 w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 shadow-[-3px_-3px_7px_rgba(255,255,255,0.7),3px_3px_5px_rgba(0,0,0,0.05)] dark:shadow-[-3px_-3px_7px_rgba(75,85,99,0.2),3px_3px_5px_rgba(0,0,0,0.3)]">
            <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">如何保护自己</h3>
        </div>
      </div>
      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((strategy, index) => <div key={index} className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.8)] dark:shadow-[5px_5px_15px_rgba(0,0,0,0.3),-5px_-5px_15px_rgba(75,85,99,0.2)] border border-gray-100 dark:border-gray-600 transition-all duration-300 hover:shadow-[3px_3px_10px_rgba(0,0,0,0.06),-3px_-3px_10px_rgba(255,255,255,0.8)] dark:hover:shadow-[3px_3px_10px_rgba(0,0,0,0.4),-3px_-3px_10px_rgba(75,85,99,0.3)] group">
            <div className="flex items-start">
              <div className="relative flex-shrink-0 mr-5">
                {/* Outer circle with shadow */}
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-[4px_4px_8px_rgba(0,0,0,0.05),-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(75,85,99,0.2)] flex items-center justify-center group-hover:shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.8)] dark:group-hover:shadow-[2px_2px_5px_rgba(0,0,0,0.3),-2px_-2px_5px_rgba(75,85,99,0.2)] transition-all duration-300">
                  {/* Inner colored circle */}
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.03),inset_-2px_-2px_4px_rgba(255,255,255,0.6)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(75,85,99,0.2)]">
                    <strategy.icon className={`h-4 w-4 ${colorMap[strategy.color]}`} />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {strategy.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {strategy.content}
                </p>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
export default NeumorphicProtectionPanel;