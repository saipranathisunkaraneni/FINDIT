import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

export interface NavbarProps {
  campusName?: string;
  userInitial?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  campusName = 'KITSW',
  userInitial = 'S',
}) => {
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Browse', path: '/browse' },
    { label: 'Report', path: '/report' },
    { label: 'My Reports', path: '/my-reports' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F5EF]/95 backdrop-blur-xs border-b border-[#E5E2D9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Campus Badge */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#174B3A] text-[#FFFEFA] flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#242923]">
              findit
            </span>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium text-[#174B3A] bg-[#FFFEFA] border border-[#E5E2D9]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#174B3A]" />
            {campusName}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-6" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-150 px-2 py-1 rounded-md relative ${
                  isActive
                    ? 'text-[#174B3A] font-semibold'
                    : 'text-[#72766F] hover:text-[#242923]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#174B3A] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: User Profile Avatar */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full bg-[#174B3A] text-[#FFFEFA] flex items-center justify-center text-xs font-semibold shadow-xs select-none cursor-pointer hover:bg-[#10372D] transition-colors"
            title="User Profile"
          >
            {userInitial}
          </div>
        </div>
      </div>
    </header>
  );
};
