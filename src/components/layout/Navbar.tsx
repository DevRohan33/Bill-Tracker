
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText, BarChart } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div className="flex items-center">
            <div className="text-xl font-bold text-primary">Simple Bill Tracker</div>
          </div>

          {/* Navigation */}
          <div className="flex space-x-2">
            <NavLink to="/" className={({ isActive }) => 
              `${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'} 
               transition-colors rounded-md`
            }>
              <Button variant="ghost" className="flex items-center space-x-2">
                <BarChart size={18} />
                {!isMobile && <span>Dashboard</span>}
              </Button>
            </NavLink>
            
            <NavLink to="/upload" className={({ isActive }) => 
              `${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'} 
               transition-colors rounded-md`
            }>
              <Button variant="ghost" className="flex items-center space-x-2">
                <FileText size={18} />
                {!isMobile && <span>Add Bill</span>}
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
