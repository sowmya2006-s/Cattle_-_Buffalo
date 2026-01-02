import React from 'react';
import { ScanLine } from 'lucide-react';
import { Activity, Info } from 'lucide-react'; // Changed ScanLine to Activity, Info
import { useTranslation } from 'react-i18next';

export default function AnalysisLoader({ progress = 0, steps = ['initializing', 'analyzing', 'reporting'], currentStep = 0 }) { // Added props for progress, steps, currentStep
    const { t } = useTranslation();

    return (
        <div className="loader-wrapper animate-fadeIn">
            <div className="scanner-container">
                <div className="scanner-ring" />
                <div className="scanner-inner">
                    <Activity size={40} strokeWidth={2.5} />
                </div>
            </div>

            <h2 className="loading-title">
                {t(`loading.steps.${steps[currentStep]}`)}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                <p className="loading-subtitle">
                    {t('loading.processing')}
                </p>
                <div className="progress-track" style={{ maxWidth: '300px' }}>
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: '700', marginTop: '1rem' }}>
                    {Math.round(progress)}%
                </span>
            </div>

            {/* Contextual Tips */}
            <div className="glass-panel animate-slideUp" style={{
                marginTop: '4rem',
                padding: '1.5rem',
                textAlign: 'left',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
            }}>
                <div style={{ color: 'var(--primary)', marginTop: '2px' }}>
                    <Info size={20} />
                </div>
                <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        AI Insight
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        {progress < 40
                            ? "Neural networks are analyzing pixel patterns to determine species classification..."
                            : progress < 80
                                ? "Calculating biometric scores based on structural integrity and breed standards..."
                                : "Finalizing comprehensive health and breed assessment report..."}
                    </p>
                </div>
            </div>
        </div>
    );
}
