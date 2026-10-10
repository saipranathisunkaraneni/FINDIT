import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ItemReport } from '../../types';
import { Badge } from './Badge';
import {
  MapPin,
  Calendar,
  Heart,
  Package,
  Smartphone,
  CreditCard,
  Key,
  BookOpen,
  Watch,
  ShieldAlert,
  CameraOff,
} from 'lucide-react';

interface ItemCardProps {
  item: ItemReport;
  matchScore?: number;
  matchTier?: 'strong' | 'moderate' | 'weak';
  compact?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  matchScore,
  matchTier,
  compact = false,
}) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saves, setSaves] = useState(item.saveCount || 0);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved((prev) => !prev);
    setSaves((prev) => (isSaved ? prev - 1 : prev + 1));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Electronics':
        return <Smartphone className="w-7 h-7 text-[#174B3A] stroke-1" />;
      case 'ID Cards':
        return <CreditCard className="w-7 h-7 text-[#174B3A] stroke-1" />;
      case 'Keys':
        return <Key className="w-7 h-7 text-[#174B3A] stroke-1" />;
      case 'Books':
        return <BookOpen className="w-7 h-7 text-[#174B3A] stroke-1" />;
      case 'Accessories':
        return <Watch className="w-7 h-7 text-[#174B3A] stroke-1" />;
      default:
        return <Package className="w-7 h-7 text-[#174B3A] stroke-1" />;
    }
  };

  const isResolved = item.status === 'resolved';
  const isUnderReview = item.status === 'under_review';
  const hasPhoto = Boolean(item.image && !imgError);

  return (
    <div
      onClick={() => navigate(`/item/${item.id}`)}
      className="group bg-[#FFFEFA] border border-[#E5E2D9] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(36,41,35,0.04)] hover:shadow-[0_8px_20px_-4px_rgba(23,75,58,0.08)] hover:border-[#D4CFC3] transition-all duration-200 cursor-pointer flex flex-col active:scale-[0.99]"
    >
      {/* Visual Thumbnail or Photo-Optional Representation */}
      <div
        className={`w-full ${
          compact ? 'h-28' : 'h-36 sm:h-40'
        } bg-[#F4F1E8] relative flex items-center justify-center overflow-hidden`}
      >
        {hasPhoto ? (
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-[#EBF2ED] flex items-center justify-center">
              {getCategoryIcon(item.category)}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#72766F]">
              <CameraOff className="w-3 h-3 text-[#9CA099]" />
              <span>Descriptive Report (No Photo)</span>
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
          {isResolved ? (
            <Badge variant="category" className="bg-[#EBF2ED] text-[#174B3A] font-bold border-[#174B3A]/30">
              ✓ Resolved
            </Badge>
          ) : isUnderReview ? (
            <Badge variant="pending" className="bg-[#FFF8E1] text-[#9E6B02] border-[#FFE082]">
              Under Review
            </Badge>
          ) : item.type === 'found' ? (
            <Badge variant="found">Found</Badge>
          ) : (
            <Badge variant="lost">Lost</Badge>
          )}

          {typeof matchScore === 'number' && (
            <Badge
              variant="match"
              className={
                matchTier === 'strong'
                  ? 'bg-[#174B3A] text-white border-transparent'
                  : 'bg-[#DCE7D8] text-[#10372D]'
              }
            >
              {matchScore}% Match
            </Badge>
          )}

          {item.imageAnalysis?.isFlaggedForReview && (
            <span
              className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5"
              title="Image flagged for moderator review"
            >
              <ShieldAlert className="w-3 h-3" /> Flagged
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSaveToggle}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-colors backdrop-blur-xs ${
            isSaved
              ? 'bg-[#FFFEFA] text-[#C62828] shadow-xs'
              : 'bg-[#FFFEFA]/80 hover:bg-[#FFFEFA] text-[#72766F] hover:text-[#C62828]'
          }`}
          aria-label={isSaved ? 'Unsave item' : 'Save item'}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-1 text-[11px] text-[#72766F]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-[#242923]">{item.category}</span>
              {item.color && (
                <>
                  <span>•</span>
                  <span className="text-[#174B3A] font-medium">{item.color}</span>
                </>
              )}
            </div>
            <span className="truncate flex items-center gap-1 shrink-0">
              <Calendar className="w-3 h-3" />
              {item.incidentDate}
            </span>
          </div>

          <h3 className="font-serif font-bold text-sm sm:text-base text-[#242923] line-clamp-1 group-hover:text-[#174B3A] transition-colors">
            {item.title}
          </h3>

          <p className="text-xs text-[#72766F] line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {item.distinguishingFeatures && (
            <p className="text-[11px] text-[#174B3A] line-clamp-1 bg-[#F4F7F2] px-2 py-0.5 rounded border border-[#E5E2D9]/60">
              <strong className="font-semibold">Mark:</strong> {item.distinguishingFeatures}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-[#E5E2D9]/70 flex items-center justify-between text-xs text-[#72766F]">
          <div className="flex items-center gap-1 text-[11px] truncate max-w-[70%]">
            <MapPin className="w-3 h-3 text-[#174B3A] shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[#9CA099] font-medium shrink-0">
            <span>{saves > 0 ? `${saves} saves` : 'Details →'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
