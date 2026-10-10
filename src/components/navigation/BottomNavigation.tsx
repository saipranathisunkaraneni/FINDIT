import React from 'react';
import { NavLink } from 'react-router-dom';
import { useFindIt } from '../../context';
import { Home, Compass, Plus, ArrowLeftRight, Clock } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { matches } = useFindIt();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFEFA]/95 backdrop-blur-md border-t border-[#E5E2D9] px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around w-full max-w-lg mx-auto">
        {/* 1. Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-lg transition-colors ${
              isActive ? 'text-[#174B3A] font-semibold' : 'text-[#72766F] hover:text-[#242923]'
            }`
          }
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] mt-0.5">Home</span>
        </NavLink>

        {/* 2. Browse */}
        <NavLink
          to="/browse"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-lg transition-colors ${
              isActive ? 'text-[#174B3A] font-semibold' : 'text-[#72766F] hover:text-[#242923]'
            }`
          }
        >
          <Compass className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[11px] mt-0.5">Browse</span>
        </NavLink>

        {/* 3. Report - Prominent Action */}
        <NavLink
          to="/report"
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] -mt-5 group"
          aria-label="Report lost or found item"
        >
          <div className="w-12 h-12 rounded-full bg-[#174B3A] text-[#FFFEFA] flex items-center justify-center shadow-[0_4px_12px_rgba(23,75,58,0.3)] group-active:scale-95 group-hover:bg-[#10372D] transition-all border-2 border-[#FFFEFA]">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-semibold text-[#174B3A] mt-0.5">Report</span>
        </NavLink>

        {/* 4. Matches */}
        <NavLink
          to="/matches"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-lg relative transition-colors ${
              isActive ? 'text-[#174B3A] font-semibold' : 'text-[#72766F] hover:text-[#242923]'
            }`
          }
        >
          <div className="relative">
            <ArrowLeftRight className="w-5 h-5 stroke-[1.8]" />
            {matches.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#174B3A] text-[#FFFEFA] text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
                {matches.length}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5">Matches</span>
        </NavLink>

        {/* 5. My Reports */}
        <NavLink
          to="/my-activity"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-lg transition-colors ${
              isActive ? 'text-[#174B3A] font-semibold' : 'text-[#72766F] hover:text-[#242923]'
            }`
          }
        >
          <Clock className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-0.5">My Reports</span>
        </NavLink>
      </div>
    </nav>
  );
};
