import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CaseLibrary from './pages/CaseLibrary';
import AntiScamGuide from './pages/AntiScamGuide';
import AIAssistant from './components/AIAssistant';

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cases" element={<CaseLibrary />} />
              <Route path="/guide" element={<AntiScamGuide />} />
            </Routes>
          </main>
          <Footer />
          
          {/* AI防骗助手 - 全局悬浮 */}
          <AIAssistant />
        </div>
      </Router>
    </ThemeProvider>
  );
}