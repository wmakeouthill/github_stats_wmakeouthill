import { useMemo } from 'react';
import { useLanguages } from '../../hooks/useLanguages';
import { PlanetData } from './LanguagePlanets.types';

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
                startDelaySec
            };
        });
    }, [data]);

    return { planets, isLoading, isError };
}
