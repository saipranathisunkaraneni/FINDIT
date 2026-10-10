import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/navigation/Header';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { ToastContainer } from '../components/common/ToastContainer';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242923] flex flex-col antialiased selection:bg-[#DCE7D8] selection:text-[#10372D]">
      {/* Top Application Header with Campus Selector */}
      <Header />

      {/* Main Responsive Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (Visible on mobile/portrait screens, hidden on desktop) */}
      <BottomNavigation />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
