import { useProfile, useProfileRefresh } from '@/features/profile/hooks/useProfile';
import { useLanguagesRefresh } from '@/features/languages/hooks/useLanguages';
import { ParticleField } from '@/shared/components/ParticleField';
import { CosmicLoader } from '@/shared/components/CosmicLoader';
import { ErrorState } from '@/shared/components/ErrorState';

// Feature Components
import { ProfileCard } from '@/features/profile/components/ProfileCard';
import { ContributionNebula } from '@/features/contributions/components/ContributionNebula';
import { LanguagePlanets } from '@/features/languages/components/LanguagePlanets';
import { StreakCounter } from '@/features/streak/components/StreakCounter';
import { RepoGrimoire } from '@/features/repositories/components/RepoGrimoire';
import { ActivityWaves } from '@/features/activity/components/ActivityWaves';
import { TimeOracle } from '@/features/activity/components/TimeOracle/TimeOracle';

import styles from './App.module.css';
import '@/shared/styles/global.css';
import { useState } from 'react';

function App() {
  const { data, isLoading, isError } = useProfile();

  // Utilizados para o refresh forçado (Bypass de 24h Edge Cache)
  const { refetch: refetchProfile } = useProfileRefresh();
  const { refetch: refetchLangs } = useLanguagesRefresh();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchProfile(), refetchLangs()]);
    setIsRefreshing(false);
  };

  const showLoading = isLoading || isRefreshing;

  return (
    <div className={styles.appLayout}>
      <ParticleField particleCount={120} />

      {showLoading && <CosmicLoader />}

      {isError && !showLoading && <ErrorState message="Os corvos não trouxeram mensagens." />}

      {data && !showLoading && (
        <>
          <main className={styles.dashboardGrid}>
            {/* Row 1 */}
            <ProfileCard
              profile={data.profile}
              className={styles.profile}
              actionButton={
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  style={{
                    background: 'rgba(107, 33, 168, 0.4)',
                    border: '1px solid var(--deep-purple)',
                    color: 'var(--phantom-white)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono, monospace',
                    cursor: isRefreshing ? 'wait' : 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {isRefreshing ? 'Invocando...' : '✦ Invocar Novos Dados'}
                </button>
              }
            />
            <ContributionNebula
              contributions={data.contributions}
              className={styles.contributions}
            />
            <StreakCounter
              streak={data.streak}
              className={styles.streak}
            />

            {/* Row 2 */}
            <LanguagePlanets
              className={styles.languages}
            />
            <TimeOracle
              contributions={data.contributions}
              className={styles.oracle}
            />

            {/* Row 3 */}
            <ActivityWaves
              contributions={data.contributions}
              className={styles.activity}
            />
            <RepoGrimoire
              repos={data.topRepos}
              className={styles.repositories}
            />
          </main>
        </>
      )}
    </div>
  );
}

export default App;
