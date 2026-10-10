import React, { useState } from 'react';
import type { ItemReport } from '../../types';
import { useFindIt } from '../../context';

import { Button } from './Button';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ClaimModalProps {
  item: ItemReport;
  isOpen: boolean;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, isOpen, onClose }) => {
  const { submitClaim } = useFindIt();
  const [reason, setReason] = useState('');
  const [verificationDetail, setVerificationDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a short explanation for your claim.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = submitClaim(item.id, item.title, reason.trim(), verificationDetail.trim());
      if (ok) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-modal-title"
        className="bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E5E2D9] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#174B3A] tracking-wide uppercase">
              Ownership Claim Form
            </span>
            <h2 id="claim-modal-title" className="text-xl font-serif font-bold text-[#242923] mt-0.5">
              Claim "{item.title}"
            </h2>
            <p className="text-xs text-[#72766F] mt-1">
              Found at {item.location} • {item.incidentDate}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#72766F] hover:text-[#242923] hover:bg-[#F2EFE7] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security / Honesty Notice */}
        <div className="p-3.5 rounded-xl bg-[#F7F5EF] border border-[#E5E2D9] flex items-start gap-3 text-xs text-[#72766F] leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-[#174B3A] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#242923]">Campus Desk Verification:</strong> Claims are reviewed
            by campus lost & found coordinators before item handover. A match score does not guarantee
            claim ownership.
          </div>
        </div>

        {/* Claim Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="claim-reason" className="block text-xs font-semibold text-[#242923] uppercase">
              Why do you believe this item is yours? *
            </label>
            <textarea
              id="claim-reason"
              rows={3}
              required
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="e.g. I left my North Face bag during the 2 PM study session on the 2nd floor desk..."
              className="w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-lg p-3 text-sm text-[#242923] placeholder-[#9CA099] focus:outline-none focus:ring-2 focus:ring-[#174B3A]/20 focus:border-[#174B3A]"
            />
            {error && <p className="text-xs text-[#C62828]">{error}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="verification-detail" className="block text-xs font-semibold text-[#242923] uppercase">
              Private Identifying Details (Confidential)
            </label>
            <textarea
              id="verification-detail"
              rows={2}
              value={verificationDetail}
              onChange={(e) => setVerificationDetail(e.target.value)}
              placeholder="e.g. Specific keychain, stickers, lock combination, wallpaper photo, or unique mark not shown publicly."
              className="w-full bg-[#FFFFFF] border border-[#E5E2D9] rounded-lg p-3 text-sm text-[#242923] placeholder-[#9CA099] focus:outline-none focus:ring-2 focus:ring-[#174B3A]/20 focus:border-[#174B3A]"
            />
            <p className="text-[11px] text-[#72766F]">
              🔒 Kept strictly private and only verified during physical claim handover.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E2D9]">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit Claim
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
