import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFindIt } from '../context';
import { ItemCard } from '../components/common/ItemCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Search,
  Tag,
  Package,
  ArrowLeftRight,
  ArrowRight,
  ShieldCheck,
  CameraOff,
  Bell,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { reports, matches, unreadNotifsCount } = useFindIt();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const recentReports = reports
    .filter((r) => r.status !== 'resolved' && r.status !== 'hidden')
    .slice(0, 6);

  const topMatch = matches[0];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* 1. Top Greeting & Headline */}
      <section className="space-y-3 pt-1 sm:pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#174B3A] bg-[#DCE7D8] border border-[#cfdccb]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#174B3A]" />
            <span>Campus Lost & Found • Photo-Optional SmartMatch</span>
          </div>

          {unreadNotifsCount > 0 && (
            <button
              type="button"
              onClick={() => navigate('/notifications')}
              className="inline-flex items-center gap-1.5 text-xs text-[#174B3A] bg-[#EBF2ED] px-2.5 py-1 rounded-full font-medium hover:bg-[#dce7d8] transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{unreadNotifsCount} new alert(s)</span>
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#242923] tracking-tight leading-[1.15]">
            Lost something? <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#174B3A]">Let's find it.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#72766F] max-w-xl leading-relaxed">
            Report what you lost or found—with or without a photo. FINDIT uses attribute-based SmartMatch
            to connect matching campus reports.
          </p>
        </div>

        {/* 2. Functional Search Bar */}
        <form onSubmit={handleSearchSubmit} className="pt-2">
          <div className="relative flex items-center max-w-2xl bg-[#FFFFFF] border border-[#E5E2D9] rounded-xl sm:rounded-2xl shadow-[0_2px_8px_-2px_rgba(36,41,35,0.06)] focus-within:ring-2 focus-within:ring-[#174B3A]/20 focus-within:border-[#174B3A] transition-all p-1.5 sm:p-2">
            <div className="pl-3 pr-2 text-[#72766F] pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Search by item, color, or location (e.g. "Casio calculator", "purple lanyard", "wallet")...'
              className="w-full bg-transparent text-sm sm:text-base text-[#242923] placeholder-[#9CA099] focus:outline-none px-2 py-2"
            />
            <Button type="submit" variant="primary" size="md" className="shrink-0 rounded-lg sm:rounded-xl">
              Search
            </Button>
          </div>
        </form>
      </section>

      {/* 3. Action Cards: Report Lost & Report Found - Responsive Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Report Lost Action */}
        <div
          onClick={() => navigate('/report?mode=lost')}
          className="group relative bg-[#174B3A] text-[#FFFEFA] rounded-2xl p-5 shadow-[0_4px_16px_rgba(23,75,58,0.15)] cursor-pointer hover:bg-[#10372D] active:scale-[0.99] transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFFEFA]/12 flex items-center justify-center text-[#FFFEFA] shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
              <Tag className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] tracking-wider font-semibold uppercase text-[#DCE7D8]">
                Photo Optional
              </span>
              <h2 className="text-xl font-serif font-bold text-[#FFFEFA] mt-0.5">Report Lost</h2>
              <p className="text-xs text-[#FFFEFA]/95 mt-0.5 font-normal">
                Describe your item in detail to find potential matches
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Report Found Action */}
        <div
          onClick={() => navigate('/report?mode=found')}
          className="group relative bg-[#FFFEFA] text-[#242923] border border-[#E5E2D9] rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_-2px_rgba(36,41,35,0.06)] cursor-pointer hover:bg-[#FAF8F2] hover:border-[#D4CFC3] active:scale-[0.99] transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EBF2ED] flex items-center justify-center text-[#174B3A] shrink-0 border border-[#174B3A]/10 group-hover:scale-105 transition-transform">
              <Package className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] tracking-wider font-semibold uppercase text-[#72766F]">
                Help a Peer
              </span>
              <h2 className="text-xl font-serif font-bold text-[#242923] mt-0.5">Report Found</h2>
              <p className="text-xs text-[#72766F] mt-0.5">
                Upload a photo or enter details of what you found
              </p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#F2EFE7] flex items-center justify-center text-[#72766F] group-hover:text-[#174B3A] group-hover:translate-x-1 transition-all shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* 4. Concise Potential Matches Banner */}
      {topMatch && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-[#174B3A]" />
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#242923]">
                SmartMatch Candidate Found
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/matches')}
              className="text-xs font-semibold text-[#174B3A] hover:underline cursor-pointer"
            >
              See all matches ({matches.length}) →
            </button>
          </div>

          <div
            onClick={() => navigate('/matches')}
            className="bg-[#FFFEFA] border border-[#174B3A]/30 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="match"
                  className={
                    topMatch.tier === 'strong' ? 'bg-[#174B3A] text-white' : 'bg-[#DCE7D8] text-[#10372D]'
                  }
                >
                  {topMatch.score}% Score • {topMatch.tier.toUpperCase()} CANDIDATE
                </Badge>
                <span className="text-xs text-[#72766F]">• {topMatch.lostItem.location}</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#242923]">
                  "{topMatch.lostItem.title}" ↔ "{topMatch.foundItem.title}"
                </h3>
                <p className="text-xs text-[#72766F] mt-0.5 line-clamp-1">
                  {topMatch.explanationSummary}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Compare Reports
            </Button>
          </div>
        </section>
      )}

      {/* 5. Compact List of Recent Reports */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#242923]">
              Recently Reported
            </h2>
            <p className="text-xs text-[#72766F]">Active campus lost and found items</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/browse')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Browse all ({reports.filter((r) => r.status !== 'resolved' && r.status !== 'hidden').length})
          </Button>
        </div>

        {recentReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentReports.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-8 text-center space-y-3">
            <Package className="w-10 h-10 text-[#9CA099] mx-auto stroke-1" />
            <h3 className="font-serif font-bold text-base text-[#242923]">No active reports</h3>
            <p className="text-xs text-[#72766F] max-w-sm mx-auto">
              Be the first to log a lost or found item on campus.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/report')}>
              Create Report
            </Button>
          </div>
        )}
      </section>

      {/* 6. Honest Security & Photo-Optional Banner */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E2D9]">
        <div className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] flex items-start gap-3 text-xs text-[#72766F]">
          <CameraOff className="w-4 h-4 text-[#174B3A] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#242923]">No Photo Required:</strong> Students can describe
            items with color, marks, and location. SmartMatch attributes ensure full matching coverage.
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] flex items-start gap-3 text-xs text-[#72766F]">
          <ShieldCheck className="w-4 h-4 text-[#174B3A] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#242923]">Private Verification:</strong> Private marks stay
            confidential until in-person verification with campus coordinators.
          </div>
        </div>
      </section>
    </div>
  );
};
