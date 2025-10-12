import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, HeartIcon } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center">
              <div className="bg-blue-50 p-2 rounded-full">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">
                SafeCareer
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500 text-center md:text-left">
              保护大学生求职安全，远离就业诈骗
            </p>
          </div>
          <div className="flex justify-center">
            <p className="text-sm text-gray-500 flex items-center">
              <span>用</span>
              <HeartIcon className="h-4 w-4 text-red-400 mx-1" />
              <span>守护每一位学生的职业梦想</span>
            </p>
          </div>
          <div className="flex justify-center md:justify-end space-x-6">
            <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm">
              首页
            </Link>
            <Link to="/cases" className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm">
              案例库
            </Link>
            <Link to="/guide" className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm">
              防骗攻略
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} SafeCareer.
            保护你的求职安全，从这里开始。
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;