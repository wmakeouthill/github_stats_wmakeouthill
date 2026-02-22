import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

// Consulta GraphQL completa (Profile, Stars, Contributions)
const GITHUB_STATS_QUERY = `
query GitHubStats($username: String!) {
  user(login: $username) {
    name
    login
    bio
    avatarUrl
    location
    createdAt
    followers { totalCount }
    following { totalCount }
    repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        name
        description
        url
        stargazerCount
        forkCount
        primaryLanguage { name color }
        updatedAt
      }
    }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoryContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            color
          }
        }
      }
    }
  }
}
`;

function calculateFallbackStreak(weeks: any[]): { current: number; longest: number; todayContributed: boolean } {
    const allDays = weeks.flatMap((w: any) => w.contributionDays);

    // Obter data exata em Brasília (São Paulo) para evitar o Vercel UTC de pular um dia ou errar
    const spTime = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
    const spDate = new Date(spTime);
    const todayStr = spDate.getFullYear() + '-' + String(spDate.getMonth() + 1).padStart(2, '0') + '-' + String(spDate.getDate()).padStart(2, '0');

    // O Github envia a semana toda, portanto os dias depois de hoje (no futuro) devem ser filtrados
    const validDays = allDays.filter((d: any) => d.date <= todayStr);

    if (validDays.length === 0) return { current: 0, longest: 0, todayContributed: false };

    const todayIndex = validDays.length - 1;
    const todayDay = validDays[todayIndex];
    const todayContributed = todayDay?.contributionCount > 0;

    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    // Calcula a maior sequência de contribuições (Nota: Dentre os 365 dias que o GraphQL retorna)
    for (let i = 0; i < validDays.length; i++) {
        if (validDays[i].contributionCount > 0) {
            tempStreak++;
            if (tempStreak > longest) longest = tempStreak;
        } else {
            tempStreak = 0;
        }
    }

    // Calcula o streak atual, contando de hoje de trás pra frente
    for (let i = todayIndex; i >= 0; i--) {
        if (validDays[i].contributionCount > 0) {
            current++;
        } else if (i === todayIndex) {
            // Hoje teve 0 contribs ainda, mas o dia não acabou no Brasil. Pula pra ontem e continua!
            continue;
        } else {
            // Zerou num dia do passado: game over do streak ativo.
            break;
        }
    }

    return { current, longest, todayContributed };
}

// Fetch Global All-Time Streaks from Readme-Streak-Stats hidden API
async function fetchGlobalStreak(username: string, fallbackWeeks: any[]) {
    const fallback = calculateFallbackStreak(fallbackWeeks);
    try {
        const res = await fetch(`https://github-readme-streak-stats.herokuapp.com/?user=${username}&type=json&timezone=America/Sao_Paulo`);
        if (!res.ok) throw new Error('Global streak api failed');
        const streakData = await res.json() as any;

        return {
            current: streakData.currentStreak?.length || fallback.current,
            longest: streakData.longestStreak?.length || fallback.longest,
            longestStart: streakData.longestStreak?.start,
            longestEnd: streakData.longestStreak?.end,
            todayContributed: fallback.todayContributed
        };
    } catch (e) {
        console.warn('Usando fallback do streak anual:', e);
        return fallback;
    }
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'GitHub token not configured on server' });
    }

    const username = (req.query.username as string) || process.env.GITHUB_USERNAME || 'wmakeouthill';

    try {
        const response = await fetch(GITHUB_GRAPHQL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: GITHUB_STATS_QUERY,
                variables: { username },
            }),
        });

        const { data, errors } = await response.json() as any;

        if (errors) {
            return res.status(502).json({ error: 'GitHub API error', details: errors });
        }

        if (!data || !data.user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const u = data.user;
        const repos = u.repositories.nodes || [];
        const totalStars = repos.reduce((acc: number, r: any) => acc + (r.stargazerCount || 0), 0);
        const totalForks = repos.reduce((acc: number, r: any) => acc + (r.forkCount || 0), 0);

        const contribs = u.contributionsCollection;
        const calendar = contribs.contributionCalendar;

        // Achatando o calendário para o frontend
        const flatCalendar = calendar.weeks.flatMap((w: any) =>
            w.contributionDays.map((d: any) => ({
                date: d.date,
                count: d.contributionCount,
                // A API do Github retorna níveis de cor. Vamos usar contagem pura para o frontend gerenciar
            }))
        );

        const streak = await fetchGlobalStreak(username, calendar.weeks);

        const formatRepo = (r: any) => ({
            name: r.name,
            description: r.description,
            url: r.url,
            stars: r.stargazerCount,
            forks: r.forkCount,
            language: r.primaryLanguage?.name || 'Unknown',
            languageColor: r.primaryLanguage?.color || '#888'
        });

        // Enviamos todos os repositórios públicos
        const allRepos = repos.map(formatRepo);

        const formatted = {
            profile: {
                name: u.name,
                login: u.login,
                bio: u.bio,
                avatarUrl: u.avatarUrl,
                location: u.location,
                createdAt: u.createdAt,
                followers: u.followers.totalCount,
                following: u.following.totalCount,
                publicRepos: u.repositories.totalCount,
                totalStars,
                totalForks
            },
            contributions: {
                totalCommits: contribs.totalCommitContributions,
                totalPRs: contribs.totalPullRequestContributions,
                totalIssues: contribs.totalIssueContributions,
                totalRepos: contribs.totalRepositoryContributions,
                calendar: flatCalendar
            },
            streak,
            topRepos: allRepos
        };

        const fresh = req.query.fresh === 'true';

        // Se o usuário pediu fresh, bypassa o cache Edge
        if (fresh) {
            res.setHeader('Cache-Control', 'no-store');
        } else {
            // 24 horas de cache puro (86400s) + 12 horas de stale-while-revalidate 
            res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
        }

        return res.status(200).json(formatted);

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal server error while fetching stats' });
    }
}
