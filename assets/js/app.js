
// Core app utilities
const store = {
  get:(k, d=null)=>{
    try{ const v = localStorage.getItem(k); return v? JSON.parse(v): d; }catch(e){ return d; }
  },
  set:(k, v)=> localStorage.setItem(k, JSON.stringify(v)),
  del:(k)=> localStorage.removeItem(k)
};

function current(){
  let me = store.get('me', null);
  if(!me){
    // infer role by path as sensible demo default
    if(location.pathname.includes('/students/')) me = {name:'Estudiante Demo', email:'estudiante@demo.cl', role:'student'};
    else if(location.pathname.includes('/parents/')) me = {name:'Apoderado Demo', email:'apoderado@demo.cl', role:'parent'};
    else if(location.pathname.includes('/admin/')) me = {name:'Admin Demo', email:'admin@demo.cl', role:'admin'};
    if(me) store.set('me', me);
  }
  return me;
}

function logout(){
  store.del('me');
  location.href = (location.pathname.includes('/students/')||location.pathname.includes('/parents/')||location.pathname.includes('/admin/')) ? '../index.html' : './index.html';
}

// Simple progress model
function addProgress(entry){
  const arr = store.get('progress', []);
  arr.push({...entry, ts: Date.now()});
  store.set('progress', arr);
  renderProgress('pg');
}

function renderProgress(elId){
  const el = document.getElementById(elId);
  if(!el) return;
  const data = store.get('progress', []);
  if(!data.length){ el.innerHTML = '<p class="badge">Sin datos aún. Realiza un simulacro para ver tu progreso.</p>'; return; }
  // Aggregate by asignatura
  const agg = {};
  data.forEach(r=>{
    const k = r.asignatura;
    if(!agg[k]) agg[k] = [];
    agg[k].push(r); // placeholder, will format below
  });
  // Build table
  let html = '<div class="grid cols-2">';
  for(const [asig, rows] of Object.entries(agg)){
    const last = rows[rows.length-1];
    const pct = Math.max(0, Math.min(100, Number(last.puntaje || 0)));
    html += `<div class="card"><h3>${asig}</h3>
      <div class="progress"><i style="width:${pct}%"></i></div>
      <small>Último puntaje: ${pct}% — Intentos: ${rows.length}</small>
    </div>`;
  }
  html += '</div>';
  el.innerHTML = html;
}

function mock(asignatura){
  // generate demo score 40-95%
  const puntaje = Math.round(40 + Math.random()*55);
  addProgress({asignatura, puntaje});
  alert('Resultado registrado: '+asignatura+' '+puntaje+'%');
}

function exportCSV(){
  const data = store.get('progress', []);
  if(!data.length){ alert('No hay datos para exportar'); return; }
  const rows = [['fecha','asignatura','puntaje']];
  data.forEach(r=> rows.append? rows.append(r): rows.push([new Date(r.ts).toISOString(), r.asignatura, r.puntaje]));
  const csv = rows.map(r=> r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'progreso.csv'; a.click();
  URL.revokeObjectURL(url);
}

// PWA niceties: set year, inject manifest, register SW
document.addEventListener('DOMContentLoaded', ()=>{
  // Year
  const y = new Date().getFullYear();
  const el = document.getElementById('year'); if(el) el.textContent = y;
  // Manifest (only if not already present)
  if(!document.querySelector('link[rel="manifest"]')){
    const l = document.createElement('link');
    l.rel = 'manifest'; l.href = (location.pathname.includes('/students/')||location.pathname.includes('/parents/')||location.pathname.includes('/admin/')||location.pathname.includes('/plans/')||location.pathname.includes('/checkout/')) ? '../manifest.json' : './manifest.json';
    document.head.appendChild(l);
  }
  // Render progress if container exists
  renderProgress('pg');
  // Register service worker
  if('serviceWorker' in navigator){
    const swPath = (location.pathname.includes('/students/')||location.pathname.includes('/parents/')||location.pathname.includes('/admin/')||location.pathname.includes('/plans/')||location.pathname.includes('/checkout/')) ? '../assets/js/service-worker.js' : './assets/js/service-worker.js';
    navigator.serviceWorker.register(swPath).catch(console.warn);
  }
});
