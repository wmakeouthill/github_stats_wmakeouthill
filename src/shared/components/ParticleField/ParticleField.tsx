import { ParticleFieldProps } from './ParticleField.types';
import { useCanvas } from './ParticleField.hooks';
import styles from './ParticleField.module.css';

export function ParticleField({ particleCount = 100, className = '' }: ParticleFieldProps) {
    const canvasRef = useCanvas(particleCount);

    return (
        <canvas
            ref={canvasRef}
            className={`${styles.canvas} ${className}`}
            aria-hidden="true"
        />
    );
}
