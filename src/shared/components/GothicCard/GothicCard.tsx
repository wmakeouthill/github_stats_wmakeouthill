import { GothicCardProps } from './GothicCard.types';
import styles from './GothicCard.module.css';

export function GothicCard({ children, className = '', id, style }: GothicCardProps) {
    return (
        <div id={id} className={`${styles.card} ${className}`} style={style}>
            {children}
        </div>
    );
}
