import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    radius: number;
    velocityX: number;
    velocityY: number;
    opacity: number;
    baseColor: string;
}

export function useCanvas(particleCount: number = 100) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const isMobile = window.innerWidth < 768;
            const count = isMobile ? particleCount / 2 : particleCount; // Menos partículas no mobile

            for (let i = 0; i < count; i++) {
                const p: Particle = {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    velocityX: (Math.random() - 0.5) * 0.5,
                    velocityY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.1,
                    baseColor: Math.random() > 0.8 ? '124, 58, 237' : '232, 230, 227', // Roxo nebulosa ou branco fantasma
                };
                particles.push(p);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Parallax sutil no movimento inteiro, não atração
            mouseRef.current = {
                x: (e.clientX / window.innerWidth - 0.5) * 2, // -1 a 1
                y: (e.clientY / window.innerHeight - 0.5) * 2,
            };
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const { x: mx, y: my } = mouseRef.current;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Parallax effect apply
                const parallaxX = mx * p.radius * 2; // Partículas maiores movem mais rápido (mais próximas)
                const parallaxY = my * p.radius * 2;

                p.x += p.velocityX;
                p.y += p.velocityY;

                // Wrap around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x + parallaxX, p.y + parallaxY, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.baseColor}, ${p.opacity})`;
                ctx.fill();

                // Linhas de constelação entre próximas
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = (p.x + parallaxX) - (p2.x + mx * p2.radius * 2);
                    const dy = (p.y + parallaxY) - (p2.y + my * p2.radius * 2);
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x + parallaxX, p.y + parallaxY);
                        ctx.lineTo(p2.x + mx * p2.radius * 2, p2.y + my * p2.radius * 2);
                        ctx.strokeStyle = `rgba(232, 230, 227, ${0.1 - dist / 1000})`; // Fade conforme distância
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        resize();
        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [particleCount]);

    return canvasRef;
}
