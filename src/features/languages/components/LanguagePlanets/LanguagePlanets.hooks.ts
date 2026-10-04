import { useMemo } from 'react';
import { useLanguages } from '../../hooks/useLanguages';
import { PlanetData } from './LanguagePlanets.types';

function normalizePlanetColor(color: string): string {
    const fallbackColor = '#A78BFA';
    const hex = color?.replace('#', '');

    if (!hex || hex.length !== 6) return fallbackColor;

    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

    if (luminance >= 95) return color;

    const lift = 95 - luminance;
    const nextRed = Math.min(255, Math.round(red + lift * 0.75));
    const nextGreen = Math.min(255, Math.round(green + lift * 0.75));
    const nextBlue = Math.min(255, Math.round(blue + lift * 0.75));

    return `#${[nextRed, nextGreen, nextBlue].map(channel => channel.toString(16).padStart(2, '0')).join('')}`;
}

export function useLanguagePlanets() {
    const { data, isLoading, isError } = useLanguages();

    const planets: PlanetData[] = useMemo(() => {
        if (!data || !data.languages) return [];

        // Pegar apenas as 8 principais linguagens
        const topLangs = data.languages.slice(0, 8);

        return topLangs.map((lang, index) => {
            // Cálculo do tamanho visual dependendo da porcentagem
            const minRadius = 8;
            const maxRadius = 35;
            // Tamanho proporcional (limite max para evitar que planete gigante ocupe tudo)
            const radiusPixels = Math.max(minRadius, Math.min(maxRadius, (lang.percentage / 100) * 150));

            // As órbitas um pouco mais juntas para não vazar da view e esconder o planeta
            const minOrbit = 28;
            const orbitGap = 10;
            const orbitRadius = minOrbit + (index * orbitGap);

            // Duração da órbita controlada
            const orbitDurationSec = 20 + (index * 8);

            // Deslocamento de inicio na órbita, para não começar tudo alinhado
            const startDelaySec = -(Math.random() * orbitDurationSec);

            return {
                ...lang,
                radiusPixels,
                orbitRadius,
                orbitDurationSec,
                startDelaySec,
                displayColor: normalizePlanetColor(lang.color)
            };
        });
    }, [data]);

    return { planets, isLoading, isError };
}
