import { useState } from 'react';
import { LanguagePlanetsProps } from './LanguagePlanets.types';
import { useLanguagePlanets } from './LanguagePlanets.hooks';
import styles from './LanguagePlanets.module.css';
import { GothicCard } from '@/shared/components/GothicCard';

export function LanguagePlanets({ className = '' }: LanguagePlanetsProps) {
    const { planets, isLoading, isError } = useLanguagePlanets();
    const [isExpanded, setIsExpanded] = useState(false);

    if (isLoading) return <GothicCard className={className}><p className="font-mono" style={{ color: 'var(--ash-gray)' }}>Observando os astros...</p></GothicCard>;
    if (isError) return null; // Fallback ou erro escondido (já que não é crítico)

    const renderSolarSystem = (expanded = false, paused = false) => (
        <div className={`${styles.solarSystem} ${expanded ? styles.solarSystemExpanded : ''} ${paused ? styles.solarSystemPaused : ''}`}>
            <div className={styles.blackHole} />

            {planets.map(p => (
                <div
                    key={`orbit-${p.name}`}
                    className={styles.orbitRing}
                    style={{ width: p.orbitRadius * 2, height: p.orbitRadius * 2 }}
                />
            ))}

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
                            backgroundColor: p.displayColor,
                            color: p.displayColor,
                            animation: `orbit ${p.orbitDurationSec}s linear infinite reverse`,
                            animationDelay: `${p.startDelaySec}s`
                        } as React.CSSProperties}
                        title={`${p.name}: ${p.percentage}%`}
                    >
                        <div className={styles.planetLabelBox}>
                            <div className={styles.planetLabelLine} style={{ backgroundColor: p.displayColor }}></div>
                            <span className={styles.planetLabelText}>
                                {expanded || p.name.length <= 8 ? p.name : p.name.substring(0, 5) + '.'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <>
            <GothicCard className={`${styles.container} ${className}`}>
                <div className={styles.headerBox}>
                    <div>
                        <div className={styles.title}>
                            <span className="font-cinzel">✦ Astros Órfãos</span>
                        </div>
                        <p className={`${styles.subtitle} font-mono`}>(Linguagens mais utilizadas recentemente)</p>
                    </div>

                    {planets.length > 0 && (
                        <button
                            type="button"
                            className={styles.expandButton}
                            onClick={() => setIsExpanded(true)}
                            aria-label="Abrir astros em tela cheia"
                            title="Abrir em tela cheia"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path d="M8 3H3v5h2V5h3V3Zm8 0v2h3v3h2V3h-5ZM5 16H3v5h5v-2H5v-3Zm14 3h-3v2h5v-5h-2v3Z" />
                            </svg>
                        </button>
                    )}
                </div>

                {planets.length === 0 ? (
                    <p className={`${styles.emptyState} font-mono`}>Nenhum astro orbitando.</p>
                ) : (
                    renderSolarSystem(false, isExpanded)
                )}
            </GothicCard>

            {isExpanded && (
                <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-label="Astros Órfãos em tela cheia">
                    <div className={styles.modalPanel}>
                        <div className={styles.modalHeader}>
                            <div>
                                <div className={styles.title}>
                                    <span className="font-cinzel">✦ Astros Órfãos</span>
                                </div>
                                <p className={`${styles.subtitle} font-mono`}>(Linguagens mais utilizadas recentemente)</p>
                            </div>
                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={() => setIsExpanded(false)}
                                aria-label="Fechar tela cheia"
                                title="Fechar"
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalOrbitStage}>
                            {renderSolarSystem(true)}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
