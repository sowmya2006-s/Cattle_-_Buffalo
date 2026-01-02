import React from 'react';
import { ScanEye, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="app-header">
      <div className="branding">
        <div className="brand-icon">
          <ScanEye size={28} strokeWidth={2} />
        </div>
        <div>
          <h1 className="brand-title">{t('app.title')}</h1>
          <p className="brand-subtitle">{t('app.desc')}</p>
        </div>
      </div>

      <div className="controls-group">
        <label className="lang-selector">
          <Globe size={16} color="var(--primary)" />
          <select
            onChange={changeLanguage}
            value={i18n.language}
            className="lang-select"
          >
            <option value="en" style={{ color: 'black' }}>English</option>
            <option value="hi" style={{ color: 'black' }}>हिंदी</option>
            <option value="ta" style={{ color: 'black' }}>தமிழ்</option>
            <option value="te" style={{ color: 'black' }}>తెలుగు</option>
            <option value="kn" style={{ color: 'black' }}>ಕನ್ನಡ</option>
            <option value="ml" style={{ color: 'black' }}>മലയാളം</option>
            <option value="bn" style={{ color: 'black' }}>বাংলা</option>
            <option value="mr" style={{ color: 'black' }}>मराठी</option>
            <option value="gu" style={{ color: 'black' }}>ગુજરાતી</option>
          </select>
        </label>
        <div className="version-badge">v2.1</div>
      </div>
    </header>
  );
}
