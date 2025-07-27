import React from 'react';
import { Calendar, Users, CreditCard, FileText, Settings, Home, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'receptionist' | 'doctor' | 'billing';
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, userRole }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'receptionist', 'doctor', 'billing'] },
    { id: 'patients', label: 'Patients', icon: Users, roles: ['admin', 'receptionist', 'doctor'] },
    { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['admin', 'receptionist', 'doctor'] },
    { id: 'billing', label: 'Billing', icon: CreditCard, roles: ['admin', 'billing', 'receptionist'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin', 'billing'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  const availableItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <nav className="bg-card border-r border-border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">MedClinic</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {availableItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  activeTab === item.id && "bg-primary text-primary-foreground"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="p-3 bg-accent rounded-lg">
          <p className="text-xs font-medium">Role: {userRole}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {userRole === 'admin' ? 'Full Access' : 
             userRole === 'doctor' ? 'Patient & Appointment Access' :
             userRole === 'receptionist' ? 'Front Desk Access' :
             'Billing Access'}
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;