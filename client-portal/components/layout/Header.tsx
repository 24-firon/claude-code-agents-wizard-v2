'use client';
import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useLogout } from '@/lib/api/queries';
import { Menu, Bell, LogOut, User, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export function Header() {
  const { user } = useAuthStore();
  const { toggleSidebar, language, setLanguage } = useUIStore();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-40 bg-black border-b border-gray-800 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                <span className="text-black font-bold">KI</span>
              </div>
              <span className="font-semibold text-lg hidden sm:inline">Client Portal</span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
              className="px-3 py-1.5 text-sm hover:bg-gray-800 rounded-lg transition-colors"
            >
              {language === 'en' ? 'DE' : 'EN'}
            </button>

            {/* Notifications */}
            <Link href="/notifications">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
              </button>
            </Link>

            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
                <Link href="/settings/profile">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                </Link>
                <button
                  onClick={() => logout.mutate()}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-error"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
