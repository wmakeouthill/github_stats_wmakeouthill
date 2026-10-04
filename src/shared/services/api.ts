import { GitHubStatsResponse, GitHubLanguagesResponse } from '../types/github.types';

// Username hardcoded como fallback para desenvolvimento
const username = import.meta.env.VITE_GITHUB_USERNAME || 'wmakeouthill';

export const githubService = {
    async getStats(fresh = false): Promise<GitHubStatsResponse> {
        const url = `/api/github-stats?username=${username}${fresh ? `&fresh=true&t=${Date.now()}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) {
            let msg = 'Erro ao buscar stats';
            try { const err = await res.json() as any; msg = err.error || msg; } catch (e) { }
            throw new Error(msg);
        }
        return res.json() as any;
    },

    async getLanguages(fresh = false): Promise<GitHubLanguagesResponse> {
        const url = `/api/github-languages?username=${username}${fresh ? `&fresh=true&t=${Date.now()}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) {
            let msg = 'Erro ao buscar linguagens';
            try { const err = await res.json() as any; msg = err.error || msg; } catch (e) { }
            throw new Error(msg);
        }
        return res.json() as any;
    }
}
