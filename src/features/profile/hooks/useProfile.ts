import { useQuery } from '@tanstack/react-query';
import { githubService } from '@/shared/services/api';

export function useProfile() {
    // Permite que o App reaja a '?fresh=true' na URL (usado pelo Puppeteer e por você manualmente)
    const isFresh = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('fresh') === 'true' : false;

    return useQuery({
        queryKey: ['github-stats'],
        queryFn: () => githubService.getStats(isFresh),
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
