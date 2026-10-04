import { StreakCounterProps } from './StreakCounter.types';
import styles from './StreakCounter.module.css';
import { GothicCard } from '@/shared/components/GothicCard';

export function StreakCounter({ streak, className = '' }: StreakCounterProps) {
    const isZero = streak.current === 0;

    return (
        <GothicCard className={`${styles.container} ${className}`}>

            {isZero ? (
                <div className={styles.eyeOff}>𓁹</div>
            ) : (
                <div className={styles.eye}>👁</div>
            )}

            <div>
                <div className={`${isZero ? styles.streakZero : styles.streakNumber} font-mono`}>
                    {streak.current}
                </div>
                <div className={`${styles.label} font-cinzel`}>Dias Consecutivos</div>
            </div>

            <p className={`${styles.quote} font-garamond`}>
                {isZero
                    ? '"Once upon a midnight dreary..."'
                    : `"O pulso solitário ecoa há ${streak.current} noites... Nevermore."`}
            </p>

            <div className={`${styles.meta} font-mono`}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span title="Os dados abrangem todo o seu histórico">Maior sequência: {streak.longest} dias</span>
                    {streak.longestStart && streak.longestEnd && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--starlight)' }}>
                            ({streak.longestStart.split('-').slice(1).join('/')} a {streak.longestEnd.split('-').slice(1).join('/')})
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4px' }}>
                    <span>
                        Hoje: {streak.todayContributed ? <b className={styles.check}>✓ Ativo</b> : <b>✕ Ausente</b>}
                    </span>
                </div>
            </div>

        </GothicCard>
    );
}
