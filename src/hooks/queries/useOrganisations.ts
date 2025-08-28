import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from '../useAxios';
import { Organisation, PaginatedResponse } from '../../types';

// Define query keys as constants for type safety and reusability
const organisationKeys = {
  all: ['organisations'] as const,
  lists: () => [...organisationKeys.all, 'list'] as const,
  list: (filters: { page?: number; search?: string }) => 
    [...organisationKeys.lists(), filters] as const,
  details: () => [...organisationKeys.all, 'detail'] as const,
  detail: (id: number) => [...organisationKeys.details(), id] as const,
} as const;

interface OrganisationData {
  name: string;
  user_ids: number[];
}

interface UpdateOrganisationData extends OrganisationData {
  id: number;
}

export const useOrganisations = (page = 1, search = '') => {
  const axios = useAxios();

  return useQuery({
    queryKey: organisationKeys.list({ page, search }),
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Organisation>>(`/organisations?page=${page}&search=${search}`);
      return data;
    },
    staleTime: 5000,
  });
};

export const useOrganisation = (id?: number) => {
  const axios = useAxios();

  return useQuery({
    queryKey: id ? organisationKeys.detail(id) : ['organisation', 'empty'],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await axios.get<Organisation>(`/organisations/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateOrganisation = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: async (data: OrganisationData) => {
      const response = await axios.post<Organisation, OrganisationData>('/organisations', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Update the organizations list
      queryClient.invalidateQueries({
        queryKey: organisationKeys.lists(),
      });
      
      // Add the new organization to the cache
      queryClient.setQueryData(organisationKeys.detail(data.id), data);
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
};

export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateOrganisationData) => {
      const response = await axios.put<Organisation>(`/organisations/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the organization in the cache
      queryClient.setQueryData(organisationKeys.detail(variables.id), data);
      
      // Invalidate and refetch the organizations list
      queryClient.invalidateQueries({
        queryKey: organisationKeys.lists(),
      });
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
};

export const useDeleteOrganisation = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete<void>(`/organisations/${id}`);
      return response.data;
    },
    onSuccess: (_, id) => {
      // Remove the deleted organization from cache
      queryClient.removeQueries({
        queryKey: organisationKeys.detail(id),
      });
      
      // Invalidate and refetch the organizations list
      queryClient.invalidateQueries({
        queryKey: organisationKeys.lists(),
      });
      
      // Invalidate dashboard stats
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      });
    },
  });
}; 