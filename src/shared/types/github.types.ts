export interface GitHubProfile {
    name: string;
    login: string;
    bio: string;
    avatarUrl: string;
    location: string;
    createdAt: string;
    followers: number;
    following: number;
    publicRepos: number;
    totalStars: number;
    totalForks: number;
}

export interface ContributionDay {
    date: string;
    count: number;
}

export interface ContributionsData {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalRepos: number;
    calendar: ContributionDay[];
}

export interface StreakData {
    current: number;
    longest: number;
    longestStart?: string;
    longestEnd?: string;
    todayContributed: boolean;
}

export interface TopRepo {
    name: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    language: string;
    languageColor: string;
}

export interface GitHubStatsResponse {
    profile: GitHubProfile;
    contributions: ContributionsData;
    streak: StreakData;
    topRepos: TopRepo[];
}

export interface LanguageStat {
    name: string;
    color: string;
    size: number;
    percentage: number;
    repoCount: number;
}

export interface GitHubLanguagesResponse {
    languages: LanguageStat[];
    totalSize: number;
}
