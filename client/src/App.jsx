import React from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AppAuthProvider, useAppAuth } from './context/AuthContext.jsx';
import { BrainProvider } from './context/BrainContext.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { Brain, Loader2 } from 'lucide-react';

const MainContent = () => {
  const { isAuthenticated, isLoading } = useAppAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/25 animate-bounce">
          <Brain className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
          <span>Synchronizing Second Brain...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <BrainProvider>
      <DashboardPage />
    </BrainProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppAuthProvider>
        <MainContent />
      </AppAuthProvider>
    </ThemeProvider>
  );
}
