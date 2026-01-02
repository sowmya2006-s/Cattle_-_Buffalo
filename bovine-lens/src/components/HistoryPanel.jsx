import React from 'react';
import { Download, Check, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HistoryPanel({ history }) {
    const { t } = useTranslation();

    const downloadCSV = () => {
        if (history.length === 0) return;

        try {
            // Create CSV content
            const headers = ['Timestamp', 'Animal Type', 'Confidence', 'Body Length', 'Height', 'Chest Width', 'Balance', 'ATC Score', 'Synced'];
            const rows = history.map(item =>
                [
                    item.timestamp,
                    item.type,
                    `${item.confidence}%`,
                    item.traits.bodyLength,
                    item.traits.height,
                    item.traits.chestWidth,
                    item.traits.balance,
                    item.atcScore,
                    'Yes'
                ].join(',')
            );

            const csvContent = [headers.join(','), ...rows].join('\n');

            // Create Blob and download using modern API
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().split('T')[0];
            link.setAttribute('href', url);
            link.setAttribute('download', `bovine_lens_report_${timestamp}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL object
            URL.revokeObjectURL(url);

            // Show success message
            console.log('Report exported successfully');
        } catch (error) {
            console.error('Error exporting report:', error);
            alert('Failed to export report. Please try again.');
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2.5rem', marginTop: '4rem', animation: 'fadeIn 0.8s ease-out 0.8s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: '700'
                }}>
                    <div style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: '0.6rem',
                        borderRadius: '0.75rem',
                        color: 'var(--accent)'
                    }}>
                        <Database size={24} />
                    </div>
                    {t('history.title')}
                </h3>
                <button
                    onClick={downloadCSV}
                    disabled={history.length === 0}
                    className="btn-primary"
                    style={{
                        padding: '0.6rem 1.25rem',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                    }}
                >
                    <Download size={18} /> {t('history.export')}
                </button>
            </div>

            {history.length === 0 ? (
                <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    border: '2px dashed var(--border)',
                    borderRadius: '1.25rem',
                    fontSize: '1rem',
                    fontWeight: '500'
                }}>
                    {t('history.empty')}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.map((record, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1.25rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '1rem',
                            border: '1px solid var(--border)',
                            transition: 'all 0.3s ease',
                            borderLeft: `5px solid ${record.species === 'BUFFALO' ? 'var(--purple)' : 'var(--primary)'}`
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '800',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '0.5rem',
                                        background: record.species === 'BUFFALO' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                        color: record.species === 'BUFFALO' ? 'var(--purple)' : 'var(--primary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {t(`results.category.${record.species === 'BUFFALO' ? 'Buffalo' : 'Cattle'}`)}
                                    </span>
                                    <span style={{
                                        fontWeight: '700',
                                        fontSize: '1.1rem',
                                        color: 'var(--text-main)'
                                    }}>
                                        {record.type === 'invalid'
                                            ? t('breeds.invalid', 'Invalid Image')
                                            : t(`breeds.${record.type.replace('cattle_', '').replace('buffalo_', '')}`, record.type.replace('cattle_', '').replace('buffalo_', ''))}
                                    </span>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-muted)',
                                        fontWeight: '600'
                                    }}>
                                        {record.confidence}%
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '500' }}>
                                    {record.timestamp}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.1rem' }}>
                                        {t('results.atcScore')}
                                    </div>
                                    <div style={{
                                        fontWeight: '800',
                                        fontSize: '1.1rem',
                                        color: record.atcScore >= 4.0 ? 'var(--primary)' : 'var(--text-main)'
                                    }}>{record.atcScore}</div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: 'var(--primary)',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '2rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    <Check size={14} strokeWidth={3} /> {t('history.synced')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
