import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Target,
  BookOpen,
  DollarSign,
  Megaphone,
  Trophy,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Menu,
  X,
  ChevronDown,
  Building2,
  LogOut
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const navigationItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/students', icon: Users, label: 'Students' },
  { path: '/groups', icon: UserCheck, label: 'Groups & Coaches' },
  { path: '/sessions', icon: Calendar, label: 'Sessions' },
  { path: '/assessments', icon: Target, label: 'Assessments' },
  { path: '/drills', icon: BookOpen, label: 'Drills Library' },
  { path: '/finance', icon: DollarSign, label: 'Finance' },
  { path: '/announcements', icon: Megaphone, label: 'Announcements' },
  { path: '/events', icon: Trophy, label: 'Events' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAcademyDropdownOpen, setIsAcademyDropdownOpen] = useState(false);
  const location = useLocation();
  
  const { 
    academies, 
    activeAcademyId, 
    setActiveAcademy,
    currentUser,
    setCurrentUser
  } = useStore();

  const activeAcademy = academies.find(a => a.id === activeAcademyId);
  const userAcademies = currentUser?.academyIds 
    ? academies.filter(a => currentUser.academyIds.includes(a.id))
    : academies;

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const handleAcademyChange = (academyId: string) => {
    setActiveAcademy(academyId);
    setIsAcademyDropdownOpen(false);
  };

  const handleLogout = () => {
    // Clear user session
    setCurrentUser(null);
    // Clear any stored tokens or session data
    localStorage.removeItem('userToken');
    localStorage.removeItem('activeAcademyId');
    // Redirect to login page or home
    window.location.href = '/login';
  };

  const isItemActive = (item: any) => {
    return location.pathname === item.path || 
      (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 h-screen flex flex-col
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'fixed z-50 lg:relative' : 'hidden lg:flex'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
                    AcademyPro
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Management</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Academy Selector */}
        {!isCollapsed && userAcademies.length > 1 && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <button
                onClick={() => setIsAcademyDropdownOpen(!isAcademyDropdownOpen)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activeAcademy?.name || 'Select Academy'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Active Academy
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                  isAcademyDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown */}
              {isAcademyDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {userAcademies.map((academy) => (
                    <button
                      key={academy.id}
                      onClick={() => handleAcademyChange(academy.id)}
                      className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        academy.id === activeAcademyId ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          academy.id === activeAcademyId ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`} />
                        <div>
                          <p className={`text-sm font-medium ${
                            academy.id === activeAcademyId 
                              ? 'text-primary-600 dark:text-primary-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {academy.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {academy.address}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`} />
                {!isCollapsed && (
                  <span className="font-medium text-sm ml-3">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-gray-500 group-hover:text-red-600 dark:group-hover:text-red-400" />
            {!isCollapsed && (
              <span className="font-medium text-sm ml-3">Logout</span>
            )}
          </button>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>© 2024 AcademyPro</p>
              <p>Management System</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};