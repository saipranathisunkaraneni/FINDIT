import React from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const MyReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E2D9] pb-4">
        <h1 className="text-3xl font-serif font-bold text-[#242923]">My Reports</h1>
        <p className="text-sm text-[#72766F] mt-1">
          Track the status of your lost and found reports.
        </p>
      </div>
      <Card padding="lg">
        <div className="text-center py-12 space-y-3">
          <Badge variant="campus">My Reports Module Ready</Badge>
          <h2 className="text-xl font-serif text-[#242923]">Reports & Match Tracking</h2>
          <p className="text-sm text-[#72766F] max-w-md mx-auto">
            Manage personal reports, view potential match suggestions, and verify claims.
          </p>
        </div>
      </Card>
    </div>
  );
};
