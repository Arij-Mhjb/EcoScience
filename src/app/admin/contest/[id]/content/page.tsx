'use client';
import{useState,useEffect,useCallback}from'react';
import{useParams}from'next/navigation';
import Link from'next/link';

type SubTab='capsules'|'questions'|'challenges'|'zones';

function ZonesTab({id}:{id:string}){
  const[zones,setZones]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[form,setForm]=useState({title:'',description:'',icon:'📍',order:1});
  const[editId,setEditId]=useState<string|null>(null);
  const[showForm,setShowForm]=useState(false);

  const load=useCallback(()=>{fetch(`/api/admin/contests/${id}/content/zones`).then(r=>r.json()).then(d=>{setZones(d.zones||[]);setLoading(false);});},[id]);
  useEffect(()=>{load();},[load]);

  const handleSave=async()=>{
    if(editId){await fetch(`/api/admin/contests/${id}/content/zones/${editId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});}
    else{await fetch(`/api/admin/contests/${id}/content/zones`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});}
    setShowForm(false);setEditId(null);setForm({title:'',description:'',icon:'📍',order:1});load();
  };

  const handleEdit=(z:any)=>{setForm({title:z.title,description:z.description,icon:z.icon,order:z.order});setEditId(z.id);setShowForm(true);};
  const handleDelete=async(zid:string)=>{if(!confirm('Supprimer cette zone et toutes ses questions ?'))return;await fetch(`/api/admin/contests/${id}/content/zones/${zid}`,{method:'DELETE'});load();};

  return(
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
        <button className="btn-admin-primary" onClick={()=>{setShowForm(true);setEditId(null);setForm({title:'',description:'',icon:'📍',order:(zones.length+1)});}}>➕ Ajouter une zone</button>
      </div>
      {showForm&&(
        <div className="admin-card" style={{marginBottom:16,border:'1px solid rgba(94,23,235,0.3)'}}>
          <h3 style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:14}}>{editId?'Modifier':'Nouvelle'} zone</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Titre (arabe)</label><input className="admin-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} dir="rtl"/></div>
            <div className="form-group"><label className="form-label">Icône</label><input className="admin-input" value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})} style={{textAlign:'center',fontSize:20}}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Description</label><input className="admin-input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Ordre</label><input className="admin-input" type="number" value={form.order} onChange={e=>setForm({...form,order:+e.target.value})}/></div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn-admin-primary" onClick={handleSave}>✓ Enregistrer</button>
            <button className="btn-admin-secondary" onClick={()=>{setShowForm(false);setEditId(null);}}>Annuler</button>
          </div>
        </div>
      )}
      {loading?<div className="empty-state"><div className="empty-state-icon">⏳</div></div>:zones.length===0?<div className="empty-state"><div className="empty-state-icon">🗺️</div><div className="empty-state-text">Aucune zone créée</div></div>:(
        <table className="admin-table">
          <thead><tr><th>Ordre</th><th>Zone</th><th>Questions</th><th>Défis</th><th>Actions</th></tr></thead>
          <tbody>
            {zones.map(z=>(
              <tr key={z.id}>
                <td style={{fontWeight:700,color:'rgba(255,255,255,0.4)'}}>{z.order}</td>
                <td><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{fontSize:20}}>{z.icon}</span><div><div style={{fontWeight:600,color:'#fff',direction:'rtl'}}>{z.title}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>{z.description}</div></div></div></td>
                <td>{z._count?.questions??0}</td>
                <td>{z._count?.challenges??0}</td>
                <td><div style={{display:'flex',gap:6}}><button className="btn-admin-secondary btn-admin-sm" onClick={()=>handleEdit(z)}>✏️</button><button className="btn-admin-danger btn-admin-sm" onClick={()=>handleDelete(z.id)}>🗑️</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function QuestionsTab({id}:{id:string}){
  const[questions,setQuestions]=useState<any[]>([]);
  const[zones,setZones]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[filterZone,setFilterZone]=useState('');
  const[showForm,setShowForm]=useState(false);
  const[editId,setEditId]=useState<string|null>(null);
  const[form,setForm]=useState({text:'',options:['','','',''],answer:0,points:3,tip:'',order:1,zoneId:''});
  const[importJson,setImportJson]=useState('');
  const[showImport,setShowImport]=useState(false);

  const load=useCallback(()=>{
    Promise.all([
      fetch(`/api/admin/contests/${id}/content/questions${filterZone?`?zoneId=${filterZone}`:''}`).then(r=>r.json()),
      fetch(`/api/admin/contests/${id}/content/zones`).then(r=>r.json()),
    ]).then(([qd,zd])=>{setQuestions(qd.questions||[]);setZones(zd.zones||[]);setLoading(false);});
  },[id,filterZone]);
  useEffect(()=>{load();},[load]);

  const handleSave=async()=>{
    const data={...form,options:form.options.filter(o=>o.trim()!=='')};
    if(editId){await fetch(`/api/admin/contests/${id}/content/questions/${editId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});}
    else{await fetch(`/api/admin/contests/${id}/content/questions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});}
    setShowForm(false);setEditId(null);setForm({text:'',options:['','','',''],answer:0,points:3,tip:'',order:1,zoneId:''});load();
  };

  const handleDelete=async(qid:string)=>{await fetch(`/api/admin/contests/${id}/content/questions/${qid}`,{method:'DELETE'});load();};
  const handleEdit=(q:any)=>{
    const opts=[...q.options];while(opts.length<4)opts.push('');
    setForm({text:q.text,options:opts,answer:q.answer,points:q.points,tip:q.tip,order:q.order,zoneId:q.zoneId});setEditId(q.id);setShowForm(true);
  };
  const handleImport=async()=>{
    try{const data=JSON.parse(importJson);await fetch(`/api/admin/contests/${id}/content/questions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});setShowImport(false);setImportJson('');load();}
    catch(e){alert('JSON invalide');}
  };

  return(
    <div>
      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
        <select className="admin-select" style={{width:200}} value={filterZone} onChange={e=>setFilterZone(e.target.value)}>
          <option value="">Toutes les zones</option>
          {zones.map(z=><option key={z.id} value={z.id}>{z.icon} {z.title}</option>)}
        </select>
        <div style={{flex:1}}/>
        <button className="btn-admin-secondary" onClick={()=>setShowImport(!showImport)}>📥 Import JSON</button>
        <button className="btn-admin-primary" onClick={()=>{setShowForm(true);setEditId(null);setForm({text:'',options:['','','',''],answer:0,points:3,tip:'',order:questions.length+1,zoneId:zones[0]?.id||''});}}>➕ Ajouter</button>
      </div>
      {showImport&&(
        <div className="admin-card" style={{marginBottom:16}}>
          <h3 style={{fontSize:14,fontWeight:600,color:'#fff',marginBottom:10}}>Import JSON</h3>
          <p style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:10}}>Format: {'[{ text, options: [], answer, points, tip, zoneId }]'}</p>
          <textarea className="admin-textarea" style={{minHeight:120}} value={importJson} onChange={e=>setImportJson(e.target.value)} placeholder={'[{"text":"...","options":["a","b","c","d"],"answer":0,"points":3,"tip":"...","zoneId":"..."}]'}/>
          <div style={{display:'flex',gap:8,marginTop:8}}><button className="btn-admin-primary" onClick={handleImport}>Importer</button><button className="btn-admin-secondary" onClick={()=>setShowImport(false)}>Annuler</button></div>
        </div>
      )}
      {showForm&&(
        <div className="admin-card" style={{marginBottom:16,border:'1px solid rgba(94,23,235,0.3)'}}>
          <h3 style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:14}}>{editId?'Modifier':'Nouvelle'} question</h3>
          <div className="form-group"><label className="form-label">Texte de la question (arabe)</label><textarea className="admin-textarea" value={form.text} onChange={e=>setForm({...form,text:e.target.value})} dir="rtl"/></div>
          <div style={{marginBottom:12}}>
            <label className="form-label">Options (A/B/C/D)</label>
            {form.options.map((o,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <div style={{width:24,height:24,borderRadius:6,background:form.answer===i?'#5e17eb':'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',cursor:'pointer',flexShrink:0}} onClick={()=>setForm({...form,answer:i})}>{['A','B','C','D'][i]}</div>
                <input className="admin-input" value={o} onChange={e=>{const opts=[...form.options];opts[i]=e.target.value;setForm({...form,options:opts});}} placeholder={`Option ${['A','B','C','D'][i]}`} dir="rtl"/>
              </div>
            ))}
            <div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>Cliquez sur la lettre pour marquer la bonne réponse</div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Points (3 ou 4)</label><select className="admin-select" value={form.points} onChange={e=>setForm({...form,points:+e.target.value})}><option value={3}>3 pts</option><option value={4}>4 pts</option></select></div>
            <div className="form-group"><label className="form-label">Zone</label><select className="admin-select" value={form.zoneId} onChange={e=>setForm({...form,zoneId:e.target.value})}>{zones.map(z=><option key={z.id} value={z.id}>{z.icon} {z.title}</option>)}</select></div>
          </div>
          <div className="form-group"><label className="form-label">Justification (arabe)</label><textarea className="admin-textarea" value={form.tip} onChange={e=>setForm({...form,tip:e.target.value})} dir="rtl"/></div>
          <div style={{display:'flex',gap:8}}><button className="btn-admin-primary" onClick={handleSave}>✓ Enregistrer</button><button className="btn-admin-secondary" onClick={()=>{setShowForm(false);setEditId(null);}}>Annuler</button></div>
        </div>
      )}
      {loading?<div className="empty-state"><div className="empty-state-icon">⏳</div></div>:questions.length===0?<div className="empty-state"><div className="empty-state-icon">❓</div><div className="empty-state-text">Aucune question</div></div>:(
        <table className="admin-table">
          <thead><tr><th>#</th><th>Question</th><th>Zone</th><th>Pts</th><th>Actions</th></tr></thead>
          <tbody>
            {questions.map((q,i)=>(
              <tr key={q.id}>
                <td style={{color:'rgba(255,255,255,0.3)',fontWeight:700}}>{i+1}</td>
                <td><div style={{color:'#fff',direction:'rtl',fontWeight:500,maxWidth:400}}>{q.text}</div></td>
                <td><span style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{q.zone?.title}</span></td>
                <td><span style={{fontWeight:700,color:q.points===4?'#fbbf24':'#7ed957'}}>{q.points}pts</span></td>
                <td><div style={{display:'flex',gap:6}}><button className="btn-admin-secondary btn-admin-sm" onClick={()=>handleEdit(q)}>✏️</button><button className="btn-admin-danger btn-admin-sm" onClick={()=>handleDelete(q.id)}>🗑️</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function CapsulesTab({id}:{id:string}){
  const[capsules,setCapsules]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[showForm,setShowForm]=useState(false);
  const[editId,setEditId]=useState<string|null>(null);
  const[form,setForm]=useState({title:'',description:'',videoUrl:'',duration:180,turtleMsg:'',order:1});

  const load=useCallback(()=>{fetch(`/api/admin/contests/${id}/content/capsules`).then(r=>r.json()).then(d=>{setCapsules(d.capsules||[]);setLoading(false);});},[id]);
  useEffect(()=>{load();},[load]);

  const handleSave=async()=>{
    if(editId){await fetch(`/api/admin/contests/${id}/content/capsules/${editId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});}
    else{await fetch(`/api/admin/contests/${id}/content/capsules`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});}
    setShowForm(false);setEditId(null);setForm({title:'',description:'',videoUrl:'',duration:180,turtleMsg:'',order:1});load();
  };
  const handleEdit=(c:any)=>{setForm({title:c.title,description:c.description,videoUrl:c.videoUrl,duration:c.duration,turtleMsg:c.turtleMsg,order:c.order});setEditId(c.id);setShowForm(true);};
  const handleDelete=async(cid:string)=>{await fetch(`/api/admin/contests/${id}/content/capsules/${cid}`,{method:'DELETE'});load();};

  return(
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
        <button className="btn-admin-primary" onClick={()=>{setShowForm(true);setEditId(null);setForm({title:'',description:'',videoUrl:'',duration:180,turtleMsg:'',order:capsules.length+1});}}>➕ Ajouter une capsule</button>
      </div>
      {showForm&&(
        <div className="admin-card" style={{marginBottom:16,border:'1px solid rgba(94,23,235,0.3)'}}>
          <h3 style={{fontSize:14,fontWeight:700,color:'#fff',marginBottom:14}}>{editId?'Modifier':'Nouvelle'} capsule</h3>
          <div className="form-group"><label className="form-label">Titre (arabe)</label><input className="admin-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} dir="rtl"/></div>
          <div className="form-group"><label className="form-label">Description</label><input className="admin-input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">URL Vidéo (YouTube embed)</label><input className="admin-input" value={form.videoUrl} onChange={e=>setForm({...form,videoUrl:e.target.value})} placeholder="https://www.youtube.com/embed/..."/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Durée (secondes)</label><input className="admin-input" type="number" value={form.duration} onChange={e=>setForm({...form,duration:+e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Ordre</label><input className="admin-input" type="number" value={form.order} onChange={e=>setForm({...form,order:+e.target.value})}/></div>
          </div>
          <div className="form-group"><label className="form-label">Message tortue (arabe)</label><textarea className="admin-textarea" value={form.turtleMsg} onChange={e=>setForm({...form,turtleMsg:e.target.value})} dir="rtl"/></div>
          <div style={{display:'flex',gap:8}}><button className="btn-admin-primary" onClick={handleSave}>✓ Enregistrer</button><button className="btn-admin-secondary" onClick={()=>{setShowForm(false);setEditId(null);}}>Annuler</button></div>
        </div>
      )}
      {loading?<div className="empty-state"><div className="empty-state-icon">⏳</div></div>:capsules.length===0?<div className="empty-state"><div className="empty-state-icon">📹</div><div className="empty-state-text">Aucune capsule</div></div>:(
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {capsules.map(c=>(
            <div key={c.id} className="admin-card" style={{display:'flex',gap:16,alignItems:'flex-start'}}>
              <div style={{width:48,height:48,borderRadius:12,background:'rgba(94,23,235,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>📹</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,color:'#fff',direction:'rtl',marginBottom:4}}>{c.title}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{Math.floor(c.duration/60)}min {c.duration%60}s · Ordre {c.order}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginTop:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.videoUrl}</div>
              </div>
              <div style={{display:'flex',gap:6,flexShrink:0}}>
                <button className="btn-admin-secondary btn-admin-sm" onClick={()=>handleEdit(c)}>✏️</button>
                <button className="btn-admin-danger btn-admin-sm" onClick={()=>handleDelete(c.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChallengesTab({id}:{id:string}){
  const[challenges,setChallenges]=useState<any[]>([]);
  const[zones,setZones]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);

  const load=useCallback(()=>{
    Promise.all([
      fetch(`/api/admin/contests/${id}/content/challenges`).then(r=>r.json()),
      fetch(`/api/admin/contests/${id}/content/zones`).then(r=>r.json()),
    ]).then(([cd,zd])=>{setChallenges(cd.challenges||[]);setZones(zd.zones||[]);setLoading(false);});
  },[id]);
  useEffect(()=>{load();},[load]);

  const handleDelete=async(chid:string)=>{await fetch(`/api/admin/contests/${id}/content/challenges/${chid}`,{method:'DELETE'});load();};

  return(
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
        <div style={{fontSize:13,color:'rgba(255,255,255,0.4)',padding:'10px 0'}}>Les défis peuvent être créés depuis la page Zones. Sélectionnez une zone et ajoutez un défi.</div>
      </div>
      {loading?<div className="empty-state"><div className="empty-state-icon">⏳</div></div>:challenges.length===0?<div className="empty-state"><div className="empty-state-icon">🎮</div><div className="empty-state-text">Aucun défi visuel</div></div>:(
        <table className="admin-table">
          <thead><tr><th>Titre</th><th>Type</th><th>Zone</th><th>Points</th><th>Actions</th></tr></thead>
          <tbody>
            {challenges.map(c=>(
              <tr key={c.id}>
                <td style={{fontWeight:600,color:'#fff',direction:'rtl'}}>{c.title}</td>
                <td><span style={{background:'rgba(94,23,235,0.15)',border:'1px solid rgba(94,23,235,0.25)',borderRadius:8,padding:'2px 10px',fontSize:11}}>{c.type==='drag_drop'?'🎯 Drag & Drop':'🔗 Matching'}</span></td>
                <td style={{color:'rgba(255,255,255,0.5)',fontSize:12}}>{c.zone?.title}</td>
                <td style={{fontWeight:700,color:'#7ed957'}}>{c.points}pts</td>
                <td><button className="btn-admin-danger btn-admin-sm" onClick={()=>handleDelete(c.id)}>🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function ContestContentPage(){
  const{id}=useParams() as{id:string};
  const[sub,setSub]=useState<SubTab>('capsules');

  const subTabs=[{key:'capsules',label:'📹 Capsules'},{key:'questions',label:'❓ Questions'},{key:'challenges',label:'🎮 Défis'},{key:'zones',label:'🗺️ Zones'}] as const;

  return(
    <div>
      <div className="page-header">
        <div>
          <Link href={`/admin/contest/${id}`} style={{fontSize:13,color:'rgba(255,255,255,0.35)',textDecoration:'none',display:'block',marginBottom:6}}>← Retour au concours</Link>
          <h1 className="page-title">📝 Gestion du contenu</h1>
        </div>
      </div>
      <div className="tabs-bar">
        {subTabs.map(t=><button key={t.key} className={`tab-btn${sub===t.key?' active':''}`} onClick={()=>setSub(t.key as SubTab)}>{t.label}</button>)}
      </div>
      {sub==='capsules'&&<CapsulesTab id={id}/>}
      {sub==='questions'&&<QuestionsTab id={id}/>}
      {sub==='challenges'&&<ChallengesTab id={id}/>}
      {sub==='zones'&&<ZonesTab id={id}/>}
    </div>
  );
}
