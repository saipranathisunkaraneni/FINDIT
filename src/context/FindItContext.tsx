import React, { useState, useMemo, useCallback } from 'react';
import type { ItemReport, Claim, InAppNotification } from '../types';
import { storageService } from '../services/storageService';
import { generateAllMatches, getMatchesForItem, MATCH_THRESHOLD } from '../services/matchingEngine';
import { FindItContext, type ToastState, type CurrentUser } from './findItContextDef';

export const FindItProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const savedCampus = localStorage.getItem('findit_selected_campus') || 'KITSW (Main Campus)';
    return {
      id: 'demo-user',
      name: 'Pranav (Demo Student)',
      role: 'student',
      campus: savedCampus,
      avatarLetter: 'P',
    };
  });

  const [reports, setReports] = useState<ItemReport[]>(() => storageService.getReports());
  const [claims, setClaims] = useState<Claim[]>(() => storageService.getClaims());
  const [notifications, setNotifications] = useState<InAppNotification[]>(() =>
    storageService.getNotifications()
  );
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Automatically recalculate matches whenever reports change
  const matches = useMemo(() => {
    return generateAllMatches(reports);
  }, [reports]);

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Add new report with instant matching check
  const addReport = useCallback(
    async (
      data: Omit<ItemReport, 'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'ownerName' | 'status'>
    ): Promise<ItemReport | null> => {
      const now = new Date().toISOString();
      const isFlagged = data.imageAnalysis?.isFlaggedForReview ?? false;

      const newReport: ItemReport = {
        ...data,
        id: `rep-${Date.now().toString().slice(-6)}`,
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        status: isFlagged ? 'under_review' : 'open',
        createdAt: now,
        updatedAt: now,
        saveCount: 0,
      };

      const success = storageService.addReport(newReport);
      if (!success) {
        showToast('Storage error: Failed to save report locally.', 'error');
        return null;
      }

      setReports((prev) => [newReport, ...prev]);

      if (isFlagged) {
        showToast(
          `Report submitted! Image has been flagged for routine coordinator review.`,
          'info'
        );
      } else {
        showToast(`Report for "${newReport.title}" published!`, 'success');
      }

      // Check for immediate matches using universal MATCH_THRESHOLD
      const candidateMatches = getMatchesForItem(newReport, reports);
      const topMatch = candidateMatches[0];

      if (topMatch && topMatch.score >= MATCH_THRESHOLD) {
        const notif: InAppNotification = {
          id: `notif-${Date.now()}`,
          type: 'match',
          title: `SmartMatch Candidate (${topMatch.score}%)`,
          message: `Your new report "${newReport.title}" matched with "${
            newReport.type === 'lost' ? topMatch.foundItem.title : topMatch.lostItem.title
          }"!`,
          relatedReportId: newReport.type === 'lost' ? topMatch.foundItem.id : topMatch.lostItem.id,
          timestamp: new Date().toISOString(),
          read: false,
        };
        storageService.addNotification(notif);
        setNotifications((prev) => [notif, ...prev]);
      }

      return newReport;
    },
    [currentUser, reports, showToast]
  );

  const updateReport = useCallback(
    (updated: ItemReport): boolean => {
      const ok = storageService.updateReport(updated);
      if (ok) {
        setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        showToast('Report updated successfully.', 'success');
      }
      return ok;
    },
    [showToast]
  );

  const deleteReport = useCallback(
    (id: string): boolean => {
      const ok = storageService.deleteReport(id);
      if (ok) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        showToast('Report removed from campus registry.', 'info');
      }
      return ok;
    },
    [showToast]
  );

  const resolveReport = useCallback(
    (id: string): boolean => {
      const existing = reports.find((r) => r.id === id);
      if (!existing) return false;

      const resolved: ItemReport = {
        ...existing,
        status: 'resolved',
        updatedAt: new Date().toISOString(),
      };

      const ok = storageService.updateReport(resolved);
      if (ok) {
        setReports((prev) => prev.map((r) => (r.id === id ? resolved : r)));
        showToast(`Item "${existing.title}" marked as resolved!`, 'success');

        const notif: InAppNotification = {
          id: `notif-${Date.now()}`,
          type: 'resolved',
          title: 'Report Successfully Resolved',
          message: `Belonging "${existing.title}" has been marked returned/resolved.`,
          relatedReportId: id,
          timestamp: new Date().toISOString(),
          read: false,
        };
        storageService.addNotification(notif);
        setNotifications((prev) => [notif, ...prev]);
      }
      return ok;
    },
    [reports, showToast]
  );

  const updateImageModeration = useCallback(
    (
      reportId: string,
      status: 'approved' | 'rejected' | 'replacement_requested',
      note?: string
    ): boolean => {
      const ok = storageService.updateImageModeration(reportId, status, note);
      if (ok) {
        setReports(storageService.getReports());
        showToast(`Image moderation updated: ${status}.`, 'info');

        const notif: InAppNotification = {
          id: `notif-${Date.now()}`,
          type: 'image_review',
          title: `Image Review Update: ${status}`,
          message: `Moderator reviewed uploaded photo for report #${reportId}. ${note || ''}`,
          relatedReportId: reportId,
          timestamp: new Date().toISOString(),
          read: false,
        };
        storageService.addNotification(notif);
        setNotifications((prev) => [notif, ...prev]);
      }
      return ok;
    },
    [showToast]
  );

  const submitClaim = useCallback(
    (reportId: string, reportTitle: string, reason: string, verificationDetail: string): boolean => {
      const newClaim: Claim = {
        id: `claim-${Date.now().toString().slice(-6)}`,
        reportId,
        reportTitle,
        claimantId: currentUser.id,
        claimantName: currentUser.name,
        reason,
        verificationDetail,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const ok = storageService.addClaim(newClaim);
      if (ok) {
        setClaims((prev) => [newClaim, ...prev]);
        showToast('Ownership claim submitted for coordinator verification!', 'success');

        const notif: InAppNotification = {
          id: `notif-${Date.now()}`,
          type: 'claim',
          title: 'Claim Submitted (Under Review)',
          message: `Your verification details for "${reportTitle}" have been recorded securely.`,
          relatedReportId: reportId,
          timestamp: new Date().toISOString(),
          read: false,
        };
        storageService.addNotification(notif);
        setNotifications((prev) => [notif, ...prev]);
      }
      return ok;
    },
    [currentUser, showToast]
  );

  const updateClaimStatus = useCallback(
    (claimId: string, status: 'approved' | 'rejected', moderatorNote?: string): boolean => {
      const ok = storageService.updateClaimStatus(claimId, status, moderatorNote);
      if (ok) {
        setClaims(storageService.getClaims());

        // When a claim is approved by the coordinator, automatically resolve the claimed item report
        if (status === 'approved') {
          const claims = storageService.getClaims();
          const targetClaim = claims.find((c) => c.id === claimId);
          if (targetClaim) {
            const allReports = storageService.getReports();
            const repIndex = allReports.findIndex((r) => r.id === targetClaim.reportId);
            if (repIndex !== -1 && allReports[repIndex].status !== 'resolved') {
              allReports[repIndex] = {
                ...allReports[repIndex],
                status: 'resolved',
                updatedAt: new Date().toISOString(),
              };
              storageService.saveReports(allReports);
              setReports(allReports);
            }
          }
        }

        showToast(`Claim has been marked as ${status}.`, 'info');

        const notif: InAppNotification = {
          id: `notif-${Date.now()}`,
          type: 'claim_update',
          title: `Claim Decision: ${status.toUpperCase()}`,
          message: `Coordinator reviewed claim #${claimId}. ${moderatorNote || ''}`,
          timestamp: new Date().toISOString(),
          read: false,
        };
        storageService.addNotification(notif);
        setNotifications((prev) => [notif, ...prev]);
      }
      return ok;
    },
    [showToast]
  );

  const markNotificationRead = useCallback((id: string) => {
    storageService.markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    storageService.markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  }, [showToast]);

  const getMatchesForReport = useCallback(
    (item: ItemReport) => {
      return getMatchesForItem(item, reports);
    },
    [reports]
  );

  const resetData = useCallback(() => {
    storageService.resetToSampleData();
    setReports(storageService.getReports());
    setClaims(storageService.getClaims());
    setNotifications(storageService.getNotifications());
    showToast('Demo dataset refreshed to initial hackathon sample state.', 'info');
  }, [showToast]);

  const updateCampus = useCallback(
    (campus: string) => {
      setCurrentUser((prev) => ({ ...prev, campus }));
      localStorage.setItem('findit_selected_campus', campus);
      showToast(`Switched campus to ${campus}`, 'info');
    },
    [showToast]
  );

  return (
    <FindItContext.Provider
      value={{
        currentUser,
        reports,
        claims,
        notifications,
        matches,
        unreadNotifsCount,
        toasts,
        showToast,
        dismissToast,
        addReport,
        updateReport,
        deleteReport,
        resolveReport,
        updateImageModeration,
        submitClaim,
        updateClaimStatus,
        markNotificationRead,
        markAllNotificationsRead,
        getMatchesForReport,
        updateCampus,
        resetData,
      }}
    >
      {children}
    </FindItContext.Provider>
  );
};
