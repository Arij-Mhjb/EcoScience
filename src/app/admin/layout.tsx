// Layout de l'espace admin — séparé du layout principal (pas de SponsorsNav/Footer)
// Auth gérée par middleware.ts et /admin/(protected)/layout.tsx
// Direction LTR, langue française

export const metadata = {
  title: 'EcoScience — Administration',
  description: 'Espace administration EcoScience',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <body style={{ margin: 0, fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#0a0a1a', color: '#fff' }}>
        {children}

        <style>{`
          * { box-sizing: border-box; }

          .admin-layout {
            display: flex;
            min-height: 100vh;
            background: #0a0a1a;
          }

          .admin-main {
            flex: 1;
            margin-left: 260px;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }

          .admin-content {
            margin-top: 64px;
            padding: 28px 32px;
            flex: 1;
            background: #0a0a1a;
            min-height: calc(100vh - 64px);
          }

          :root {
            --admin-bg: #0a0a1a;
            --admin-sidebar: #0f0f23;
            --admin-card: #141428;
            --admin-card-hover: #1a1a35;
            --admin-border: rgba(94, 23, 235, 0.15);
            --admin-primary: #5e17eb;
            --admin-green: #7ed957;
            --admin-text: #e2e2f0;
            --admin-text-muted: rgba(226, 226, 240, 0.5);
          }

          .admin-card {
            background: var(--admin-card);
            border: 1px solid var(--admin-border);
            border-radius: 16px;
            padding: 24px;
            transition: border-color 0.2s;
          }

          .admin-card:hover { border-color: rgba(94, 23, 235, 0.3); }

          .btn-admin-primary {
            padding: 10px 20px;
            background: linear-gradient(135deg, #5e17eb, #7c3aed);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
          }

          .btn-admin-primary:hover {
            background: linear-gradient(135deg, #7c3aed, #5e17eb);
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(94, 23, 235, 0.4);
          }

          .btn-admin-secondary {
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.06);
            color: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
          }

          .btn-admin-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            color: #fff;
          }

          .btn-admin-danger {
            padding: 10px 20px;
            background: rgba(239, 68, 68, 0.1);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 10px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .btn-admin-danger:hover {
            background: rgba(239, 68, 68, 0.2);
            border-color: rgba(239, 68, 68, 0.4);
          }

          .btn-admin-sm {
            padding: 6px 12px;
            font-size: 12px;
            border-radius: 8px;
          }

          .admin-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }

          .admin-table th {
            text-align: left;
            padding: 12px 16px;
            color: rgba(226, 226, 240, 0.5);
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            border-bottom: 1px solid rgba(94, 23, 235, 0.15);
          }

          .admin-table td {
            padding: 14px 16px;
            color: rgba(226, 226, 240, 0.85);
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          }

          .admin-table tr:hover td {
            background: rgba(94, 23, 235, 0.05);
          }

          .admin-input, .admin-select, .admin-textarea {
            width: 100%;
            padding: 10px 14px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            color: #fff;
            font-size: 13px;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
          }

          .admin-input:focus, .admin-select:focus, .admin-textarea:focus {
            border-color: rgba(94, 23, 235, 0.5);
            background: rgba(94, 23, 235, 0.05);
          }

          .admin-input::placeholder, .admin-textarea::placeholder { color: rgba(255, 255, 255, 0.25); }

          .admin-select option { background: #1a1a35; color: #fff; }

          .admin-textarea { resize: vertical; min-height: 80px; }

          .badge-active {
            background: rgba(126, 217, 87, 0.15);
            color: #7ed957;
            border: 1px solid rgba(126, 217, 87, 0.3);
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
          }

          .badge-locked {
            background: rgba(255, 255, 255, 0.06);
            color: rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
          }

          .badge-completed {
            background: rgba(59, 130, 246, 0.15);
            color: #60a5fa;
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 11px;
          }

          .badge-in-progress {
            background: rgba(245, 158, 11, 0.15);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.3);
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 11px;
          }

          .badge-not-started {
            background: rgba(156, 163, 175, 0.1);
            color: rgba(156, 163, 175, 0.7);
            border: 1px solid rgba(156, 163, 175, 0.15);
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 11px;
          }

          .page-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 28px;
            gap: 16px;
          }

          .page-title {
            font-size: 22px;
            font-weight: 700;
            color: #fff;
          }

          .page-subtitle {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.4);
            margin-top: 3px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 16px;
            margin-bottom: 28px;
          }

          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(6px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }

          .modal-box {
            background: #141428;
            border: 1px solid rgba(94, 23, 235, 0.3);
            border-radius: 20px;
            padding: 32px;
            width: 100%;
            max-width: 560px;
            max-height: 85vh;
            overflow-y: auto;
          }

          .modal-title {
            font-size: 18px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .modal-close {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.5);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.2s;
            font-family: inherit;
          }

          .modal-close:hover {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
            color: #f87171;
          }

          .form-group { margin-bottom: 16px; }

          .form-label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.45);
            text-transform: uppercase;
            letter-spacing: 0.7px;
            margin-bottom: 7px;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }

          .tabs-bar {
            display: flex;
            gap: 4px;
            background: rgba(255, 255, 255, 0.04);
            padding: 4px;
            border-radius: 12px;
            margin-bottom: 24px;
            overflow-x: auto;
          }

          .tab-btn {
            flex: 1;
            padding: 10px 14px;
            border: none;
            border-radius: 9px;
            background: transparent;
            color: rgba(255, 255, 255, 0.45);
            font-size: 12.5px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            white-space: nowrap;
            min-width: fit-content;
          }

          .tab-btn.active {
            background: linear-gradient(135deg, #5e17eb, #7c3aed);
            color: #fff;
            box-shadow: 0 2px 12px rgba(94, 23, 235, 0.4);
          }

          .tab-btn:hover:not(.active) {
            background: rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.7);
          }

          .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: rgba(255, 255, 255, 0.25);
          }

          .empty-state-icon { font-size: 48px; margin-bottom: 12px; }
          .empty-state-text { font-size: 14px; }

          .search-bar {
            position: relative;
          }

          .search-bar input {
            padding-left: 36px;
          }

          .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255,255,255,0.3);
            font-size: 14px;
          }

          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
          ::-webkit-scrollbar-thumb { background: rgba(94,23,235,0.4); border-radius: 4px; }
        `}</style>
      </body>
    </html>
  );
}
