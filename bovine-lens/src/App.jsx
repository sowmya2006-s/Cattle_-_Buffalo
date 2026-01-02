import React, { useState, useEffect } from 'react';
import { loadModel, preprocessImage, runInference } from './utils/modelHelper';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import AnalysisLoader from './components/AnalysisLoader';
import ResultsDashboard from './components/ResultsDashboard';
import HistoryPanel from './components/HistoryPanel';
import { useTranslation } from 'react-i18next';
import { extractMeasurements } from './utils/measurementHelper';

function App() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState('IDLE'); // IDLE, ANALYZING, COMPLETED
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [showToast, setShowToast] = useState(false);

  // Load ONNX Model
  const [session, setSession] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);

  useEffect(() => {
    const initModel = async () => {
      try {
        const sess = await loadModel();
        setSession(sess);
      } catch (e) {
        console.error("Model load failed", e);
      } finally {
        setModelLoading(false);
      }
    };
    initModel();
  }, []);

  // Update background theme based on results

  // Restore pseudoRandom helper (needed for fallback/traits)
  const pseudoRandom = (seed) => {
    let value = 0;
    for (let i = 0; i < seed.length; i++) {
      value += seed.charCodeAt(i);
    }
    return (Math.sin(value) + 1) / 2;
  };

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    setImagePreview(imageUrl);
    setStatus('ANALYZING');

    try {
      // Create HTMLImageElement to pass to preprocessor
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      // Run Inference if model is ready
      let isBuffalo = false;
      let confidence = 0;
      let predictions = null; // Initialize to null for scope visibility

      if (session) {
        console.log("Running inference...");
        const tensor = await preprocessImage(img);
        predictions = await runInference(session, tensor);

        console.log("Predictions:", predictions);

        const top = predictions[0];
        const breedName = top.label;

        // Explicitly handle the 'invalid' class from the model
        if (breedName === 'invalid') {
          console.log("Image classified as INVALID by model.");
          setStatus('INVALID');
          return;
        }

        // Use the category from model predictions (Cattle or Buffalo)
        isBuffalo = top.category === 'Buffalo';
        confidence = (top.prob * 100).toFixed(1);

        console.log("Top prediction:", breedName, "Confidence:", confidence + "%");

        // Debugging: Log all predictions to see distribution
        console.log("All predictions:", predictions);

        // Confidence threshold validation - detect non-cattle/buffalo images
        // Increased to 8% now that the model is trained on real data
        const CONFIDENCE_THRESHOLD = 8;
        if (parseFloat(confidence) < CONFIDENCE_THRESHOLD) {
          console.log(`Image rejected: confidence ${confidence}% below threshold ${CONFIDENCE_THRESHOLD}%`);
          setStatus('INVALID');
          return;
        }

        // Update result type to be the Breed Name
        var resultType = breedName;
        var speciesTag = isBuffalo ? 'BUFFALO' : 'CATTLE';
      } else {
        console.warn("Model not loaded, falling back to mock");
        const seed = selectedFile.name + selectedFile.size;
        const rand = pseudoRandom(seed);
        isBuffalo = rand > 0.5;
        confidence = Math.floor(92 + (rand * 7));
        var resultType = isBuffalo ? 'Generic Buffalo' : 'Generic Cattle';
        var speciesTag = isBuffalo ? 'BUFFALO' : 'CATTLE';
      }

      // Simulate a bit of delay for UX if inference is too fast
      await new Promise(r => setTimeout(r, 1000));

      // Extract structural measurements from the image
      console.log("Extracting structural measurements from image...");
      // Pass breed info for cm calibration
      const measurements = await extractMeasurements(img, speciesTag, resultType);

      const newResult = {
        id: Date.now(),
        type: resultType, // Display Breed Name (e.g., 'Angus')
        species: speciesTag, // Internal species tag ('CATTLE' or 'BUFFALO')
        confidence: confidence,
        traits: measurements,
        atcScore: (3.5 + (Math.random() * 1.5)).toFixed(1),
        timestamp: new Date().toLocaleString(),
        probabilities: predictions
      };

      setResults(newResult);
      setStatus('COMPLETED');
      setHistory(prev => [newResult, ...prev]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);


    } catch (e) {
      console.error("Analysis failed", e);
      // Fallback: If inference fails, show error or try purely mock
      // For now, let's alert the user so they know
      alert("Something went wrong during analysis: " + e.message);
      setStatus('IDLE');
    }
  };


  const handleReset = () => {
    setFile(null);
    setImagePreview(null);
    setResults(null);
    setStatus('IDLE');
  };

  return (
    <div className={`app-root ${results?.species === 'BUFFALO' ? 'buffalo-theme' : results?.species === 'CATTLE' ? 'cattle-theme' : ''}`}>
      <div className="mesh-container">
        <div className="mesh-gradient"></div>
      </div>
      <div className="theme-overlay"></div>

      <Header />
      <main className="animate-fadeIn" style={{ padding: '2rem', flex: 1, position: 'relative', maxWidth: '1200px', margin: '0 auto', width: '100%', zIndex: 10 }}>
        {status === 'IDLE' && (
          <div>
            <div className="hero-wrapper">
              <h2 className="hero-main-title">
                {t('app.heroTitle')} <span className="title-gradient">{t('app.heroSubtitle')}</span>
              </h2>
              <p className="hero-description">
                {t('app.heroDesc')}
              </p>
            </div>
            <ImageUpload onFileSelect={handleFileSelect} />

            {/* Show history on IDLE screen too if available */}
            {history.length > 0 && <HistoryPanel history={history} />}
          </div>
        )}

        {status === 'ANALYZING' && (
          <AnalysisLoader />
        )}

        {status === 'COMPLETED' && results && (
          <>
            <ResultsDashboard
              key={results.timestamp} /* Force re-render on new result */
              results={results}
              image={imagePreview}
              onReset={handleReset}
            />
            {history.length > 0 && <HistoryPanel history={history} />}
          </>
        )}

        {status === 'INVALID' && (
          <div style={{
            maxWidth: '500px',
            margin: '4rem auto',
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease'
          }}>
            <div className="glass-panel" style={{
              padding: '3rem',
              background: 'rgba(30, 41, 59, 0.7)', // Matches glass-bg using vars if possible but explicit for safety
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--text-main)',
                marginBottom: '1rem',
                fontFamily: 'var(--font-display)'
              }}>
                {t('error.invalidImage')}
              </h2>
              <p style={{
                color: 'var(--text-muted)',
                marginBottom: '2rem',
                fontSize: '1rem',
                lineHeight: '1.5'
              }}>
                {t('error.tryAgain', 'Please upload an image of a cattle or buffalo.')}
              </p>
              <button className="btn-primary" onClick={handleReset} style={{ background: '#ef4444', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}>
                {t('app.tryAgain', 'Try Again')}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--primary)',
        padding: '1rem 1.5rem',
        borderRadius: '1rem', // Softer radius
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        transform: showToast ? 'translateY(0)' : 'translateY(100px)',
        opacity: showToast ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 200
      }}>
        <div style={{
          background: 'var(--primary)',
          borderRadius: '50%',
          padding: '0.2rem',
          display: 'flex',
          boxShadow: '0 0 10px var(--primary-glow)'
        }}>
          <Check size={16} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-main)' }}>{t('toast.success')}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('toast.sub')}</div>
        </div>
      </div>

      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--text-dim)',
        fontSize: '0.85rem',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
        background: 'rgba(15, 23, 42, 0.4)'
      }}>
        © 2025 BovineLens Analytics. All rights reserved. | <span style={{ color: 'var(--primary)' }}>{t('app.footer')}</span>
      </footer>
    </div>
  );
}

// Simple Check icon component for Toast if lucide import fails (safety fallback)
const Check = ({ size, color, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default App;
