import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  Plus,
  Download,
  Upload,
  Settings,
  CheckCircle,
  X,
} from 'lucide-react';
import { useWorkspaces, switchWorkspace } from '../hooks/useMetrics';
import { useStore } from '../store/useStore';
import { useQueryClient } from '@tanstack/react-query';

export function Workspaces() {
  const { data, isLoading } = useWorkspaces();
  const { currentWorkspace, setCurrentWorkspace } = useStore();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const workspaces = data?.workspaces || [];

  const handleSwitchWorkspace = async (workspaceName: string) => {
    try {
      await switchWorkspace(workspaceName);
      setCurrentWorkspace(workspaceName);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    } catch (error) {
      console.error('Failed to switch workspace:', error);
    }
  };

  const handleCreateWorkspace = () => {
    // In a real implementation, this would call an API
    console.log('Creating workspace:', newWorkspaceName);
    setShowCreateModal(false);
    setNewWorkspaceName('');
  };

  const handleExport = (workspace: any) => {
    // In a real implementation, this would export workspace data
    const dataStr = JSON.stringify(workspace, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${workspace.name}-export.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Workspaces
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your project workspaces and switch between them
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Workspace
        </button>
      </div>

      {/* Workspaces Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No workspaces yet. Create your first workspace to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace: any, index: number) => (
            <motion.div
              key={workspace.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-6 rounded-lg border cursor-pointer transition-all ${
                currentWorkspace === workspace.name
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                  : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-gray-700 hover:shadow-lg'
              }`}
              onClick={() => handleSwitchWorkspace(workspace.name)}
            >
              {/* Workspace Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${
                    currentWorkspace === workspace.name
                      ? 'bg-blue-100 dark:bg-blue-900/40'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Folder className={`w-6 h-6 ${
                      currentWorkspace === workspace.name
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {workspace.name}
                    </h3>
                    {workspace.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {workspace.description}
                      </p>
                    )}
                  </div>
                </div>

                {currentWorkspace === workspace.name && (
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                )}
              </div>

              {/* Workspace Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tasks:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {workspace.todoCount || 0}
                  </span>
                </div>
                {workspace.created && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(workspace.created).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExport(workspace);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle settings
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Workspace Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Create Workspace
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Create a new workspace for your project
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="my-new-workspace"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateWorkspace}
                    disabled={!newWorkspaceName.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
