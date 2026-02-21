import { ProfileCardProps } from './ProfileCard.types';
import styles from './ProfileCard.module.css';
import { GothicCard } from '@/shared/components/GothicCard';

export function ProfileCard({ profile, className = '', actionButton }: ProfileCardProps) {
    // Limpando o login ("@wmakeouthill") se necessário, ou adicionando o @
    const handle = profile.login.startsWith('@') ? profile.login : `@${profile.login}`;

    // Formatador de números (ex: 1200 -> 1.2k)
    const formatNum = (num: number) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    const joinDate = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(profile.createdAt));

    return (
        <GothicCard className={`${styles.container} ${className}`}>

            <div className={styles.avatarWrapper}>
                <img src={profile.avatarUrl} alt={profile.name} className={styles.avatar} />
            </div>

            <h1 className={`${styles.name} font-cinzel`}>{profile.name}</h1>
            <p className={`${styles.login} font-mono`}>{handle}</p>

            {profile.bio && <p className={`${styles.bio} font-garamond`}>"{profile.bio}"</p>}

            <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                    <span className={`${styles.statValue} font-mono`}>{formatNum(profile.publicRepos)}</span>
                    <span className={styles.statLabel}>Repos</span>
                </div>
                <div className={styles.statBox}>
                    <span className={`${styles.statValue} font-mono`}>{formatNum(profile.totalStars)}</span>
                    <span className={styles.statLabel}>Stars</span>
                </div>
                <div className={styles.statBox}>
                    <span className={`${styles.statValue} font-mono`}>{formatNum(profile.totalForks)}</span>
                    <span className={styles.statLabel}>Forks</span>
                </div>
                <div className={styles.statBox}>
                    <span className={`${styles.statValue} font-mono`}>{formatNum(profile.followers)}</span>
                    <span className={styles.statLabel}>Followers</span>
                </div>
            </div>

            <div className={`${styles.meta} font-mono`}>
                Membro desde {joinDate} {profile.location ? `· ${profile.location}` : ''}
            </div>

            {actionButton && (
                <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                    {actionButton}
                </div>
            )}

        </GothicCard>
    );
}
