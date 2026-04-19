// Page de connexion admin — design sobre et professionnel
// Route : /admin/login  (exclue du layout admin avec auth check)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur de connexion');
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      setError('Erreur réseau, veuillez réessayer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Background pattern */}
      <div className="bg-pattern" />

      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-badge">🌿</div>
          <div>
            <h1 className="logo-text">EcoScience</h1>
            <p className="logo-sub">Portail d&apos;Administration</p>
          </div>
        </div>

        {/* Card */}
        <div className="login-card">
          <h2 className="card-title">Connexion Admin</h2>
          <p className="card-sub">Accès réservé à l&apos;équipe pédagogique</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label">Adresse email</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecoscience.ma"
                required
                className="field-input"
              />
            </div>

            <div className="field">
              <label className="field-label">Mot de passe</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="field-input"
              />
            </div>

            {error && (
              <div className="error-box">
                ⚠️ {error}
              </div>
            )}

            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  Connexion en cours...
                </span>
              ) : (
                '→ Se connecter'
              )}
            </button>
          </form>

          <div className="login-footer">
            <a href="/" className="back-link">← Retour à l&apos;espace élève</a>
          </div>
        </div>

        <p className="platform-info">
          InNOScEnce · Plateforme EcoScience v2.0
        </p>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: #0a0a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          direction: ltr;
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(94, 23, 235, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(126, 217, 87, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .login-container {
          width: 100%;
          max-width: 440px;
          padding: 24px;
          position: relative;
          z-index: 1;
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 32px;
          justify-content: center;
        }

        .logo-badge {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #5e17eb, #7ed957);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }

        .logo-text {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .logo-sub {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 2px;
        }

        .login-card {
          background: #141428;
          border: 1px solid rgba(94, 23, 235, 0.25);
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(94, 23, 235, 0.1);
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .card-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 28px;
        }

        .field {
          margin-bottom: 18px;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .field-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .field-input:focus {
          border-color: rgba(94, 23, 235, 0.6);
          background: rgba(94, 23, 235, 0.06);
        }

        .field-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        .error-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 10px;
          padding: 12px 16px;
          color: #f87171;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #5e17eb, #7c3aed);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          margin-top: 4px;
          letter-spacing: 0.3px;
        }

        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #7c3aed, #5e17eb);
          box-shadow: 0 6px 24px rgba(94, 23, 235, 0.5);
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .login-footer {
          text-align: center;
          margin-top: 20px;
        }

        .back-link {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.3);
          text-decoration: none;
          transition: color 0.2s;
        }

        .back-link:hover { color: rgba(255, 255, 255, 0.6); }

        .platform-info {
          text-align: center;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.15);
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
}
