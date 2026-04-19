'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Participation {
  contestId: string;
  contest: { id: string; title: string; icon: string };
  score: number;
  status: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  xp: number;
  level: number;
  participations: Participation[];
  createdAt: string;
}

interface Contest { id: string; title: string; icon: string; }

function StudentModal({
  student,
  contests,
  onClose,
  onSave,
}: {
  student: Student | null;
  contests: Contest[];
  onClose: () => void;
  onSave: () => void;
}) {
  const isNew = !student;
  const [form, setForm] = useState({
    firstName: student?.firstName ?? '',
    lastName: student?.lastName ?? '',
    email: student?.email ?? '',
    password: '',
    showPwd: false,
    contestIds: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isNew) {
        const res = await fetch('/api/admin/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const d = await res.json();
          setError(d.error || 'Erreur');
          return;
        }
      } else {
        const patch: Record<string, string> = {};
        if (form.firstName) patch.firstName = form.firstName;
        if (form.lastName) patch.lastName = form.lastName;
        if (form.email) patch.email = form.email;
        if (form.password) patch.password = form.password;

        const res = await fetch(`/api/admin/students/${student!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        if (!res.ok) {
          const d = await res.json();
          setError(d.error || 'Erreur');
          return;
        }
      }
      onSave();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          {isNew ? '➕ Créer un élève' : `✏️ Modifier ${student?.firstName}`}
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input className="admin-input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Prénom" required />
            </div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input className="admin-input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Nom" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="admin-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@ecoscience.ma" required />
          </div>

          <div className="form-group">
            <label className="form-label">
              {isNew ? 'Mot de passe temporaire' : 'Mot de passe'}
            </label>
            {!isNew && student?.plainPassword && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 12px', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Actuel:</span>
                <span style={{ flex: 1, fontFamily: form.showPwd ? 'inherit' : 'monospace', fontSize: form.showPwd ? 13 : 16, color: form.showPwd ? '#fff' : 'rgba(255,255,255,0.6)', letterSpacing: form.showPwd ? 'normal' : 3 }}>
                  {form.showPwd ? student.plainPassword : '••••••••'}
                </span>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, showPwd: !f.showPwd }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: 0.7 }}
                >
                  {form.showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            )}
            <input
              className="admin-input"
              type="text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={isNew ? "Nouveau mot de passe..." : "Saisir un nouveau mot de passe (laisser vide pour ne pas changer)"}
              required={isNew}
            />
          </div>

          {isNew && (
            <div className="form-group">
              <label className="form-label">Assigner à des concours (optionnel)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {contests.map((c) => (
                  <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={form.contestIds.includes(c.id)}
                      onChange={(e) => {
                        if (e.target.checked) setForm({ ...form, contestIds: [...form.contestIds, c.id] });
                        else setForm({ ...form, contestIds: form.contestIds.filter((id) => id !== c.id) });
                      }}
                      style={{ accentColor: '#5e17eb' }}
                    />
                    {c.icon} {c.title}
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" disabled={loading} className="btn-admin-primary" style={{ flex: 1 }}>
              {loading ? 'Enregistrement...' : isNew ? '✓ Créer l\'élève' : '✓ Enregistrer'}
            </button>
            <button type="button" onClick={onClose} className="btn-admin-secondary">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalStudent, setModalStudent] = useState<Student | null | false>(false); // false = closed, null = new
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/students?search=${encodeURIComponent(search)}`).then((r) => r.json()),
      fetch('/api/admin/contests').then((r) => r.json()),
    ]).then(([sd, cd]) => {
      setStudents(sd.users || []);
      setContests(cd.contests || []);
      setLoading(false);
    });
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement cet élève et toutes ses participations ?')) return;
    await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
    load();
  };

  const exportCSV = () => {
    const rows = [
      ['Prénom', 'Nom', 'Email', 'XP', 'Niveau', 'Concours', 'Créé le'],
      ...students.map((s) => [
        s.firstName,
        s.lastName,
        s.email,
        String(s.xp),
        String(s.level),
        s.participations.map((p) => p.contest.title).join(' | '),
        new Date(s.createdAt).toLocaleDateString('fr-FR'),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eleves-ecoscience.csv';
    a.click();
  };

  const statusBadge = (status: string) => {
    if (status === 'completed') return <span className="badge-completed">✅ Terminé</span>;
    if (status === 'in_progress') return <span className="badge-in-progress">⏳ En cours</span>;
    return <span className="badge-not-started">⬜ Pas démarré</span>;
  };

  return (
    <div>
      {/* Modal */}
      {modalStudent !== false && (
        <StudentModal
          student={modalStudent}
          contests={contests}
          onClose={() => setModalStudent(false)}
          onSave={load}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">👥 Gestion des élèves</h1>
          <p className="page-subtitle">{students.length} élève(s) au total</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={exportCSV} className="btn-admin-secondary">📥 Export CSV</button>
          <button onClick={() => setModalStudent(null)} className="btn-admin-primary">➕ Créer un élève</button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="admin-card" style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            className="admin-input"
            style={{ paddingLeft: 36 }}
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="admin-card">
        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-text">Chargement...</div>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-text">Aucun élève trouvé</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Élève</th>
                <th>Email</th>
                <th>Concours</th>
                <th>XP</th>
                <th>Niveau</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #5e17eb, #7ed957)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0 }}>
                        {s.firstName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{s.firstName} {s.lastName}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{s.email}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {s.participations.length === 0 ? (
                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>—</span>
                      ) : s.participations.map((p) => (
                        <span key={p.contestId} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(94,23,235,0.15)', border: '1px solid rgba(94,23,235,0.25)', borderRadius: 8, padding: '2px 8px', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                          {p.contest.icon} {statusBadge(p.status)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#7ed957' }}>{s.xp} XP</td>
                  <td>
                    <span style={{ background: 'rgba(94,23,235,0.15)', border: '1px solid rgba(94,23,235,0.25)', borderRadius: 8, padding: '2px 10px', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                      Niv. {s.level}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/admin/students/${s.id}`} className="btn-admin-secondary btn-admin-sm">👁️</Link>
                      <button className="btn-admin-secondary btn-admin-sm" onClick={() => setModalStudent(s)}>✏️</button>
                      <button className="btn-admin-danger btn-admin-sm" onClick={() => handleDelete(s.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
