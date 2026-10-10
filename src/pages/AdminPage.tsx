import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFindIt } from '../context';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Shield,
  CheckCircle2,
  XCircle,
  EyeOff,
  Eye,
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
  Image,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    reports,
    claims,
    updateReport,
    updateClaimStatus,
    updateImageModeration,
    resetData,
  } = useFindIt();

  const [activeTab, setActiveTab] = useState<'claims' | 'images' | 'moderation'>('claims');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Live metrics from real dataset
  const totalReports = reports.length;
  const activeLost = reports.filter((r) => r.type === 'lost' && r.status !== 'resolved' && r.status !== 'hidden').length;
  const activeFound = reports.filter((r) => r.type === 'found' && r.status !== 'resolved' && r.status !== 'hidden').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const pendingClaims = claims.filter((c) => c.status === 'pending').length;
  const flaggedReports = reports.filter((r) => r.imageAnalysis?.isFlaggedForReview);

  const handleToggleHide = (reportId: string, currentStatus: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;
    const newStatus = currentStatus === 'hidden' ? 'open' : 'hidden';
    updateReport({ ...report, status: newStatus as any });
  };

  const handleToggleResolve = (reportId: string, currentStatus: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;
    const newStatus = currentStatus === 'resolved' ? 'open' : 'resolved';
    updateReport({ ...report, status: newStatus as any });
  };

  return (
    <div className="space-y-8">
      {/* Admin Demo Header */}
      <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#174B3A] text-white flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#242923]">
                  Campus Coordinator Desk
                </h1>
                <span className="text-[10px] uppercase font-bold text-[#9E6B02] bg-[#FFF8E1] border border-[#FFE082] px-2 py-0.5 rounded">
                  Demo Moderator View
                </span>
              </div>
              <p className="text-xs text-[#72766F] mt-0.5">
                Local demonstration workspace for report moderation, claim verification, and image integrity review.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Demo Dataset
          </Button>
        </div>

        <p className="text-[11px] text-[#72766F] border-t border-[#E5E2D9] pt-2 italic">
          Disclaimer: This coordinator dashboard runs client-side using localStorage for demonstration purposes. No production backend authorization is claimed.
        </p>
      </div>

      {/* Real Computed Metrics - 2 columns on Phone Portrait */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-3 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#72766F]">Total Reports</span>
          <p className="text-2xl font-serif font-bold text-[#242923]">{totalReports}</p>
        </div>
        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-3 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#C62828]">Active Lost</span>
          <p className="text-2xl font-serif font-bold text-[#C62828]">{activeLost}</p>
        </div>
        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-3 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#1B5E20]">Active Found</span>
          <p className="text-2xl font-serif font-bold text-[#1B5E20]">{activeFound}</p>
        </div>
        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-3 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#174B3A]">Resolved</span>
          <p className="text-2xl font-serif font-bold text-[#174B3A]">{resolvedCount}</p>
        </div>
        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-3 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#9E6B02]">Claims</span>
          <p className="text-2xl font-serif font-bold text-[#9E6B02]">{pendingClaims}</p>
        </div>
        <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-3 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-amber-700">Flagged Images</span>
          <p className="text-2xl font-serif font-bold text-amber-700">{flaggedReports.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E5E2D9] pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('claims')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'claims' ? 'bg-[#174B3A] text-white' : 'text-[#72766F] hover:text-[#242923]'
          }`}
        >
          Ownership Claims ({claims.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('images')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'images' ? 'bg-[#174B3A] text-white' : 'text-[#72766F] hover:text-[#242923]'
          }`}
        >
          <span>Suspicious Image Queue</span>
          {flaggedReports.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {flaggedReports.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('moderation')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'moderation' ? 'bg-[#174B3A] text-white' : 'text-[#72766F] hover:text-[#242923]'
          }`}
        >
          Report Moderation ({reports.length})
        </button>
      </div>

      {/* TAB 1: Claims Review */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {claims.length > 0 ? (
            claims.map((claim) => (
              <div
                key={claim.id}
                className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-[#72766F]">
                        Claim #{claim.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          claim.status === 'pending'
                            ? 'bg-[#FFF8E1] text-[#9E6B02]'
                            : claim.status === 'approved'
                            ? 'bg-[#E8F5E9] text-[#1B5E20]'
                            : 'bg-[#FBE9E7] text-[#C62828]'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#242923] mt-1">
                      {claim.reportTitle}
                    </h3>
                    <p className="text-xs text-[#72766F]">
                      Claimant: <strong className="text-[#242923]">{claim.claimantName}</strong> ({claim.claimantId})
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/item/${claim.reportId}`)}
                  >
                    View Original Item
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-[#242923]">Claimant Explanation:</span>
                    <p className="text-[#72766F] mt-0.5">{claim.reason}</p>
                  </div>

                  {claim.verificationDetail && (
                    <div className="pt-2 border-t border-[#E5E2D9]">
                      <span className="font-bold text-[#174B3A]">
                        Confidential Verification Mark (Coordinator-Only):
                      </span>
                      <p className="text-[#242923] font-mono mt-0.5 bg-white p-2 rounded border border-[#E5E2D9]">
                        {claim.verificationDetail}
                      </p>
                    </div>
                  )}
                </div>

                {/* Moderation Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5E2D9]">
                  <span className="text-[11px] text-[#72766F]">
                    Submitted {new Date(claim.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {claim.status !== 'approved' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateClaimStatus(claim.id, 'approved', 'Verified in person.')}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Approve Claim
                      </Button>
                    )}

                    {claim.status !== 'rejected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateClaimStatus(claim.id, 'rejected', 'Verification marks did not match.')}
                        className="border-[#C62828] text-[#C62828] hover:bg-[#FBE9E7]"
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Reject Claim
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-12 text-center text-xs text-[#72766F]">
              No claims submitted for coordinator review.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Suspicious Image Queue */}
      {activeTab === 'images' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] text-xs text-[#72766F] leading-relaxed">
            <strong className="text-[#242923]">Suspicious Image Moderation:</strong> Evaluates duplicate file reuse, unnatural dimensions, and anomalies. Review the photo and approve or reject the listing.
          </div>

          {flaggedReports.length > 0 ? (
            flaggedReports.map((report) => (
              <div
                key={report.id}
                className="bg-[#FFFEFA] border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {report.image ? (
                      <img
                        src={report.image}
                        alt="Flagged"
                        className="w-20 h-20 rounded-xl object-cover border border-[#E5E2D9] shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-[#F2EFE7] flex items-center justify-center text-[#9CA099] shrink-0">
                        <Image className="w-8 h-8" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-[#72766F]">
                          Report #{report.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {report.imageAnalysis?.visualRiskLevel.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#242923]">{report.title}</h3>
                      <p className="text-xs text-[#72766F]">
                        By {report.ownerName} • {report.location} • Color: {report.color}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/item/${report.id}`)}
                  >
                    View Listing
                  </Button>
                </div>

                {/* Risk Reasons */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 text-xs text-amber-900">
                  <strong className="flex items-center gap-1.5 font-bold text-amber-800">
                    <ShieldAlert className="w-4 h-4" /> Detected Flags:
                  </strong>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {report.imageAnalysis?.riskReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-amber-800/80 pt-1 font-mono">
                    File Signature: {report.imageAnalysis?.fileHash} • Dimensions:{' '}
                    {report.imageAnalysis?.dimensions?.width}x{report.imageAnalysis?.dimensions?.height}px
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E2D9]">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => updateImageModeration(report.id, 'approved', 'Cleared by coordinator.')}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Clear & Approve Photo
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateImageModeration(report.id, 'replacement_requested', 'Photo unclear; please replace.')}
                  >
                    Request Replacement
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateImageModeration(report.id, 'rejected', 'Image confirmed misleading or fraudulent.')}
                    className="border-[#C62828] text-[#C62828] hover:bg-[#FBE9E7]"
                    leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  >
                    Reject & Hide Report
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-12 text-center text-xs text-[#72766F]">
              No flagged images in review queue. All uploaded photos have passed validation.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Report Moderation */}
      {activeTab === 'moderation' && (
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={report.type === 'found' ? 'found' : 'lost'}>
                    {report.type.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-[#72766F]">• {report.category}</span>
                  <span className="text-xs text-[#72766F]">• {report.location}</span>
                  {report.status === 'hidden' && (
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                      HIDDEN
                    </span>
                  )}
                  {report.status === 'resolved' && (
                    <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded">
                      RESOLVED
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-sm text-[#242923]">{report.title}</h4>
                <p className="text-xs text-[#72766F] line-clamp-1">{report.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleHide(report.id, report.status)}
                  className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 cursor-pointer ${
                    report.status === 'hidden'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-[#FFFEFA] text-[#72766F] border-[#E5E2D9] hover:text-[#242923]'
                  }`}
                  title={report.status === 'hidden' ? 'Unhide Report' : 'Hide from Public'}
                >
                  {report.status === 'hidden' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{report.status === 'hidden' ? 'Unhide' : 'Hide'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleResolve(report.id, report.status)}
                  className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 cursor-pointer ${
                    report.status === 'resolved'
                      ? 'bg-green-50 text-green-800 border-green-300'
                      : 'bg-[#FFFEFA] text-[#72766F] border-[#E5E2D9] hover:text-[#174B3A]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{report.status === 'resolved' ? 'Reopen' : 'Resolve'}</span>
                </button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/item/${report.id}`)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-[#174B3A]">
              <AlertTriangle className="w-6 h-6 shrink-0 text-[#9E6B02]" />
              <h3 className="font-serif font-bold text-lg text-[#242923]">Reset to Demo Data?</h3>
            </div>
            <p className="text-xs text-[#72766F]">
              This will restore the original demo reports, sample claims, and notification states in localStorage.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  resetData();
                  setShowResetConfirm(false);
                }}
              >
                Reset Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
