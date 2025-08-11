import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className,
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className={cn(
        "flex-1 flex flex-col",
        className
      )}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;