import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText, BarChart, User } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const isMobile = useIsMobile();

const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="text-xl font-bold text-primary">Simple Bill Tracker</div>

          {/* Middle: Navigation Links */}
          <div className="flex space-x-2 items-center">
            <NavLink to="/dashboard" className={({ isActive }) =>
              `${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'} transition-colors rounded-md`
            }>
              <Button variant="ghost" className="flex items-center space-x-2">
                <BarChart size={18} />
                {!isMobile && <span>Dashboard</span>}
              </Button>
            </NavLink>

            <NavLink to="/upload" className={({ isActive }) =>
              `${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'} transition-colors rounded-md`
            }>
              <Button variant="ghost" className="flex items-center space-x-2">
                <FileText size={18} />
                {!isMobile && <span>Add Bill</span>}
              </Button>
            </NavLink>
          </div>

          {/* Right: Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert("Go to profile")}>Your Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("About section")}>About</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
