import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFindIt } from '../context';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  ArrowLeftRight,
  ArrowRight,
  Info,
  MapPin,
  CameraOff,
} from 'lucide-react';

export const MatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const { matches, currentUser } = useFindIt();
  const [filterMode, setFilterMode] = useState<'all' | 'my'>('all');

  const displayedMatches = matches.filter((m) => {
    if (filterMode === 'my') {
      return (
        m.lostItem.ownerId === currentUser.id ||
        m.foundItem.ownerId === currentUser.id
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Title & Explainer */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#174B3A] bg-[#DCE7D8] border border-[#cfdccb] mb-2">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Explainable SmartMatch Engine</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#242923]">
              Suggested Match Pairs
            </h1>
            <p className="text-xs sm:text-sm text-[#72766F] mt-1">
              Cross-correlating Lost and Found reports with or without photographs using attribute analysis.
            </p>
          </div>

          {/* Filter Mode */}
          <div className="inline-flex p-1 bg-[#FAF8F2] border border-[#E5E2D9] rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#174B3A] text-white shadow-2xs'
                  : 'text-[#72766F] hover:text-[#242923]'
              }`}
            >
              All Matches ({matches.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('my')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterMode === 'my'
                  ? 'bg-[#174B3A] text-white shadow-2xs'
                  : 'text-[#72766F] hover:text-[#242923]'
              }`}
            >
              My Reports Only
            </button>
          </div>
        </div>

        {/* Algorithm Weights Banner */}
        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#242923] uppercase tracking-wider">
            <Info className="w-4 h-4 text-[#174B3A]" />
            <span>Configurable SmartMatch Scoring Weights</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9]/70 space-y-0.5">
              <span className="font-bold text-[#174B3A] text-sm">35%</span>
              <p className="text-[#242923] font-medium">Description</p>
              <p className="text-[10px] text-[#72766F]">Keywords & features</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9]/70 space-y-0.5">
              <span className="font-bold text-[#174B3A] text-sm">25%</span>
              <p className="text-[#242923] font-medium">Category</p>
              <p className="text-[10px] text-[#72766F]">Class & item name</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9]/70 space-y-0.5">
              <span className="font-bold text-[#174B3A] text-sm">15%</span>
              <p className="text-[#242923] font-medium">Color</p>
              <p className="text-[10px] text-[#72766F]">Tonal agreement</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9]/70 space-y-0.5">
              <span className="font-bold text-[#174B3A] text-sm">15%</span>
              <p className="text-[#242923] font-medium">Location</p>
              <p className="text-[10px] text-[#72766F]">Campus facility</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9]/70 space-y-0.5 col-span-2 sm:col-span-1">
              <span className="font-bold text-[#174B3A] text-sm">10%</span>
              <p className="text-[#242923] font-medium">Date</p>
              <p className="text-[10px] text-[#72766F]">0–7 days proximity</p>
            </div>
          </div>

          <p className="text-[11px] text-[#72766F] italic">
            * Note: Similarity score is an explainable discovery guide, not proof of ownership. Missing photographs never penalize score calculation.
          </p>
        </div>
      </div>

      {/* Matches List */}
      {displayedMatches.length > 0 ? (
        <div className="space-y-6">
          {displayedMatches.map((match) => (
            <div
              key={match.id}
              className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-4 sm:p-6 shadow-xs space-y-5"
            >
              {/* Header with Score & Tier */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E2D9] pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                      match.tier === 'strong'
                        ? 'bg-[#174B3A] text-white'
                        : match.tier === 'moderate'
                        ? 'bg-[#DCE7D8] text-[#10372D] border border-[#cfdccb]'
                        : 'bg-[#F2EFE7] text-[#242923]'
                    }`}
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>{match.score}% Score • {match.tier.toUpperCase()} CANDIDATE</span>
                  </div>

                  <span className="text-xs text-[#72766F]">
                    Category: <strong className="text-[#242923]">{match.lostItem.category}</strong>
                  </span>
                </div>

                <div className="text-xs text-[#72766F]">
                  Lost: {match.lostItem.incidentDate} • Found: {match.foundItem.incidentDate}
                </div>
              </div>

              {/* Natural-Language Explanation Summary */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] text-xs leading-relaxed text-[#242923]">
                <strong className="text-[#174B3A] uppercase tracking-wide block mb-1">
                  Why these reports match:
                </strong>
                <p>{match.explanationSummary}</p>
              </div>

              {/* Side-by-Side (Desktop) / Stacked (Mobile) Item Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* Lost Item */}
                <div
                  onClick={() => navigate(`/item/${match.lostItem.id}`)}
                  className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] hover:border-[#174B3A] transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="lost">Lost Report</Badge>
                      <span className="text-[11px] text-[#72766F]">By {match.lostItem.ownerName}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#242923] group-hover:text-[#174B3A] transition-colors">
                      {match.lostItem.title}
                    </h3>
                    <p className="text-xs text-[#72766F] line-clamp-2 leading-relaxed">
                      {match.lostItem.description}
                    </p>

                    <div className="flex flex-wrap gap-1 text-[11px] pt-1">
                      {match.lostItem.color && (
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E5E2D9] text-[#242923]">
                          Color: {match.lostItem.color}
                        </span>
                      )}
                      {!match.lostItem.image && (
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E5E2D9] text-[#72766F] flex items-center gap-1">
                          <CameraOff className="w-3 h-3" /> No Photo
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E2D9]/70 flex items-center justify-between text-xs text-[#72766F]">
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-[#174B3A]" /> {match.lostItem.location}
                    </span>
                    <span className="text-[#174B3A] font-semibold text-xs">View Report →</span>
                  </div>
                </div>

                {/* Found Item */}
                <div
                  onClick={() => navigate(`/item/${match.foundItem.id}`)}
                  className="p-4 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] hover:border-[#174B3A] transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="found">Found Report</Badge>
                      <span className="text-[11px] text-[#72766F]">By {match.foundItem.ownerName}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#242923] group-hover:text-[#174B3A] transition-colors">
                      {match.foundItem.title}
                    </h3>
                    <p className="text-xs text-[#72766F] line-clamp-2 leading-relaxed">
                      {match.foundItem.description}
                    </p>

                    <div className="flex flex-wrap gap-1 text-[11px] pt-1">
                      {match.foundItem.color && (
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E5E2D9] text-[#242923]">
                          Color: {match.foundItem.color}
                        </span>
                      )}
                      {match.foundItem.image && (
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E5E2D9] text-[#174B3A]">
                          ✓ Photo Attached
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E2D9]/70 flex items-center justify-between text-xs text-[#72766F]">
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-[#174B3A]" /> {match.foundItem.location}
                    </span>
                    <span className="text-[#174B3A] font-semibold text-xs">View Report →</span>
                  </div>
                </div>
              </div>

              {/* Detailed Factor Breakdown */}
              <div className="space-y-2 pt-2 border-t border-[#E5E2D9]/70">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#72766F] block">
                  Factor Contribution Breakdown:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {match.breakdown.map((f, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#FAF8F2] border border-[#E5E2D9]/60 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-[#242923]">{f.name}</p>
                        <p className="text-[11px] text-[#72766F]">{f.detail}</p>
                      </div>
                      <span className="text-xs font-bold text-[#174B3A] shrink-0 ml-2">
                        {f.score} / {f.maxScore} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E2D9]/70">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/item/${match.lostItem.id}`)}
                >
                  Inspect Lost Item
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/item/${match.foundItem.id}`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Review Found Item & Claim
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F2EFE7] text-[#9CA099] flex items-center justify-center mx-auto">
            <ArrowLeftRight className="w-8 h-8 stroke-1" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#242923]">No candidate pairs yet</h3>
            <p className="text-xs text-[#72766F] max-w-sm mx-auto">
              SmartMatch continuously evaluates new Lost and Found reports as students submit them across campus.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/report')}>
            Report an Item
          </Button>
        </div>
      )}
    </div>
  );
};
