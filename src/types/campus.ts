/**
 * Campus and user definition types
 */

export interface CampusInfo {
  id: string;
  name: string;
  shortCode: string;
  city: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'admin';
  campus: string;
  avatarLetter: string;
}

export interface NotificationItem {
  id: string;
  type: 'match' | 'claim' | 'status' | 'approved';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  relatedItemId?: string;
}
