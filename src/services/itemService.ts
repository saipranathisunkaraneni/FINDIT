import type { ItemReport, ItemFilterOptions, ItemMatch } from '../types';

/**
 * Service contracts for Findit items and SmartMatch.
 * This establishes clean API boundaries without mock server artifacts.
 */
export interface ItemService {
  getItems: (filters?: ItemFilterOptions) => Promise<ItemReport[]>;
  getItemById: (id: string) => Promise<ItemReport | null>;
  createReport: (report: Omit<ItemReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ItemReport>;
  findMatches: (itemId: string) => Promise<ItemMatch[]>;
  claimItem: (itemId: string, verificationAnswer: string) => Promise<{ success: boolean; message: string }>;
}

