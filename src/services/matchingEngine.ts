import type { ItemReport, ItemMatch, MatchFactorBreakdown } from '../types';
import { findCampusBlock, calculateDistanceMeters } from './campusLocations';

/**
 * Universal threshold for eligible match candidate pairings.
 * Consistent across match lists, item detail comparisons, and in-app notifications.
 */
export const MATCH_THRESHOLD = 50;

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'in', 'on', 'at', 'with', 'and', 'is', 'of', 'to', 'for', 'has', 'it',
  'was', 'by', 'from', 'this', 'that', 'there', 'some', 'my', 'your', 'found', 'lost',
  'item', 'near', 'left', 'desk', 'campus', 'room', 'block', 'floor', 'hall'
]);

function extractKeywords(text: string): Set<string> {
  const words = (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

/**
 * Calculates explainable SmartMatch score between a Lost report and a Found report.
 * Total score is strictly bounded between 0 and 100.
 *
 * Scoring Weights (Total 100 pts):
 * - Description & distinguishing marks: 35%
 * - Category & item name similarity: 25%
 * - Color agreement: 15%
 * - Location proximity (Haversine meters): 15%
 * - Incident date proximity: 10%
 *
 * Missing photos NEVER penalize the score (photo-optional design guarantee).
 */
export function calculateMatchScore(lost: ItemReport, found: ItemReport): {
  score: number;
  tier: 'strong' | 'moderate' | 'weak';
  reasons: string[];
  explanationSummary: string;
  breakdown: MatchFactorBreakdown[];
} {
  const reasons: string[] = [];
  const breakdown: MatchFactorBreakdown[] = [];

  // Strict Category Gate: Reports from completely different categories cannot match
  const categoryExact = lost.category === found.category;
  if (!categoryExact && lost.category !== 'Other' && found.category !== 'Other') {
    return {
      score: 0,
      tier: 'weak',
      reasons: [],
      explanationSummary: `Category mismatch (${lost.category} vs ${found.category}).`,
      breakdown: [
        {
          name: 'Category & Name',
          weight: 25,
          score: 0,
          maxScore: 25,
          detail: `Different categories (${lost.category} vs ${found.category}).`,
        },
      ],
    };
  }

  // 1. Description & Distinguishing Features Similarity (35 pts max)
  // Uses Sørensen–Dice coefficient to prevent short descriptions from falsely scoring high against long descriptions.
  const lostDescFull = `${lost.description} ${lost.distinguishingFeatures || ''}`;
  const foundDescFull = `${found.description} ${found.distinguishingFeatures || ''}`;
  const lostTokens = extractKeywords(lostDescFull);
  const foundTokens = extractKeywords(foundDescFull);

  let descScore = 0;
  const commonKeywords: string[] = [];
  for (const token of lostTokens) {
    if (foundTokens.has(token)) {
      commonKeywords.push(token);
    }
  }

  const totalDescTokens = lostTokens.size + foundTokens.size;
  if (totalDescTokens > 0 && commonKeywords.length > 0) {
    // Dice coefficient balances token counts symmetrically: 2 * |A ∩ B| / (|A| + |B|)
    const diceSimilarity = (2 * commonKeywords.length) / totalDescTokens;

    // Bonus for specific distinguishing marks match (e.g. scratch, initials, case)
    const lostMarks = extractKeywords(lost.distinguishingFeatures || '');
    const foundMarks = extractKeywords(found.distinguishingFeatures || '');
    let markMatches = 0;
    for (const m of lostMarks) {
      if (foundMarks.has(m)) markMatches++;
    }
    const markBonus = markMatches > 0 ? 0.15 : 0;

    const overlapRatio = Math.min(1, diceSimilarity + markBonus);
    descScore = Math.round(overlapRatio * 35);
    reasons.push(
      `Description keywords match (${commonKeywords.slice(0, 3).join(', ')})`
    );
  }

  breakdown.push({
    name: 'Description & Features',
    weight: 35,
    score: descScore,
    maxScore: 35,
    detail: commonKeywords.length > 0
      ? `Matched ${commonKeywords.length} term(s): "${commonKeywords.slice(0, 3).join('", "')}"`
      : 'No distinctive descriptive keyword overlap found.',
  });

  // 2. Category & Item Name Similarity (25 pts max)
  let catNameScore = 0;
  const lostTitleTokens = extractKeywords(lost.title);
  const foundTitleTokens = extractKeywords(found.title);

  let titleOverlapCount = 0;
  for (const t of lostTitleTokens) {
    if (foundTitleTokens.has(t)) titleOverlapCount++;
  }

  if (categoryExact) {
    catNameScore += 15; // 15 pts for exact category agreement
    reasons.push(`Category agreement (${lost.category})`);
  }

  const totalTitleTokens = lostTitleTokens.size + foundTitleTokens.size;
  if (totalTitleTokens > 0 && titleOverlapCount > 0) {
    const titleRatio = (2 * titleOverlapCount) / totalTitleTokens;
    const titlePts = Math.round(titleRatio * 10);
    catNameScore += titlePts;
    reasons.push('Title keyword match');
  }

  breakdown.push({
    name: 'Category & Name',
    weight: 25,
    score: catNameScore,
    maxScore: 25,
    detail: categoryExact
      ? titleOverlapCount > 0
        ? `Category (${lost.category}) and title keywords align.`
        : `Category (${lost.category}) matches.`
      : 'Different categories.',
  });

  // 3. Color Agreement (15 pts max)
  let colorScore = 0;
  const lostColor = (lost.color || '').trim().toLowerCase();
  const foundColor = (found.color || '').trim().toLowerCase();

  if (lostColor && foundColor) {
    if (lostColor === foundColor) {
      colorScore = 15;
      reasons.push(`Color match (${lost.color})`);
    } else if (lostColor.includes(foundColor) || foundColor.includes(lostColor)) {
      colorScore = 10;
      reasons.push(`Similar color tones (${lost.color} / ${found.color})`);
    }
  } else if (!lostColor || !foundColor) {
    // If color is unstated on either report, grant neutral credit (photo-optional guarantee)
    colorScore = 8;
  }

  breakdown.push({
    name: 'Color Agreement',
    weight: 15,
    score: colorScore,
    maxScore: 15,
    detail: lostColor && foundColor
      ? colorScore >= 10
        ? `Colors align: ${lost.color} and ${found.color}.`
        : `Different colors: "${lost.color}" vs "${found.color}".`
      : 'Color was not specified on one or both reports (neutral score).',
  });

  // 4. Location Proximity (15 pts max)
  let locScore = 0;
  let locDetail = '';
  const lostLoc = (lost.location || '').trim().toLowerCase();
  const foundLoc = (found.location || '').trim().toLowerCase();

  // Resolve coordinates from report fields or known KITSW blocks
  const lostBlock = findCampusBlock(lost.location);
  const foundBlock = findCampusBlock(found.location);
  const lostLat = lost.latitude ?? lostBlock?.lat;
  const lostLng = lost.longitude ?? lostBlock?.lng;
  const foundLat = found.latitude ?? foundBlock?.lat;
  const foundLng = found.longitude ?? foundBlock?.lng;

  if (lostLat !== undefined && lostLng !== undefined && foundLat !== undefined && foundLng !== undefined) {
    const distMeters = calculateDistanceMeters(lostLat, lostLng, foundLat, foundLng);
    if (distMeters <= 60) {
      locScore = 15;
      reasons.push(`Same campus building / perimeter (~${distMeters}m apart)`);
      locDetail = `High geographic proximity: within ${distMeters} meters on KITSW campus.`;
    } else if (distMeters <= 180) {
      locScore = 12;
      reasons.push(`Adjacent campus buildings (~${distMeters}m apart)`);
      locDetail = `Nearby locations: approx. ${distMeters} meters apart.`;
    } else if (distMeters <= 350) {
      locScore = 8;
      reasons.push(`Within walking distance (~${distMeters}m apart)`);
      locDetail = `Within campus walking radius: approx. ${distMeters} meters apart.`;
    } else {
      locScore = 3;
      locDetail = `Locations are ${distMeters} meters apart across campus.`;
    }
  } else if (lostLoc === foundLoc) {
    locScore = 15;
    reasons.push(`Identical location (${lost.location})`);
    locDetail = `Both reports are situated in ${lost.location}.`;
  } else if (lostLoc.includes(foundLoc) || foundLoc.includes(lostLoc)) {
    locScore = 10;
    reasons.push(`Nearby campus facility (${lost.location} / ${found.location})`);
    locDetail = `Locations share common campus name: ${lost.location} / ${found.location}.`;
  } else {
    locDetail = `Different locations (${lost.location} vs ${found.location}).`;
  }

  breakdown.push({
    name: 'Location Proximity',
    weight: 15,
    score: locScore,
    maxScore: 15,
    detail: locDetail,
  });

  // 5. Date Proximity (10 pts max)
  let dateScore = 0;
  let dayDiff = 999;
  try {
    const d1 = new Date(lost.incidentDate).getTime();
    const d2 = new Date(found.incidentDate).getTime();
    dayDiff = Math.abs(Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));

    if (dayDiff === 0) {
      dateScore = 10;
      reasons.push('Same incident date');
    } else if (dayDiff <= 1) {
      dateScore = 9;
      reasons.push('Incident dates within 24 hours');
    } else if (dayDiff <= 3) {
      dateScore = 7;
      reasons.push(`Incident dates within ${dayDiff} days`);
    } else if (dayDiff <= 7) {
      dateScore = 4;
      reasons.push(`Dates within a week (${dayDiff} days apart)`);
    }
  } catch {
    dateScore = 4;
  }

  breakdown.push({
    name: 'Date Proximity',
    weight: 10,
    score: dateScore,
    maxScore: 10,
    detail: dayDiff <= 7
      ? `Reported dates are close (${dayDiff === 0 ? 'same day' : `${dayDiff} day(s) apart`}).`
      : 'Reported dates have a larger time gap.',
  });

  // Total Score (Strictly bounded 0 - 100)
  const totalScore = Math.min(100, Math.max(0, descScore + catNameScore + colorScore + locScore + dateScore));

  // Determine Confidence Tier
  const tier: 'strong' | 'moderate' | 'weak' =
    totalScore >= 75 ? 'strong' : totalScore >= 50 ? 'moderate' : 'weak';

  // Construct Realistic Explanation Summary
  const reasonSummaryParts: string[] = [];
  if (categoryExact) reasonSummaryParts.push(`Category (${lost.category})`);
  if (colorScore >= 10 && lost.color) reasonSummaryParts.push(`Color (${lost.color})`);
  if (locScore >= 10) reasonSummaryParts.push(`Location (${lost.location})`);
  if (commonKeywords.length > 0) reasonSummaryParts.push(`${commonKeywords.length} shared keyword(s)`);
  if (dateScore >= 9) reasonSummaryParts.push('Date proximity');

  const explanationSummary = reasonSummaryParts.length > 0
    ? `Correlated based on: ${reasonSummaryParts.join(', ')}.`
    : `Evaluated across campus category, location, and date attributes.`;

  return {
    score: totalScore,
    tier,
    reasons,
    explanationSummary,
    breakdown,
  };
}

/**
 * Helper to check whether a report is eligible for match candidate pairing.
 * Excludes resolved, hidden, and under-review reports.
 */
function isReportEligibleForMatching(report: ItemReport): boolean {
  return (
    report.status !== 'resolved' &&
    report.status !== 'hidden' &&
    report.status !== 'under_review'
  );
}

/**
 * Generates ranked match candidates across all eligible active reports.
 * Excludes resolved, hidden, and under-review reports.
 */
export function generateAllMatches(reports: ItemReport[]): ItemMatch[] {
  const activeLost = reports.filter((r) => r.type === 'lost' && isReportEligibleForMatching(r));
  const activeFound = reports.filter((r) => r.type === 'found' && isReportEligibleForMatching(r));

  const matches: ItemMatch[] = [];

  for (const lost of activeLost) {
    for (const found of activeFound) {
      if (lost.id === found.id) continue;

      const { score, tier, reasons, explanationSummary, breakdown } = calculateMatchScore(lost, found);

      // Only include candidate pairings that meet the universal threshold
      if (score >= MATCH_THRESHOLD) {
        matches.push({
          id: `match-${lost.id}-${found.id}`,
          lostItem: lost,
          foundItem: found,
          score,
          tier,
          reasons,
          explanationSummary,
          breakdown,
        });
      }
    }
  }

  // Rank highest scores first
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Retrieves match candidates for a single report.
 * Excludes resolved, hidden, and under-review reports.
 */
export function getMatchesForItem(item: ItemReport, allReports: ItemReport[]): ItemMatch[] {
  if (!isReportEligibleForMatching(item)) return [];

  const oppositeType = item.type === 'lost' ? 'found' : 'lost';
  const candidates = allReports.filter(
    (r) => r.type === oppositeType && isReportEligibleForMatching(r) && r.id !== item.id
  );

  const results: ItemMatch[] = [];

  for (const candidate of candidates) {
    const lostItem = item.type === 'lost' ? item : candidate;
    const foundItem = item.type === 'found' ? item : candidate;

    const { score, tier, reasons, explanationSummary, breakdown } = calculateMatchScore(lostItem, foundItem);
    if (score >= MATCH_THRESHOLD) {
      results.push({
        id: `match-${lostItem.id}-${foundItem.id}`,
        lostItem,
        foundItem,
        score,
        tier,
        reasons,
        explanationSummary,
        breakdown,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
