// User related types
export type UserRole = "ADMIN" | "EMPLOYEE";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  formatted_created_at?: string;
  formatted_updated_at?: string;
  organisations?: Organisation[];
}

export interface AuthResponseBase {
  user: User;
}

// Organisation related types
export interface Organisation {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  formatted_created_at?: string;
  formatted_updated_at?: string;
  users?: User[];
  users_count?: number;
}

export interface OrganisationData {
  name: string;
  user_ids: number[];
}

export interface UpdateOrganisationData {
  id: number;
  name: string;
  user_ids: number[];
}

// Common response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  per_page: number;
  total: number;
  links: PaginationLink[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Auth related types
export interface LoginCredentials extends Record<string, unknown> {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  name: string;
  password_confirmation: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

// Dashboard related types
interface DashboardStats {
  totalUsers: number;
  totalOrganizations: number;
  adminUsers: number;
  activeOrganizations: number;
  superAdminUsers?: number;
}

interface UserRoles {
  superAdminCount?: number;
  adminCount: number;
  employeeCount: number;
}

interface Growth {
  labels: string[];
  users: number[];
  organizations: number[];
}

interface DashboardMeta {
  lastUpdated: string;
}

interface DashboardData {
  stats: DashboardStats;
  userRoles: UserRoles;
  growth: Growth;
  meta: DashboardMeta;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}
