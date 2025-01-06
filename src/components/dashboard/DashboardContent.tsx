import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import DownloadApp from './DownloadApp';

const DashboardContent = () => {
  return (
    <div className="p-6 space-y-6">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <DashboardStats />
          <QuickActions />
          <RecentActivity />
        </div>
        
        <div className="space-y-6">
          <DownloadApp />
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <p className="text-sm text-gray-600">Here you can add more details or features.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
