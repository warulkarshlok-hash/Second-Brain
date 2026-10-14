import React, { useState } from 'react';
import { useBrain } from '../context/BrainContext.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { FilterBar } from '../components/content/FilterBar.jsx';
import { ContentGrid } from '../components/content/ContentGrid.jsx';
import { ContentModal } from '../components/content/ContentModal.jsx';
import { ContentDetailModal } from '../components/content/ContentDetailModal.jsx';
import { DeleteConfirmModal } from '../components/content/DeleteConfirmModal.jsx';
import { AskBrainModal } from '../components/ai/AskBrainModal.jsx';
import { CommandPalette } from '../components/layout/CommandPalette.jsx';
import { ToastContainer } from '../components/common/Toast.jsx';
import { AdminPage } from './AdminPage.jsx';

export const DashboardPage = () => {
  const { activeView } = useBrain();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar openMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeView === 'admin' ? (
            <AdminPage />
          ) : (
            <>
              <FilterBar />
              <ContentGrid />
            </>
          )}
        </main>
      </div>

      {/* Modals & Overlays */}
      <ContentModal />
      <ContentDetailModal />
      <DeleteConfirmModal />
      <AskBrainModal />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};
