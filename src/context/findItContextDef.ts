import { createContext } from 'react';
import type { ItemReport, Claim, InAppNotification, ItemMatch } from '../types';

export interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface CurrentUser {
  id: string;
  name: string;
  role: 'student' | 'admin';
  campus: string;
  avatarLetter: string;
}

export interface FindItContextType {
  currentUser: CurrentUser;
  reports: ItemReport[];
  claims: Claim[];
  notifications: InAppNotification[];
  matches: ItemMatch[];
  unreadNotifsCount: number;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  addReport: (newReport: Omit<ItemReport, 'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'ownerName' | 'status'>) => Promise<ItemReport | null>;
  updateReport: (updated: ItemReport) => boolean;
  deleteReport: (id: string) => boolean;
  resolveReport: (id: string) => boolean;
  updateImageModeration: (reportId: string, status: 'approved' | 'rejected' | 'replacement_requested', note?: string) => boolean;
  submitClaim: (reportId: string, reportTitle: string, reason: string, verificationDetail: string) => boolean;
  updateClaimStatus: (claimId: string, status: 'approved' | 'rejected', moderatorNote?: string) => boolean;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getMatchesForReport: (item: ItemReport) => ItemMatch[];
  updateCampus: (campus: string) => void;
  resetData: () => void;
}

export const FindItContext = createContext<FindItContextType | null>(null);
