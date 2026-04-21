'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface Contest {
  id: string;
  title: string;
  icon: string;
  isActive: boolean;
  isHidden: boolean;
  order: number;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/contests')
      .then((r) => r.json())
      .then((d) => {
        setContests(d.contests || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pathname]); // Re-fetch when navigating

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon bg-white p-1">
          <Image 
            src="/images/ecoscience-text-logo.png" 
            alt="EcoScience Logo" 
            width={36} 
            height={36} 
            className="object-contain"
          />
        </div>
        <div>
          <div className="logo-title">EcoScience</div>
          <div className="logo-sub">Administration</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* Dashboard */}
        <Link
          href="/admin/dashboard"
          className={`nav-item ${pathname === '/admin/dashboard' ? 'active' : ''}`}
        >
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </Link>

        {/* Concours */}
        <div className="nav-section-label">CONCOURS</div>

        {loading ? (
          <div className="nav-loading">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        ) : (
          contests.map((c) => (
            <Link
              key={c.id}
              href={`/admin/contest/${c.id}`}
              className={`nav-item contest-item ${isActive(`/admin/contest/${c.id}`) ? 'active' : ''}`}
              title={c.title}
            >
              <span className="nav-icon">{c.icon}</span>
              <span className="nav-label">{c.title}</span>
              <span className={`status-badge ${c.isActive ? 'active' : 'locked'}`}>
                {c.isActive ? '✅' : '🔒'}
              </span>
            </Link>
          ))
        )}

        <Link
          href="/admin/contest/new"
          className={`nav-item new-item ${pathname === '/admin/contest/new' ? 'active' : ''}`}
        >
          <span className="nav-icon">➕</span>
          <span>Nouveau concours</span>
        </Link>

        <div className="nav-divider" />

        {/* Gestion globale */}
        <Link
          href="/admin/students"
          className={`nav-item ${isActive('/admin/students') ? 'active' : ''}`}
        >
          <span className="nav-icon">👥</span>
          <span>Élèves</span>
        </Link>
      </nav>

      <style jsx>{`
        .admin-sidebar {
          width: 260px;
          min-height: 100vh;
          background: #0f0f23;
          border-right: 1px solid rgba(94, 23, 235, 0.2);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          overflow-y: auto;
          z-index: 100;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .logo-icon {
          font-size: 28px;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #5e17eb, #7ed957);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
        }

        .logo-sub {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .sidebar-nav {
          padding: 16px 12px;
          flex: 1;
        }

        .nav-section-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.25);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 12px 8px 6px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.2s;
          text-decoration: none;
          margin-bottom: 2px;
          cursor: pointer;
        }

        .nav-item:hover {
          background: rgba(94, 23, 235, 0.15);
          color: #fff;
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(94, 23, 235, 0.4), rgba(126, 217, 87, 0.1));
          color: #fff;
          border: 1px solid rgba(94, 23, 235, 0.4);
        }

        .nav-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .nav-label {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12.5px;
        }

        .contest-item {
          font-size: 12.5px;
        }

        .status-badge {
          font-size: 11px;
          flex-shrink: 0;
        }

        .new-item {
          border: 1px dashed rgba(126, 217, 87, 0.3);
          color: rgba(126, 217, 87, 0.8);
          margin-top: 6px;
        }

        .new-item:hover {
          background: rgba(126, 217, 87, 0.1);
          border-color: rgba(126, 217, 87, 0.6);
          color: #7ed957;
        }

        .nav-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: 12px 0;
        }

        .nav-loading {
          display: flex;
          gap: 6px;
          padding: 12px;
        }

        .loading-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(94, 23, 235, 0.5);
          animation: pulse 1.4s ease-in-out infinite;
        }

        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </aside>
  );
}
