import { User } from '../types';

export interface NotificationState {
  notificationMessage: string | null;
}

export interface AuthState {
  user: User | null;
}

export interface RootState {
  auth: AuthState;
  notification: NotificationState;
} 