import { useQuery } from '@tanstack/react-query';
import { githubService } from '@/shared/services/api';

export function useLanguages() {
    const isFresh = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('fresh') === 'true' : false;

    return useQuery({
        queryKey: ['github-languages'],
        queryFn: () => githubService.getLanguages(isFresh),
        staleTime: 60 * 60 * 1000, // 1 hora de cache, linguagens não mudam tanto
        retry: 2,
    });
}

export function useLanguagesRefresh() {
    return useQuery({
        queryKey: ['github-languages'],
        queryFn: () => githubService.getLanguages(true),
        enabled: false,
    });
}
