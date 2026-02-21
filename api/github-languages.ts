import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

const GITHUB_LANGUAGES_QUERY = `
query Languages($username: String!) {
  user(login: $username) {
    repositories(first: 100, ownerAffiliations: OWNER) {
      nodes {
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node { name color }
          }
        }
      }
    }
  }
}
`;

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
                query: GITHUB_LANGUAGES_QUERY,
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

        const repos = data.user.repositories.nodes || [];

        const langMap = new Map<string, { name: string; color: string; size: number; repoCount: number }>();
        let totalSize = 0;

        for (const repo of repos) {
            if (!repo.languages || !repo.languages.edges) continue;

            const langs = repo.languages.edges;
            for (const lang of langs) {
                const name = lang.node.name;
                const size = lang.size;
                const color = lang.node.color;

                totalSize += size;

                if (langMap.has(name)) {
                    const existing = langMap.get(name)!;
                    existing.size += size;
                    existing.repoCount += 1;
                } else {
                    langMap.set(name, { name, color, size, repoCount: 1 });
                }
            }
        }

        // Ordenar por tamanho e calcular percentagens
        const sortedLangs = Array.from(langMap.values())
            .sort((a, b) => b.size - a.size)
            .map(l => ({
                ...l,
                percentage: totalSize > 0 ? Number(((l.size / totalSize) * 100).toFixed(2)) : 0
            }));

        const formatted = {
            languages: sortedLangs,
            totalSize
        };

        const fresh = req.query.fresh === 'true';
        if (fresh) {
            res.setHeader('Cache-Control', 'no-store');
        } else {
            res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
        }

        return res.status(200).json(formatted);

    } catch (error) {
        console.error('Server error (languages):', error);
        return res.status(500).json({ error: 'Internal server error while fetching languages' });
    }
}
