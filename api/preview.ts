import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Retorna um SVG de preview do painel (estilo github-readme-stats).
 * Uso no README: ![Preview](https://github-stats-wmakeouthill.vercel.app/api/preview)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).setHeader('Allow', 'GET').end();
    }

    const username = (req.query.username as string) || process.env.GITHUB_USERNAME || 'wmakeouthill';
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

    let profile: { login: string; followers: number; publicRepos: number; totalStars?: number; avatarUrl?: string };
    let streak: { current: number; longest: number };

    try {
        const apiRes = await fetch(`${baseUrl}/api/github-stats?username=${encodeURIComponent(username)}`);
        if (!apiRes.ok) throw new Error('Stats API failed');
        const data = await apiRes.json() as any;
        profile = {
            login: data.profile?.login || username,
            followers: data.profile?.followers ?? 0,
            publicRepos: data.profile?.publicRepos ?? 0,
            totalStars: data.profile?.totalStars ?? 0,
            avatarUrl: data.profile?.avatarUrl
        };
        streak = {
            current: data.streak?.current ?? 0,
            longest: data.streak?.longest ?? 0
        };
    } catch {
        profile = { login: username, followers: 0, publicRepos: 0, totalStars: 0 };
        streak = { current: 0, longest: 0 };
    }

    const bg = '#002E59';
    const accent = '#DBC27D';
    const text = '#e6edf3';
    const muted = '#8b949e';

    const avatarHref = profile.avatarUrl ? profile.avatarUrl.replace(/&/g, '&amp;') : '';
    const avatar = avatarHref
        ? `<image href="${avatarHref}" x="20" y="24" width="64" height="64" clip-path="url(#avatar)"/>`
        : `<circle cx="52" cy="56" r="32" fill="${muted}"/>`;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="495" height="180" viewBox="0 0 495 180">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg}"/>
      <stop offset="100%" style="stop-color:#0d2137"/>
    </linearGradient>
    <clipPath id="avatar">
      <circle cx="52" cy="56" r="32"/>
    </clipPath>
  </defs>
  <rect width="495" height="180" rx="12" fill="url(#bg)" stroke="${accent}" stroke-width="2"/>
  ${avatar}
  <text x="100" y="52" fill="${accent}" font-family="system-ui, sans-serif" font-size="18" font-weight="700">@${profile.login}</text>
  <text x="100" y="78" fill="${muted}" font-family="system-ui, sans-serif" font-size="12">GitHub Stats</text>
  <text x="100" y="102" fill="${text}" font-family="system-ui, sans-serif" font-size="13">${profile.followers} seguidores · ${profile.publicRepos} repos · ${profile.totalStars ?? 0} ★</text>
  <text x="100" y="126" fill="${text}" font-family="system-ui, sans-serif" font-size="13">Streak atual: ${streak.current} dias · Recorde: ${streak.longest} dias</text>
  <text x="100" y="152" fill="${accent}" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Clique para abrir o painel →</text>
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
    return res.status(200).send(svg);
}
