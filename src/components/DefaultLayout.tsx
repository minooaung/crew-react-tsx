import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, MouseEvent } from "react";
import axiosClient from "../axios-client";
import { useSelector } from "react-redux";
import { useLogout } from "../hooks/queries/useAuth";
import { RootState } from "../store/types";

export default function DefaultLayout(): JSX.Element {
  const location = useLocation();
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const notification = useSelector(
    (state: RootState) => state.notification.notificationMessage
  );
  const { mutate: logout } = useLogout();

  if (import.meta.env.VITE_BACKEND_FRAMEWORK === "laravel") {
    // Periodically refresh session every 5 minutes
    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     console.log("Session refreshed");
    //     axiosClient.get("/user").catch(() => {
    //       logout();
    //     });
    //   }, 5 * 60 * 1000);

    //   return () => clearInterval(interval);
    // }, [logout]);

    useEffect(() => {
      const interval = setInterval(() => {
        axiosClient
          .get("/user")
          .then(() => {
            console.log("Session refreshed successfully");
          })
          .catch((error) => {
            // Only logout if it's an authentication error (401)
            if (error.response && error.response.status === 401) {
              console.log("Session expired, logging out");
              logout();
            } else {
              console.warn(
                "Session refresh failed, will retry next interval",
                error
              );
            }
          });
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }, [logout]);
  }

  const onLogout = (ev: MouseEvent<HTMLButtonElement>): void => {
    ev.preventDefault();
    logout();
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-6">
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className={`block px-4 py-2 rounded-lg transition-colors ${
              isActive("/dashboard") ? "bg-blue-700 text-white font-medium" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/users"
            className={`block px-4 py-2 rounded-lg transition-colors ${
              isActive("/users") ? "bg-blue-700 text-white font-medium" : ""
            }`}
          >
            Users
          </Link>
          <Link
            to="/organisations"
            className={`block px-4 py-2 rounded-lg transition-colors ${
              isActive("/organisations")
                ? "bg-blue-700 text-white font-medium"
                : ""
            }`}
          >
            Organisations
          </Link>
          <Link
            to="/report"
            className={`block px-4 py-2 rounded-lg transition-colors ${
              isActive("/report") ? "bg-blue-700 text-white font-medium" : ""
            }`}
          >
            Report
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex-1">
              {/* Page title will go here from child components */}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                {reduxUser?.name}
              </span>
              <button
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {notification}
        </div>
      )}
    </div>
  );
}
