import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

const Home = lazy(() => import('./pages/Home'));
const CaseLibrary = lazy(() => import('./pages/CaseLibrary'));
const AntiScamGuide = lazy(() => import('./pages/AntiScamGuide'));

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <main className="flex-grow pt-16">
            <Suspense fallback={<div className="p-6 text-center text-gray-500 dark:text-gray-400">页面加载中…</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cases" element={<CaseLibrary />} />
                <Route path="/guide" element={<AntiScamGuide />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          
          {/* AI防骗助手 - 全局悬浮 */}
          <AIAssistant />
        </div>
      </Router>
    </ThemeProvider>
  );
}
