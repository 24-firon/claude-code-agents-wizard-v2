'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Bell,
  Settings,
  Terminal,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['CEO', 'CTO', 'PM', 'ADMIN'] },
  { name: 'Technical', href: '/technical', icon: Terminal, roles: ['CTO', 'ADMIN'] },
  { name: 'Documents', href: '/documents', icon: FileText, roles: ['CEO', 'CTO', 'PM', 'ADMIN'] },
  { name: 'Timeline', href: '/timeline', icon: CalendarDays, roles: ['CEO', 'CTO', 'PM', 'ADMIN'] },
  { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['CEO', 'CTO', 'PM', 'ADMIN'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['CEO', 'CTO', 'PM', 'ADMIN'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  const filteredNav = navigation.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 bg-black border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <nav className="h-full overflow-y-auto pt-20 pb-4 px-4">
        <div className="space-y-1">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-gold text-black font-medium'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User Info */}
        {user && (
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="px-3">
              <p className="text-sm font-medium text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              <p className="text-xs text-gold mt-1">{user.role}</p>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
