import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color: string;
}

interface QuickActionLinkProps {
  action: QuickAction;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

// Action definitions extracted for better maintainability
const DEFAULT_ACTIONS: QuickAction[] = [
  {
    id: 'add-user',
    name: 'Add User',
    description: 'Create a new user account',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    to: '/users/new',
    color: 'text-blue-700 bg-blue-50 hover:bg-blue-100',
  },
  {
    id: 'new-org',
    name: 'New Organization',
    description: 'Create a new organization',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    to: '/organisations/new',
    color: 'text-green-700 bg-green-50 hover:bg-green-100',
  },
  {
    id: 'generate-report',
    name: 'Generate Report',
    description: 'Create a new report',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    to: '/report',
    color: 'text-purple-700 bg-purple-50 hover:bg-purple-100',
  },
];

const QuickActionLink: React.FC<QuickActionLinkProps> = React.memo(({ action }) => (
  <Link
    to={action.to}
    className={`relative rounded-lg p-4 flex items-center space-x-3 ${action.color} transition-colors duration-200`}
  >
    <div className="flex-shrink-0">{action.icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900">{action.name}</p>
      <p className="text-sm text-gray-500">{action.description}</p>
    </div>
  </Link>
));

QuickActionLink.displayName = 'QuickActionLink';

const QuickActions: React.FC<QuickActionsProps> = ({ actions = DEFAULT_ACTIONS }) => {
  // Memoize the actions to prevent unnecessary re-renders
  const sortedActions = useMemo(() => [...actions].sort((a, b) => a.name.localeCompare(b.name)), [actions]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedActions.map((action) => (
            <QuickActionLink key={action.id} action={action} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(QuickActions); 