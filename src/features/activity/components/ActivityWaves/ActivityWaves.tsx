import { ActivityWavesProps } from './ActivityWaves.types';
import { useActivityWaves } from './ActivityWaves.hooks';
import styles from './ActivityWaves.module.css';
import { GothicCard } from '@/shared/components/GothicCard';

export function ActivityWaves({ contributions, className = '' }: ActivityWavesProps) {
    const { pathData, recentDays } = useActivityWaves(contributions);

    if (!pathData) return null;

    const firstDay = recentDays[0]?.date ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(recentDays[0].date)) : '';
    const lastDay = recentDays[recentDays.length - 1]?.date ? new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(recentDays[recentDays.length - 1].date)) : 'Hoje';

    return (
        <GothicCard className={`${styles.container} ${className}`}>
            <div className={styles.title}>
                <span className="font-cinzel">〰 Ondas no Vácuo</span>
            </div>

            <div className={styles.svgContainer}>
                {/* viewBox fixo na base para manter a proporção Y constante, mas permitindo squeeze X via css width 100% */}
                <svg className={styles.waveSvg} viewBox="0 0 800 150" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="waveGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="var(--deep-purple)" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="var(--abyss)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Preenchimento abaixo da linha (forma de onda até o fundo da Y-axis) */}
                    <path
                        className={styles.waveFill}
                        d={`${pathData} L 800,150 L 0,150 Z`}
                    />

                    {/* Linha da onda pura */}
                    <path
                        className={styles.waveLine}
                        d={pathData}
                    />
                </svg>
            </div>

            <div className={`${styles.labels} font-mono`}>
                <span className={styles.dayLabel}>-30 Dias ({firstDay})</span>
                <span className={styles.dayLabel}>Presente ({lastDay})</span>
            </div>
        </GothicCard>
    );
}
