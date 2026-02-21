import { useQuery } from '@tanstack/react-query';
import { githubService } from '@/shared/services/api';

export function useProfile() {
    return useQuery({
        queryKey: ['github-stats'],
        queryFn: () => githubService.getStats(false),
        staleTime: 60 * 60 * 1000,
        retry: 2,
    });
}

export function useProfileRefresh() {
    return useQuery({
        queryKey: ['github-stats'],
        queryFn: () => githubService.getStats(true),
        enabled: false, // Só roda manualmente
    });
}
