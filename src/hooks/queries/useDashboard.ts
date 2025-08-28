import { useQuery } from '@tanstack/react-query';
import { useAxios } from '../useAxios';
import { DashboardResponse } from '../../types';

export const useDashboardStats = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await axios.get<DashboardResponse>('/dashboard/stats');
      return data;
    },
    // Refresh every minute
    refetchInterval: 60 * 1000,
    // Keep data fresh for 30 seconds
    staleTime: 30 * 1000,
    // Refetch on window focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });
}; 