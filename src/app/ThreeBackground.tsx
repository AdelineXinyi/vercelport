// src/app/ThreeBackground.tsx
'use client';

import { useEffect, useRef } from 'react';
import { createParticleEffect } from './particle-effect-logic';

const ThreeBackground = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const { init, animate, cleanup, onWindowResize, onPointerMove } = createParticleEffect(mountRef);

        let animationFrameId: number;

        init();
        
        const renderLoop = () => {
            animate();
            animationFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        window.addEventListener('resize', onWindowResize);
        window.addEventListener('pointermove', onPointerMove);

        return () => {
            cleanup();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <div ref={mountRef} className="three-background-container" />;
};

// 将默认导出修改为异步导入模式
// 这可以确保 Next.js 在客户端正确处理它
export default ThreeBackground;