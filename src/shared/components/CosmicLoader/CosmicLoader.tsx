import styles from './CosmicLoader.module.css';

export function CosmicLoader() {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p className={`${styles.text} font-garamond`}>Consultando o abismo...</p>
        </div>
    );
}
