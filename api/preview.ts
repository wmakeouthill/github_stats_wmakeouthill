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
  const baseUrl = process.env.VERCEL_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://github-stats-wmakeouthill.vercel.app';

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

  let base64Avatar = '';
  if (profile.avatarUrl) {
    try {
      const imgRes = await fetch(profile.avatarUrl);
      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
      base64Avatar = `data:${contentType};base64,${buffer.toString('base64')}`;
    } catch (e) {
      console.warn('Erro ao baixar avatar em base64', e);
    }
  }

  const avatar = base64Avatar
    ? `<image href="${base64Avatar}" x="20" y="24" width="72" height="72" clip-path="url(#avatar)"/>`
    : `<circle cx="56" cy="56" r="36" fill="${muted}"/>`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="495" height="195" viewBox="0 0 495 195">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0c29"/>
      <stop offset="50%" style="stop-color:#302b63"/>
      <stop offset="100%" style="stop-color:#24243e"/>
    </linearGradient>
    <clipPath id="avatar">
      <circle cx="56" cy="56" r="36"/>
    </clipPath>
    <!-- Filtro de brilho sutil -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <!-- Fundo do Card -->
  <rect width="495" height="195" rx="12" fill="url(#bg)" stroke="#DBC27D" stroke-width="1.5"/>

  <!-- Título e Borda Sutil Superior -->
  <rect width="495" height="4" fill="#6B21A8" rx="2" opacity="0.8"/>
  <text x="247.5" y="24" fill="#DBC27D" font-family="'Courier New', Courier, monospace" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">✦ O GRIMÓRIO DE CÓDIGO ✦</text>
  <line x1="40" y1="32" x2="455" y2="32" stroke="#4B5563" stroke-dasharray="2,2" stroke-width="1" opacity="0.3"/>

  <!-- Avatar e Informações da Esquerda -->
  <g transform="translate(10, 30)">
    ${avatar}
  </g>
  <text x="110" y="70" fill="#EAEAEA" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800">@${profile.login}</text>
  <text x="110" y="90" fill="#9CA3AF" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-style="italic">Dashboard Cósmico Interativo</text>

  <!-- Caixa de Status Direita (Linhas divisórias) -->
  <line x1="320" y1="60" x2="320" y2="150" stroke="#4B5563" stroke-width="1" opacity="0.3"/>

  <!-- Métricas Primárias (Meio) -->
  <g transform="translate(110, 115)">
    <text x="0" y="0" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12">Seguidores</text>
    <text x="0" y="20" fill="#F3F4F6" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">${profile.followers}</text>
    
    <text x="80" y="0" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12">Repos</text>
    <text x="80" y="20" fill="#F3F4F6" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">${profile.publicRepos}</text>
    
    <text x="140" y="0" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12">Estrelas</text>
    <text x="140" y="20" fill="#DBC27D" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" filter="url(#glow)">${profile.totalStars ?? 0} ★</text>
  </g>

  <!-- Métricas de Streak (Direita) -->
  <g transform="translate(340, 75)">
    <circle cx="0" cy="-4" r="4" fill="#10B981" />
    <text x="12" y="0" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="11">Streak Atual</text>
    <text x="12" y="22" fill="#F3F4F6" font-family="system-ui, sans-serif" font-size="22" font-weight="bold">${streak.current}</text>
    <text x="45" y="22" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12"> dias</text>

    <!-- Fogo ou ícone de Recorde -->
    <path d="M0,40 C0,40 5,35 5,30 C5,25 0,20 0,20 C0,20 -5,25 -5,30 C-5,35 0,40 0,40 Z" fill="#DBC27D" transform="translate(0, 15) scale(0.6)"/>
    <text x="12" y="52" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="11">Maior Sequência</text>
    <text x="12" y="72" fill="#DBC27D" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" filter="url(#glow)">${streak.longest}</text>
    <text x="40" y="72" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12"> dias</text>
  </g>

  <!-- Rodapé / Call to Action -->
  <line x1="40" y1="160" x2="455" y2="160" stroke="#4B5563" stroke-dasharray="2,2" stroke-width="1" opacity="0.3"/>
  <rect x="150" y="168" width="195" height="20" rx="10" fill="#1E1B4B" opacity="0.6"/>
  <text x="247.5" y="182" fill="#c084fc" font-family="system-ui, sans-serif" font-size="11" font-weight="600" text-anchor="middle">Clique na imagem para abrir o Painel ✦</text>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
  return res.status(200).send(svg);
}
