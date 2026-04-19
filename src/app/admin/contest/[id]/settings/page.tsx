'use client';
import{useState,useEffect}from'react';
import{useParams,useRouter}from'next/navigation';
import Link from'next/link';

export default function ContestSettingsPage(){
  const{id}=useParams() as{id:string};
  const router=useRouter();
  const[form,setForm]=useState({title:'',description:'',image:'',icon:'',order:1,durationMin:120,isActive:false,isHidden:false});
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[msg,setMsg]=useState('');
  const[showDelete,setShowDelete]=useState(false);
  const[deleteConfirm,setDeleteConfirm]=useState('');

  useEffect(()=>{
    fetch(`/api/admin/contests/${id}`).then(r=>r.json()).then(d=>{
      const c=d.contest;
      setForm({title:c.title,description:c.description,image:c.image,icon:c.icon,order:c.order,durationMin:c.durationMin,isActive:c.isActive,isHidden:c.isHidden});
      setLoading(false);
    });
  },[id]);

  const handleSave=async()=>{
    setSaving(true);
    const r=await fetch(`/api/admin/contests/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    setSaving(false);
    if(r.ok){setMsg('Paramètres sauvegardés !');setTimeout(()=>setMsg(''),3000);}
  };

  const handleToggle=async()=>{
    const newVal=!form.isActive;
    setForm({...form,isActive:newVal});
    await fetch(`/api/admin/contests/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({isActive:newVal})});
    setMsg(newVal?'Concours activé !':'Concours verrouillé !');setTimeout(()=>setMsg(''),3000);
  };

  const handleResetAll=async()=>{
    if(!confirm('Réinitialiser TOUTES les progressions de ce concours ?'))return;
    const r=await fetch(`/api/admin/contests/${id}/students`).then(x=>x.json());
    await Promise.all((r.participations||[]).map((p:any)=>
      fetch(`/api/admin/contests/${id}/students/${p.user.id}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'reset'})})
    ));
    setMsg('Toutes les progressions ont été réinitialisées !');setTimeout(()=>setMsg(''),3000);
  };

  const handleDelete=async()=>{
    if(deleteConfirm!=='SUPPRIMER')return;
    await fetch(`/api/admin/contests/${id}`,{method:'DELETE'});
    router.push('/admin/dashboard');
  };

  if(loading)return<div style={{padding:40,color:'rgba(255,255,255,0.4)',textAlign:'center'}}>Chargement...</div>;

  return(
    <div>
      {showDelete&&(
        <div className="modal-overlay" onClick={()=>setShowDelete(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-title" style={{color:'#f87171'}}>⚠️ Supprimer le concours<button className="modal-close" onClick={()=>setShowDelete(false)}>✕</button></div>
            <p style={{color:'rgba(255,255,255,0.6)',fontSize:14,marginBottom:20}}>Cette action est <strong style={{color:'#f87171'}}>irréversible</strong>. Toutes les zones, questions, participations et données associées seront supprimées.</p>
            <div className="form-group">
              <label className="form-label">Tapez SUPPRIMER pour confirmer</label>
              <input className="admin-input" value={deleteConfirm} onChange={e=>setDeleteConfirm(e.target.value)} placeholder="SUPPRIMER"/>
            </div>
            <button className="btn-admin-danger" style={{width:'100%',justifyContent:'center'}} disabled={deleteConfirm!=='SUPPRIMER'} onClick={handleDelete}>🗑️ Supprimer définitivement</button>
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <Link href={`/admin/contest/${id}`} style={{fontSize:13,color:'rgba(255,255,255,0.35)',textDecoration:'none',display:'block',marginBottom:6}}>← Retour au concours</Link>
          <h1 className="page-title">⚙️ Paramètres du concours</h1>
        </div>
      </div>

      {msg&&<div style={{background:'rgba(126,217,87,0.1)',border:'1px solid rgba(126,217,87,0.3)',borderRadius:10,padding:'10px 16px',color:'#7ed957',fontSize:13,marginBottom:20}}>{msg}</div>}

      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:20,alignItems:'start'}}>
        <div>
          <div className="admin-card" style={{marginBottom:16}}>
            <h2 style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:16}}>📝 Informations générales</h2>
            <div className="form-group"><label className="form-label">Titre (arabe)</label><input className="admin-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} dir="rtl"/></div>
            <div className="form-group"><label className="form-label">Description (arabe)</label><textarea className="admin-textarea" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} dir="rtl"/></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">URL Image</label><input className="admin-input" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Icône (emoji)</label><input className="admin-input" value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})} style={{fontSize:24,textAlign:'center'}}/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Ordre d&apos;affichage</label><input className="admin-input" type="number" value={form.order} onChange={e=>setForm({...form,order:+e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Durée (minutes)</label><input className="admin-input" type="number" value={form.durationMin} onChange={e=>setForm({...form,durationMin:+e.target.value})}/></div>
            </div>
            <button className="btn-admin-primary" onClick={handleSave} disabled={saving}>{saving?'Sauvegarde...':'✓ Enregistrer les modifications'}</button>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="admin-card">
            <h2 style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:16}}>🔒 Visibilité</h2>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
              <div>
                <div style={{fontWeight:600,color:'#fff',fontSize:14}}>{form.isActive?'✅ Concours actif':'🔒 Concours verrouillé'}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginTop:3}}>{form.isActive?'Les élèves peuvent y participer':'Non accessible aux élèves'}</div>
              </div>
              <button onClick={handleToggle} style={{padding:'8px 16px',borderRadius:8,border:`1px solid ${form.isActive?'rgba(239,68,68,0.3)':'rgba(126,217,87,0.3)'}`,background:form.isActive?'rgba(239,68,68,0.08)':'rgba(126,217,87,0.08)',color:form.isActive?'#f87171':'#7ed957',cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:600}}>
                {form.isActive?'🔒 Verrouiller':'✅ Activer'}
              </button>
            </div>
          </div>

          <div className="admin-card">
            <h2 style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:12}}>⚠️ Actions dangereuses</h2>
            <button className="btn-admin-secondary" style={{width:'100%',justifyContent:'center',marginBottom:10}} onClick={handleResetAll}>🔄 Reset toutes les progressions</button>
            <button className="btn-admin-danger" style={{width:'100%',justifyContent:'center'}} onClick={()=>setShowDelete(true)}>🗑️ Supprimer ce concours</button>
          </div>
        </div>
      </div>
    </div>
  );
}
