'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Participation {
  id: string;
  contestId: string;
  contest: { id: string; title: string; icon: string; isActive: boolean };
  score: number;
  timeSpent: number;
  errors: number;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  plainPassword: string;
  xp: number;
  level: number;
  createdAt: string;
  participations: Participation[];
}

interface Contest { id: string; title: string; icon: string; }

function fmt(s: number) { if (!s) return '—'; return `${Math.floor(s / 60)}m ${s % 60}s`; }

function StatusBadge({ status }: { status: string }) {
  if (status === 'completed') return <span className="badge-completed">✅ Terminé</span>;
  if (status === 'in_progress') return <span className="badge-in-progress">⏳ En cours</span>;
  return <span className="badge-not-started">⬜ Non démarré</span>;
}

// Composant mot de passe avec show/hide
function PasswordField({ plain, onEdit }: { plain: string; onEdit: () => void }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, fontWeight: 600 }}>
        🔑 Mot de passe
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
        <span style={{ flex: 1, fontFamily: show ? 'inherit' : 'monospace', fontSize: show ? 14 : 18, color: show ? '#fff' : 'rgba(255,255,255,0.6)', letterSpacing: show ? 'normal' : 4 }}>
          {show ? (plain || '—') : '••••••••'}
        </span>
        <button
          onClick={() => setShow(s => !s)}
          title={show ? 'Masquer' : 'Afficher'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: '2px 4px', opacity: 0.7, transition: 'opacity 0.2s' }}
        >
          {show ? '🙈' : '👁️'}
        </button>
        <button
          onClick={onEdit}
          title="Modifier le mot de passe"
          style={{ background: 'rgba(94,23,235,0.15)', border: '1px solid rgba(94,23,235,0.25)', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#a78bfa', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
        >
          ✏️ Modifier
        </button>
      </div>
    </div>
  );
}

export default function StudentDetailPage() {
  const { id } = useParams() as { id: string };
  const [student, setStudent] = useState<Student | null>(null);
  const [allContests, setAllContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingPwd, setEditingPwd] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [assignContestId, setAssignContestId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/students/${id}`).then(r => r.json()),
      fetch('/api/admin/contests').then(r => r.json()),
    ]).then(([sd, cd]) => {
      setStudent(sd.user);
      setAllContests(cd.contests || []);
      setForm({ firstName: sd.user.firstName, lastName: sd.user.lastName, email: sd.user.email, password: '' });
      setLoading(false);
    });
  };

  useEffect(load, [id]);

  const handleSave = async () => {
    setSaving(true);
    const patch: Record<string, string> = {};
    if (form.firstName) patch.firstName = form.firstName;
    if (form.lastName) patch.lastName = form.lastName;
    if (form.email) patch.email = form.email;
    if (form.password) patch.password = form.password;

    const res = await fetch(`/api/admin/students/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    setSaving(false);
    if (res.ok) {
      setEditing(false);
      setEditingPwd(false);
      setSuccessMsg('Modifications enregistrées !');
      setTimeout(() => setSuccessMsg(''), 3000);
      load();
    } else {
      const d = await res.json();
      setErrorMsg(d.error || 'Erreur');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleAssign = async () => {
    if (!assignContestId) return;
    setAssigning(true);
    const res = await fetch(`/api/admin/students/${id}/participations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contestId: assignContestId }),
    });
    setAssigning(false);
    setAssignContestId('');
    if (res.ok) { setSuccessMsg('Élève inscrit avec succès !'); }
    else { const d = await res.json(); setErrorMsg(d.error || 'Erreur'); }
    setTimeout(() => { setSuccessMsg(''); setErrorMsg(''); }, 3000);
    load();
  };

  const handleRemove = async (contestId: string) => {
    if (!confirm('Retirer cet élève de ce concours ? Sa progression sera supprimée.')) return;
    await fetch(`/api/admin/students/${id}/participations`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contestId }) });
    load();
  };

  const handleReset = async (contestId: string) => {
    if (!confirm('هل أنت متأكد؟ سيتم حذف كل تقدم هذا التلميذ')) return;
    await fetch(`/api/admin/contests/${contestId}/students/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reset' }) });
    setSuccessMsg('Progression réinitialisée !');
    setTimeout(() => setSuccessMsg(''), 3000);
    load();
  };

  const notAssigned = allContests.filter(c => !student?.participations.find(p => p.contestId === c.id));

  if (loading) return <div style={{ padding: 40, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Chargement...</div>;
  if (!student) return <div style={{ padding: 40, color: '#f87171', textAlign: 'center' }}>Élève introuvable</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
        <Link href="/admin/students" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>👥 Élèves</Link>
        <span>›</span>
        <span style={{ color: '#fff' }}>{student.firstName} {student.lastName}</span>
      </div>

      {successMsg && <div style={{ background: 'rgba(126,217,87,0.1)', border: '1px solid rgba(126,217,87,0.3)', borderRadius: 10, padding: '12px 16px', color: '#7ed957', fontSize: 13, marginBottom: 20 }}>✅ {successMsg}</div>}
      {errorMsg && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', color: '#f87171', fontSize: 13, marginBottom: 20 }}>⚠️ {errorMsg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Infos personnelles */}
        <div className="admin-card">
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #5e17eb, #7ed957)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 auto 12px' }}>
              {student.firstName.charAt(0)}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{student.firstName} {student.lastName}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{student.email}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{ background: 'rgba(126,217,87,0.08)', border: '1px solid rgba(126,217,87,0.15)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#7ed957' }}>{student.xp}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>XP Total</div>
            </div>
            <div style={{ background: 'rgba(94,23,235,0.08)', border: '1px solid rgba(94,23,235,0.15)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#a78bfa' }}>Niv.{student.level}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Niveau</div>
            </div>
          </div>

          {/* Mot de passe lisible */}
          <div style={{ marginBottom: 20 }}>
            {!editingPwd ? (
              <PasswordField plain={student.plainPassword} onEdit={() => { setEditingPwd(true); setEditing(false); }} />
            ) : (
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, fontWeight: 600 }}>🔑 Nouveau mot de passe</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="admin-input"
                    type="text"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Nouveau mot de passe..."
                    style={{ flex: 1 }}
                  />
                  <button className="btn-admin-primary btn-admin-sm" onClick={handleSave} disabled={saving || !form.password}>
                    {saving ? '...' : '✓'}
                  </button>
                  <button className="btn-admin-secondary btn-admin-sm" onClick={() => { setEditingPwd(false); setForm({ ...form, password: '' }); }}>✕</button>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,200,0,0.6)', marginTop: 6 }}>⚠️ Le nouveau mot de passe sera visible en clair ici.</div>
              </div>
            )}
          </div>

          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>
            Inscrit le {new Date(student.createdAt).toLocaleDateString('fr-FR')}
          </div>

          {!editing ? (
            <button className="btn-admin-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setEditing(true); setEditingPwd(false); }}>
              ✏️ Modifier les informations
            </button>
          ) : (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: 11 }}>Modifier les informations</div>
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input className="admin-input" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Nom</label>
                <input className="admin-input" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="admin-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-admin-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave} disabled={saving}>
                  {saving ? '...' : '✓ Enregistrer'}
                </button>
                <button className="btn-admin-secondary" onClick={() => setEditing(false)}>✕</button>
              </div>
            </div>
          )}
        </div>

        {/* Participations */}
        <div>
          <div className="admin-card" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🏆 Participations aux concours</h2>

            {student.participations.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">📭</div><div className="empty-state-text">Aucune participation</div></div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr><th>Concours</th><th>Score</th><th>Temps</th><th>Erreurs</th><th>Statut</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {student.participations.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{p.contest.icon}</span>
                          <span style={{ fontWeight: 500 }}>{p.contest.title}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: p.score > 70 ? '#7ed957' : p.score > 40 ? '#fbbf24' : '#f87171' }}>{p.score}pts</td>
                      <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{fmt(p.timeSpent)}</td>
                      <td style={{ color: p.errors > 3 ? '#f87171' : 'rgba(255,255,255,0.5)' }}>{p.errors}</td>
                      <td><StatusBadge status={p.status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link href={`/admin/contest/${p.contestId}`} className="btn-admin-secondary btn-admin-sm">👁️</Link>
                          <button className="btn-admin-secondary btn-admin-sm" onClick={() => handleReset(p.contestId)} title="Reset">🔄</button>
                          <button className="btn-admin-danger btn-admin-sm" onClick={() => handleRemove(p.contestId)} title="Retirer">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {notAssigned.length > 0 && (
            <div className="admin-card">
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 14 }}>➕ Inscrire à un concours</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <select className="admin-select" value={assignContestId} onChange={e => setAssignContestId(e.target.value)} style={{ flex: 1 }}>
                  <option value="">Sélectionner un concours...</option>
                  {notAssigned.map(c => <option key={c.id} value={c.id}>{c.icon} {c.title}</option>)}
                </select>
                <button className="btn-admin-primary" onClick={handleAssign} disabled={!assignContestId || assigning}>
                  {assigning ? '...' : 'Inscrire'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
