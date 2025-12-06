import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import { AuthProvider } from './contexts/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const CaseLibrary = lazy(() => import('./pages/CaseLibrary'));
const AntiScamGuide = lazy(() => import('./pages/AntiScamGuide'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Auth = lazy(() => import('./pages/Auth'));

// Loading component with dark theme
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin mx-auto mb-4" />
      <p className="font-mono text-sm text-white/40">页面加载中...</p>
    </div>
  </div>
);

// 布局组件 - 根据路由决定是否显示 Navbar 和 Footer
const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Auth 页面不显示 Navbar */}
      {!isAuthPage && <Navbar />}
      
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cases" element={<CaseLibrary />} />
                <Route path="/guide" element={<AntiScamGuide />} />
                <Route path="/quiz" element={<Quiz />} />
            <Route path="/auth" element={<Auth />} />
              </Routes>
            </Suspense>
          </main>
      
      {/* Auth 页面不显示 Footer */}
      {!isAuthPage && <Footer />}
          
      {/* AI防骗助手 - 全局悬浮（Auth页面也显示） */}
          <AIAssistant />
        </div>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
      </Router>
  );
}
