import React, { useState } from 'react';
import { ShieldCheckIcon, AlertCircleIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, PhoneCallIcon, DollarSignIcon, BuildingIcon, BriefcaseIcon, MessageCircleIcon, CheckIcon } from 'lucide-react';
import NeumorphicEmergencyPanel from '../components/NeumorphicEmergencyPanel';
import NeumorphicProtectionPanel from '../components/NeumorphicProtectionPanel';
// Define warning categories and their content
const warningCategories = [{
  id: 'financial',
  title: '金钱相关预警',
  icon: DollarSignIcon,
  color: 'red',
  bgPattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FEE2E2' fill-opacity='0.7'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  warnings: ['要求预先支付培训费、押金、材料费等', '承诺不合理的高薪或回报', '要求使用个人银行账户进行资金周转', '以任何理由索要银行卡信息或转账']
}, {
  id: 'company',
  title: '公司背景预警',
  icon: BuildingIcon,
  color: 'amber',
  bgPattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FEF3C7' fill-opacity='0.7'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  warnings: ['公司信息模糊，无法在官方渠道查证', '工作地点频繁变更或在非正规场所', '招聘信息过于简单，缺少具体岗位描述', '只提供手机联系方式，无固定电话或邮箱']
}, {
  id: 'process',
  title: '招聘流程预警',
  icon: BriefcaseIcon,
  color: 'purple',
  bgPattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F3E8FF' fill-opacity='0.7'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  warnings: ['无需面试或简单聊天后立即录用', '要求提供过多的个人敏感信息', '急切催促做决定，制造紧迫感', '招聘信息长期存在，不限招聘人数']
}, {
  id: 'communication',
  title: '沟通方式预警',
  icon: MessageCircleIcon,
  color: 'blue',
  bgPattern: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DBEAFE' fill-opacity='0.7'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  warnings: ['只通过非正规渠道如个人社交账号联系', '拒绝视频面试或当面交流', '邮件地址使用免费邮箱而非企业邮箱', '要求添加私人社交账号并发送敏感信息']
}];
// Warning Chip component
const WarningChip = ({
  text,
  checked,
  onToggle
}) => {
  return <div className={`
        flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer
        ${checked ? 'bg-blue-100 border-blue-300 shadow-sm' : 'bg-white border-gray-200 hover:shadow-md hover:-translate-y-1'}
        border mb-3
      `} onClick={onToggle}>
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0
        ${checked ? 'bg-blue-500' : 'bg-gray-100'}
      `}>
        {checked ? <CheckIcon className="h-4 w-4 text-white" /> : <XCircleIcon className="h-4 w-4 text-gray-400" />}
      </div>
      <span className={`text-sm ${checked ? 'text-blue-800 font-medium' : 'text-gray-600'}`}>
        {text}
      </span>
    </div>;
};
const AntiScamGuide = () => {
  // State to track which warnings have been reviewed
  const [reviewedWarnings, setReviewedWarnings] = useState({});
  // Toggle the reviewed state of a warning
  const toggleWarning = (categoryId, index) => {
    setReviewedWarnings(prev => {
      const key = `${categoryId}-${index}`;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };
  // Calculate progress
  const calculateProgress = () => {
    const totalWarnings = warningCategories.reduce((sum, category) => sum + category.warnings.length, 0);
    const reviewedCount = Object.values(reviewedWarnings).filter(Boolean).length;
    return {
      percentage: Math.round(reviewedCount / totalWarnings * 100),
      reviewed: reviewedCount,
      total: totalWarnings
    };
  };
  const progress = calculateProgress();
  // Color mapping
  const colorMap = {
    red: {
      accent: 'bg-red-500',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      progressBg: 'bg-red-100',
      progressFill: 'bg-red-500'
    },
    amber: {
      accent: 'bg-amber-500',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      progressBg: 'bg-amber-100',
      progressFill: 'bg-amber-500'
    },
    purple: {
      accent: 'bg-purple-500',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
      progressBg: 'bg-purple-100',
      progressFill: 'bg-purple-500'
    },
    blue: {
      accent: 'bg-blue-500',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      progressBg: 'bg-blue-100',
      progressFill: 'bg-blue-500'
    }
  };
  return <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Hero Section with Card Design */}
        <div className="relative mx-auto max-w-4xl">
          {/* Floating Shield Icon */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse-slow border-4 border-blue-100">
              <ShieldCheckIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          {/* Card Container with Mesh Gradient */}
          <div className="relative rounded-xl overflow-hidden shadow-xl border border-white/15 backdrop-blur-sm">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-80"></div>
            {/* Animated Particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="particles-container">
                {/* Circles */}
                <div className="particle circle-particle top-1/4 left-1/5"></div>
                <div className="particle circle-particle top-3/4 right-1/4"></div>
                <div className="particle circle-particle bottom-1/3 left-1/3"></div>
                {/* Squares */}
                <div className="particle square-particle top-1/3 right-1/5"></div>
                <div className="particle square-particle bottom-1/4 left-1/4"></div>
                {/* Triangles */}
                <div className="particle triangle-particle top-2/3 right-1/3"></div>
                <div className="particle triangle-particle bottom-1/2 left-1/2"></div>
              </div>
            </div>
            {/* Content */}
            <div className="relative px-6 py-10 flex flex-col items-center text-center z-10">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl drop-shadow-md mt-6">
                大学生求职防骗攻略
              </h1>
              <div className="w-24 h-1 bg-white/30 rounded-full my-6"></div>
              <p className="max-w-2xl text-lg text-blue-50 leading-relaxed">
                掌握这些防骗技巧，让你的求职之路更加安全顺畅
              </p>
              {/* Glass-morphic Button Container */}
              <div className="mt-10 bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20 shadow-inner flex">
                <a href="#warnings" className="group bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 flex items-center mr-2">
                  查看预警信号
                  <AlertTriangleIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#strategies" className="group bg-white text-blue-500 hover:bg-blue-50 rounded-full px-6 py-3 text-sm font-medium shadow-md transition-all duration-300 flex items-center">
                  防护策略
                  <ShieldCheckIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Introduction Card */}
        <div className="relative -mt-12 mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="px-6 py-6 sm:px-8 sm:py-7 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-xl p-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="ml-4 text-xl font-bold text-gray-900">
                  防骗指南简介
                </h2>
              </div>
            </div>
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <p className="text-gray-600 leading-relaxed text-lg">
                在求职过程中，大学生由于经验不足和急切就业的心态，容易成为诈骗分子的目标。本攻略整合了常见的求职诈骗手段和防范措施，帮助大学生提高警惕，安全求职。
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-blue-600 font-semibold text-xl mb-1">
                    100+
                  </div>
                  <div className="text-blue-700 text-sm">真实案例分析</div>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <div className="text-indigo-600 font-semibold text-xl mb-1">
                    20+
                  </div>
                  <div className="text-indigo-700 text-sm">防骗策略</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-purple-600 font-semibold text-xl mb-1">
                    1000+
                  </div>
                  <div className="text-purple-700 text-sm">学生受益</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Warning Signs Section */}
        <div id="warnings" className="mt-24 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              
              <h2 className="text-3xl font-bold text-gray-900">
                求职诈骗预警信号
              </h2>
              <p className="mt-3 text-gray-500 max-w-2xl">
                检查并了解这些预警信号，提高你的求职安全意识，远离求职陷阱
              </p>
            </div>
            <div className="mt-6 sm:mt-0">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700">
                <span className="text-xs font-medium mr-1.5">完成度</span>
                <span className="text-sm font-semibold">
                  {progress.percentage}%
                </span>
              </div>
            </div>
          </div>
          {/* Progress tracker - Redesigned */}
          <div className="mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md p-8 border border-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="inline-block w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 text-sm">
                  <CheckIcon className="h-4 w-4" />
                </span>
                预警信号学习进度
              </h3>
              <div className="mt-4 sm:mt-0 flex items-center">
                <span className="text-gray-500 text-sm mr-3">已学习</span>
                <div className="bg-white rounded-full px-3 py-1 shadow-sm border border-gray-200">
                  <span className="font-mono text-blue-600 font-semibold">
                    {progress.reviewed}
                  </span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="font-mono text-gray-600">
                    {progress.total}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-3 bg-white rounded-full shadow-inner overflow-hidden border border-gray-200">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out" style={{
                width: `${progress.percentage}%`
              }}></div>
              </div>
              {/* Progress markers */}
              <div className="mt-2 flex justify-between">
                <div className="text-xs text-gray-500">0%</div>
                <div className="text-xs text-gray-500">25%</div>
                <div className="text-xs text-gray-500">50%</div>
                <div className="text-xs text-gray-500">75%</div>
                <div className="text-xs text-gray-500">100%</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                继续学习预警信号，提高你的求职安全意识
              </p>
            </div>
          </div>
          {/* Warning cards grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {warningCategories.map(category => <div key={category.id} className="group bg-white overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl relative" style={{
            backgroundImage: category.bgPattern
          }}>
                {/* Accent color bar */}
                <div className={`h-1.5 w-full ${colorMap[category.color].accent}`}></div>
                <div className="px-7 py-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-xl ${colorMap[category.color].iconBg} flex items-center justify-center mr-4 transition-transform duration-300 group-hover:scale-110`}>
                      <category.icon className={`h-6 w-6 ${colorMap[category.color].iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {category.title}
                      </h3>
                      <div className="mt-1 text-xs text-gray-500">
                        点击下方选项以标记为已学习
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-7 py-7">
                  <div className="space-y-3">
                    {category.warnings.map((warning, index) => <WarningChip key={index} text={warning} checked={reviewedWarnings[`${category.id}-${index}`] || false} onToggle={() => toggleWarning(category.id, index)} />)}
                  </div>
                  {/* Category progress indicator */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>类别学习进度</span>
                      <div className="flex items-center">
                        <span className="font-medium text-sm text-gray-700">
                          {category.warnings.filter((_, index) => reviewedWarnings[`${category.id}-${index}`]).length}
                        </span>
                        <span className="mx-1">/</span>
                        <span>{category.warnings.length}</span>
                      </div>
                    </div>
                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`absolute top-0 left-0 h-full ${colorMap[category.color].progressFill} transition-all duration-500 ease-out`} style={{
                    width: `${category.warnings.filter((_, index) => reviewedWarnings[`${category.id}-${index}`]).length / category.warnings.length * 100}%`
                  }}></div>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        {/* Protection Strategies */}
        <div id="strategies" className="mt-24 scroll-mt-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              安全策略
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              求职安全防护策略
            </h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              采用这些策略来保护自己，确保求职过程安全无忧
            </p>
          </div>
          {/* Replace the old protection strategies section with the new neumorphic panel */}
          <NeumorphicProtectionPanel />
        </div>
        {/* Emergency Response - Replaced with Neumorphic Panel */}
        <div className="mt-24">
          <NeumorphicEmergencyPanel />
        </div>
        {/* Placeholder for future content */}
        <div className="mt-20 text-center">
          
        </div>
      </div>
    </div>;
};
export default AntiScamGuide;