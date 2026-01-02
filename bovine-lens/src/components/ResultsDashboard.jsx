import AnatomyOverlay from './AnatomyOverlay';
import { CheckCircle, Activity, Ruler, Scale, Box, ArrowRight, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ResultsDashboard({ results, image, onReset }) {
    const { t } = useTranslation();

    const TraitMeter = ({ label, valueKey, icon: Icon, index }) => {
        const traitData = results.traits[valueKey];
        const rating = typeof traitData === 'string' ? traitData : traitData?.rating || 'MEDIUM';
        const ratioText = (traitData?.ratio && valueKey !== 'balance') ? `${traitData.ratio}%` : '';
        const cmValue = (traitData?.cm !== undefined && traitData?.cm !== null) ? `${traitData.cm} cm` : '';
        const confidence = traitData?.confidence || null;
        const interpretation = traitData?.interpretation || '';

        const displayValue = t(`results.values.${rating}`);
        const traitLabel = traitData?.label || t(`results.traits.${valueKey}`);

        const score = rating === 'HIGH' ? 3 : rating === 'MEDIUM' ? 2 : 1;
        let color = 'var(--accent)';
        if (score === 3) color = 'var(--primary)';
        if (score === 1) color = 'var(--warning)';

        return (
            <div
                className="glass-panel trait-card animate-slideUp"
                style={{
                    animationDelay: `${index * 0.1}s`,
                    borderLeftColor: color
                }}
            >
                <div className="trait-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="trait-icon-box" style={{ color: color }}>
                            <Icon size={18} strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{traitLabel}</span>
                    </div>
                    {confidence && (
                        <div style={{
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '2rem',
                            background: confidence === 'HIGH' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                            color: confidence === 'HIGH' ? '#4ade80' : '#facc15',
                            border: `1px solid ${confidence === 'HIGH' ? 'rgba(34, 197, 129, 0.2)' : 'rgba(234, 179, 8, 0.2)'}`
                        }}>
                            {confidence}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                    <div className="trait-value-main">
                        {cmValue}
                        {cmValue && <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '600' }}>(ESTIMATED)</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: color, textTransform: 'uppercase' }}>{displayValue}</span>
                        {ratioText && <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '500' }}>• {ratioText}</span>}
                    </div>
                </div>

                <div className="trait-interpretation">
                    {interpretation}
                </div>
            </div>
        );
    };

    return (
        <div className="results-container">
            {/* Hero Card */}
            <div className="glass-panel hero-card animate-scaleIn">
                <div className="hero-image-section">
                    <img src={image} alt="Analyzed Animal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <AnatomyOverlay />
                </div>

                <div className="hero-info-section">
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--primary)',
                        padding: '0.4rem 1rem',
                        borderRadius: '2rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        marginBottom: '1.25rem',
                        alignSelf: 'flex-start',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        <CheckCircle size={14} /> {t('results.complete')}
                    </div>

                    <div className={`species-label ${results.species === 'BUFFALO' ? 'species-buffalo' : 'species-cattle'}`}>
                        {results.species === 'Invalid'
                            ? 'INVALID'
                            : t(`results.category.${results.species === 'BUFFALO' ? 'Buffalo' : 'Cattle'}`)}
                    </div>

                    <div className="breed-group">
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>BREED:</span>
                        <span className="breed-label">
                            {results.type === 'invalid'
                                ? t('breeds.invalid', 'Invalid Image')
                                : t(`breeds.${results.type.replace('cattle_', '').replace('buffalo_', '')}`, results.type.replace('cattle_', '').replace('buffalo_', '').toUpperCase())}
                        </span>
                    </div>

                    <div className="stats-grid">
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('results.confidence')}</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                {results.confidence}%
                            </div>
                        </div>

                        {results.atcScore >= 4.0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    padding: '0.75rem',
                                    borderRadius: '1rem',
                                    color: 'var(--gold)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)'
                                }}>
                                    <Award size={32} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('results.elite.title')}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>{t('results.elite.sub')}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {results.probabilities && (
                        <div style={{
                            marginTop: 'auto',
                            padding: '1rem',
                            borderRadius: '1rem',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>Probability Distribution</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {results.probabilities.slice(1, 4).map(p => (
                                    <div key={p.idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{p.label}</span>
                                        <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{(p.prob * 100).toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '2rem',
                fontFamily: 'var(--font-display)',
                fontWeight: '800',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                letterSpacing: '-0.02em'
            }}>
                <Activity size={24} color="var(--primary)" />
                {t('results.traits.title')}
            </h3>

            <div className="trait-grid">
                <TraitMeter valueKey="bodyLength" icon={Ruler} index={0} />
                <TraitMeter valueKey="height" icon={Activity} index={1} />
                <TraitMeter valueKey="chestWidth" icon={Box} index={2} />
                <TraitMeter valueKey="rumpLength" icon={ArrowRight} index={3} />
                <TraitMeter valueKey="balance" icon={Scale} index={4} />
            </div>

            <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
                <button className="btn-primary" onClick={onReset}>
                    {t('app.analyzeNew')} <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
