'use client';
import{useState,useEffect,useCallback}from'react';
import{useParams}from'next/navigation';
import Link from'next/link';

function fmt(s:number){if(!s)return'—';return`${Math.floor(s/60)}m ${s%60}s`;}
function StatusBadge({s}:{s:string}){
  if(s==='completed')return<span className="badge-completed">✅</span>;
  if(s==='in_progress')return<span className="badge-in-progress">⏳</span>;
  return<span className="badge-not-started">⬜</span>;
}

export default function ContestStudentsPage(){
  const{id}=useParams() as{id:string};
  const[parts,setParts]=useState<any[]>([]);
  const[allStudents,setAllStudents]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[search,setSearch]=useState('');
  const[addUserId,setAddUserId]=useState('');
  const[msg,setMsg]=useState('');

  const load=useCallback(()=>{
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/contests/${id}/students`).then(r=>r.json()),
      fetch('/api/admin/students').then(r=>r.json()),
    ]).then(([pd,sd])=>{
      setParts(pd.participations||[]);
      setAllStudents(sd.users||[]);
      setLoading(false);
    });
  },[id]);

  useEffect(()=>{load();},[load]);

  const filtered=parts.filter(p=>
    search===''||
    `${p.user.firstName} ${p.user.lastName}`.toLowerCase().includes(search.toLowerCase())||
    p.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const notInContest=allStudents.filter(s=>!parts.find(p=>p.user.id===s.id));

  const handleAdd=async()=>{
    if(!addUserId)return;
    const r=await fetch(`/api/admin/contests/${id}/students`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:addUserId})});
    if(r.ok){setMsg('Élève ajouté!');setAddUserId('');load();}
    else{const d=await r.json();setMsg(d.error||'Erreur');}
    setTimeout(()=>setMsg(''),3000);
  };

  const handleRemove=async(userId:string)=>{
    if(!confirm('Retirer cet élève de ce concours ?'))return;
    await fetch(`/api/admin/contests/${id}/students/${userId}`,{method:'DELETE'});
    load();
  };

  const handleReset=async(userId:string)=>{
    if(!confirm('هل أنت متأكد؟ سيتم حذف كل تقدم هذا التلميذ'))return;
    await fetch(`/api/admin/contests/${id}/students/${userId}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'reset'})});
    setMsg('Progression réinitialisée!');setTimeout(()=>setMsg(''),3000);load();
  };

  const exportCSV=()=>{
    const rows=[['Nom','Email','Score','Temps','Erreurs','Statut'],...filtered.map(p=>[`${p.user.firstName} ${p.user.lastName}`,p.user.email,String(p.score),fmt(p.timeSpent),String(p.errors),p.status])];
    const csv=rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv'}));a.download='participants.csv';a.click();
  };

  return(
    <div>
      <div className="page-header">
        <div>
          <div style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginBottom:6}}>
            <Link href={`/admin/contest/${id}`} style={{color:'inherit',textDecoration:'none'}}>← Retour au concours</Link>
          </div>
          <h1 className="page-title">👥 Élèves du concours</h1>
          <p className="page-subtitle">{parts.length} participant(s)</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={exportCSV} className="btn-admin-secondary">📥 CSV</button>
        </div>
      </div>

      {msg&&<div style={{background:'rgba(126,217,87,0.1)',border:'1px solid rgba(126,217,87,0.3)',borderRadius:10,padding:'10px 16px',color:'#7ed957',fontSize:13,marginBottom:16}}>{msg}</div>}

      <div className="admin-card" style={{marginBottom:16}}>
        <h3 style={{fontSize:14,fontWeight:600,color:'#fff',marginBottom:12}}>➕ Ajouter un élève existant</h3>
        <div style={{display:'flex',gap:10}}>
          <select className="admin-select" value={addUserId} onChange={e=>setAddUserId(e.target.value)} style={{flex:1}}>
            <option value="">Sélectionner un élève...</option>
            {notInContest.map(s=><option key={s.id} value={s.id}>{s.firstName} {s.lastName} — {s.email}</option>)}
          </select>
          <button className="btn-admin-primary" onClick={handleAdd} disabled={!addUserId}>Ajouter</button>
          <Link href="/admin/students" className="btn-admin-secondary">➕ Créer élève</Link>
        </div>
      </div>

      <div className="admin-card">
        <div style={{marginBottom:16}}>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input className="admin-input" style={{paddingLeft:36}} placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>
        {loading?<div className="empty-state"><div className="empty-state-icon">⏳</div></div>:filtered.length===0?<div className="empty-state"><div className="empty-state-icon">👥</div><div className="empty-state-text">Aucun participant</div></div>:(
          <table className="admin-table">
            <thead><tr><th>Élève</th><th>Score</th><th>Temps</th><th>Erreurs</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id}>
                  <td>
                    <div style={{fontWeight:600,color:'#fff'}}>{p.user.firstName} {p.user.lastName}</div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>{p.user.email}</div>
                  </td>
                  <td style={{fontWeight:700,color:p.score>70?'#7ed957':p.score>40?'#fbbf24':'#f87171'}}>{p.score}pts</td>
                  <td style={{color:'rgba(255,255,255,0.5)',fontSize:12}}>{fmt(p.timeSpent)}</td>
                  <td style={{color:p.errors>3?'#f87171':'rgba(255,255,255,0.5)'}}>{p.errors}</td>
                  <td><StatusBadge s={p.status}/></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <Link href={`/admin/students/${p.user.id}`} className="btn-admin-secondary btn-admin-sm">👁️</Link>
                      <button className="btn-admin-secondary btn-admin-sm" onClick={()=>handleReset(p.user.id)} title="Reset">🔄</button>
                      <button className="btn-admin-danger btn-admin-sm" onClick={()=>handleRemove(p.user.id)} title="Retirer">✕</button>
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
