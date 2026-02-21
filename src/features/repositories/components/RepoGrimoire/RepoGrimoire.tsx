import { useState } from 'react';
import { RepoGrimoireProps } from './RepoGrimoire.types';
import styles from './RepoGrimoire.module.css';
import { GothicCard } from '@/shared/components/GothicCard';

export function RepoGrimoire({ repos, className = '' }: RepoGrimoireProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // 2 projetos por linha x 2 linhas

    const totalPages = Math.ceil(repos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleRepos = repos.slice(startIndex, startIndex + itemsPerPage);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <GothicCard className={`${styles.container} ${className}`}>

            <div className={styles.header}>
                <div className={styles.title}>
                    <span className="font-cinzel">📖 O Grimório</span>
                </div>
            </div>

            <div className={styles.grid}>
                {visibleRepos.map(repo => (
                    <a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.bookCard}
                    >
                        <h3 className={`${styles.repoName} font-cinzel`}>{repo.name}</h3>

                        <p className={`${styles.repoDescription} font-garamond`}>
                            {repo.description || '"E o corvo nada disse..." (Sem descrição)'}
                        </p>

                        <div className={`${styles.repoMeta} font-mono`}>
                            <div className={styles.langBadge}>
                                <div className={styles.langColor} style={{ backgroundColor: repo.languageColor || 'var(--ash-gray)' }} />
                                <span>{repo.language || 'Gótico'}</span>
                            </div>
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <span>✦</span> <span>{repo.stars}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span title="Forks (Alquimia)">🜂</span> <span>{repo.forks}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`${styles.pageBtn} font-mono`}
                    >
                        &lt;
                    </button>
                    <span className={`${styles.pageInfo} font-mono`}>
                        Pág {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`${styles.pageBtn} font-mono`}
                    >
                        &gt;
                    </button>
                </div>
            )}

        </GothicCard>
    );
}
