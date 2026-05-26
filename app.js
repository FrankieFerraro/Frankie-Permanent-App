const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const todayKey = () => new Date().toISOString().slice(0,10);
const prettyDate = (key=todayKey()) => new Date(key+'T00:00:00').toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'});
const uid = () => Math.random().toString(36).slice(2,10);

const MOTD = [
  {q:'The compound effect is invisible until it is undeniable.', c:'Small actions feel meaningless in the moment. They are not. They are building something you cannot yet see.', r:'What small action, done daily for the next year, would transform an area of my life?'},
  {q:'Build the day so tomorrow can trust you.', c:'Confidence is not a feeling you wait for. It is evidence you create through repeated follow-through.', r:'What would make tomorrow easier if I handled it today?'},
  {q:'Be patient with results and wildly impatient with action.', c:'Results lag. Action is immediate. Stop demanding instant proof and start demanding immediate movement.', r:'Where can I act before I feel ready?'},
  {q:'The standard is built when no one is watching.', c:'The private choices are the ones that become your public life.', r:'What private standard do I need to raise today?'},
  {q:'Simple done consistently beats perfect done randomly.', c:'A clean repeatable action is worth more than a complicated plan you avoid.', r:'What is the simplest useful move I can make today?'}
];
const MENTOR = {
  "I'm procrastinating": "You are not stuck because the task is impossible. You are stuck because the start feels bigger than it is. Shrink the task. Set a 10-minute timer and do the first ugly version. Momentum comes after movement, not before it.",
  "I don't know where to start": "Start with the part that creates clarity. Write the outcome, list the next three actions and do the smallest one first. You do not need the full map to take the next step.",
  "I need guidance": "Come back to priorities. Health, relationship, income, home and purpose. Pick the area causing the most drag and choose one action that would reduce pressure today.",
  "I feel overwhelmed": "Your brain is holding too many open loops. Empty them onto paper or this app. Then choose one thing, not five. Calm returns when the next action becomes clear.",
  "I feel sad, angry or moody": "Do not make permanent decisions from a temporary state. Regulate first. Breathe, walk, drink water, eat properly, then speak or act. Your emotion is real, but it does not need to drive the car.",
  "I need discipline": "Discipline is removing the negotiation. Decide the rule before the mood arrives. Make the action small enough that excuses look ridiculous.",
  "I need perspective": "Most problems feel bigger when you are tired, isolated or rushing. Zoom out. What will matter in 12 months? What is the mature response right now?",
  "I need to reset my day": "The day is not ruined. Reset the next hour. Clean your space, drink water, take a breath and complete one visible action. Win the next block.",
  "I'm avoiding something important": "Avoidance is information. It usually means fear, confusion or discomfort. Name the reason, then take the smallest honest step toward it."
};

const defaultState = () => ({
  activeTab:'home', profile:'Frankie', streak:0, motdIndex:0, motdDate:todayKey(), calendarYear:new Date().getFullYear(), notesView:'today', selectedNoteDate:todayKey(), mentorRecent:[], resetPasscode:'2222',
  profiles:{
    Frankie:{checklist:[{id:uid(),text:'Pizza',done:true}], notes:{}, wins:sampleWins()},
    Jade:{checklist:[{id:uid(),text:'Drink water',done:false},{id:uid(),text:'Move body',done:false}], notes:{}, wins:sampleWins(true)}
  }
});
function sampleWins(jade=false){return [
  {id:uid(),title:jade?'Weekly Reset':'Pakenham House',subs:[{id:uid(),title:'Outside',tasks:[task('Fix light'),task('Check roof'),task('Clean deck')]},{id:uid(),title:'Inside',tasks:[task('Fix tap'),task('Organise garage')]}],tasks:[]},
  {id:uid(),title:jade?'Health Admin':'Life Admin',subs:[],tasks:[task('Call agent'),task('Pay bill'),task('Book appointment')]}
]}
function task(text){return {id:uid(),text,done:false}}
let state = load();
seedNotesIfEmpty();
function load(){try{return JSON.parse(localStorage.getItem('frankie2_state'))||defaultState()}catch{return defaultState()}}
function save(){localStorage.setItem('frankie2_state', JSON.stringify(state))}
function profile(){return state.profiles[state.profile]}
function setState(fn){fn(state); save(); render()}
function seedNotesIfEmpty(){const n=profile().notes;if(Object.keys(n).length)return; const base=new Date(); for(let i=1;i<=25;i++){const d=new Date(base); d.setDate(base.getDate()-i); const k=d.toISOString().slice(0,10); n[k]=`Test note ${i}. This is a sample daily note so you can test the All Notes view, scrolling, calendar markers and opening older notes.`} save()}
function parseDateInput(v){v=(v||'').trim(); if(!v)return null; let m=v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if(m)return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`; m=v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/); if(m)return `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`; const d=new Date(v); if(!isNaN(d))return d.toISOString().slice(0,10); return null}
function escapeHtml(s=''){return s.replace(/[&<>'"]/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[c]))}

function render(){
  const app=$('#app');
  app.innerHTML = `<main class="shell">${screen()}</main>${nav()}`;
  bindCommon();
  if(state.activeTab==='notes') bindNotes();
}
function nav(){const tabs=[['home','⌂','Home'],['wins','🏆','Wins'],['notes','▤','Notes'],['mentor','🧠','Mentor'],['stats','▮','Stats'],['settings','⚙','Settings']];return `<nav class="nav"><div class="nav-inner">${tabs.map(t=>`<button class="nav-btn ${state.activeTab===t[0]?'active':''}" data-tab="${t[0]}"><span class="nav-ico">${t[1]}</span>${t[2]}</button>`).join('')}</div></nav>`}
function bindCommon(){ $$('.nav-btn').forEach(b=>b.onclick=()=>setState(s=>s.activeTab=b.dataset.tab)); }
function screen(){return ({home:home(),wins:wins(),notes:notes(),mentor:mentor(),stats:stats(),settings:settings()})[state.activeTab]}
function home(){const p=profile(), total=p.checklist.length, done=p.checklist.filter(x=>x.done).length, score=total?Math.round(done/total*100):0, m=MOTD[state.motdIndex%MOTD.length];return `
  <section class="header"><div><h1 class="title">Hey ${state.profile} 🔥</h1><div class="sub">${prettyDate()}</div></div><button class="avatar" id="switchProfile">${state.profile[0]}</button></section>
  <section class="card motd"><div class="between"><div class="motd-label">MESSAGE OF THE DAY</div><button id="newMotd" class="btn">↻ New</button></div><p class="motd-quote">"${escapeHtml(m.q)}"</p><div class="motd-body">${escapeHtml(m.c)}</div><div class="reflect"><div class="reflect-title">REFLECT</div><div class="reflect-text">${escapeHtml(m.r)}</div></div></section>
  <section class="card score-streak"><div><div class="progress-ring" style="--score:${score}"><strong>${score}%</strong><span>Today</span></div><div class="card-title">Daily Score</div></div><div class="divider"></div><div><div class="flame-wrap"><div class="flame"><span class="flame-number">${state.streak}</span></div></div><div class="card-title">Streak</div></div></section>
  <div class="between"><div class="list-title">Daily Checklist</div><div class="gold"><strong>${done}/${total}</strong></div></div>
  <section>${p.checklist.map(item=>`<div class="check-row ${item.done?'done':''}" data-id="${item.id}"><button class="tick checkTick">✓</button><div class="row-text">${escapeHtml(item.text)}</div><button class="icon-btn editCheck">✏️</button><button class="icon-btn delCheck">🗑️</button></div>`).join('')}</section>
  <button class="btn full" id="addCheck">+ Add item</button>`}
function wins(){const p=profile(); const achievements=countAchievements(p.wins); const tasks=countTasks(p.wins);return `<section class="header"><div><h1 class="title">Wins 🏆</h1><div class="sub">Achievement List</div></div><button class="avatar">🏆</button></section><div class="between win-head"><div><span class="gold"><strong>${achievements}</strong></span> <span class="muted">achievements of ${tasks} tasks</span></div><button class="btn" id="addMain">+ Main heading</button></div>${p.wins.map(w=>winCard(w)).join('')}`}
function winCard(w){return `<section class="card win-card" data-win="${w.id}"><div class="between"><div class="win-title">🏆 ${escapeHtml(w.title)}</div><button class="btn danger delWin">🗑️ Delete</button></div><div class="win-actions"><button class="btn addSub">➕ subheading</button><button class="btn addMainTask">➕ task</button></div>${w.tasks.map(t=>taskRow(t)).join('')}${w.subs.map(sub=>`<div class="subhead" data-sub="${sub.id}"><span>📌 ${escapeHtml(sub.title)}</span><span><button class="btn addSubTask">➕</button> <button class="btn danger delSub">🗑️</button></span></div>${sub.tasks.map(t=>taskRow(t)).join('')}`).join('')}</section>`}
function taskRow(t){return `<div class="task-row ${t.done?'done':''}" data-task="${t.id}"><button class="tick winTick">✓</button><div class="row-text">${escapeHtml(t.text)}</div><button class="icon-btn editTask">✏️</button><button class="icon-btn delTask">🗑️</button></div>`}
function notes(){return `<section class="header"><h1 class="title">Notes 📝</h1><div class="row"><button class="btn" id="goDate">Go to date</button><button class="btn" id="exportNotes">Export</button></div></section><section class="segment"><button class="seg-btn ${state.notesView==='today'?'active':''}" data-view="today">Today</button><button class="seg-btn ${state.notesView==='all'?'active':''}" data-view="all">All Notes</button><button class="seg-btn ${state.notesView==='calendar'?'active':''}" data-view="calendar">Calendar</button></section>${notesBody()}`}
function notesBody(){const p=profile(); if(state.notesView==='today'){const val=p.notes[state.selectedNoteDate]||'';return `<div class="sub">${prettyDate(state.selectedNoteDate)}</div><textarea class="textarea" id="noteText" placeholder="Write today's note...">${escapeHtml(val)}</textarea><div class="row" style="margin-top:12px"><button class="btn" id="saveNote">💾 Save today</button><button class="btn ghost" id="copyNote">📋 Copy today</button></div>`}
 if(state.notesView==='all'){const entries=Object.entries(p.notes).sort((a,b)=>b[0].localeCompare(a[0])); if(!entries.length)return `<div class="empty"><div>📝<strong>No notes yet</strong><span>Switch to Today to write your first note</span></div></div>`; return `<section class="card" style="padding:0">${entries.map(([k,v])=>`<div class="note-card" data-date="${k}"><div><div class="note-date">${prettyDate(k)}</div><div class="note-preview">${escapeHtml(v.slice(0,85))}${v.length>85?'...':''}</div></div><button class="icon-btn copyOne">📋</button></div>`).join('')}</section>`}
 return calendar();}
function calendar(){const y=state.calendarYear; const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `<div class="calendar-head"><button class="btn" id="prevYear">‹</button><div class="year-title">${y}</div><button class="btn" id="nextYear">›</button></div><section class="months">${months.map((m,i)=>month(y,i,m)).join('')}</section>`}
function month(y,mi,name){const first=new Date(y,mi,1).getDay(); const days=new Date(y,mi+1,0).getDate(); let cells=''; for(let i=0;i<first;i++)cells+=`<div></div>`; for(let d=1;d<=days;d++){const k=`${y}-${String(mi+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; cells+=`<button class="day ${k===todayKey()?'today':''} ${profile().notes[k]?'has-note':''}" data-date="${k}">${d}</button>`} return `<div class="month"><div class="month-title">${name}</div><div class="days">${cells}</div></div>`}
function mentor(){return `<section class="header"><div><h1 class="title">Mentor</h1><div class="sub">What do you need right now?</div></div></section>${Object.keys(MENTOR).map((k,i)=>`<button class="mentor-item" data-mentor="${escapeHtml(k)}"><span>${['⌛','🗺️','🧭','🌊','🌧️','⚔️','🔭','🔄','🚧'][i]} &nbsp; ${escapeHtml(k)}</span><span class="muted">›</span></button>`).join('')}<div class="section-label">RECENT</div>${state.mentorRecent.slice(0,3).map(x=>`<div class="note-card"><span>${escapeHtml(x.text)}</span><span class="muted">${prettyDate(x.date)}</span></div>`).join('')}`}
function stats(){const p=profile(), total=countTasks(p.wins), ach=countAchievements(p.wins), notes=Object.keys(p.notes).length, checklist=p.checklist.length?Math.round(p.checklist.filter(x=>x.done).length/p.checklist.length*100):0;return `<h1 class="title">Stats</h1><section class="stat-grid" style="margin-top:24px"><div class="small-card stat-card"><div class="stat-num gold">${state.streak} 🔥</div><div class="muted">Shared Streak</div></div><div class="small-card stat-card"><div class="stat-num" style="color:var(--green)">${ach}</div><div class="muted">Achievements</div><div class="tiny">of ${total} tasks</div></div><div class="small-card stat-card"><div class="stat-num" style="color:var(--blue)">${notes}</div><div class="muted">Notes Written</div></div><div class="small-card stat-card"><div class="stat-num gold">${checklist}%</div><div class="muted">Checklist Rate</div><div class="tiny">${p.checklist.filter(x=>x.done).length}/${p.checklist.length} today</div></div></section><section class="card"><div class="between"><h2>Daily Score — Last 7 Days</h2><span class="muted">Avg ${checklist}%</span></div><div class="bars">${['We','Th','Fr','Sa','Su','Mo','Tu'].map(d=>`<div><div class="bar" style="--h:${checklist||5}"></div><div class="tiny">${d}</div></div>`).join('')}</div></section><section class="card"><h2>Shared Streak</h2><div class="between"><div><div class="stat-num gold">${state.streak}</div><div class="muted">Current</div></div><div><div class="stat-num gold">—</div><div class="muted">Last Active</div></div><div><div class="stat-num gold">—</div><div class="muted">Both In</div></div></div></section>`}
function settings(){return `<h1 class="title">Settings</h1><div class="section-label">PROFILE</div><section class="card between"><div class="row"><div class="avatar">${state.profile[0]}</div><div><h2>${state.profile}</h2><div class="muted">Active profile</div></div></div><button class="btn" id="switchProfile2">Switch</button></section><div class="section-label">PARTNER CONNECTION</div><section class="settings-list"><button>🔗 Generate Invite Code <span class="muted">L930K4</span></button><button>🔑 Enter Partner Code</button></section><div class="section-label">STREAK</div><section class="card" style="text-align:center"><div class="row" style="justify-content:center"><div class="flame" style="width:68px;height:88px"><span class="flame-number" style="font-size:24px;bottom:19px">${state.streak}</span></div></div><div class="muted">Current shared streak</div></section><section class="settings-list"><button id="incStreak">➕ Increment Streak (Manual)</button><button id="changePass">🔒 Change Reset Passcode</button><button class="danger-text" id="resetStreak">⚠️ Reset Streak</button></section><div class="section-label">DATA & BACKUP</div><section class="settings-list"><button id="backupData">📦 Backup Data</button><button id="restoreData">📥 Restore from Backup</button><input id="restoreFile" type="file" accept="application/json" hidden></section><div class="section-label">ABOUT</div><section class="card"><div class="about-row"><span class="muted">Version</span><span>Frankie 2.0 V1</span></div><div class="about-row"><span class="muted">Profiles</span><span>Frankie · Jade</span></div><div class="about-row"><span class="muted">Data Privacy</span><span>Stored locally on device</span></div><div class="about-row"><span class="muted">Shared Data</span><span>Streak · MOTD · Check-in</span></div></section>`}

function countTasks(wins){return wins.reduce((a,w)=>a+w.tasks.length+w.subs.reduce((b,s)=>b+s.tasks.length,0),0)}
function countAchievements(wins){return wins.reduce((a,w)=>a+w.tasks.filter(t=>t.done).length+w.subs.reduce((b,s)=>b+s.tasks.filter(t=>t.done).length,0),0)}
function findTask(wins,id){for(const w of wins){let t=w.tasks.find(t=>t.id===id); if(t)return t; for(const s of w.subs){t=s.tasks.find(t=>t.id===id); if(t)return t}}}

// delegated interactions
document.addEventListener('click', e=>{
 const id=e.target.id, btn=e.target.closest('button'), row=e.target.closest('[data-id]'), winEl=e.target.closest('[data-win]'), subEl=e.target.closest('[data-sub]'), taskEl=e.target.closest('[data-task]');
 if(id==='newMotd')return setState(s=>s.motdIndex=(s.motdIndex+1)%MOTD.length);
 if(id==='switchProfile'||id==='switchProfile2')return setState(s=>{s.profile=s.profile==='Frankie'?'Jade':'Frankie'; seedNotesIfEmpty()});
 if(id==='addCheck'){const text=prompt('New checklist item'); if(text)setState(s=>profile().checklist.push({id:uid(),text,done:false}))}
 if(btn?.classList.contains('checkTick'))setState(s=>{const it=profile().checklist.find(x=>x.id===row.dataset.id); it.done=!it.done});
 if(btn?.classList.contains('editCheck')){const it=profile().checklist.find(x=>x.id===row.dataset.id); const text=prompt('Edit item',it.text); if(text!==null)setState(s=>it.text=text)}
 if(btn?.classList.contains('delCheck'))setState(s=>profile().checklist=profile().checklist.filter(x=>x.id!==row.dataset.id));
 if(id==='addMain'){const title=prompt('Main heading name'); if(title)setState(s=>profile().wins.push({id:uid(),title,subs:[],tasks:[]}))}
 if(btn?.classList.contains('delWin'))setState(s=>profile().wins=profile().wins.filter(w=>w.id!==winEl.dataset.win));
 if(btn?.classList.contains('addSub')){const title=prompt('Subheading name'); if(title)setState(s=>profile().wins.find(w=>w.id===winEl.dataset.win).subs.push({id:uid(),title,tasks:[]}))}
 if(btn?.classList.contains('addMainTask')){const text=prompt('Task'); if(text)setState(s=>profile().wins.find(w=>w.id===winEl.dataset.win).tasks.push(task(text)))}
 if(btn?.classList.contains('addSubTask')){const text=prompt('Task'); if(text)setState(s=>profile().wins.find(w=>w.id===winEl.dataset.win).subs.find(x=>x.id===subEl.dataset.sub).tasks.push(task(text)))}
 if(btn?.classList.contains('delSub'))setState(s=>{const w=profile().wins.find(w=>w.id===winEl.dataset.win); w.subs=w.subs.filter(x=>x.id!==subEl.dataset.sub)});
 if(btn?.classList.contains('winTick'))setState(s=>{const t=findTask(profile().wins,taskEl.dataset.task); t.done=!t.done});
 if(btn?.classList.contains('editTask')){const t=findTask(profile().wins,taskEl.dataset.task); const text=prompt('Edit task',t.text); if(text!==null)setState(s=>t.text=text)}
 if(btn?.classList.contains('delTask'))setState(s=>{for(const w of profile().wins){w.tasks=w.tasks.filter(t=>t.id!==taskEl.dataset.task); for(const sub of w.subs)sub.tasks=sub.tasks.filter(t=>t.id!==taskEl.dataset.task)}});
 if(btn?.classList.contains('mentor-item')){const text=btn.dataset.mentor; alert(MENTOR[text]); setState(s=>{s.mentorRecent=[{text,date:todayKey()},...s.mentorRecent.filter(x=>x.text!==text)].slice(0,8)})}
 if(id==='incStreak')setState(s=>s.streak++);
 if(id==='resetStreak'){const p=prompt('Enter reset passcode'); if(p===state.resetPasscode && confirm('Reset shared streak?'))setState(s=>s.streak=0)}
 if(id==='changePass'){const p=prompt('New passcode'); if(p)setState(s=>s.resetPasscode=p)}
 if(id==='backupData')download('frankie-2-backup.json',JSON.stringify(state,null,2),'application/json')
 if(id==='restoreData')$('#restoreFile')?.click();
});
function bindNotes(){
 $$('.seg-btn').forEach(b=>b.onclick=()=>setState(s=>s.notesView=b.dataset.view));
 $('#saveNote')?.addEventListener('click',()=>{const v=$('#noteText').value; setState(s=>{profile().notes[state.selectedNoteDate]=v})});
 $('#copyNote')?.addEventListener('click',()=>navigator.clipboard?.writeText($('#noteText').value));
 $('#goDate')?.addEventListener('click',()=>{const k=parseDateInput(prompt('Enter date, e.g. 26/05/2026')); if(k)setState(s=>{s.selectedNoteDate=k; s.notesView='today'; s.calendarYear=Number(k.slice(0,4))})});
 $('#exportNotes')?.addEventListener('click',()=>{const notes=profile().notes; const md=Object.entries(notes).sort().map(([k,v])=>`# ${prettyDate(k)}\n\n${v}`).join('\n\n---\n\n'); download(`${state.profile}-notes.md`,md,'text/markdown')});
 $('#prevYear')?.addEventListener('click',()=>setState(s=>s.calendarYear--)); $('#nextYear')?.addEventListener('click',()=>setState(s=>s.calendarYear++));
 $$('.day').forEach(b=>b.onclick=()=>setState(s=>{s.selectedNoteDate=b.dataset.date; s.notesView='today'}));
 $$('.note-card[data-date]').forEach(card=>card.onclick=e=>{if(e.target.closest('.copyOne')){navigator.clipboard?.writeText(profile().notes[card.dataset.date]); return;} setState(s=>{s.selectedNoteDate=card.dataset.date; s.notesView='today'})});
 $('#restoreFile')?.addEventListener('change',async e=>{const f=e.target.files[0]; if(!f)return; const text=await f.text(); state=JSON.parse(text); save(); render()});
}
function download(name,content,type){const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([content],{type})); a.download=name; a.click(); URL.revokeObjectURL(a.href)}
if('serviceWorker' in navigator)navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
render();
