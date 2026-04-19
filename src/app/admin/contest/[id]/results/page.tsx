'use client';
import{useState,useEffect,useCallback}from'react';
import{useParams}from'next/navigation';
import Link from'next/link';

export default function ContestResultsPage(){
  const{id}=useParams() as{id:string};
  const[results,setResults]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[selected,setSelected]=useState<any>(null);

  const load=useCallback(()=>{
    fetch(`/api/admin/contests/${id}/results`).then(r=>r.json()).then(d=>{setResults(d.results||[]);setLoading(false);});
  },[id]);

  useEffect(()=>{load();},[load]);

  const fmt=(s:number)=>{if(!s)return'—';return`${Math.floor(s/60)}m ${s%60}s`;};

  const exportCSV=()=>{
    const rows=[['Rang','Prénom','Nom','Email','Score','Temps','Erreurs','Statut'],...results.map(r=>[String(r.rank),r.firstName,r.lastName,r.email,String(r.score),fmt(r.timeSpent),String(r.errors),r.status])];
    const csv=rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv'}));a.download='resultats.csv';a.click();
  };

  const medalColor=(rank:number)=>rank===1?'#f59e0b':rank===2?'#9ca3af':rank===3?'#b45309':'rgba(255,255,255,0.3)';
  const medalIcon=(rank:number)=>rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':`#${rank}`;

  return(
    <div>
      {selected&&(
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">
              📋 Détail — {selected.firstName} {selected.lastName}
              <button className="modal-close" onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:20}}>
              {[{l:'Score',v:`${selected.score}pts`,c:'#7ed957'},{l:'Temps',v:fmt(selected.timeSpent),c:'#0ea5e9'},{l:'Erreurs',v:String(selected.errors),c:selected.errors>3?'#f87171':'#fff'}].map((s,i)=>(
                <div key={i} style={{background:'rgba(255,255,255,0.04)',borderRadius:10,padding:14,textAlign:'center'}}>
                  <div style={{fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginTop:4}}>{s.l}</div>
                </div>
              ))}
            </div>
            {selected.quizAnswers&&Array.isArray(selected.quizAnswers)&&selected.quizAnswers.length>0&&(
              <div>
                <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.5)',marginBottom:10,textTransform:'uppercase',letterSpacing:1}}>Réponses quiz</div>
                {selected.quizAnswers.map((qa:any,i:number)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                    <span style={{fontSize:16}}>{qa.correct?'✅':'❌'}</span>
                    <span style={{fontSize:13,color:'rgba(255,255,255,0.7)',direction:'rtl',flex:1}}>{qa.questionText||`Q${i+1}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <Link href={`/admin/contest/${id}`} style={{fontSize:13,color:'rgba(255,255,255,0.35)',textDecoration:'none',display:'block',marginBottom:6}}>← Retour au concours</Link>
          <h1 className="page-title">🏅 Classement officiel</h1>
          <p className="page-subtitle">{results.length} participant(s) · Tri: score ↓ erreurs ↑ temps ↑</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={()=>window.print()} className="btn-admin-secondary">🖨️ Imprimer</button>
          <button onClick={exportCSV} className="btn-admin-primary">📥 Export CSV</button>
        </div>
      </div>

      <div className="admin-card">
        {loading?<div className="empty-state"><div className="empty-state-icon">⏳</div></div>:results.length===0?<div className="empty-state"><div className="empty-state-icon">📭</div><div className="empty-state-text">Aucun résultat</div></div>:(
          <table className="admin-table">
            <thead><tr><th>Rang</th><th>Élève</th><th>Score</th><th>Temps</th><th>Erreurs</th><th>Statut</th><th>Détail</th></tr></thead>
            <tbody>
              {results.map(r=>(
                <tr key={r.participationId}>
                  <td>
                    <span style={{fontSize:r.rank<=3?22:14,fontWeight:800,color:medalColor(r.rank)}}>{medalIcon(r.rank)}</span>
                  </td>
                  <td>
                    <div style={{fontWeight:600,color:'#fff'}}>{r.firstName} {r.lastName}</div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>{r.email}</div>
                  </td>
                  <td>
                    <div style={{fontWeight:800,fontSize:16,color:r.score>=80?'#7ed957':r.score>=50?'#fbbf24':'#f87171'}}>{r.score}</div>
                  </td>
                  <td style={{color:'rgba(255,255,255,0.5)',fontSize:13}}>{fmt(r.timeSpent)}</td>
                  <td style={{color:r.errors>3?'#f87171':'rgba(255,255,255,0.6)'}}>{r.errors}</td>
                  <td>
                    {r.status==='completed'?<span className="badge-completed">✅ Terminé</span>:r.status==='in_progress'?<span className="badge-in-progress">⏳ En cours</span>:<span className="badge-not-started">⬜ Non démarré</span>}
                  </td>
                  <td>
                    <button className="btn-admin-secondary btn-admin-sm" onClick={()=>setSelected(r)}>👁️ Voir</button>
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
