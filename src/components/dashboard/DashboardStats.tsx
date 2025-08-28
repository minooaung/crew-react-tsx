import React from "react";

interface DashboardStatsData {
  totalUsers: number;
  totalOrganizations: number;
  adminUsers: number;
  activeOrganizations: number;
  superAdminUsers?: number;
}

interface DashboardStatsProps {
  stats?: DashboardStatsData;
}

const defaultStats: DashboardStatsData = {
  totalUsers: 0,
  totalOrganizations: 0,
  adminUsers: 0,
  activeOrganizations: 0,
};

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats = defaultStats,
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${
        import.meta.env.VITE_BACKEND_FRAMEWORK === "ASP.NET"
          ? "lg:grid-cols-5"
          : "lg:grid-cols-4"
      } gap-4 mb-6`}
    >
      {/* Super Admin Users Stats Card - Only show for ASP.NET */}
      {import.meta.env.VITE_BACKEND_FRAMEWORK === "ASP.NET" &&
        stats.superAdminUsers !== undefined && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Super Admins
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.superAdminUsers}
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Admin Users Stats Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Admin Users</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.adminUsers}
            </p>
          </div>
        </div>
      </div>

      {/* Users Stats Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalUsers}
            </p>
          </div>
        </div>
      </div>

      {/* Organizations Stats Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Organizations</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalOrganizations}
            </p>
          </div>
        </div>
      </div>

      {/* Active Organizations Stats Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">
              Active Organizations
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.activeOrganizations}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashboardStats);
