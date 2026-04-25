'use client';
import{useState}from'react';
import{useRouter}from'next/navigation';

const STEPS=['📋 Infos','🗺️ Zones','📹 Capsule','❓ Questions','🎮 Défis','✅ Récap'];

export default function NewContestPage(){
  const router=useRouter();
  const[step,setStep]=useState(0);
  const[saving,setSaving]=useState(false);
  const[createdId,setCreatedId]=useState<string|null>(null);

  // Données accumulées
  const[info,setInfo]=useState({title:'',titleFr:'',description:'',descriptionFr:'',image:'',icon:'🏆',order:99,durationMin:120});
  const[zones,setZones]=useState([{title:'',titleFr:'',description:'',descriptionFr:'',icon:'📍',order:1}]);
  const[capsule,setCapsule]=useState({title:'',titleFr:'',description:'',descriptionFr:'',videoUrl:'',duration:180,turtleMsg:'',turtleMsgFr:'',enabled:false});
  const[questions,setQuestions]=useState([{text:'',textFr:'',options:['','','',''],optionsFr:['','','',''],answer:0,points:3,tip:'',tipFr:'',zoneIndex:0}]);
  const[challenges,setChallenges]=useState<any[]>([]);

  const addZone=()=>setZones([...zones,{title:'',titleFr:'',description:'',descriptionFr:'',icon:'📍',order:zones.length+1}]);
  const addQuestion=()=>setQuestions([...questions,{text:'',textFr:'',options:['','','',''],optionsFr:['','','',''],answer:0,points:3,tip:'',tipFr:'',zoneIndex:0}]);

  const handleCreate=async()=>{
    setSaving(true);
    try{
      // 1. Créer le concours
      const cr=await fetch('/api/admin/contests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(info)});
      const cd=await cr.json();
      const cid=cd.contest.id;

      // 2. Créer les zones
      const createdZones=await Promise.all(zones.filter(z=>z.title).map(z=>
        fetch(`/api/admin/contests/${cid}/content/zones`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(z)}).then(r=>r.json()).then(d=>d.zone)
      ));

      // 3. Créer la capsule si activée
      if(capsule.enabled&&capsule.title&&capsule.videoUrl){
        await fetch(`/api/admin/contests/${cid}/content/capsules`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...capsule,order:1})});
      }

      // 4. Créer les questions
      await Promise.all(questions.filter(q=>q.text).map(q=>{
        const zone=createdZones[q.zoneIndex]||createdZones[0];
        if(!zone)return Promise.resolve();
        return fetch(`/api/admin/contests/${cid}/content/questions`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...q,options:q.options.filter(o=>o.trim()),optionsFr:q.optionsFr.filter(o=>o.trim()),zoneId:zone.id})});
      }));

      setCreatedId(cid);
      setSaving(false);
    }catch(e){setSaving(false);alert('Erreur lors de la création');}
  };

  if(createdId)return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:64,marginBottom:20}}>🎉</div>
        <h2 style={{fontSize:24,fontWeight:800,color:'#fff',marginBottom:12}}>Concours créé avec succès !</h2>
        <p style={{color:'rgba(255,255,255,0.5)',marginBottom:24}}>Le concours est verrouillé par défaut. Activez-le depuis les paramètres.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center'}}>
          <button className="btn-admin-primary" onClick={()=>router.push(`/admin/contest/${createdId}`)}>Voir le concours →</button>
          <button className="btn-admin-secondary" onClick={()=>router.push(`/admin/contest/${createdId}/settings`)}>⚙️ Paramètres</button>
        </div>
      </div>
    </div>
  );

  return(
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">➕ Nouveau concours</h1>
          <p className="page-subtitle">Étape {step+1} / {STEPS.length}</p>
        </div>
      </div>

      {/* Stepper */}
      <div style={{display:'flex',gap:0,marginBottom:32,background:'rgba(255,255,255,0.04)',borderRadius:14,padding:4,overflow:'hidden'}}>
        {STEPS.map((s,i)=>(
          <div key={i} onClick={()=>i<step&&setStep(i)} style={{flex:1,padding:'10px 8px',textAlign:'center',fontSize:12,fontWeight:i===step?700:500,color:i===step?'#fff':i<step?'#7ed957':'rgba(255,255,255,0.3)',background:i===step?'linear-gradient(135deg,#5e17eb,#7c3aed)':'transparent',borderRadius:10,cursor:i<step?'pointer':'default',transition:'all 0.2s'}}>
            {i<step?'✓ ':''}{s}
          </div>
        ))}
      </div>

      <div className="admin-card">
        {/* Étape 1 — Infos */}
        {step===0&&(
          <div>
            <h2 style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:20}}>📋 Informations générales</h2>
            <div className="form-group"><label className="form-label">Titre du concours (arabe)</label><input className="admin-input" value={info.title} onChange={e=>setInfo({...info,title:e.target.value})} placeholder="عنوان المسابقة" dir="rtl"/></div>
            <div className="form-group"><label className="form-label">Titre du concours (français)</label><input className="admin-input" value={info.titleFr} onChange={e=>setInfo({...info,titleFr:e.target.value})} placeholder="Titre du concours"/></div>
            <div className="form-group"><label className="form-label">Description (arabe)</label><textarea className="admin-textarea" value={info.description} onChange={e=>setInfo({...info,description:e.target.value})} placeholder="وصف المسابقة..." dir="rtl"/></div>
            <div className="form-group"><label className="form-label">Description (français)</label><textarea className="admin-textarea" value={info.descriptionFr} onChange={e=>setInfo({...info,descriptionFr:e.target.value})} placeholder="Description du concours..."/></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Image (URL)</label><input className="admin-input" value={info.image} onChange={e=>setInfo({...info,image:e.target.value})} placeholder="/images/contest.svg"/></div>
              <div className="form-group"><label className="form-label">Icône (emoji)</label><input className="admin-input" value={info.icon} onChange={e=>setInfo({...info,icon:e.target.value})} style={{textAlign:'center',fontSize:24}}/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Ordre d&apos;affichage</label><input className="admin-input" type="number" value={info.order} onChange={e=>setInfo({...info,order:+e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Durée (minutes)</label><input className="admin-input" type="number" value={info.durationMin} onChange={e=>setInfo({...info,durationMin:+e.target.value})}/></div>
            </div>
            <div style={{background:'rgba(94,23,235,0.08)',border:'1px solid rgba(94,23,235,0.2)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'rgba(255,255,255,0.5)'}}>🔒 Le concours sera créé en mode <strong style={{color:'#fff'}}>verrouillé</strong> par défaut.</div>
          </div>
        )}

        {/* Étape 2 — Zones */}
        {step===1&&(
          <div>
            <h2 style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:20}}>🗺️ Zones de la roadmap</h2>
            {zones.map((z,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.03)',borderRadius:12,padding:16,marginBottom:12,border:'1px solid rgba(255,255,255,0.06)'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                  <div style={{fontWeight:700,color:'rgba(255,255,255,0.5)',fontSize:13}}>Zone {i+1}</div>
                  {zones.length>1&&<button className="btn-admin-danger btn-admin-sm" onClick={()=>setZones(zones.filter((_,j)=>j!==i))}>✕</button>}
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Titre (arabe)</label><input className="admin-input" value={z.title} onChange={e=>{const nz=[...zones];nz[i]={...nz[i],title:e.target.value};setZones(nz);}} dir="rtl"/></div>
                  <div className="form-group"><label className="form-label">Titre (français)</label><input className="admin-input" value={z.titleFr} onChange={e=>{const nz=[...zones];nz[i]={...nz[i],titleFr:e.target.value};setZones(nz);}}/></div>
                  <div className="form-group"><label className="form-label">Icône</label><input className="admin-input" value={z.icon} onChange={e=>{const nz=[...zones];nz[i]={...nz[i],icon:e.target.value};setZones(nz);}} style={{textAlign:'center',fontSize:20}}/></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Description (arabe)</label><input className="admin-input" value={z.description} onChange={e=>{const nz=[...zones];nz[i]={...nz[i],description:e.target.value};setZones(nz);}} dir="rtl"/></div>
                  <div className="form-group"><label className="form-label">Description (français)</label><input className="admin-input" value={z.descriptionFr} onChange={e=>{const nz=[...zones];nz[i]={...nz[i],descriptionFr:e.target.value};setZones(nz);}}/></div>
                </div>
              </div>
            ))}
            <button className="btn-admin-secondary" onClick={addZone} style={{width:'100%',justifyContent:'center',borderStyle:'dashed'}}>➕ Ajouter une zone</button>
          </div>
        )}

        {/* Étape 3 — Capsule */}
        {step===2&&(
          <div>
            <h2 style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:8}}>📹 Capsule d&apos;ouverture</h2>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:20}}>Optionnelle — peut être ajoutée plus tard depuis la gestion du contenu.</p>
            <label style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,cursor:'pointer'}}>
              <input type="checkbox" checked={capsule.enabled} onChange={e=>setCapsule({...capsule,enabled:e.target.checked})} style={{accentColor:'#5e17eb',width:18,height:18}}/>
              <span style={{color:'#fff',fontWeight:600}}>Ajouter une capsule maintenant</span>
            </label>
            {capsule.enabled&&(
              <div>
                <div className="form-group"><label className="form-label">Titre (arabe)</label><input className="admin-input" value={capsule.title} onChange={e=>setCapsule({...capsule,title:e.target.value})} dir="rtl"/></div>
                <div className="form-group"><label className="form-label">Titre (français)</label><input className="admin-input" value={capsule.titleFr} onChange={e=>setCapsule({...capsule,titleFr:e.target.value})}/></div>
                <div className="form-group"><label className="form-label">URL Vidéo</label><input className="admin-input" value={capsule.videoUrl} onChange={e=>setCapsule({...capsule,videoUrl:e.target.value})} placeholder="https://www.youtube.com/embed/..."/></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Durée (s)</label><input className="admin-input" type="number" value={capsule.duration} onChange={e=>setCapsule({...capsule,duration:+e.target.value})}/></div>
                </div>
                <div className="form-group"><label className="form-label">Message tortue (arabe)</label><textarea className="admin-textarea" value={capsule.turtleMsg} onChange={e=>setCapsule({...capsule,turtleMsg:e.target.value})} dir="rtl"/></div>
                <div className="form-group"><label className="form-label">Message tortue (français)</label><textarea className="admin-textarea" value={capsule.turtleMsgFr} onChange={e=>setCapsule({...capsule,turtleMsgFr:e.target.value})}/></div>
              </div>
            )}
          </div>
        )}

        {/* Étape 4 — Questions */}
        {step===3&&(
          <div>
            <h2 style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:8}}>❓ Questions</h2>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:20}}>Résumé: {questions.filter(q=>q.text).length} questions · {questions.filter(q=>q.text).reduce((a,q)=>a+q.points,0)} pts total</p>
            {questions.map((q,qi)=>(
              <div key={qi} style={{background:'rgba(255,255,255,0.03)',borderRadius:12,padding:16,marginBottom:12,border:'1px solid rgba(255,255,255,0.06)'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <span style={{fontWeight:700,color:'rgba(255,255,255,0.4)',fontSize:13}}>Q{qi+1}</span>
                  {questions.length>1&&<button className="btn-admin-danger btn-admin-sm" onClick={()=>setQuestions(questions.filter((_,j)=>j!==qi))}>✕</button>}
                </div>
                <div className="form-group"><input className="admin-input" value={q.text} onChange={e=>{const nq=[...questions];nq[qi]={...nq[qi],text:e.target.value};setQuestions(nq);}} placeholder="السؤال بالعربية..." dir="rtl"/></div>
                <div className="form-group"><input className="admin-input" value={q.textFr} onChange={e=>{const nq=[...questions];nq[qi]={...nq[qi],textFr:e.target.value};setQuestions(nq);}} placeholder="Question en français..."/></div>
                {q.options.map((o,oi)=>(
                  <div key={oi} style={{display:'flex',gap:8,marginBottom:6}}>
                    <div style={{width:24,height:24,borderRadius:6,background:q.answer===oi?'#5e17eb':'rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',cursor:'pointer',flexShrink:0}} onClick={()=>{const nq=[...questions];nq[qi]={...nq[qi],answer:oi};setQuestions(nq);}}>{['A','B','C','D'][oi]}</div>
                    <div style={{flex:1,display:'flex',flexDirection:'column',gap:4}}>
                      <input className="admin-input" value={o} onChange={e=>{const nq=[...questions];const opts=[...nq[qi].options];opts[oi]=e.target.value;nq[qi]={...nq[qi],options:opts};setQuestions(nq);}} placeholder={`Option ${['A','B','C','D'][oi]} (AR)`} dir="rtl" style={{fontSize:12}}/>
                      <input className="admin-input" value={q.optionsFr[oi]} onChange={e=>{const nq=[...questions];const optsFr=[...nq[qi].optionsFr];optsFr[oi]=e.target.value;nq[qi]={...nq[qi],optionsFr:optsFr};setQuestions(nq);}} placeholder={`Option ${['A','B','C','D'][oi]} (FR)`} style={{fontSize:12}}/>
                    </div>
                  </div>
                ))}
                <div className="form-group"><input className="admin-input" value={q.tip} onChange={e=>{const nq=[...questions];nq[qi]={...nq[qi],tip:e.target.value};setQuestions(nq);}} placeholder="نصيحة (اختياري)..." dir="rtl" style={{fontSize:12}}/></div>
                <div className="form-group"><input className="admin-input" value={q.tipFr} onChange={e=>{const nq=[...questions];nq[qi]={...nq[qi],tipFr:e.target.value};setQuestions(nq);}} placeholder="Astuce en français (optionnel)..." style={{fontSize:12}}/></div>
                <div style={{display:'flex',gap:10,marginTop:8}}>
                  <select className="admin-select" style={{flex:1}} value={q.zoneIndex} onChange={e=>{const nq=[...questions];nq[qi]={...nq[qi],zoneIndex:+e.target.value};setQuestions(nq);}}>
                    {zones.map((z,zi)=><option key={zi} value={zi}>{z.icon||'📍'} {z.title||`Zone ${zi+1}`}</option>)}
                  </select>
                  <select className="admin-select" style={{width:100}} value={q.points} onChange={e=>{const nq=[...questions];nq[qi]={...nq[qi],points:+e.target.value};setQuestions(nq);}}>
                    <option value={3}>3 pts</option><option value={4}>4 pts</option>
                  </select>
                </div>
              </div>
            ))}
            <button className="btn-admin-secondary" onClick={addQuestion} style={{width:'100%',justifyContent:'center',borderStyle:'dashed'}}>➕ Ajouter une question</button>
          </div>
        )}

        {/* Étape 5 — Défis */}
        {step===4&&(
          <div style={{textAlign:'center',padding:'40px 20px'}}>
            <div style={{fontSize:48,marginBottom:16}}>🎮</div>
            <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginBottom:8}}>Défis visuels</h2>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:14,marginBottom:24}}>Les défis peuvent être ajoutés après la création du concours, depuis la section Contenu › Défis.</p>
            <div style={{background:'rgba(94,23,235,0.08)',border:'1px solid rgba(94,23,235,0.2)',borderRadius:12,padding:'16px 20px',fontSize:13,color:'rgba(255,255,255,0.6)',textAlign:'left'}}>
              <div style={{marginBottom:8}}>✓ Drag &amp; Drop — faites glisser les objets dans les bonnes poubelles</div>
              <div>✓ Matching — reliez les éléments correspondants</div>
            </div>
          </div>
        )}

        {/* Étape 6 — Récap */}
        {step===5&&(
          <div>
            <h2 style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:20}}>✅ Récapitulatif</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
              {[
                {l:'Titre',v:info.title||'—',dir:'rtl'},
                {l:'Icône',v:info.icon,dir:'ltr'},
                {l:'Durée',v:`${info.durationMin} min`,dir:'ltr'},
                {l:'Ordre',v:String(info.order),dir:'ltr'},
                {l:'Zones',v:`${zones.filter(z=>z.title).length} zone(s)`,dir:'ltr'},
                {l:'Questions',v:`${questions.filter(q=>q.text).length} question(s)`,dir:'ltr'},
                {l:'Capsule',v:capsule.enabled&&capsule.title?'✅ Oui':'—',dir:'ltr'},
                {l:'Statut initial',v:'🔒 Verrouillé',dir:'ltr'},
              ].map((r,i)=>(
                <div key={i} style={{background:'rgba(255,255,255,0.04)',borderRadius:10,padding:'12px 14px'}}>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>{r.l}</div>
                  <div style={{fontSize:14,fontWeight:600,color:'#fff',direction:r.dir as 'rtl'|'ltr'}}>{r.v}</div>
                </div>
              ))}
            </div>
            <button className="btn-admin-primary" onClick={handleCreate} disabled={saving||!info.title} style={{width:'100%',justifyContent:'center',padding:'14px'}}>
              {saving?'⏳ Création en cours...':'🚀 Créer le concours'}
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{display:'flex',justifyContent:'space-between',marginTop:20}}>
        <button className="btn-admin-secondary" onClick={()=>setStep(s=>s-1)} disabled={step===0}>{step>0?'← Précédent':''}</button>
        {step<STEPS.length-1&&<button className="btn-admin-primary" onClick={()=>setStep(s=>s+1)} disabled={step===0&&!info.title}>Suivant →</button>}
      </div>
    </div>
  );
}
