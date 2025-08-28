import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./views/Users";
import UserForm from "./views/UserForm";
import Organisations from "./views/Organisations";
import OrganisationForm from "./views/OrganisationForm";
import Report from "./views/Report";
import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" />
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      {
        path: '/users',
        element: <ProtectedRoute><Users /></ProtectedRoute>
      },
      {
        path: '/users/new',
        element: <ProtectedRoute><UserForm key="userCreate" /></ProtectedRoute>
      },
      {
        path: '/users/:id',
        element: <ProtectedRoute><UserForm key="userUpdate" /></ProtectedRoute>
      },
      {
        path: '/organisations',
        element: <ProtectedRoute><Organisations /></ProtectedRoute>
      },
      {
        path: '/organisations/new',
        element: <ProtectedRoute><OrganisationForm key="orgCreate" /></ProtectedRoute>
      },
      {
        path: '/organisations/:id',
        element: <ProtectedRoute><OrganisationForm key="orgUpdate" /></ProtectedRoute>
      },
      {
        path: '/report',
        element: <ProtectedRoute><Report /></ProtectedRoute>
      }
    ]
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <PublicOnlyRoute><Login /></PublicOnlyRoute>
      },
      {
        path: '/signup',
        element: <PublicOnlyRoute><Signup /></PublicOnlyRoute>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router; 