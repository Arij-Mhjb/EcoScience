'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalStudents: number;
  totalParticipations: number;
  avgScore: number;
  avgTime: number;
}

interface ContestRow {
  id: string;
  title: string;
  icon: string;
  isActive: boolean;
  participantCount: number;
  avgScore: number;
  completionRate: number;
}

interface RecentActivity {
  type: 'participation' | 'student';
  name: string;
  detail: string;
  time: string;
  icon: string;
}

function StatCard({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) {
  return (
    <div className="stat-card" style={{ borderColor: `${color}25` }}>
      <div className="stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <style jsx>{`
        .stat-card {
          background: #141428;
          border: 1px solid rgba(94,23,235,0.15);
          border-radius: 16px;
          padding: 22px 20px;
          transition: transform 0.2s, border-color 0.2s;
        }
        .stat-card:hover { transform: translateY(-2px); border-color: rgba(94,23,235,0.3); }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 14px;
        }
        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
          line-height: 1;
        }
        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

function formatTime(seconds: number) {
  if (seconds === 0) return '0 min';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [contests, setContests] = useState<ContestRow[]>([]);
  const [recent, setRecent] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/contests').then(async (r) => {
        try { return await r.json(); } catch { return { contests: [] }; }
      }),
      fetch('/api/admin/students').then(async (r) => {
        try { return await r.json(); } catch { return { users: [] }; }
      }),
    ]).then(([contestData, studentData]) => {
      const c: ContestRow[] = contestData?.contests || [];
      const users = studentData.users || [];

      const totalParticipations = c.reduce((a: number, b: ContestRow) => a + b.participantCount, 0);
      const allScores = c.map((x: ContestRow) => x.avgScore).filter((s: number) => s > 0);
      const globalAvgScore = allScores.length ? Math.round(allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length) : 0;

      setStats({
        totalStudents: users.length,
        totalParticipations,
        avgScore: globalAvgScore,
        avgTime: 0,
      });

      setContests(c);

      // Activité récente (derniers élèves)
      const recentStudents: RecentActivity[] = users.slice(0, 3).map((u: { firstName: string; lastName: string; email: string; createdAt: string }) => ({
        type: 'student' as const,
        name: `${u.firstName} ${u.lastName}`,
        detail: u.email,
        time: new Date(u.createdAt).toLocaleDateString('fr-FR'),
        icon: '👤',
      }));

      setRecent(recentStudents);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
          <div>Chargement du dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">🏠 Dashboard</h1>
          <p className="page-subtitle">Vue d&apos;ensemble de la plateforme EcoScience</p>
        </div>
        <Link href="/admin/contest/new" className="btn-admin-primary">
          ➕ Nouveau concours
        </Link>
      </div>

      {/* Stats globales */}
      <div className="stats-grid">
        <StatCard icon="👥" value={stats?.totalStudents ?? 0} label="Total élèves" color="#5e17eb" />
        <StatCard icon="📝" value={stats?.totalParticipations ?? 0} label="Participations" color="#7ed957" />
        <StatCard icon="⭐" value={`${stats?.avgScore ?? 0}%`} label="Score moyen global" color="#f59e0b" />
        <StatCard icon="🏆" value={contests.filter(c => c.isActive).length} label="Concours actifs" color="#0ea5e9" />
      </div>

      {/* Tableau récapitulatif des concours */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>📊 Aperçu par concours</h2>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Concours</th>
              <th>Statut</th>
              <th>Participants</th>
              <th>Score moyen</th>
              <th>Complétion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{c.icon}</span>
                    <span style={{ fontWeight: 500 }}>{c.title}</span>
                  </div>
                </td>
                <td>
                  <span className={c.isActive ? 'badge-active' : 'badge-locked'}>
                    {c.isActive ? '✅ Actif' : '🔒 Verrouillé'}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{c.participantCount}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${c.avgScore}%`, height: '100%', background: '#5e17eb', borderRadius: 2 }} />
                    </div>
                    <span>{c.avgScore}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${c.completionRate}%`, height: '100%', background: '#7ed957', borderRadius: 2 }} />
                    </div>
                    <span>{c.completionRate}%</span>
                  </div>
                </td>
                <td>
                  <Link href={`/admin/contest/${c.id}`} className="btn-admin-secondary btn-admin-sm">
                    Gérer →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activité récente */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="admin-card">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🕐 Activité récente</h2>
          {recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">Aucune activité récente</div>
            </div>
          ) : (
            recent.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < recent.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(94,23,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{a.detail}</div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{a.time}</div>
              </div>
            ))
          )}
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>⚡ Actions rapides</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/admin/students" className="btn-admin-secondary" style={{ justifyContent: 'flex-start' }}>
              👥 Gérer les élèves
            </Link>
            <Link href="/admin/contest/new" className="btn-admin-secondary" style={{ justifyContent: 'flex-start' }}>
              ➕ Créer un concours
            </Link>
            {contests.length > 0 && (
              <Link href={`/admin/contest/${contests[0].id}/results`} className="btn-admin-secondary" style={{ justifyContent: 'flex-start' }}>
                📊 Voir les résultats
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
