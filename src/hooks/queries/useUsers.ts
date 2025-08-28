import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import { useDispatch } from "react-redux";
import { notiActions } from "../../store/notification";
import { authActions } from "../../store/auth";
import { ApiResponse, User } from "../../types";

interface UserFilters {
  page?: number;
  search?: string;
}

interface CreateUserData extends Record<string, unknown> {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

interface UpdateUserData extends Partial<CreateUserData> {
  id: number;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  per_page: number;
  total: number;
  links: PaginationLink[];
}

interface UsersResponse {
  data: User[];
  meta: PaginationMeta;
}

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  selected: (ids: number[]) => [...userKeys.all, "selected", ids] as const,
};

export const useUsers = (page = 1, search = "") => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: userKeys.list({ page, search }),
    queryFn: async () => {
      const { data } = await axios.get<UsersResponse>("/users", { params: { page, search } });
      return data;
    },
    staleTime: 10000, // Consider data fresh for 10 seconds
    gcTime: 300000, // Cache for 5 minutes
  });
};

// Hook to fetch specific users by their IDs
export const useSelectedUsers = (userIds: number[] = []) => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: userKeys.selected(userIds),
    queryFn: async () => {
      if (!userIds.length) return { data: [] };
      const { data } = await axios.get<ApiResponse<User[]>>("/users/selected", { 
        params: { ids: userIds.join(",") } 
      });
      return data;
    },
    enabled: userIds.length > 0,
    staleTime: 10000, // Consider data fresh for 10 seconds
    gcTime: 300000, // Cache for 5 minutes
  });
};

export const useUser = (id?: number) => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: userKeys.detail(id!),
    queryFn: async () => {
      const { data } = await axios.get<User>(`/users/${id}`);
      return data;
    },
    enabled: !!id, // Only run if id is provided
    staleTime: 0, // Consider data immediately stale
    gcTime: 0, // Don't cache the data
    refetchOnMount: true // Always refetch when component mounts
  });
};

export const useCreateUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const { data } = await axios.post<ApiResponse<User>>("/users", userData);
      //console.log('Created user data: ', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      dispatch(notiActions.settingNotiMessage("User created successfully"));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
    },
  });
};

export const useUpdateUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async ({ id, ...userData }: UpdateUserData) => {
      const { data } = await axios.put<ApiResponse<User>>(`/users/${id}`, userData);
      //console.log('Updated user data: ', data);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      
      // Update Redux store if the updated user is the logged-in user
      const currentUser = JSON.parse(localStorage.getItem("user") || "null") as User | null;
      if (currentUser && currentUser.id === variables.id) {
        dispatch(authActions.settingUser({
          ...currentUser,
          ...data // Spread the updated user data
        }));
      }

      dispatch(notiActions.settingNotiMessage("User updated successfully"));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
    },
  });
};

export const useDeleteUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.delete<ApiResponse<void>>(`/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      dispatch(notiActions.settingNotiMessage("User was successfully deleted"));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
    }
  });
}; 