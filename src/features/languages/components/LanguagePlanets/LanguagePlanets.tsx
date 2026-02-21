import { LanguagePlanetsProps } from './LanguagePlanets.types';
import { useLanguagePlanets } from './LanguagePlanets.hooks';
import styles from './LanguagePlanets.module.css';
import { GothicCard } from '@/shared/components/GothicCard';

export function LanguagePlanets({ className = '' }: LanguagePlanetsProps) {
    const { planets, isLoading, isError } = useLanguagePlanets();

    if (isLoading) return <GothicCard className={className}><p className="font-mono" style={{ color: 'var(--ash-gray)' }}>Observando os astros...</p></GothicCard>;
    if (isError) return null; // Fallback ou erro escondido (já que não é crítico)

    return (
        <GothicCard className={`${styles.container} ${className}`}>
            <div className={styles.headerBox}>
                <div className={styles.title}>
                    <span className="font-cinzel">✦ Astros Órfãos</span>
                </div>
                <p className={`${styles.subtitle} font-mono`}>(Linguagens mais utilizadas recentemente)</p>
            </div>

            {planets.length === 0 ? (
                <p className={`${styles.emptyState} font-mono`}>Nenhum astro orbitando.</p>
            ) : (
                <div className={styles.solarSystem}>
                    {/* Centro gravitacional */}
                    <div className={styles.blackHole} />

                    {/* Renderização de Órbitas (Tracejados) */}
                    {planets.map(p => (
                        <div
                            key={`orbit-${p.name}`}
                            className={styles.orbitRing}
                            style={{ width: p.orbitRadius * 2, height: p.orbitRadius * 2 }}
                        />
                    ))}

                    {/* Renderização dos Planetas animando */}
                    {planets.map(p => (
                        <div
                            key={p.name}
                            className={styles.planetWrapper}
                            style={{
                                '--orbit-radius': `${p.orbitRadius}px`,
                                animation: `orbit ${p.orbitDurationSec}s linear infinite, orbit-z ${p.orbitDurationSec}s linear infinite`,
                                animationDelay: `${p.startDelaySec}s, ${p.startDelaySec}s`
                            } as React.CSSProperties}
                        >
                            <div
                                className={styles.planet}
                                style={{
                                    width: `${p.radiusPixels}px`,
                                    height: `${p.radiusPixels}px`,
                                    backgroundColor: p.color,
                                    color: p.color,
                                    animation: `orbit ${p.orbitDurationSec}s linear infinite reverse`,
                                    animationDelay: `${p.startDelaySec}s`
                                } as React.CSSProperties}
                                title={`${p.name}: ${p.percentage}%`}
                            >
                                {/* Etiqueta sempre visível! */}
                                <div className={styles.planetLabelBox}>
                                    <div className={styles.planetLabelLine} style={{ backgroundColor: p.color }}></div>
                                    <span className={styles.planetLabelText}>
                                        {p.name.length > 8 ? p.name.substring(0, 5) + '.' : p.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </GothicCard>
    );
}
