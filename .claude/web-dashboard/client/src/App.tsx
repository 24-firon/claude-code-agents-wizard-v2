import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Folder,
  Menu,
  X,
  Sun,
  Moon,
  Activity,
} from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Metrics } from './pages/Metrics';
import { Agents } from './pages/Agents';
import { Workspaces } from './pages/Workspaces';
import { useStore } from './store/useStore';
import { useWebSocket } from './hooks/useWebSocket';
import clsx from 'clsx';

function AppContent() {
  const location = useLocation();
  const { theme, toggleTheme, sidebarOpen, toggleSidebar, currentWorkspace } = useStore();
  const { isConnected } = useWebSocket();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Metrics', href: '/metrics', icon: BarChart3 },
    { name: 'Agents', href: '/agents', icon: Users },
    { name: 'Workspaces', href: '/workspaces', icon: Folder },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-40 h-screen transition-transform',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-gray-700'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Agent Dashboard
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Real-time Monitoring
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Workspace Info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Current Workspace
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {currentWorkspace}
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div
                className={clsx(
                  'w-2 h-2 rounded-full',
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                )}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={clsx('transition-all', sidebarOpen ? 'lg:ml-64' : 'ml-0')}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* Connection Indicator */}
              <div
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
                  isConnected
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                )}
              >
                <div
                  className={clsx(
                    'w-2 h-2 rounded-full',
                    isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  )}
                />
                {isConnected ? 'Live' : 'Offline'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/metrics" element={<Metrics />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/workspaces" element={<Workspaces />} />
            </Routes>
          </motion.div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
