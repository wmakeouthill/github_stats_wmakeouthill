import { useMemo } from 'react';
import { ContributionsData } from '@/shared/types/github.types';

export function useActivityWaves(contributions: ContributionsData) {
    // Pegamos o calendário todo do Github (geralmente 365 dias)
    const recentDays = useMemo(() => {
        if (!contributions || !contributions.calendar) return [];
        return contributions.calendar;
    }, [contributions]);

    const pathData = useMemo(() => {
        if (recentDays.length === 0) return '';

        // Largura proporcional aos 365 pontos para não amassar muito (o SVG vai escalonar responsivamente no CSS)
        const width = Math.max(800, recentDays.length * 3);
        const height = 150;
        const points = recentDays.length;
        const stepX = width / (points - 1);

        // Acha o max para normalizar (com um mínimo de 1 para evitar divisão por zero)
        const maxVal = Math.max(...recentDays.map(d => d.count), 1);

        // Gera os pontos [x,y]
        const coords = recentDays.map((d, i) => {
            const x = i * stepX;
            // Inverte o Y porque no SVG o 0 é no topo. Y = height - (normalized * height * 0.8) -> deixa espaço em cima
            const normalized = d.count / maxVal;
            const y = height - (normalized * height * 0.8) - 10; // 10px pad
            return { x, y };
        });

        // Curva Bézier Catmull-Rom simplificada (smooth line)
        return coords.reduce((acc, point, i, a) => {
            if (i === 0) return `M ${point.x},${point.y}`;
            // Pontos de controle fixos no meio X para suavizar (cubic bezier)
            const prev = a[i - 1];
            const cp1x = prev.x + (point.x - prev.x) / 2;
            const cp1y = prev.y;
            const cp2x = prev.x + (point.x - prev.x) / 2;
            const cp2y = point.y;

            return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
        }, '');

    }, [recentDays]);

    return { pathData, recentDays };
}
