import React from 'react';
import { PhoneCallIcon } from 'lucide-react';
const NeumorphicEmergencyPanel = () => {
  return <div className="relative bg-red-50 dark:bg-red-950/30 rounded-3xl p-8 shadow-[20px_20px_60px_rgba(255,226,226,0.5),-20px_-20px_60px_rgba(255,255,255,0.8)] dark:shadow-[20px_20px_60px_rgba(0,0,0,0.3),-20px_-20px_60px_rgba(75,85,99,0.1)] border border-red-100 dark:border-red-900/50 transition-all duration-300 hover:shadow-[15px_15px_30px_rgba(255,226,226,0.6),-15px_-15px_30px_rgba(255,255,255,0.9)] dark:hover:shadow-[15px_15px_30px_rgba(0,0,0,0.4),-15px_-15px_30px_rgba(75,85,99,0.2)]">
      {/* Header with pill-shaped embossed effect */}
      <div className="flex items-center mb-8">
        <div className="flex items-center bg-red-50 dark:bg-red-950/30 rounded-full py-3 px-6 shadow-[inset_3px_3px_6px_rgba(178,15,15,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-3px_-3px_6px_rgba(75,85,99,0.1)] border border-red-100 dark:border-red-900/50">
          <div className="mr-4 w-12 h-12 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-950/30 shadow-[-3px_-3px_7px_rgba(255,255,255,0.7),3px_3px_5px_rgba(178,15,15,0.1)] dark:shadow-[-3px_-3px_7px_rgba(75,85,99,0.1),3px_3px_5px_rgba(0,0,0,0.3)]">
            <PhoneCallIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-red-800 dark:text-red-300">遇到诈骗怎么办？</h3>
        </div>
      </div>
      {/* Content container with soft inner shadow */}
      <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-6 shadow-[inset_4px_4px_8px_rgba(178,15,15,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(75,85,99,0.1)] border border-red-100 dark:border-red-900/50">
        <p className="text-red-700 dark:text-red-300 text-lg font-medium mb-8">
          如果你不幸遇到求职诈骗，请立即采取以下措施：
        </p>
        <ol className="space-y-6">
          {['立即停止与对方的所有联系和资金往来', '保存所有通讯记录、转账凭证等证据', '向当地公安机关报案，拨打110或前往派出所', '向学校就业指导中心报告，防止更多同学受害', '拨打反诈中心热线96110寻求专业指导'].map((item, index) => <li key={index} className="group">
              <div className="flex items-start">
                {/* Number badge with concentric circles effect */}
                <div className="relative flex-shrink-0 w-10 h-10 mr-6">
                  <div className="absolute inset-0 rounded-full bg-red-50 dark:bg-red-950/30 shadow-[4px_4px_8px_rgba(178,15,15,0.15),-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(75,85,99,0.1)] group-hover:shadow-[2px_2px_4px_rgba(178,15,15,0.15),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:group-hover:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(75,85,99,0.1)] transition-all duration-300"></div>
                  <div className="absolute inset-[3px] rounded-full bg-red-50 dark:bg-red-950/30 shadow-[inset_2px_2px_4px_rgba(178,15,15,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(75,85,99,0.1)]"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-red-700 dark:text-red-300 font-bold">
                    {index + 1}
                  </div>
                </div>
                {/* Inset card with pressed effect */}
                <div className="flex-grow bg-red-50 dark:bg-red-950/30 rounded-xl py-4 px-6 shadow-[inset_3px_3px_6px_rgba(178,15,15,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-3px_-3px_6px_rgba(75,85,99,0.1)] border border-red-100 dark:border-red-900/50 group-hover:shadow-[inset_4px_4px_8px_rgba(178,15,15,0.15),inset_-2px_-2px_5px_rgba(255,255,255,0.6)] dark:group-hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(75,85,99,0.1)] group-hover:bg-red-100 dark:group-hover:bg-red-950/50 transition-all duration-300">
                  <span className="text-red-700 dark:text-red-300">{item}</span>
                </div>
              </div>
            </li>)}
        </ol>
        {/* Floating neumorphic button for emergency hotline */}
        <div className="mt-10 flex justify-center">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-red-50 dark:bg-red-950/30 rounded-full blur-md opacity-70"></div>
            <button className="relative flex items-center bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 font-medium rounded-full py-3 px-8 shadow-[4px_4px_8px_rgba(178,15,15,0.2),-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(75,85,99,0.1)] border border-red-100 dark:border-red-900/50 transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(178,15,15,0.2),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(75,85,99,0.1)] hover:translate-y-[1px] active:shadow-[inset_2px_2px_5px_rgba(178,15,15,0.15),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(75,85,99,0.1)] active:translate-y-[2px]">
              <PhoneCallIcon className="h-5 w-5 mr-3" />
              反诈热线：96110
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default NeumorphicEmergencyPanel;