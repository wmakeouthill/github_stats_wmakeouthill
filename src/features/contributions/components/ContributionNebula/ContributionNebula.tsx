import { useRef, useEffect } from 'react';
import { ContributionNebulaProps } from './ContributionNebula.types';
import { useContributionNebula } from './ContributionNebula.hooks';
import styles from './ContributionNebula.module.css';
import { GothicCard } from '@/shared/components/GothicCard';

export function ContributionNebula({ contributions, className = '' }: ContributionNebulaProps) {
    const { starsInfo } = useContributionNebula(contributions);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Garante que o grid de Poeira Cósmica role para a extrema direita (para o dia de hoje) ao carregar
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [starsInfo]);

    return (
        <GothicCard className={`${styles.container} ${className}`}>

            <div className={styles.title}>
                <span className="font-cinzel">✦ Poeira Cósmica</span>
            </div>

            <div className={styles.skyGrid} dir="ltr" ref={scrollRef}>
                {starsInfo.map((star, idx) => (
                    <div key={`${star.date}-${idx}`} className={styles.starCell} title={`${star.count} contribuições em ${star.date}`}>
                        <div
                            className={`${styles.star} ${styles[`level-${star.level}` as keyof typeof styles]}`}
                            style={{
                                transform: `translate(${star.offsetX}px, ${star.offsetY}px)`
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className={`${styles.legend} font-mono`}>
                <span>Nas trevas, cada commit é uma estrela: </span>
                <div className={styles.legendStarBox} title="0">
                    <div className={`${styles.star} ${styles['level-0']}`} />
                </div>
                <div className={styles.legendStarBox} title="1-3">
                    <div className={`${styles.star} ${styles['level-1']}`} />
                </div>
                <div className={styles.legendStarBox} title="4-7">
                    <div className={`${styles.star} ${styles['level-2']}`} />
                </div>
                <div className={styles.legendStarBox} title="8-15">
                    <div className={`${styles.star} ${styles['level-3']}`} />
                </div>
                <div className={styles.legendStarBox} title="16+">
                    <div className={`${styles.star} ${styles['level-4']}`} />
                </div>
            </div>

            <div className={`${styles.summary} font-mono`}>
                <span><b>{contributions.totalCommits}</b> Commits</span>
                <span><b>{contributions.totalPRs}</b> PRs</span>
                <span><b>{contributions.totalIssues}</b> Issues</span>
                <span><b>{contributions.totalRepos}</b> Repos</span>
            </div>

        </GothicCard>
    );
}
