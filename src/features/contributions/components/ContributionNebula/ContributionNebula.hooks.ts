import { useMemo } from 'react';
import { ContributionsData, ContributionDay } from '@/shared/types/github.types';

export function useContributionNebula(contributions: ContributionsData) {
    // Processa as estrelas para o heatmap
    const starsInfo = useMemo(() => {
        if (!contributions || !contributions.calendar) return [];

        // Transformamos cada dia em uma "estrela" com nível de intensidade (0 a 4)
        return contributions.calendar.map((day: ContributionDay) => {
            let level = 0;
            if (day.count === 0) level = 0;
            else if (day.count <= 3) level = 1;
            else if (day.count <= 7) level = 2;
            else if (day.count <= 15) level = 3;
            else level = 4;

            return {
                ...day,
                level,
                // Aleatorizar um pouco a posição de cada estrela (dentro de sua grid slot) faz parecer um céu
                offsetX: (Math.random() - 0.5) * 4,
                offsetY: (Math.random() - 0.5) * 4
            };
        });
    }, [contributions]);

    return { starsInfo };
}
