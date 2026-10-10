/**
 * FINDIT - Domain Type Definitions
 * Campus Lost & Found with Explainable SmartMatch & Image Integrity Analysis
 */

export type ReportType = 'lost' | 'found';

export type ReportStatus =
  | 'open'
  | 'potential_match'
  | 'claim_pending'
  | 'resolved'
  | 'under_review'
  | 'hidden';

export type ItemCategory =
  | 'Electronics'
  | 'ID Cards'
  | 'Bags'
  | 'Keys'
  | 'Books'
  | 'Accessories'
  | 'Clothing'
  | 'Other';

export interface ImageAnalysisResult {
  hasImage: boolean;
  fileHash?: string;
  fileSizeBytes?: number;
  dimensions?: { width: number; height: number };
  format?: string;
  isDuplicateReuse?: boolean;
  duplicateOfReportId?: string;
  visualRiskLevel: 'no_indicators_detected' | 'moderate' | 'potentially_suspicious' | 'unable_to_determine';
  riskReasons: string[];
  isFlaggedForReview: boolean;
  moderatorReviewStatus?: 'pending' | 'approved' | 'rejected' | 'replacement_requested';
  moderatorNote?: string;
  detectionProvider: 'local_heuristics' | 'external_api_unavailable';
  analysisTimestamp: string;
}

export interface ItemReport {
  id: string;
  ownerId: string;
  ownerName: string;
  type: ReportType;
  title: string;
  category: ItemCategory;
  color: string; // Required or known color (e.g. "Black", "Purple", "Metallic")
  description: string;
  distinguishingFeatures?: string; // Stickers, scratches, initials, case type
  location: string;
  latitude?: number;
  longitude?: number;
  incidentDate: string; // YYYY-MM-DD
  image?: string; // Optional image data URL or external URL
  imageAnalysis?: ImageAnalysisResult;
  status: ReportStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  privateDetail?: string; // Confidential verification mark (never exposed in public listing)
  saveCount?: number;
}

export interface MatchFactorBreakdown {
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  detail: string;
}

export interface ItemMatch {
  id: string;
  lostItem: ItemReport;
  foundItem: ItemReport;
  score: number; // 0 - 100
  tier: 'strong' | 'moderate' | 'weak';
  reasons: string[];
  explanationSummary: string;
  breakdown: MatchFactorBreakdown[];
}

export interface Claim {
  id: string;
  reportId: string;
  reportTitle: string;
  claimantId: string;
  claimantName: string;
  reason: string;
  verificationDetail: string;
  status: 'pending' | 'approved' | 'rejected';
  moderatorNote?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface InAppNotification {
  id: string;
  type: 'match' | 'claim' | 'claim_update' | 'resolved' | 'image_review' | 'system';
  title: string;
  message: string;
  relatedReportId?: string;
  timestamp: string;
  read: boolean;
}

export interface ItemFilterOptions {
  searchQuery?: string;
  type?: 'all' | 'lost' | 'found';
  category?: string;
  color?: string;
  location?: string;
  status?: string;
  sortBy?: 'newest' | 'oldest' | 'title';
}

export interface CampusStats {
  totalReports: number;
  activeLost: number;
  activeFound: number;
  resolved: number;
  pendingClaims: number;
  flaggedImages: number;
}
