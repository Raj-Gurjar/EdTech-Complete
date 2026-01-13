import React from 'react';
import HighlightText from '../../user interfaces/HighlightText';
import '../../pages/Home/Home.scss';

export default function Settings() {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-blackBg">
      {/* Purple Gradient Background Patches */}
      <div className="home-gradient-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="gradient-patch-1"></div>
        <div className="gradient-patch-2"></div>
        <div className="gradient-patch-3"></div>
        <div className="gradient-patch-4"></div>
        <div className="gradient-patch-5"></div>
      </div>
      
      <div className="w-11/12 max-w-6xl mx-auto py-6 sm:py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            <HighlightText text={"Settings"} />
          </h1>
          <p className="text-white4 text-sm sm:text-base">Manage your account settings and preferences</p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Account Settings Card */}
          <div 
            className="rounded-xl shadow-lg p-6 border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Account Settings</h2>
            <p className="text-white4 text-sm">Settings page coming soon...</p>
          </div>

          {/* Notification Settings Card */}
          <div 
            className="rounded-xl shadow-lg p-6 border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Notification Settings</h2>
            <p className="text-white4 text-sm">Notification preferences coming soon...</p>
          </div>

          {/* Privacy Settings Card */}
          <div 
            className="rounded-xl shadow-lg p-6 border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Privacy Settings</h2>
            <p className="text-white4 text-sm">Privacy controls coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
