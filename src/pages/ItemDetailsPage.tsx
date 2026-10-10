import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFindIt } from '../context';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ItemCard } from '../components/common/ItemCard';
import { ClaimModal } from '../components/common/ClaimModal';
import { CampusLocationViewer } from '../components/common/CampusLocationViewer';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ArrowLeftRight,
  Share2,
  Package,
  AlertTriangle,
  CameraOff,
} from 'lucide-react';

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reports, currentUser, resolveReport, deleteReport, getMatchesForReport, showToast } =
    useFindIt();

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imgError, setImgError] = useState(false);

  const item = reports.find((r) => r.id === id);

  if (!item) {
    return (
      <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
        <Package className="w-12 h-12 text-[#9CA099] mx-auto stroke-1" />
        <h2 className="text-xl font-serif font-bold text-[#242923]">Report Not Found</h2>
        <p className="text-xs text-[#72766F]">
          The item report you are looking for may have been removed or does not exist.
        </p>
        <Button variant="primary" onClick={() => navigate('/browse')}>
          Back to Browse
        </Button>
      </div>
    );
  }

  const isOwner = item.ownerId === currentUser.id;
  const isResolved = item.status === 'resolved';
  const isUnderReview = item.status === 'under_review';
  const matches = getMatchesForReport(item);
  const hasPhoto = Boolean(item.image && !imgError);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `FINDIT: ${item.title}`,
        text: `${item.title} (${item.type.toUpperCase()}) at ${item.location}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  const handleResolve = () => {
    resolveReport(item.id);
  };

  const handleDelete = () => {
    deleteReport(item.id);
    navigate('/my-activity');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#174B3A] hover:text-[#10372D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FFFEFA] border border-[#E5E2D9] text-[#72766F] hover:text-[#242923] hover:border-[#D4CFC3] transition-all cursor-pointer shadow-2xs"
          title="Share Report"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Item Card */}
      <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Photo or Descriptive Visual Area */}
          <div className="h-72 sm:h-80 md:h-full min-h-[300px] w-full bg-[#F4F1E8] relative flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-[#E5E2D9]">
            {hasPhoto ? (
              <img
                src={item.image}
                alt={item.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2.5 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#EBF2ED] text-[#174B3A] flex items-center justify-center">
                  <Package className="w-8 h-8 stroke-1" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-bold text-[#242923]">Descriptive Report</span>
                  <p className="text-xs text-[#72766F] max-w-xs">
                    Submitted without a photo. All physical details are matched via SmartMatch text attributes.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] text-[#174B3A] bg-[#DCE7D8] px-2.5 py-1 rounded-full font-semibold">
                  <CameraOff className="w-3.5 h-3.5" />
                  <span>Photo-Optional Verified</span>
                </div>
              </div>
            )}

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {isResolved ? (
                <Badge variant="category" className="bg-[#EBF2ED] text-[#174B3A] font-bold">
                  ✓ Returned / Resolved
                </Badge>
              ) : isUnderReview ? (
                <Badge variant="pending" className="bg-[#FFF8E1] text-[#9E6B02] font-bold">
                  Under Review
                </Badge>
              ) : item.type === 'found' ? (
                <Badge variant="found">Found Item</Badge>
              ) : (
                <Badge variant="lost">Lost Item</Badge>
              )}
            </div>
          </div>

          {/* Details & Attributes Panel */}
          <div className="p-5 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#72766F]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold uppercase tracking-wider text-[#174B3A]">
                    {item.category}
                  </span>
                  {item.color && (
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F2] border border-[#E5E2D9] font-medium text-[#242923]">
                      Color: {item.color}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#242923] leading-snug">
                  {item.title}
                </h1>
                <p className="text-xs sm:text-sm text-[#72766F] mt-3 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Distinguishing Features */}
              {item.distinguishingFeatures && (
                <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#174B3A] tracking-wider">
                    Distinguishing Characteristics
                  </span>
                  <p className="text-xs text-[#242923] font-medium">
                    {item.distinguishingFeatures}
                  </p>
                </div>
              )}

              {/* Location & Incident Date */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#72766F] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#174B3A]" /> Location
                  </span>
                  <p className="text-xs font-semibold text-[#242923]">{item.location}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#72766F] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#174B3A]" /> Incident Date
                  </span>
                  <p className="text-xs font-semibold text-[#242923]">{item.incidentDate}</p>
                </div>
              </div>

              {/* Interactive Campus Map View */}
              <CampusLocationViewer
                location={item.location}
                latitude={item.latitude}
                longitude={item.longitude}
              />

              {/* Private Ownership Mark (Only visible to Author) */}
              {isOwner && item.privateDetail && (
                <div className="p-3 rounded-xl bg-[#EBF2ED] border border-[#174B3A]/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#174B3A] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Confidential Ownership Mark (Private)
                  </span>
                  <p className="text-xs text-[#242923] font-mono">{item.privateDetail}</p>
                </div>
              )}

              {/* Image Integrity Analysis Information (If photo present) */}
              {item.imageAnalysis && (
                <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E5E2D9] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#242923] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#174B3A]" /> Image Integrity Check
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        item.imageAnalysis.visualRiskLevel === 'potentially_suspicious'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-green-100 text-green-900 border border-green-300'
                      }`}
                    >
                      {item.imageAnalysis.visualRiskLevel === 'potentially_suspicious'
                        ? 'Flagged for Review'
                        : 'Verified Decodable'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#72766F] leading-tight">
                    {item.imageAnalysis.riskReasons[0]}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E5E2D9] space-y-3">
              {isResolved ? (
                <div className="p-3.5 rounded-xl bg-[#EBF2ED] border border-[#174B3A]/30 text-center space-y-1">
                  <span className="text-xs font-bold text-[#174B3A] flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Item Successfully Recovered & Resolved
                  </span>
                  <p className="text-[11px] text-[#72766F]">
                    This report has been marked resolved. It is archived and excluded from active match candidates.
                  </p>
                </div>
              ) : isOwner ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      onClick={handleResolve}
                      className="flex-1"
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Mark as Returned / Resolved
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="border-[#C62828] text-[#C62828] hover:bg-[#FBE9E7]"
                      aria-label="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-[#72766F] text-center">
                    You authored this demo report.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {item.type === 'found' && (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setIsClaimModalOpen(true)}
                      className="w-full"
                      leftIcon={<ShieldCheck className="w-5 h-5" />}
                    >
                      This Is Mine — Submit Claim
                    </Button>
                  )}

                  {item.type === 'lost' && (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => navigate('/report?mode=found')}
                      className="w-full"
                      leftIcon={<Package className="w-5 h-5" />}
                    >
                      I Found This Belonging — Log Match
                    </Button>
                  )}

                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-[11px] text-[#72766F]">
                      Claims verified in-person at campus desk.
                    </p>
                    <button
                      type="button"
                      onClick={handleResolve}
                      className="text-[11px] font-semibold text-[#174B3A] hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Demo: Mark Resolved</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-[#C62828]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif font-bold text-lg text-[#242923]">Delete this report?</h3>
            </div>
            <p className="text-xs text-[#72766F]">
              Are you sure you want to delete "{item.title}"? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDelete}
                className="bg-[#C62828] hover:bg-[#a51d1d]"
              >
                Delete Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Matching Reports for this item */}
      {matches.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-[#E5E2D9]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-[#174B3A]" />
              <h2 className="text-xl font-serif font-bold text-[#242923]">
                SmartMatch Candidates ({matches.length})
              </h2>
            </div>
            <span className="text-xs text-[#72766F]">Multi-factor explainable ranking</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.map((m) => {
              const pairedItem = item.type === 'lost' ? m.foundItem : m.lostItem;
              return (
                <ItemCard key={m.id} item={pairedItem} matchScore={m.score} matchTier={m.tier} />
              );
            })}
          </div>
        </section>
      )}

      {/* Claim Form Modal */}
      <ClaimModal
        item={item}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />
    </div>
  );
};
