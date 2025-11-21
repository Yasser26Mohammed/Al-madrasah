
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Menu, X, LogOut, School, Bell, User } from 'lucide-react';

interface LayoutProps {
  role: UserRole;
  title: string;
  onLogout: () => void;
  children: React.ReactNode;
  userName?: string;
}

export const Layout: React.FC<LayoutProps> = ({ role, title, onLogout, children, userName }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getThemeColor = () => {
    switch (role) {
      case UserRole.ADMIN: return 'bg-indigo-600';
      case UserRole.TEACHER: return 'bg-teal-600';
      case UserRole.PARENT: return 'bg-orange-500';
      case UserRole.STUDENT: return 'bg-blue-600';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className={`md:hidden flex justify-between items-center p-4 text-white ${getThemeColor()}`}>
        <span className="font-bold text-lg">{title}</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className={`h-full flex flex-col`}>
          <div className={`p-6 flex items-center justify-center ${getThemeColor()} text-white`}>
             <School className="w-8 h-8 ml-2" />
             <h1 className="text-2xl font-bold">مدرستي</h1>
          </div>
          
          <div className="p-4 border-b bg-gray-50">
             <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User />
                </div>
                <div className="mr-3">
                    <p className="text-sm font-semibold text-gray-800">{userName || 'المستخدم'}</p>
                    <p className="text-xs text-gray-500">
                        {role === UserRole.ADMIN && 'مدير النظام'}
                        {role === UserRole.TEACHER && 'معلم'}
                        {role === UserRole.PARENT && 'ولي أمر'}
                        {role === UserRole.STUDENT && 'طالب'}
                    </p>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Navigation items could go here if we had routing, for now it's a SPA dashboard */}
            <div className={`p-4 rounded-lg border text-sm ${
                role === UserRole.STUDENT ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>
                مرحباً بك في البوابة الإلكترونية. يمكنك الوصول إلى جميع الخدمات من لوحة التحكم الرئيسية.
            </div>
          </div>

          <div className="p-4 border-t">
            <button 
                onClick={onLogout}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto h-screen">
        <header className="bg-white shadow-sm p-6 hidden md:flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <div className="flex items-center text-gray-500">
                <Bell className="w-6 h-6 cursor-pointer hover:text-gray-700 transition-colors" />
            </div>
        </header>
        <main className="p-4 md:p-8">
            {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};
