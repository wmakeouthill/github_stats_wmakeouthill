import { useMemo } from 'react';
import styles from './ErrorState.module.css';

const POE_QUOTES = [
    "All that we see or seem is but a dream within a dream.",
    "I became insane, with long intervals of horrible sanity.",
    "The boundaries which divide Life from Death are at best shadowy and vague.",
    "Words have no power to impress the mind without the exquisite horror of their reality."
];

export interface ErrorStateProps {
    message?: string;
}

export function ErrorState({ message = "A conexão com o além falhou." }: ErrorStateProps) {
    const quote = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * POE_QUOTES.length);
        return POE_QUOTES[randomIndex];
    }, []);

    return (
        <div className={styles.errorContainer}>
            <div className={styles.icon}>✧</div>
            <h3 className="font-cinzel">The Darkness Lingers</h3>
            <p className={`${styles.quote} font-garamond`}>"{quote}"</p>
            <p className={`${styles.details} font-mono`}>{message}</p>
        </div>
    );
}
