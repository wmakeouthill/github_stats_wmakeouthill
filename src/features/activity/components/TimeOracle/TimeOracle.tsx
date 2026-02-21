import { useMemo } from 'react';
import { ContributionsData } from '@/shared/types/github.types';
import { GothicCard } from '@/shared/components/GothicCard';

export function TimeOracle({ contributions, className = '' }: { contributions: ContributionsData, className?: string }) {
    const stats = useMemo(() => {
        const days = contributions.calendar || [];
        let maxCommits = 0;
        let maxDate = '';
        const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat
        let activeDays = 0;

        days.forEach(d => {
            if (d.count > maxCommits) {
                maxCommits = d.count;
                maxDate = d.date;
            }
            if (d.count > 0) {
                activeDays++;
                // Precisamos parsear a data corretamente com UTC para não errar o dia da semana pelo Timezone local
                const dateObj = new Date(d.date + 'T12:00:00Z');
                dayCounts[dateObj.getDay()] += d.count;
            }
        });

        const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
        const dayNames = ['Domingos', 'Segundas', 'Terças', 'Quartas', 'Quintas', 'Sextas', 'Sábados'];
        const bestDay = dayNames[maxDayIndex] || 'Desconhecido';

        return { maxCommits, maxDate, bestDay, activeDays };
    }, [contributions]);

    return (
        <GothicCard className={className} style={{ display: 'flex', flexDirection: 'column', padding: 'var(--spacing-sm)', gap: '4px', minHeight: 'auto', justifyContent: 'flex-start', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.1rem', letterSpacing: '2px', fontFamily: 'var(--font-cinzel)' }}>⏳ Oráculo</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
                <div style={{ fontSize: '0.80rem', color: 'var(--starlight)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Foco Cósmico
                </div>
                <div style={{ fontSize: '1.6rem', color: 'var(--faded-gold)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', textShadow: '0 0 10px rgba(212, 165, 116, 0.4)' }}>
                    {stats.bestDay}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--ash-gray)', borderTop: '1px dashed var(--midnight-blue)', paddingTop: '8px', marginTop: 'auto', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
                    <span>Dias Ativos no ano:</span> <b style={{ color: 'var(--spectral-green)' }}>{stats.activeDays} </b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
                    <span>Maior pico diário:</span> <b style={{ color: 'var(--phantom-white)' }} title={stats.maxDate}>{stats.maxCommits} energias</b>
                </div>
            </div>
        </GothicCard>
    );
}
