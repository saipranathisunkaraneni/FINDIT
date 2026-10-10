import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useFindIt } from '../../context';
import { Search, Bell, Shield, ChevronDown } from 'lucide-react';

const CAMPUS_OPTIONS = [
  'KITSW (Main Campus)',
  'KITSW (Academic Blocks & Labs)',
  'KITSW (Central Library & Admin)',
  'KITSW (Hostels & Canteen)',
  'KITSW (Sports Complex)',
];

export const Header: React.FC = () => {
  const { unreadNotifsCount, currentUser, updateCampus, matches } = useFindIt();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#E5E2D9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand & Campus Options Dropdown */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#174B3A] text-[#FFFEFA] flex items-center justify-center font-serif text-sm font-bold shadow-xs group-hover:bg-[#10372D] transition-colors">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#242923]">
              findit
            </span>
          </Link>

          {/* KITSW Campus Options Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={currentUser.campus}
              onChange={(e) => updateCampus(e.target.value)}
              className="appearance-none bg-[#FFFEFA] border border-[#E5E2D9] hover:border-[#174B3A] text-[#174B3A] text-xs font-semibold rounded-full pl-3 pr-7 py-1.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#174B3A]/20 cursor-pointer transition-all"
              aria-label="Select Campus Option"
            >
              {CAMPUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#174B3A] absolute right-2.5 pointer-events-none stroke-[2.5]" />
          </div>
        </div>

        {/* Center: Desktop Navigation Links (Responsive, not thin) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Desktop Navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors hover:text-[#174B3A] ${
                isActive ? 'text-[#174B3A] font-semibold' : 'text-[#72766F]'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/browse"
            className={({ isActive }) =>
              `transition-colors hover:text-[#174B3A] ${
                isActive ? 'text-[#174B3A] font-semibold' : 'text-[#72766F]'
              }`
            }
          >
            Browse
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#174B3A] text-white shadow-xs'
                  : 'bg-[#EBF2ED] text-[#174B3A] hover:bg-[#dce7d8]'
              }`
            }
          >
            + Report Item
          </NavLink>
          <NavLink
            to="/matches"
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 transition-colors hover:text-[#174B3A] ${
                isActive ? 'text-[#174B3A] font-semibold' : 'text-[#72766F]'
              }`
            }
          >
            <span>Matches</span>
            {matches.length > 0 && (
              <span className="bg-[#174B3A] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {matches.length}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/my-activity"
            className={({ isActive }) =>
              `transition-colors hover:text-[#174B3A] ${
                isActive ? 'text-[#174B3A] font-semibold' : 'text-[#72766F]'
              }`
            }
          >
            My Activity
          </NavLink>
        </nav>

        {/* Right Section: Admin, Notifications & Avatar */}
        <div className="flex items-center gap-2">
          {/* Admin Demo entry */}
          <Link
            to="/admin"
            className="p-2 rounded-xl text-[#72766F] hover:text-[#174B3A] hover:bg-[#EBF2ED] transition-colors"
            title="Campus Coordinator Admin"
            aria-label="Admin Demo"
          >
            <Shield className="w-4.5 h-4.5 text-[#174B3A]" />
          </Link>

          {/* Notifications Icon */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-xl text-[#72766F] hover:text-[#242923] hover:bg-[#FFFEFA] transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C62828] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </Link>

          {/* User Profile Avatar */}
          <Link
            to="/my-activity"
            className="w-8 h-8 rounded-full bg-[#174B3A] text-[#FFFEFA] flex items-center justify-center text-xs font-semibold shadow-xs select-none hover:bg-[#10372D] transition-colors ml-1"
            title="My Activity Profile"
          >
            {currentUser.avatarLetter}
          </Link>
        </div>
      </div>
    </header>
  );
};
