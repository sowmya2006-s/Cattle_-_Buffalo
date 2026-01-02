import React from 'react';

export default function AnatomyOverlay() {
    // Mock target points typical for a side profile cow/buffalo
    const targets = [
        { x: '20%', y: '30%', label: 'CRANIAL' }, // Head area
        { x: '50%', y: '25%', label: 'DORSAL' },  // Back/Hump area
        { x: '80%', y: '40%', label: 'CAUDAL' },  // Rump area
        { x: '50%', y: '60%', label: 'VENTRAL' }, // Belly/Chest
    ];

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {/* Grid Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.3
            }}></div>

            {targets.map((t, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: t.x,
                    top: t.y,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: `targetPop 0.5s ease-out ${i * 0.2}s backwards`
                }}>
                    {/* Reticle */}
                    <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                        <div style={{
                            position: 'absolute', inset: 0, border: '1px solid var(--primary)',
                            clipPath: 'polygon(0 0, 25% 0, 25% 100%, 0 100%)' // Left bracket
                        }}></div>
                        <div style={{
                            position: 'absolute', inset: 0, border: '1px solid var(--primary)',
                            clipPath: 'polygon(75% 0, 100% 0, 100% 100%, 75% 100%)' // Right bracket
                        }}></div>
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', width: '4px', height: '4px',
                            background: 'var(--primary)', borderRadius: '50%', transform: 'translate(-50%, -50%)'
                        }}></div>
                    </div>

                    {/* Label */}
                    <div style={{
                        fontSize: '0.6rem',
                        background: 'var(--primary)',
                        color: 'var(--bg-dark)',
                        padding: '2px 4px',
                        marginTop: '4px',
                        fontWeight: 'bold',
                        letterSpacing: '1px'
                    }}>
                        {t.label}
                    </div>
                </div>
            ))}

            <style>{`
        @keyframes targetPop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
        </div>
    );
}
