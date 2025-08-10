import React, { useState } from 'react';
import Navigation from '@/components/layout/navigation';
import DashboardOverview from '@/components/dashboard/dashboard-overview';
import PatientRegistration from '@/components/patients/patient-registration';
import AppointmentScheduler from '@/components/appointments/appointment-scheduler';
import heroImage from '@/assets/medical-hero.jpg';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<'admin' | 'receptionist' | 'doctor' | 'billing'>('admin');
  
  const userProfiles = {
    admin: { name: 'Dr. Sarah Wilson', email: 'sarah.wilson@medclinic.com', avatar: 'SW' },
    receptionist: { name: 'Emily Johnson', email: 'emily.johnson@medclinic.com', avatar: 'EJ' },
    doctor: { name: 'Dr. Michael Chen', email: 'michael.chen@medclinic.com', avatar: 'MC' },
    billing: { name: 'Robert Martinez', email: 'robert.martinez@medclinic.com', avatar: 'RM' }
  };
  
  const currentUser = userProfiles[userRole];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview userRole={userRole} />;
      case 'patients':
        return <PatientRegistration />;
      case 'appointments':
        return <AppointmentScheduler />;
      case 'billing':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Billing & Payments</h2>
            <p className="text-muted-foreground">Coming soon - Complete billing management</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>
            <p className="text-muted-foreground">Coming soon - Detailed reporting system</p>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-4">User Role Simulator</h3>
              <div className="flex gap-2">
                {(['admin', 'receptionist', 'doctor', 'billing'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRole(role)}
                    className={`px-3 py-1 rounded text-sm ${
                      userRole === role 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <DashboardOverview userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-64 flex-shrink-0">
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userRole={userRole}
          currentUser={currentUser}
        />
      </div>
      
      <div className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && (
          <div 
            className="h-48 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-primary/20"></div>
          </div>
        )}
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
