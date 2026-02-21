import { LanguageStat } from '@/shared/types/github.types';

export interface LanguagePlanetsProps {
    className?: string;
    // O hook fará a chamada de dados internamente para facilitar, mas poderíamos passar as props
}

// Interface interna do Planeta
export interface PlanetData extends LanguageStat {
    radiusPixels: number;
    orbitRadius: number;
    orbitDurationSec: number;
    startDelaySec: number;
}
