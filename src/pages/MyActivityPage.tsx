import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFindIt } from '../context';

import { ItemCard } from '../components/common/ItemCard';
import { Button } from '../components/common/Button';
import {
  Package,
  FileCheck,
  CheckCircle2,
  ArrowLeftRight,
  ShieldAlert,
  Plus,
} from 'lucide-react';

export const MyActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const { reports, claims, currentUser, getMatchesForReport } = useFindIt();
  const [activeTab, setActiveTab] = useState<'reports' | 'claims' | 'resolved'>('reports');

  // Filter user's own reports
  const myReports = reports.filter((r) => r.ownerId === currentUser.id && r.status !== 'resolved');
  const myResolved = reports.filter((r) => r.ownerId === currentUser.id && r.status === 'resolved');
  const myClaims = claims.filter((c) => c.claimantId === currentUser.id);

  return (
    <div className="space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#174B3A] text-[#FFFEFA] flex items-center justify-center font-serif text-2xl font-bold shrink-0 shadow-xs">
            {currentUser.avatarLetter}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#242923]">
                {currentUser.name}
              </h1>
              <span className="text-[10px] uppercase font-bold text-[#174B3A] bg-[#DCE7D8] px-2 py-0.5 rounded">
                Demo Student
              </span>
            </div>
            <p className="text-xs text-[#72766F] mt-0.5">
              Campus: {currentUser.campus} • Student ID: CS23-DEMO-04
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/report')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Report
        </Button>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex p-1 bg-[#FAF8F2] border border-[#E5E2D9] rounded-xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
            activeTab === 'reports'
              ? 'bg-[#174B3A] text-white shadow-xs'
              : 'text-[#72766F] hover:text-[#242923]'
          }`}
        >
          Active Reports ({myReports.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('claims')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
            activeTab === 'claims'
              ? 'bg-[#174B3A] text-white shadow-xs'
              : 'text-[#72766F] hover:text-[#242923]'
          }`}
        >
          My Claims ({myClaims.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('resolved')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
            activeTab === 'resolved'
              ? 'bg-[#174B3A] text-white shadow-xs'
              : 'text-[#72766F] hover:text-[#242923]'
          }`}
        >
          Resolved ({myResolved.length})
        </button>
      </div>

      {/* TAB 1: Active Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {myReports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myReports.map((report) => {
                const matches = getMatchesForReport(report);
                const hasMatch = matches.length > 0;

                return (
                  <div key={report.id} className="space-y-2">
                    <ItemCard item={report} />
                    {hasMatch && (
                      <div
                        onClick={() => navigate('/matches')}
                        className="p-2.5 rounded-xl bg-[#EBF2ED] border border-[#174B3A]/20 flex items-center justify-between cursor-pointer hover:bg-[#dce7d8] transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#174B3A]">
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          <span>{matches.length} Match Suggestion(s)</span>
                        </div>
                        <span className="text-[11px] font-medium text-[#174B3A]">View →</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-12 text-center space-y-4">
              <Package className="w-12 h-12 text-[#9CA099] mx-auto stroke-1" />
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#242923]">No active reports</h3>
                <p className="text-xs text-[#72766F] max-w-sm mx-auto">
                  You haven't submitted any active lost or found reports yet.
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={() => navigate('/report')}>
                Create First Report
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: My Claims */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {myClaims.length > 0 ? (
            myClaims.map((claim) => (
              <div
                key={claim.id}
                className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#72766F]">
                      Claim ID: {claim.id}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#242923] mt-0.5">
                      {claim.reportTitle}
                    </h3>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      claim.status === 'pending'
                        ? 'bg-[#FFF8E1] text-[#9E6B02] border border-[#FFE082]'
                        : claim.status === 'approved'
                        ? 'bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9]'
                        : 'bg-[#FBE9E7] text-[#C62828] border border-[#FFCCBC]'
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] space-y-2 text-xs">
                  <div>
                    <strong className="text-[#242923]">Your Explanation:</strong>
                    <p className="text-[#72766F] mt-0.5">{claim.reason}</p>
                  </div>
                  {claim.verificationDetail && (
                    <div className="pt-2 border-t border-[#E5E2D9]/60">
                      <strong className="text-[#242923] flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-[#174B3A]" /> Confidential Verification Note:
                      </strong>
                      <p className="text-[#72766F] mt-0.5">{claim.verificationDetail}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-[#72766F] pt-1">
                  <span>Submitted on {new Date(claim.createdAt).toLocaleDateString()}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/item/${claim.reportId}`)}
                  >
                    View Found Listing
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-12 text-center space-y-4">
              <FileCheck className="w-12 h-12 text-[#9CA099] mx-auto stroke-1" />
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#242923]">No claims filed</h3>
                <p className="text-xs text-[#72766F] max-w-sm mx-auto">
                  When you locate an item you believe is yours, submit a claim with verification
                  details to recover it.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/browse?type=found')}>
                Browse Found Items
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Resolved Reports */}
      {activeTab === 'resolved' && (
        <div className="space-y-6">
          {myResolved.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myResolved.map((report) => (
                <ItemCard key={report.id} item={report} />
              ))}
            </div>
          ) : (
            <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#9CA099] mx-auto stroke-1" />
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#242923]">No resolved reports</h3>
                <p className="text-xs text-[#72766F] max-w-sm mx-auto">
                  When a lost or found item is successfully recovered or returned, mark it as resolved
                  to update the campus registry.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
