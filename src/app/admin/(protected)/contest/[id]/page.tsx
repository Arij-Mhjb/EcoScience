'use client';
import{useState,useEffect}from'react';
import{useParams,useRouter}from'next/navigation';
import Link from'next/link';
export default function ContestPage(){
  const{id}=useParams() as{id:string};
  const router=useRouter();
  const[tab,setTab]=useState('overview');
  const[contest,setContest]=useState<any>(null);
  const[stats,setStats]=useState<any>(null);
  const[loading,setLoading]=useState(true);
  useEffect(()=>{fetch('/api/admin/contests/'+id).then(r=>r.json()).then(d=>{setContest(d.contest);setStats(d.stats);setLoading(false);});},[id]);
  if(loading)return<div style={{padding:40,color:'rgba(255,255,255,0.4)',textAlign:'center'}}>Chargement...</div>;
  if(!contest)return<div style={{padding:40,color:'#f87171',textAlign:'center'}}>Concours introuvable</div>;
  const tabs=[{key:'overview',label:'📊 Aperçu'},{key:'students',label:'👥 Élèves'},{key:'content',label:'📝 Contenu'},{key:'results',label:'🏅 Résultats'},{key:'settings',label:'⚙️ Paramètres'}];
  const handleTab=(key:string)=>{setTab(key);if(key!=='overview')router.push('/admin/contest/'+id+'/'+key);};
  return(
<div>
<div className='page-header'>
<div>
<div style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginBottom:6}}><Link href='/admin/dashboard' style={{color:'inherit',textDecoration:'none'}}>Dashboard</Link> › {contest.title}</div>
<h1 className='page-title'>{contest.icon} {contest.title}</h1>
<p className='page-subtitle'>{contest.isActive?'✅ Actif':'🔒 Verrouillé'} · {contest.durationMin} min</p>
</div>
<div style={{display:'flex',gap:10}}>
<Link href={'/admin/contest/'+id+'/results'} className='btn-admin-secondary'>🏅 Résultats</Link>
<Link href={'/admin/contest/'+id+'/settings'} className='btn-admin-primary'>⚙️ Paramètres</Link>
</div>
</div>
<div className='tabs-bar'>
{tabs.map(t=><button key={t.key} className={'tab-btn'+(tab===t.key?' active':'')} onClick={()=>handleTab(t.key)}>{t.label}</button>)}
</div>
{tab==='overview'&&<div>
<div className='stats-grid' style={{gridTemplateColumns:'repeat(4,1fr)'}}>
{[{icon:'👥',val:stats?.participantCount??0,label:'Participants',c:'#5e17eb'},{icon:'⭐',val:(stats?.avgScore??0)+'pts',label:'Score moyen',c:'#f59e0b'},{icon:'✅',val:(stats?.completionRate??0)+'%',label:'Complétion',c:'#7ed957'},{icon:'⏱️',val:stats?.avgTime?Math.floor(stats.avgTime/60)+'m':'—',label:'Temps moyen',c:'#0ea5e9'}].map((s,i)=>(
<div key={i} className='admin-card' style={{textAlign:'center'}}>
<div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
<div style={{fontSize:26,fontWeight:800,color:s.c}}>{s.val}</div>
<div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:4}}>{s.label}</div>
</div>
))}
</div>
<div className='admin-card'>
<h2 style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:16}}>ℹ️ Détails du concours</h2>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
<div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:6,textTransform:'uppercase'}}>Titre</div><div style={{color:'#fff',fontWeight:600,direction:'rtl'}}>{contest.title}</div></div>
<div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:6,textTransform:'uppercase'}}>Durée</div><div style={{color:'#fff',fontWeight:600}}>{contest.durationMin} min</div></div>
<div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:6,textTransform:'uppercase'}}>Zones</div><div style={{color:'#fff',fontWeight:600}}>{contest.zones?.length??0}</div></div>
<div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:6,textTransform:'uppercase'}}>Capsules</div><div style={{color:'#fff',fontWeight:600}}>{contest.capsules?.length??0}</div></div>
<div style={{gridColumn:'1/-1'}}><div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginBottom:6,textTransform:'uppercase'}}>Description</div><div style={{color:'rgba(255,255,255,0.7)',direction:'rtl',lineHeight:1.6}}>{contest.description}</div></div>
</div>
<div style={{marginTop:20,display:'flex',gap:10}}>
<Link href={'/admin/contest/'+id+'/students'} className='btn-admin-secondary'>👥 Élèves</Link>
<Link href={'/admin/contest/'+id+'/content'} className='btn-admin-secondary'>📝 Contenu</Link>
</div>
</div>
</div>}
</div>
  );
}