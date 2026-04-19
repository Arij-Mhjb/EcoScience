'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

interface AdminHeaderProps {
  adminName: string;
  adminEmail: string;
}

export default function AdminHeader({ adminName, adminEmail }: AdminHeaderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <header className="admin-header">
      <div className="header-title">
        <span className="breadcrumb-icon bg-white p-0.5 rounded-md flex items-center justify-center">
          <Image 
            src="/images/ecoscience-text-logo.png" 
            alt="Logo" 
            width={20} 
            height={20} 
            className="object-contain"
          />
        </span>
        <span>EcoScience Admin</span>
      </div>

      <div className="header-right">
        <div className="admin-info">
          <div className="admin-avatar">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="admin-details">
            <div className="admin-name">{adminName}</div>
            <div className="admin-email">{adminEmail}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="logout-btn"
        >
          {loading ? '...' : '⏏ Déconnexion'}
        </button>
      </div>

      <style jsx>{`
        .admin-header {
          height: 64px;
          background: #0f0f23;
          border-bottom: 1px solid rgba(94, 23, 235, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: fixed;
          top: 0;
          left: 260px;
          right: 0;
          z-index: 99;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }

        .breadcrumb-icon { font-size: 18px; }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #5e17eb, #7ed957);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          color: #fff;
        }

        .admin-details { line-height: 1.2; }

        .admin-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }

        .admin-email {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.35);
        }

        .logout-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 100, 100, 0.3);
          background: rgba(255, 100, 100, 0.08);
          color: rgba(255, 150, 150, 0.9);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .logout-btn:hover {
          background: rgba(255, 100, 100, 0.18);
          border-color: rgba(255, 100, 100, 0.5);
          color: #ff9999;
        }
      `}</style>
    </header>
  );
}
