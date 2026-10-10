import type { ItemReport, Claim, InAppNotification, ImageAnalysisResult } from '../types';
import { INITIAL_REPORTS, INITIAL_CLAIMS, INITIAL_NOTIFICATIONS } from './sampleData';
import { imageAnalysisService } from './imageAnalysisService';

const STORAGE_KEYS = {
  REPORTS: 'findit_v3_fullphotos_reports',
  CLAIMS: 'findit_v3_fullphotos_claims',
  NOTIFICATIONS: 'findit_v3_fullphotos_notifications',
  INITIALIZED: 'findit_v3_fullphotos_initialized',
};

class StorageService {
  public initialize(): void {
    try {
      const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (!isInitialized) {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
        localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      }
    } catch (err) {
      console.warn('StorageService: LocalStorage initialization warning', err);
    }
  }

  // ---- REPORTS ----
  public getReports(): ItemReport[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (!raw) {
        this.initialize();
        return INITIAL_REPORTS;
      }
      return JSON.parse(raw) as ItemReport[];
    } catch {
      return INITIAL_REPORTS;
    }
  }

  public saveReports(reports: ItemReport[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      return true;
    } catch (err) {
      console.error('StorageService: Failed to save reports (possible quota exceeded)', err);
      return false;
    }
  }

  public addReport(report: ItemReport): boolean {
    const existing = this.getReports();
    const updated = [report, ...existing];
    return this.saveReports(updated);
  }

  public updateReport(report: ItemReport): boolean {
    const existing = this.getReports();
    const index = existing.findIndex((r) => r.id === report.id);
    if (index === -1) return false;
    existing[index] = { ...report, updatedAt: new Date().toISOString() };
    return this.saveReports(existing);
  }

  public deleteReport(id: string): boolean {
    const existing = this.getReports();
    const filtered = existing.filter((r) => r.id !== id);
    return this.saveReports(filtered);
  }

  public updateImageModeration(
    reportId: string,
    status: 'approved' | 'rejected' | 'replacement_requested',
    note?: string
  ): boolean {
    const reports = this.getReports();
    const target = reports.find((r) => r.id === reportId);
    if (!target || !target.imageAnalysis) return false;

    target.imageAnalysis.moderatorReviewStatus = status;
    target.imageAnalysis.moderatorNote = note;
    if (status === 'approved') {
      target.imageAnalysis.isFlaggedForReview = false;
      target.status = 'open';
    } else if (status === 'rejected') {
      target.status = 'hidden';
    }

    return this.saveReports(reports);
  }

  // ---- CLAIMS ----
  public getClaims(): Claim[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CLAIMS);
      if (!raw) return INITIAL_CLAIMS;
      return JSON.parse(raw) as Claim[];
    } catch {
      return INITIAL_CLAIMS;
    }
  }

  public saveClaims(claims: Claim[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
      return true;
    } catch {
      return false;
    }
  }

  public addClaim(claim: Claim): boolean {
    const existing = this.getClaims();
    return this.saveClaims([claim, ...existing]);
  }

  public updateClaimStatus(claimId: string, status: 'approved' | 'rejected', moderatorNote?: string): boolean {
    const claims = this.getClaims();
    const index = claims.findIndex((c) => c.id === claimId);
    if (index === -1) return false;
    claims[index].status = status;
    claims[index].moderatorNote = moderatorNote;
    claims[index].reviewedAt = new Date().toISOString();
    return this.saveClaims(claims);
  }

  // ---- NOTIFICATIONS ----
  public getNotifications(): InAppNotification[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (!raw) return INITIAL_NOTIFICATIONS;
      return JSON.parse(raw) as InAppNotification[];
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  public saveNotifications(notifications: InAppNotification[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      return true;
    } catch {
      return false;
    }
  }

  public addNotification(notification: InAppNotification): boolean {
    const existing = this.getNotifications();
    return this.saveNotifications([notification, ...existing]);
  }

  public markNotificationAsRead(id: string): boolean {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    return this.saveNotifications(updated);
  }

  public markAllNotificationsAsRead(): boolean {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => ({ ...n, read: true }));
    return this.saveNotifications(updated);
  }

  // ---- RESET ----
  public resetToSampleData(): void {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }

  /**
   * Processes, validates, downsamples, and inspects an uploaded image.
   * Returns data URL and image analysis results.
   */
  public async processImageFile(
    file: File,
    category: string,
    existingReports: ItemReport[]
  ): Promise<{ dataUrl: string; analysis: ImageAnalysisResult }> {
    return new Promise((resolve, reject) => {
      // 1. Format check
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!acceptedTypes.includes(file.type)) {
        reject(new Error('Invalid image format. Please select a JPG, PNG, or WebP file.'));
        return;
      }

      // 2. Size limit (5MB before compression)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Image exceeds 5MB size limit. Please upload a smaller file.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          const maxWidth = 800;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas rendering context unavailable.'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.72);

          // Perform automated integrity check
          const analysis = imageAnalysisService.analyzeImage(
            dataUrl,
            file.size,
            file.type,
            img.width,
            img.height,
            category,
            existingReports
          );

          resolve({ dataUrl, analysis });
        };
        img.onerror = () => reject(new Error('Image file could not be decoded.'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file from disk.'));
      reader.readAsDataURL(file);
    });
  }
}

export const storageService = new StorageService();
storageService.initialize();
