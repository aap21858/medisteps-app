import React from 'react';
import { Calendar, Users, CreditCard, FileText, Settings, Home, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'receptionist' | 'doctor' | 'billing';
  currentUser: {
    name: string;
    email: string;
    avatar: string;
  };
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, userRole, currentUser }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'receptionist', 'doctor', 'billing'] },
    { id: 'patients', label: 'Patients', icon: Users, roles: ['admin', 'receptionist', 'doctor'] },
    { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['admin', 'receptionist', 'doctor'] },
    { id: 'staff', label: 'Staff Management', icon: Users, roles: ['admin'] },
    { id: 'billing', label: 'Billing', icon: CreditCard, roles: ['admin', 'billing', 'receptionist'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin', 'billing'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];
  const navigate = useNavigate();

  const availableItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleSignOut = () => {
    localStorage.removeItem("token"); // or sessionStorage if you use that
    navigate('/login'); // redirect to login page
  };

  return (
    <nav className="bg-card border-r border-border flex flex-col h-full">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Healix</h1>
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
      
      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
            {currentUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {userRole === 'admin' ? 'Administrator' : 
               userRole === 'doctor' ? 'Doctor' :
               userRole === 'receptionist' ? 'Receptionist' :
               'Billing Specialist'}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          {/* <a 
            href="/login"
            className="block w-full text-center py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            Sign Out
          </a> */}
          <Button
            variant="outline"
            className="w-full text-center py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;