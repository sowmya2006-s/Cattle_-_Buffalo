import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ImageUpload({ onFileSelect }) {
    const { t } = useTranslation();
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className={`upload-zone animate-float ${isDragOver ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <div className="upload-icon-container">
                <UploadCloud size={56} strokeWidth={1.5} />
                {isDragOver && <div className="ripple-effect" />}
            </div>

            <h3 className="upload-title">{t('upload.title')}</h3>
            <p className="upload-subtitle">{t('upload.subtitle')}</p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <div className="glass-panel" style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '3rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid var(--border)',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                }}>
                    <ImageIcon size={16} /> {t('upload.support')}
                </div>
            </div>

            <div className="sample-section">
                <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1.5rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Try Sample Images
                </p>
                <div className="sample-grid">
                    <div
                        className="sample-card"
                        style={{ backgroundImage: 'url(/samples/cattle.png)' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            fetch('/samples/cattle.png')
                                .then(res => res.blob())
                                .then(blob => onFileSelect(new File([blob], 'sample-cattle.png', { type: 'image/png' })));
                        }}
                    >
                        <div className="sample-label">🐄 CATTLE</div>
                    </div>

                    <div
                        className="sample-card"
                        style={{ backgroundImage: 'url(/samples/buffalo.png)' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            fetch('/samples/buffalo.png')
                                .then(res => res.blob())
                                .then(blob => onFileSelect(new File([blob], 'sample-buffalo.png', { type: 'image/png' })));
                        }}
                    >
                        <div className="sample-label">🐃 BUFFALO</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
