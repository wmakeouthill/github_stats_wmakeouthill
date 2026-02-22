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

  let profile: any = { login: username, followers: 0, publicRepos: 0, totalStars: 0 };
  let streak: any = { current: 0, longest: 0 };
  let contributions: any = { totalCommits: 0, totalPRs: 0, totalIssues: 0, totalRepos: 0 };
  let topLangs: any[] = [];
  let oracleStats: any = { activeDays: 0, maxCommits: 0 };

  try {
    // Fazemos a chamada interna sempre bypassando o cache de Edge da Vercel (&fresh=true) 
    // porque o Próprio SVG retornado para o Readme já engatilhará o seu Cache de 60min ali na frente.
    const apiRes = await fetch(`${baseUrl}/api/github-stats?username=${encodeURIComponent(username)}&fresh=true`);
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
    contributions = data.contributions || contributions;

    // Calcular Linguagens simulando Astros Orfaos
    const langMap: Record<string, { count: number, color: string }> = {};
    (data.topRepos || []).forEach((r: any) => {
      if (r.language && r.language !== 'Unknown') {
        if (!langMap[r.language]) langMap[r.language] = { count: 0, color: r.languageColor || '#888' };
        langMap[r.language].count++;
      }
    });
    topLangs = Object.keys(langMap)
      .map(k => ({ name: k, ...langMap[k] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // 5 principais linguagens

    // Oráculo Calc
    const calendar = contributions.calendar || [];
    let maxCommits = 0;
    let maxDate = '';
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    let activeDays = 0;

    calendar.forEach((d: any) => {
      if (d.count > maxCommits) {
        maxCommits = d.count;
        maxDate = d.date;
      }
      if (d.count > 0) {
        activeDays++;
        const dateObj = new Date(d.date + 'T12:00:00Z');
        dayCounts[dateObj.getDay()] += d.count;
      }
    });

    const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    const dayNames = ['Domingos', 'Segundas', 'Terças', 'Quartas', 'Quintas', 'Sextas', 'Sábados'];

    oracleStats.bestDay = dayNames[maxDayIndex] || '-';
    oracleStats.activeDays = activeDays;
    oracleStats.maxCommits = maxCommits;
    oracleStats.maxDate = maxDate;

  } catch (e) {
    console.warn('Erro ao processar dados customizados no preview.', e);
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
    ? `<image href="${base64Avatar}" x="25" y="45" width="70" height="70" clip-path="url(#avatar)"/>`
    : `<circle cx="60" cy="80" r="35" fill="${muted}"/>`;

  // Montagem SVG (Widescreen 900x230)
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="230" viewBox="0 0 900 230">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0c29"/>
      <stop offset="50%" style="stop-color:#302b63"/>
      <stop offset="100%" style="stop-color:#24243e"/>
    </linearGradient>
    <clipPath id="avatar">
      <circle cx="60" cy="80" r="35"/>
    </clipPath>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <rect width="900" height="230" rx="12" fill="url(#bg)" stroke="#DBC27D" stroke-width="1.5"/>
  <rect width="900" height="5" fill="#6B21A8" rx="2" opacity="0.8"/>
  <text x="450" y="24" fill="#DBC27D" font-family="Courier New, monospace" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">✦ DASHBOARD CÓSMICO COMPACTADO ✦</text>
  <line x1="30" y1="34" x2="870" y2="34" stroke="#4B5563" stroke-dasharray="2,2" stroke-width="1" opacity="0.3"/>

  <!-- Coluna 1: Perfil (Largura expandida para respirar) -->
  <g transform="translate(10, 0)">
    ${avatar}
    <text x="110" y="70" fill="#EAEAEA" font-family="system-ui, sans-serif" font-size="20" font-weight="800">@${profile.login}</text>
    <text x="110" y="90" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12" font-style="italic">Arquiteto do Vácuo</text>
    
    <g transform="translate(110, 115)">
      <text x="0" y="0" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="11">Seguidores</text>
      <text x="0" y="20" fill="#F3F4F6" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">${profile.followers}</text>
      <text x="80" y="0" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="11">Repos</text>
      <text x="80" y="20" fill="#F3F4F6" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">${profile.publicRepos}</text>
      <text x="145" y="0" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="11">Estrelas</text>
      <text x="145" y="20" fill="#DBC27D" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" filter="url(#glow)">${profile.totalStars} ★</text>
    </g>
  </g>

  <line x1="310" y1="50" x2="310" y2="180" stroke="#4B5563" stroke-width="1" opacity="0.3"/>

  <!-- Coluna 2: Poeira Cósmica (Empurrado para a Direita) -->
  <g transform="translate(330, 55)">
    <text x="0" y="0" fill="#DBC27D" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" letter-spacing="1">✦ POEIRA CÓSMICA <tspan fill="#8b949e" font-size="10" font-weight="normal">(365 Dias)</tspan></text>
    
    <text x="0" y="30" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="11">Total Commits</text>
    <text x="115" y="30" fill="#F3F4F6" font-family="monospace" font-size="14" font-weight="bold">${contributions.totalCommits}</text>

    <text x="0" y="55" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="11">Pull Requests</text>
    <text x="115" y="55" fill="#a78bfa" font-family="monospace" font-size="14" font-weight="bold">${contributions.totalPRs}</text>

    <text x="0" y="80" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="11">Issues Abertas</text>
    <text x="115" y="80" fill="#34d399" font-family="monospace" font-size="14" font-weight="bold">${contributions.totalIssues}</text>

    <text x="0" y="105" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="11">Repositórios Contrib.</text>
    <text x="115" y="105" fill="#93c5fd" font-family="monospace" font-size="14" font-weight="bold">${contributions.totalRepos}</text>
  </g>

  <line x1="530" y1="50" x2="530" y2="180" stroke="#4B5563" stroke-width="1" opacity="0.3"/>

  <!-- Coluna 3: Astros e Oráculo (Empurrado para a Direita) -->
  <g transform="translate(560, 50)">
    <text x="0" y="0" fill="#DBC27D" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" letter-spacing="1">✦ ASTROS ÓRFÃOS</text>
    <g transform="translate(0, 15)">
      ${topLangs.map((l, i) => `
        <circle cx="5" cy="${i * 18 + 5}" r="4" fill="${l.color}" />
        <text x="15" y="${i * 18 + 9}" fill="#EAEAEA" font-family="system-ui" font-size="11">${l.name}</text>
      `).join('')}
      ${topLangs.length === 0 ? `<text x="0" y="15" fill="#9CA3AF" font-size="11">Nenhum astro...</text>` : ''}
    </g>

    <!-- Oráculo movido para baixo para não dar conflito horizontal -->
    <g transform="translate(0, 115)">
      <text x="0" y="0" fill="#DBC27D" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" letter-spacing="1">⏳ ORÁCULO</text>
      
      <!-- Linha 1: Dias Ativos -->
      <text x="0" y="25" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="10">Dias Ativos</text>
      <text x="100" y="25" fill="#10B981" font-family="monospace" font-size="14" font-weight="bold">${oracleStats.activeDays}</text>
      
      <!-- Linha 2: Pico e Foco Cósmico lado a lado -->
      <text x="0" y="45" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="10">Pico de Energia</text>
      <text x="75" y="45" fill="#F3F4F6" font-family="monospace" font-size="14" font-weight="bold">${oracleStats.maxCommits}</text>
      
      <text x="100" y="45" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="9">Foco cósmico:</text>
      <text x="130" y="45" fill="#c084fc" font-family="monospace" font-size="11" font-weight="bold">${oracleStats.bestDay}</text>
    </g>
  </g>

  <line x1="740" y1="50" x2="740" y2="180" stroke="#4B5563" stroke-width="1" opacity="0.3"/>

  <!-- Coluna 4: Streak (Empurrado para a Direita) -->
  <g transform="translate(760, 55)">
    <circle cx="5" cy="-4" r="5" fill="#10B981" />
    <text x="18" y="0" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12">STREAK ATUAL</text>
    <text x="18" y="28" fill="#F3F4F6" font-family="system-ui, sans-serif" font-size="28" font-weight="bold">${streak.current}</text>
    <text x="55" y="28" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12"> dias</text>

    <path d="M5,50 C5,50 10,45 10,40 C10,35 5,30 5,30 C5,30 0,35 0,40 C0,45 5,50 5,50 Z" fill="#DBC27D" transform="translate(-10, 15) scale(0.7)"/>
    <text x="18" y="65" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12">MAIOR RECORDE</text>
    <text x="18" y="93" fill="#DBC27D" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" filter="url(#glow)">${streak.longest}</text>
    <text x="55" y="93" fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="12"> dias</text>
  </g>

  <!-- Rodapé -->
  <line x1="30" y1="195" x2="870" y2="195" stroke="#4B5563" stroke-dasharray="2,2" stroke-width="1" opacity="0.3"/>
  <rect x="350" y="202" width="200" height="20" rx="10" fill="#1E1B4B" opacity="0.8"/>
  <text x="450" y="216" fill="#c084fc" font-family="system-ui, sans-serif" font-size="11" font-weight="600" text-anchor="middle">Acessar App Interativo Original ✦</text>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
  return res.status(200).send(svg);
}
