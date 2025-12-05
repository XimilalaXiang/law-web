import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

const Home = lazy(() => import('./pages/Home'));
const CaseLibrary = lazy(() => import('./pages/CaseLibrary'));
const AntiScamGuide = lazy(() => import('./pages/AntiScamGuide'));

// Loading component with dark theme
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin mx-auto mb-4" />
      <p className="font-mono text-sm text-white/40">页面加载中...</p>
    </div>
  </div>
);

export function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
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
  );
}
