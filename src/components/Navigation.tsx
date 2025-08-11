import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  Calendar, 
  FileText, 
  MessageSquare, 
  User, 
  Users, 
  Shield, 
  Stethoscope,
  Menu,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Logo = () => (
  <Link to="/landing" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
    <span className="text-blue-600">Clever</span>
    <span className="text-green-600">Heal</span>
  </Link>
);

const Navigation: React.FC = () => {
  const { user, userRole, signOut, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = React.useMemo(() => {
    if (!user || !userRole) return [];

    const baseItems = [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Appointments', href: '/appointments', icon: Calendar },
      { name: 'Profile', href: '/profile', icon: User },
      { name: 'Messages', href: '/messaging', icon: MessageSquare },
    ];

    if (userRole === 'admin') {
      return [
        { name: 'Admin Dashboard', href: '/admin-panel', icon: Shield },
        { name: 'User Management', href: '/user-management', icon: Users },
        { name: 'All Appointments', href: '/appointments', icon: Calendar },
        { name: 'Patient Records', href: '/patient-records', icon: FileText },
      ];
    }

    if (userRole === 'doctor') {
      return [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Doctor Dashboard', href: '/doctor-dashboard', icon: Stethoscope },
        { name: 'Appointments', href: '/appointments', icon: Calendar },
        { name: 'Patient Records', href: '/patient-records', icon: FileText },
        { name: 'Messages', href: '/messaging', icon: MessageSquare },
        { name: 'Profile', href: '/profile', icon: User },
      ];
    }

    if (userRole === 'patient') {
      return [
        { name: 'Patient Dashboard', href: '/patient-dashboard', icon: User },
        { name: 'My Appointments', href: '/appointments', icon: Calendar },
        { name: 'Medical Records', href: '/medical-records', icon: FileText },
        { name: 'Doctors', href: '/doctors', icon: Stethoscope },
        { name: 'Messages', href: '/messaging', icon: MessageSquare },
        { name: 'Profile', href: '/profile', icon: User },
      ];
    }

    return baseItems;
  }, [user, userRole]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/landing');
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const userName = profile?.first_name || profile?.email?.split('@')[0] || 'User';

  if (!user) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn(
      "flex gap-1",
      mobile ? "flex-col space-y-2" : "flex-row"
    )}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
              mobile && "justify-start"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Logo />
            <div className="hidden md:block">
              <NavItems />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {userRole && (
                  <span className="capitalize bg-primary/10 px-2 py-1 rounded-full text-xs mr-2">
                    {userRole}
                  </span>
                )}
                {userName}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{userName}</div>
                      <div className="text-xs text-muted-foreground capitalize">{userRole}</div>
                    </div>
                  </div>
                  <NavItems mobile />
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="justify-start mt-4"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;