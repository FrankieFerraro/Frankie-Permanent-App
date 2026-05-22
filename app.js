
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const KEY = `lifeos_${CONFIG.slug}_v5`;
const PASSCODE = "2413";
const TODAY = () => new Date().toISOString().slice(0,10);
const clone = x => JSON.parse(JSON.stringify(x));

const defaultState = {
  streak: 4,
  markedToday:false,
  lastIntroDate:null,
  habits: CONFIG.defaultHabits.map((name,i)=>({id:crypto.randomUUID(), name, done:i<2})),
  waterMl: CONFIG.waterGoal ? 0 : null,
  projects: CONFIG.defaultProjects,
  notes: {},
  notesLayout: 'cols1',
  history: [],
  messageOffset: 0,
  mentorCustom: {}
};
let state = load();

function load(){
  try { const saved = JSON.parse(localStorage.getItem(KEY)); return saved ? {...clone(defaultState), ...saved} : clone(defaultState); }
  catch { return clone(defaultState); }
}
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); render(); }
function show(tab){ $$('.screen').forEach(x=>x.classList.remove('active')); $$('.tab').forEach(x=>x.classList.remove('active')); $('#'+tab).classList.add('active'); $(`[data-tab="${tab}"]`).classList.add('active'); }

function messageIndex(){ const start = new Date('2026-01-01'); const d = Math.floor((new Date() - start)/86400000); return (d + (state.messageOffset||0)) % CONFIG.messages.length; }
function message(){ return CONFIG.messages[messageIndex()]; }
function score(){
  const habit = state.habits.length ? state.habits.filter(h=>h.done).length/state.habits.length : 0;
  if(CONFIG.waterGoal){ return Math.round((habit*0.72 + Math.min(1,(state.waterMl||0)/CONFIG.waterGoal)*0.28)*100); }
  return Math.round(habit*100);
}
function tier(){ const s=state.streak; if(s>=365) return 'tier-legend'; if(s>=181) return 'tier-gold'; if(s>=61) return 'tier-purple'; if(s>=31) return 'tier-blue'; return ''; }
function tierName(){ const s=state.streak; if(s>=365) return 'Legendary phoenix'; if(s>=181) return 'White/gold elite flame'; if(s>=61) return 'Purple flame'; if(s>=31) return 'Blue ember flame'; return 'Orange flame'; }
function render(){
  document.body.className = CONFIG.bodyClass || '';
  $('#title').textContent = CONFIG.title; $('#sub').textContent = CONFIG.subtitle;
  document.body.classList.remove('tier-blue','tier-purple','tier-gold','tier-legend'); if(tier()) document.body.classList.add(tier());
  const m=message(); $('#messageLine').textContent=m.line; $('#messageContext').textContent=m.context; $('#messageReflection').textContent=m.reflection;
  $('#scoreNum').textContent = score()+'%'; document.documentElement.style.setProperty('--scoreDeg', `${score()*3.6}deg`);
  $('#streakNum').textContent = state.streak; $('#streakName').textContent = tierName();
  $('#notifPreview').textContent = `🔥Day ${state.streak} complete🔥\nStreak alive with Jade. Keep going!`;
  renderHabits(); renderWater(); renderProjects(); renderNotes(); renderHistory(); renderProgress();
}
function init(){
  $$('.tab').forEach(b=>b.addEventListener('click',()=>show(b.dataset.tab)));
  $('#newMessage').onclick=()=>{state.messageOffset=(state.messageOffset||0)+1;save()};
  $('#markComplete').onclick=markComplete; $('#replayIntro').onclick=playIntro;
  $('#addHabitBtn').onclick=addHabit; $('#resetToday').onclick=resetToday; $('#closeDay').onclick=closeDay;
  $('#addProject').onclick=addProject; $('#saveTodayNote').onclick=()=>saveNote(TODAY(), $('#todayNote').value);
  $('#noteDate').value = TODAY(); $('#goDate').onclick=goDate; $('#copyNotes').onclick=copyNotes; $('#exportNotes').onclick=exportNotes; $('#printNotes').onclick=()=>window.print();
  $('#layout').onchange=e=>{state.notesLayout=e.target.value;save()};
  $$('.mentorBtn').forEach(b=>b.onclick=()=>mentor(b.dataset.mentor)); $('#editMentor').onclick=editMentor;
  $('#backup').onclick=backup; $('#restore').onclick=restore; $('#unlockReset').onclick=unlockReset; $('#finalReset').onclick=finalReset;
  $('#askNotify').onclick=requestNotifications; $('#testNotify').onclick=testNotify;
  render(); maybeIntro();
}
function maybeIntro(){ if(state.lastIntroDate !== TODAY()){ setTimeout(playIntro,300); state.lastIntroDate=TODAY(); localStorage.setItem(KEY, JSON.stringify(state)); } }
function playIntro(){ const el=$('#intro'); $('#introStreak').textContent = `Day ${state.streak} alive`; el.classList.add('active'); setTimeout(()=>el.classList.remove('active'),4000); }

function markComplete(){ state.markedToday=true; state.streak=Math.max(1,(state.streak||0)+1); closeDay(false); tryBadge(state.streak); testNotify(); save(); }
function resetToday(){ if(!confirm('Reset today only?')) return; state.habits.forEach(h=>h.done=false); if(CONFIG.waterGoal) state.waterMl=0; state.markedToday=false; save(); }
function closeDay(showAlert=true){ const d=TODAY(); const lacking=[]; if(CONFIG.waterGoal && (state.waterMl||0)<CONFIG.waterGoal) lacking.push('water'); state.habits.filter(h=>!h.done).slice(0,4).forEach(h=>lacking.push(h.name)); const item={date:d,score:score(),lacking}; const i=state.history.findIndex(x=>x.date===d); if(i>=0) state.history[i]=item; else state.history.unshift(item); state.history=state.history.slice(0,730); if(showAlert) alert(`Day saved - ${item.score}%`); save(); }
function renderHabits(){ const w=$('#habits'); w.innerHTML=''; state.habits.forEach(h=>{ const div=document.createElement('div'); div.className='habit'; div.innerHTML=`<div class="circle ${h.done?'done':''}" data-id="${h.id}">${h.done?'✓':''}</div><div class="grow text ${h.done?'done':''}">${esc(h.name)}</div><button class="small secondary" data-edit="${h.id}">Edit</button><button class="small danger" data-del="${h.id}">×</button>`; w.appendChild(div); }); w.querySelectorAll('[data-id]').forEach(x=>x.onclick=()=>{const h=state.habits.find(h=>h.id===x.dataset.id); h.done=!h.done; save();}); w.querySelectorAll('[data-del]').forEach(x=>x.onclick=()=>{state.habits=state.habits.filter(h=>h.id!==x.dataset.del);save();}); w.querySelectorAll('[data-edit]').forEach(x=>x.onclick=()=>{const h=state.habits.find(h=>h.id===x.dataset.edit);const n=prompt('Habit name',h.name); if(n){h.name=n.trim();save();}}); }
function addHabit(){ const n=$('#newHabit').value.trim(); if(!n) return; state.habits.push({id:crypto.randomUUID(),name:n,done:false}); $('#newHabit').value=''; save(); }
function renderWater(){ const c=$('#waterCard'); if(!CONFIG.waterGoal){c.classList.add('hidden');return;} c.classList.remove('hidden'); $('#waterNow').textContent=`${state.waterMl||0}ml / ${CONFIG.waterGoal}ml`; $('#waterPct').textContent=Math.min(100,Math.round((state.waterMl||0)/CONFIG.waterGoal*100))+'%'; const d=$('#drops'); d.innerHTML=''; for(let i=1;i<=9;i++){const ml=i*250;const el=document.createElement('div'); el.className='drop'+((state.waterMl||0)>=ml?' on':''); el.innerHTML=`<span>${ml>=1000?(ml/1000).toFixed(ml%1000?2:0)+'L':ml}</span>`; el.onclick=()=>{state.waterMl=ml;save()}; d.appendChild(el);} }

function renderProjects(){ const w=$('#projects'); w.innerHTML=''; state.projects.forEach(p=>{ const el=document.createElement('div'); el.className='project'; el.innerHTML=`<div class="row"><div class="projectTitle">${esc(p.title)}</div><div class="actions"><button class="small secondary" data-sec="${p.id}">+ subheading</button><button class="small secondary" data-task="${p.id}">+ task</button><button class="small danger" data-delproj="${p.id}">×</button></div></div><div class="sections"></div>`; const sw=el.querySelector('.sections'); p.sections.forEach(s=>{ const sec=document.createElement('div'); sec.innerHTML=`<div class="subhead">${esc(s.title||'General')}</div>`; s.tasks.forEach(t=>{ const ta=document.createElement('div'); ta.className='task'+(t.done?' burn':''); ta.innerHTML=`<div class="circle ${t.done?'done':''}" data-complete="${t.id}">${t.done?'🔥':''}</div><div class="grow text ${t.done?'done':''}">${esc(t.text)}</div><button class="small danger" data-deltask="${t.id}">×</button>`; sec.appendChild(ta); }); sw.appendChild(sec); }); w.appendChild(el); });
  w.querySelectorAll('[data-sec]').forEach(b=>b.onclick=()=>addSection(b.dataset.sec)); w.querySelectorAll('[data-task]').forEach(b=>b.onclick=()=>addTask(b.dataset.task)); w.querySelectorAll('[data-delproj]').forEach(b=>b.onclick=()=>{state.projects=state.projects.filter(p=>p.id!==b.dataset.delproj);save();}); w.querySelectorAll('[data-deltask]').forEach(b=>b.onclick=()=>deleteTask(b.dataset.deltask)); w.querySelectorAll('[data-complete]').forEach(b=>b.onclick=()=>completeTask(b.dataset.complete,b)); }
function addProject(){ const t=prompt('Main heading name'); if(!t)return; state.projects.unshift({id:crypto.randomUUID(),title:t.trim(),sections:[{id:crypto.randomUUID(),title:'General',tasks:[]}]}); save(); }
function addSection(pid){ const p=state.projects.find(x=>x.id===pid); const t=prompt('Subheading name'); if(p&&t){p.sections.push({id:crypto.randomUUID(),title:t.trim(),tasks:[]});save();} }
function addTask(pid){ const p=state.projects.find(x=>x.id===pid); if(!p)return; const secName=prompt('Subheading to add under', p.sections[0]?.title||'General')||'General'; let s=p.sections.find(x=>(x.title||'General').toLowerCase()===secName.toLowerCase()); if(!s){s={id:crypto.randomUUID(),title:secName,tasks:[]};p.sections.push(s)} const txt=prompt('Task / achievement'); if(txt){s.tasks.push({id:crypto.randomUUID(),text:txt.trim(),done:false});save();} }
function completeTask(id,btn){ for(const p of state.projects){for(const s of p.sections){const t=s.tasks.find(x=>x.id===id); if(t){t.done=true; const row=btn.closest('.task'); const burst=document.createElement('div'); burst.className='burst'; burst.textContent='🔥'; row.appendChild(burst); setTimeout(save,700);return;}}} }
function deleteTask(id){ state.projects.forEach(p=>p.sections.forEach(s=>s.tasks=s.tasks.filter(t=>t.id!==id))); save(); }

function ensureTodayNote(){ if(!(TODAY() in state.notes)) state.notes[TODAY()]=''; }
function saveNote(date,text){ state.notes[date]=text; save(); }
function renderNotes(){ ensureTodayNote(); $('#todayDate').textContent = TODAY(); $('#todayNote').value = state.notes[TODAY()]||''; $('#layout').value=state.notesLayout||'cols1'; const grid=$('#notesGrid'); grid.className='notesGrid '+(state.notesLayout||'cols1'); grid.innerHTML=''; const dates=Object.keys(state.notes).sort().reverse().filter(d=>d!==TODAY()); const view=dates.slice(0,80); view.forEach(d=>grid.appendChild(noteCard(d,state.notes[d]))); if(!view.length) grid.innerHTML='<p class="note">Previous notes will appear here after you start writing.</p>'; }
function noteCard(date,text){ const el=document.createElement('div'); el.className='noteCard'; el.innerHTML=`<div class="dateTitle">${date}</div><textarea data-note="${date}">${esc(text||'')}</textarea><div class="actions" style="margin-top:8px"><button class="small secondary" data-save="${date}">Save</button><button class="small danger" data-delnote="${date}">Delete</button></div>`; el.querySelector('[data-save]').onclick=()=>saveNote(date,el.querySelector('textarea').value); el.querySelector('[data-delnote]').onclick=()=>{if(confirm('Delete this note?')){delete state.notes[date];save();}}; return el; }
function goDate(){ const d=$('#noteDate').value; if(!d)return; if(!(d in state.notes)) state.notes[d]=''; save(); setTimeout(()=>{show('notes'); const card=[...document.querySelectorAll('[data-note]')].find(x=>x.dataset.note===d); if(d===TODAY()) $('#todayNote').focus(); else if(card){card.focus(); card.scrollIntoView({behavior:'smooth',block:'center'});} },100); }
function copyNotes(){ const txt=Object.keys(state.notes).sort().reverse().map(d=>`## ${d}\n${state.notes[d]||''}`).join('\n\n'); navigator.clipboard.writeText(txt); alert('All notes copied.'); }
function exportNotes(){ download(`${CONFIG.slug}-daily-notes.json`, JSON.stringify(state.notes,null,2)); }

function renderHistory(){ const w=$('#history'); w.innerHTML=''; const h=state.history.slice(0,28); if(!h.length){w.innerHTML='<p class="note">Close your first day to start history.</p>'; return;} h.forEach(d=>{const el=document.createElement('div'); el.className='day'; el.innerHTML=`<b>${d.score}%</b>${d.date.slice(5)}<br><small>${d.lacking?.length?'Low: '+d.lacking.join(', '):'Clean'}</small>`;w.appendChild(el);}); }
function renderProgress(){ const h=state.history; const avg=arr=>arr.length?Math.round(arr.reduce((a,b)=>a+b.score,0)/arr.length):0; $('#weekAvg').textContent=avg(h.slice(0,7))+'%'; $('#monthAvg').textContent=avg(h.slice(0,31))+'%'; $('#yearAvg').textContent=avg(h.slice(0,365))+'%'; $('#bar30').style.width=Math.min(100,state.streak/30*100)+'%'; $('#bar60').style.width=Math.min(100,state.streak/60*100)+'%'; $('#bar365').style.width=Math.min(100,state.streak/365*100)+'%'; }

function mentor(type){ $('#mentorOut').textContent = state.mentorCustom[type] || CONFIG.mentor[type] || CONFIG.mentor.default; }
function editMentor(){ const keys=Object.keys(CONFIG.mentor).filter(x=>x!=='default'); const k=prompt('Which response? '+keys.join(', ')); if(!k||!CONFIG.mentor[k])return; const next=prompt('New response', state.mentorCustom[k]||CONFIG.mentor[k]); if(next){state.mentorCustom[k]=next;save();mentor(k);} }
function unlockReset(){ const first=confirm('Danger zone. Are you sure you want to begin reset flow?'); if(!first)return; const code=prompt('Enter reset passcode'); if(code===PASSCODE){$('#resetPanel').classList.remove('hidden');} else alert('Wrong passcode.'); }
function finalReset(){ if(confirm('Final confirmation - reset streak to zero?')){state.streak=0;state.markedToday=false;tryBadge(0);save();alert('Streak reset.');$('#resetPanel').classList.add('hidden');} }
async function requestNotifications(){ if(!('Notification' in window)){alert('Notifications are not supported here.');return;} const p=await Notification.requestPermission(); alert('Notification permission - '+p); }
function testNotify(){ if('Notification' in window && Notification.permission==='granted') new Notification(`🔥Day ${state.streak} complete🔥`,{body:'Streak alive with Jade. Keep going!',icon:'icon-192.png'}); else alert('Allow notifications first. Scheduled push comes in the cloud stage.'); }
async function tryBadge(n){ try{ if('setAppBadge' in navigator) await navigator.setAppBadge(n); }catch(e){} }
function backup(){ download(`${CONFIG.slug}-life-os-backup.json`, JSON.stringify(state,null,2)); }
function restore(){ const inp=document.createElement('input'); inp.type='file'; inp.accept='application/json'; inp.onchange=async()=>{const f=inp.files[0]; if(!f)return; state={...clone(defaultState),...JSON.parse(await f.text())}; save();}; inp.click(); }
function download(name,content){ const blob=new Blob([content],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); }
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js').catch(()=>{}); }
document.addEventListener('DOMContentLoaded', init);
