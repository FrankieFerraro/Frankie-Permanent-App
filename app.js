const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const todayKey = () => new Date().toISOString().slice(0,10);
const prettyDate = (key=todayKey()) => new Date(key+'T00:00:00').toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'});
const uid = () => Math.random().toString(36).slice(2,10);

const MOTD = [
  {q:'Be patient with results and wildly impatient with action.', c:'Results lag. Action is immediate. Stop demanding instant proof and start demanding immediate movement.', r:'Where can I act before I feel ready?'},
  {q:'Build the day so tomorrow can trust you.', c:'Confidence is not a feeling you wait for. It is evidence you create through repeated follow-through.', r:'What would make tomorrow easier if I handled it today?'},
  {q:'The standard is built when no one is watching.', c:'The private choices are the ones that become your public life. You do not rise to your dream. You fall to your standard.', r:'What private standard do I need to raise today?'},
  {q:'Simple done consistently beats perfect done randomly.', c:'A clean repeatable action is worth more than a complicated plan you avoid. The win is in the repeat.', r:'What is the simplest useful move I can make today?'},
  {q:'The compound effect is invisible until it is undeniable.', c:'Small actions feel meaningless in the moment. They are not. They are building something you cannot yet see.', r:'What small action, done daily for the next year, would transform an area of my life?'},
  {q:'Discipline is remembering what you wanted when the mood changes.', c:'Your mood will negotiate. Your standard should not. Decide the rule before the resistance shows up.', r:'What rule do I need to follow today regardless of mood?'},
  {q:'A clear next step beats a perfect life plan.', c:'Overthinking often hides as preparation. Clarity usually comes from action, not from waiting until every detail is known.', r:'What is the next honest step?'},
  {q:'The life you want is built in the hours nobody claps for.', c:'The quiet work matters. The unseen reps become the visible result.', r:'What unseen rep needs to be done today?'},
  {q:'You do not need more motivation. You need less negotiation.', c:'Every time you renegotiate the basics, you weaken trust with yourself. Make the important things automatic.', r:'Where am I negotiating with something that should be non-negotiable?'},
  {q:'Make the right thing easier and the wrong thing harder.', c:'Environment beats willpower when the day gets heavy. Design your surroundings so your future self has fewer battles.', r:'What can I remove or set up today to make good choices easier?'},
  {q:'Win the next block, not the whole future.', c:'Big goals feel heavy when you try to carry them all at once. Shrink the focus to the next clean hour.', r:'What would winning the next hour look like?'},
  {q:'Consistency is self-respect made visible.', c:'Each follow-through is a vote for the person you are becoming. Small promises kept build a strong identity.', r:'What promise to myself will I keep today?'},
  {q:'Act before comfort gives you permission.', c:'Comfort is not the signal to start. Often, the start is what creates comfort later.', r:'Where am I waiting to feel ready?'},
  {q:'Pressure is easier to carry when your priorities are clear.', c:'A messy mind makes life feel heavier. Decide what matters most today and let that lead.', r:'What is the highest-priority move today?'},
  {q:'The goal is not to feel unstoppable. The goal is to keep moving while human.', c:'Tired, uncertain and imperfect still counts. You do not need a perfect state to take a solid action.', r:'What can I do even if I do not feel at my best?'},
  {q:'Your future is trained by your repeated response.', c:'How you respond today becomes the pattern you rely on tomorrow. Choose the response you want to become normal.', r:'What response do I want to train today?'},
  {q:'If it matters, give it a place in the day.', c:'Important things do not survive on intention alone. They need time, space and a clear action.', r:'What important thing needs a real place in today?'},
  {q:'A strong life is built by reducing avoidable chaos.', c:'Some stress is life. Some stress is poor systems. Remove the friction you keep recreating.', r:'What repeat problem can I systemise or clean up today?'},
  {q:'Do the thing that makes you proud before you do the thing that numbs you.', c:'Avoidance gives short relief and long pressure. Action gives short discomfort and long peace.', r:'What am I avoiding that would make me proud if I handled it?'},
  {q:'You can be kind to yourself without lowering the standard.', c:'Compassion and discipline are not opposites. The best version of you needs both.', r:'Where do I need both kindness and a higher standard?'},
  {q:'Energy follows integrity.', c:'Every unfinished promise drains something. Every clean action gives a little power back.', r:'What small promise can I close today?'},
  {q:'Direction beats speed when speed is pointed nowhere.', c:'Moving fast is useful only when the target is clear. Slow down long enough to aim, then move.', r:'What am I actually aiming at today?'},
  {q:'You are one clean decision away from a better day.', c:'You do not need to rescue the whole week at once. Make one clean decision and let momentum build.', r:'What is the cleanest decision I can make right now?'},
  {q:'The boring basics are undefeated.', c:'Sleep, movement, food, sunlight, water, work and honest conversations still carry most of the weight.', r:'Which basic needs attention today?'},
  {q:'Do not let a bad hour become your identity.', c:'A moment can be messy without the day being lost. Reset quickly and return to the standard.', r:'What is my reset move today?'},
  {q:'The path gets clearer when your actions get cleaner.', c:'Confusion often reduces after you remove the obvious distractions and handle the obvious next step.', r:'What obvious thing needs to be handled?'},
  {q:'You build trust with yourself the same way you build it with anyone else — by showing up.', c:'Self-belief is not magic. It is a history of kept commitments.', r:'What commitment will I keep today?'},
  {q:'Your family gets the benefit of the standards you build alone.', c:'Private discipline becomes public stability. The work you do on yourself becomes safety for the people you love.', r:'What private standard supports my future family?'},
  {q:'Small wins are not small when they change your direction.', c:'A small action repeated can turn the entire ship. Respect the first move.', r:'What small win would shift my direction today?'},
  {q:'Stop asking whether it is impressive. Ask whether it compounds.', c:'Flash fades. Compounding builds. Choose the action that creates future leverage.', r:'What action will compound if I repeat it?'},
  {q:'Calm is built through preparation, not hope.', c:'You feel steadier when your systems are stronger. Prepare the basics before life gets loud.', r:'What can I prepare today to reduce pressure tomorrow?'},
  {q:'Your standards are louder than your intentions.', c:'What you repeatedly accept becomes your real plan. Raise what you allow from yourself.', r:'What have I been accepting that needs to change?'},
  {q:'The next version of you is built by today’s proof.', c:'Your identity updates when your actions give it evidence. Give yourself proof today.', r:'What proof can I create today?'},
  {q:'Take the step that creates respect, not just relief.', c:'Relief is sometimes avoidance in disguise. Respect comes from doing the thing that actually matters.', r:'What choice would I respect tonight?'},
  {q:'Strong people still need systems.', c:'Do not rely on toughness for everything. Build routines that carry you when motivation drops.', r:'What system would make this easier to repeat?'},
  {q:'The day does not need to be perfect to be powerful.', c:'One focused block, one honest conversation or one completed task can change the tone of the day.', r:'What would make today powerful, even if it is not perfect?'},
  {q:'Future freedom is purchased with present structure.', c:'The structure you build now gives your future family more options, peace and time.', r:'What structure would give my future more freedom?'},
  {q:'Move like the person who already decided.', c:'Once the decision is made, the energy changes. Stop reopening the door every morning.', r:'What decision needs to be treated as already made?'},
  {q:'Do the hard thing while it is still small.', c:'Most problems get heavier when ignored. Handle the early version before it becomes the expensive version.', r:'What small hard thing should I handle now?'},
  {q:'A better life is usually a better set of defaults.', c:'Your default habits become your default future. Upgrade the automatic things.', r:'What default needs upgrading today?'}
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
  activeTab:'home', profile:'Frankie', streak:0, motdIndex:0, motdDate:todayKey(), calendarYear:new Date().getFullYear(), notesView:'today', selectedNoteDate:todayKey(), mentorRecent:[], resetPasscode:'2222', phoenixSeenDate:'',
  profiles:{
    Frankie:{checklist:[{id:uid(),text:'Pizza',done:true}], water:{}, notes:{}, wins:sampleWins()},
    Jade:{checklist:[{id:uid(),text:'Move body',done:false}], water:{}, notes:{}, wins:sampleWins(true)}
  },
  finance:{view:'payslips', person:'Frankie', editPayslipId:null, customWeeks:8, calcLines:[], rates:sampleFinanceRates(), payslips:[]}
});
function sampleWins(jade=false){return [
  {id:uid(),title:jade?'Weekly Reset':'Pakenham House',subs:[{id:uid(),title:'Outside',tasks:[task('Fix light'),task('Check roof'),task('Clean deck')]},{id:uid(),title:'Inside',tasks:[task('Fix tap'),task('Organise garage')]}],tasks:[]},
  {id:uid(),title:jade?'Health Admin':'Life Admin',subs:[],tasks:[task('Call agent'),task('Pay bill'),task('Book appointment')]}
]}
function sampleFinanceRates(){return [
  {id:uid(),person:'Frankie',employer:'Paylos',label:'Weekday',rate:0},
  {id:uid(),person:'Frankie',employer:'Paylos',label:'Weekend',rate:0},
  {id:uid(),person:'Jade',employer:'Studio Pilates',label:'Weekday',rate:0},
  {id:uid(),person:'Jade',employer:'Studio Pilates',label:'Saturday',rate:0},
  {id:uid(),person:'Jade',employer:'Studio Pilates',label:'Sunday',rate:0}
]}
function task(text){return {id:uid(),text,done:false}}
let state = load();
migrateState();
setDailyMOTD();
touchActive();
seedNotesIfEmpty();
function load(){try{return JSON.parse(localStorage.getItem('frankie2_state'))||defaultState()}catch{return defaultState()}}
function migrateState(){
  state.lastActive = state.lastActive || {Frankie:null,Jade:null};
  state.mentorOpen = state.mentorOpen || null;
  state.phoenixSeenDate = state.phoenixSeenDate || '';
  state.calendarYear = state.calendarYear || new Date().getFullYear();
  state.notesView = state.notesView || 'today';
  state.selectedNoteDate = state.selectedNoteDate || todayKey();
  state.profiles = state.profiles || defaultState().profiles;
  Object.keys(state.profiles).forEach(name => {
    state.profiles[name].water = state.profiles[name].water || {};
  });
  state.finance = state.finance || {view:'payslips', person:'Frankie', editPayslipId:null, customWeeks:8, calcLines:[], rates:sampleFinanceRates(), payslips:[]};
  state.finance.view = state.finance.view || 'payslips';
  state.finance.person = state.finance.person || 'Frankie';
  state.finance.customWeeks = state.finance.customWeeks || 8;
  state.finance.calcLines = state.finance.calcLines || [];
  state.finance.rates = state.finance.rates || sampleFinanceRates();
  state.finance.payslips = state.finance.payslips || [];
}
function setDailyMOTD(){
  const t = todayKey();
  if(state.motdDate !== t){
    const d = new Date(t+'T00:00:00');
    const dayNumber = Math.floor(d.getTime()/86400000);
    state.motdIndex = Math.abs(dayNumber) % MOTD.length;
    state.motdDate = t;
    save();
  }
}

function touchActive(){
  state.lastActive[state.profile] = Date.now();
  save();
}
function save(){localStorage.setItem('frankie2_state', JSON.stringify(state))}
function profile(){return state.profiles[state.profile]}
function waterCount(){return profile().water?.[todayKey()] || 0}
function waterMl(){return waterCount()*250}
function waterComplete(){return waterCount()>=10}
function setWater(count){setState(s=>{profile().water[todayKey()] = Math.max(0, Math.min(10, count));})}
function focusChecklistItem(id){
  setTimeout(()=>{
    const el=document.querySelector(`[data-check-id="${id}"]`);
    if(!el) return;
    el.focus();
    const range=document.createRange();
    range.selectNodeContents(el);
    const sel=window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  },30);
}
function setState(fn){fn(state); save(); render(); if(focusCheckAfterRender){const id=focusCheckAfterRender; focusCheckAfterRender=null; focusChecklistItem(id);}}
function seedNotesIfEmpty(){const n=profile().notes;if(Object.keys(n).length)return; const base=new Date(); for(let i=1;i<=25;i++){const d=new Date(base); d.setDate(base.getDate()-i); const k=d.toISOString().slice(0,10); n[k]=`Test note ${i}. This is a sample daily note so you can test the All Notes view, scrolling, calendar markers and opening older notes.`} save()}
function parseDateInput(v){v=(v||'').trim(); if(!v)return null; let m=v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if(m)return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`; m=v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/); if(m)return `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`; const d=new Date(v); if(!isNaN(d))return d.toISOString().slice(0,10); return null}
function escapeHtml(s=''){return s.replace(/[&<>'"]/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[c]))}
function timeAgo(ts){
  if(!ts) return 'Not used yet';
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff/60000);
  if(mins < 1) return 'Just now';
  if(mins < 60) return mins + ' min ago';
  const hrs = Math.floor(mins/60);
  if(hrs < 24) return hrs + (hrs===1?' hour ago':' hours ago');
  const days = Math.floor(hrs/24);
  const rem = hrs % 24;
  if(days < 7) return days + (days===1?' day':' days') + (rem ? ' ' + rem + 'h ago' : ' ago');
  return prettyDate(new Date(ts).toISOString().slice(0,10));
}

function render(){
  const app=$('#app');
  app.innerHTML = `<main class="shell">${screen()}</main>${nav()}`;
  bindCommon();
  if(state.activeTab==='notes') bindNotes();
  if(state.activeTab==='finance') bindFinance();
  focusPendingEditable();
  maybeShowPhoenix();
}
function nav(){const tabs=[['home','⌂','Home'],['wins','🏆','Wins'],['notes','▤','Notes'],['finance','💰','Finance'],['mentor','🧠','Mentor'],['stats','▮','Stats'],['settings','⚙','Settings']];return `<nav class="nav"><div class="nav-inner">${tabs.map(t=>`<button class="nav-btn ${state.activeTab===t[0]?'active':''}" data-tab="${t[0]}"><span class="nav-ico">${t[1]}</span>${t[2]}</button>`).join('')}</div></nav>`}
function bindCommon(){ $$('.nav-btn').forEach(b=>b.onclick=()=>setState(s=>s.activeTab=b.dataset.tab)); }
function screen(){return ({home:home(),wins:wins(),notes:notes(),finance:finance(),mentor:mentor(),stats:stats(),settings:settings()})[state.activeTab]}
function home(){const p=profile(), waterDone=waterComplete()?1:0, total=p.checklist.length+1, done=p.checklist.filter(x=>x.done).length+waterDone, score=total?Math.round(done/total*100):0, m=MOTD[state.motdIndex%MOTD.length];return `
  <section class="header"><div><h1 class="title">Frankie 2.0</h1><div class="sub">${prettyDate()}</div></div><button class="avatar" id="switchProfile">${state.profile[0]}</button></section>
  <section class="card motd"><div class="motd-label">MESSAGE OF THE DAY</div><p class="motd-quote">"${escapeHtml(m.q)}"</p><div class="motd-body">${escapeHtml(m.c)}</div><div class="reflect"><div class="reflect-title">REFLECT</div><div class="reflect-text">${escapeHtml(m.r)}</div></div></section>
  <section class="card score-streak"><div><div class="progress-ring" style="--score:${score}"><strong>${score}%</strong><span>Today</span></div><div class="card-title">Daily Score</div></div><div class="divider"></div><div><div class="flame-wrap"><div class="flame"><span class="flame-number">${state.streak}</span></div></div><div class="card-title">Streak</div></div></section>
  <div class="between checklist-head"><div><div class="list-title">Daily Checklist</div><div class="tiny">${done}/${total} done</div></div><button class="mini-add" id="addCheck" aria-label="Add checklist item">+</button></div>
  ${waterTracker()}
  <section class="checklist-section">${p.checklist.map(item=>`<div class="check-row inline-check ${item.done?'done':''}" data-id="${item.id}"><button class="tick checkTick">✓</button><div class="row-text check-editable" contenteditable="true" data-check-id="${item.id}" data-placeholder="New task">${escapeHtml(item.text)}</div><button class="icon-btn delCheck">×</button></div>`).join('')}</section>`}
function waterTracker(){
  const count = waterCount();
  const ml = waterMl();
  const label = ml>=1000 ? (ml/1000).toFixed(ml%1000===0?0:2)+'L' : ml+'ml';
  return `<section class="water-card">
    <div class="water-top"><div><strong>💧 Water Intake</strong><span>Permanent daily task</span></div><div class="water-amount" id="waterAmount">${label} / 2.5L</div></div>
    <div class="droplets" id="waterDroplets" data-count="${count}">${Array.from({length:10},(_,i)=>`<button class="drop ${i<count?'filled':''}" data-water="${i+1}" aria-label="${(i+1)*250}ml">💧</button>`).join('')}</div>
    <div class="water-note">Tap a droplet or slide your finger across to fill more or less. Each droplet = 250ml.</div>
  </section>`
}

function wins(){const p=profile(); const achievements=countAchievements(p.wins); const tasks=countTasks(p.wins); const groups=p.wins.length;return `<section class="header"><div><h1 class="title">Wins 🏆</h1><div class="sub">Achievement List</div></div><button class="avatar">🏆</button></section><div class="between win-head"><div><div><span class="gold"><strong>${achievements}</strong></span> <span class="muted">achievements of ${tasks} tasks</span></div><div class="tiny win-group-count">📁 ${groups} main heading${groups===1?'':'s'}</div></div><button class="btn" id="addMain">+ Main heading</button></div>${p.wins.map(w=>winCard(w)).join('')}`}
function winCard(w){return `<section class="card win-card drag-item" data-drag-type="win" data-win="${w.id}"><div class="between win-drag-zone"><div class="win-title"><span class="drag-grip">☰</span> 🏆 <span class="editable editable-title" contenteditable="true" data-edit-type="win" data-edit-id="${w.id}" data-placeholder="Main heading">${escapeHtml(w.title)}</span></div><button class="btn danger delWin">🗑️ Delete</button></div><div class="win-actions"><button class="btn addSub">➕ subheading</button><button class="btn addMainTask">➕ task</button></div><div class="main-task-drop" data-drop-type="main" data-win="${w.id}">${w.tasks.map(t=>taskRow(t,w.id,'main')).join('')}</div>${w.subs.map(sub=>`<div class="sub-block drag-item" data-drag-type="sub" data-win="${w.id}" data-sub="${sub.id}"><div class="subhead"><span class="sub-label"><span class="drag-grip">☰</span> 📌 <span class="editable editable-sub" contenteditable="true" data-edit-type="sub" data-edit-id="${sub.id}" data-placeholder="Subheading">${escapeHtml(sub.title)}</span></span><span><button class="btn addSubTask">➕</button> <button class="btn danger delSub">🗑️</button></span></div><div class="sub-task-drop" data-drop-type="sub" data-win="${w.id}" data-sub="${sub.id}">${sub.tasks.map(t=>taskRow(t,w.id,sub.id)).join('')}</div></div>`).join('')}</section>`}
function taskRow(t,winId='',subId='main'){return `<div class="task-row drag-item ${t.done?'done':''}" data-drag-type="task" data-win="${winId}" data-sub="${subId}" data-task="${t.id}"><button class="tick winTick">✓</button><span class="drag-grip task-grip">☰</span><div class="row-text editable editable-task" contenteditable="true" data-edit-type="task" data-edit-id="${t.id}" data-placeholder="New task">${escapeHtml(t.text)}</div><button class="icon-btn editTask">✏️</button><button class="icon-btn delTask">🗑️</button></div>`}
function notes(){return `<section class="header notes-header"><h1 class="title">Notes 📝</h1><div class="row note-actions"><button class="btn" id="todayNote">Today</button><button class="btn" id="goDate">Go to date</button><button class="btn" id="exportNotes">Export</button></div></section><section class="segment"><button class="seg-btn ${state.notesView==='today'?'active':''}" data-view="today">Today</button><button class="seg-btn ${state.notesView==='all'?'active':''}" data-view="all">All Notes</button><button class="seg-btn ${state.notesView==='calendar'?'active':''}" data-view="calendar">Calendar</button></section>${notesBody()}`}
function notesBody(){const p=profile(); if(state.notesView==='today'){const val=p.notes[state.selectedNoteDate]||'';return `<div class="sub">${prettyDate(state.selectedNoteDate)}</div><textarea class="textarea" id="noteText" placeholder="Write today's note...">${escapeHtml(val)}</textarea><div class="row" style="margin-top:12px"><button class="btn" id="saveNote">💾 Save today</button><button class="btn ghost" id="copyNote">📋 Copy today</button></div>`}
 if(state.notesView==='all'){const entries=Object.entries(p.notes).sort((a,b)=>b[0].localeCompare(a[0])); if(!entries.length)return `<div class="empty"><div>📝<strong>No notes yet</strong><span>Switch to Today to write your first note</span></div></div>`; return `<section class="card" style="padding:0">${entries.map(([k,v])=>`<div class="note-card" data-date="${k}"><div><div class="note-date">${prettyDate(k)}</div><div class="note-preview">${escapeHtml(v.slice(0,85))}${v.length>85?'...':''}</div></div><button class="icon-btn copyOne">📋</button></div>`).join('')}</section>`}
 return calendar();}
function calendar(){const y=state.calendarYear; const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `<div class="calendar-head"><button class="btn" id="prevYear">‹</button><div class="year-title">${y}</div><button class="btn" id="nextYear">›</button></div><section class="months">${months.map((m,i)=>month(y,i,m)).join('')}</section>`}
function month(y,mi,name){const first=new Date(y,mi,1).getDay(); const days=new Date(y,mi+1,0).getDate(); let cells=''; for(let i=0;i<first;i++)cells+=`<div></div>`; for(let d=1;d<=days;d++){const k=`${y}-${String(mi+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; cells+=`<button class="day ${k===todayKey()?'today':''} ${profile().notes[k]?'has-note':''}" data-date="${k}">${d}</button>`} return `<div class="month"><div class="month-title">${name}</div><div class="days">${cells}</div></div>`}

function money(n){n=Number(n)||0; return '$'+n.toLocaleString('en-AU',{maximumFractionDigits:2,minimumFractionDigits:n%1?2:0})}
function financePeople(){return ['Frankie','Jade']}
function finance(){const f=state.finance; const s=financeStats(f.person), combined=financeStats('Combined'); return `<section class="header"><div><h1 class="title">Finance 💰</h1><div class="sub">Payslips, rates and income averages</div></div><button class="avatar">💰</button></section>
  <section class="stat-grid finance-top">
    <div class="small-card stat-card"><div class="stat-num gold">${money(s.last4)}</div><div class="muted">${f.person} 4 week avg</div></div>
    <div class="small-card stat-card"><div class="stat-num" style="color:var(--green)">${money(combined.last4)}</div><div class="muted">Combined 4 week avg</div></div>
    <div class="small-card stat-card"><div class="stat-num" style="color:var(--blue)">${money(s.yearNet)}</div><div class="muted">${f.person} this year</div></div>
    <div class="small-card stat-card"><div class="stat-num gold">${money(s.allTime)}</div><div class="muted">All-time weekly avg</div></div>
  </section>
  <section class="segment finance-seg"><button class="seg-btn ${f.view==='payslips'?'active':''}" data-finance-view="payslips">Payslips</button><button class="seg-btn ${f.view==='calculator'?'active':''}" data-finance-view="calculator">Calculator</button><button class="seg-btn ${f.view==='rates'?'active':''}" data-finance-view="rates">Rates</button><button class="seg-btn ${f.view==='insights'?'active':''}" data-finance-view="insights">Insights</button></section>
  ${financeBody()}`
}
function financePersonToggle(){return `<div class="person-toggle">${financePeople().map(p=>`<button class="${state.finance.person===p?'active':''}" data-finance-person="${p}">${p}</button>`).join('')}</div>`}
function financeBody(){const v=state.finance.view; if(v==='calculator')return financeCalculator(); if(v==='rates')return financeRates(); if(v==='insights')return financeInsights(); return financePayslips();}
function financePayslips(){
  const f=state.finance, p=f.person, editing=f.payslips.find(x=>x.id===f.editPayslipId);
  const list=f.payslips.filter(x=>x.person===p).sort((a,b)=>(b.payDate||'').localeCompare(a.payDate||''));
  return `${financePersonToggle()}
  <section class="card finance-form">
    <div class="between"><h2>${editing?'Edit':'Add'} payslip</h2><button class="btn ghost" id="clearPayslipForm">Clear</button></div>
    <div class="finance-grid">
      <label>Pay date<input class="input" id="fpDate" type="date" value="${editing?.payDate||todayKey()}"></label>
      <label>Employer<input class="input" id="fpEmployer" placeholder="Paylos / Goodlife / Studio Pilates" value="${escapeHtml(editing?.employer||'')}"></label>
      <label>Period from<input class="input" id="fpFrom" type="date" value="${editing?.periodFrom||''}"></label>
      <label>Period to<input class="input" id="fpTo" type="date" value="${editing?.periodTo||''}"></label>
      <label>Total hours<input class="input" id="fpHours" type="number" step="0.01" placeholder="0" value="${editing?.hours||''}"></label>
      <label>Gross pay<input class="input" id="fpGross" type="number" step="0.01" placeholder="0" value="${editing?.gross||''}"></label>
      <label>Net pay<input class="input" id="fpNet" type="number" step="0.01" placeholder="0" value="${editing?.net||''}"></label>
      <label>Tax withheld<input class="input" id="fpTax" type="number" step="0.01" placeholder="Optional" value="${editing?.tax||''}"></label>
      <label>Super<input class="input" id="fpSuper" type="number" step="0.01" placeholder="Optional" value="${editing?.superAmount||''}"></label>
      <label>Payslip photo<input class="input" id="fpFile" type="file" accept="image/*,application/pdf"></label>
    </div>
    <label>Notes<textarea class="textarea finance-note" id="fpNotes" placeholder="Optional notes">${escapeHtml(editing?.notes||'')}</textarea></label>
    <div class="row" style="margin-top:12px"><button class="btn" id="savePayslip">💾 Save payslip</button>${editing?.attachment?`<a class="btn ghost" href="${editing.attachment}" target="_blank">📎 View current</a>`:''}</div>
    <div class="tiny finance-warning">Payslip attachments are stored locally on this phone in this test version. Use small images where possible.</div>
  </section>
  <div class="section-label">SAVED PAYSLIPS</div>
  ${list.length?`<section>${list.map(payslipCard).join('')}</section>`:`<div class="empty"><div>💰<strong>No payslips yet</strong><span>Add the first one above.</span></div></div>`}`
}
function payslipCard(x){return `<section class="card payslip-card" data-payslip="${x.id}">
  <div class="between"><div><div class="note-date">${prettyDate(x.payDate||todayKey())}</div><div class="muted">${escapeHtml(x.employer||'No employer')}</div></div><div class="pay-net">${money(x.net)}</div></div>
  <div class="pay-meta"><span>Gross ${money(x.gross)}</span><span>${Number(x.hours||0)} hrs</span><span>${x.periodFrom&&x.periodTo?prettyDate(x.periodFrom)+' - '+prettyDate(x.periodTo):'No period'}</span></div>
  <div class="row pay-actions"><button class="btn editPayslip">✏️ Edit</button><button class="btn danger delPayslip">🗑️ Delete</button>${x.attachment?`<a class="btn ghost" href="${x.attachment}" target="_blank">📎 View payslip</a>`:''}</div>
</section>`}
function financeCalculator(){
  const f=state.finance, rates=f.rates.filter(r=>r.person===f.person), total=f.calcLines.reduce((a,l)=>a+(Number(l.hours)||0)*(Number(l.rate)||0),0);
  return `${financePersonToggle()}<section class="card finance-form"><h2>Quick pay calculator</h2>
    <div class="finance-grid">
      <label>Saved rate<select class="input" id="calcRateSelect"><option value="">Manual / choose rate</option>${rates.map(r=>`<option value="${r.id}">${escapeHtml(r.employer)} - ${escapeHtml(r.label)} - ${money(r.rate)}/hr</option>`).join('')}</select></label>
      <label>Line label<input class="input" id="calcLabel" placeholder="Weekday / Saturday / overtime"></label>
      <label>Hours<input class="input" id="calcHours" type="number" step="0.01" placeholder="0"></label>
      <label>Hourly rate<input class="input" id="calcRate" type="number" step="0.01" placeholder="0"></label>
    </div>
    <div class="row" style="margin-top:12px"><button class="btn" id="addCalcLine">➕ Add line</button><button class="btn ghost" id="clearCalc">Clear</button></div>
  </section>
  <section class="card"><div class="between"><h2>Expected gross</h2><div class="pay-net">${money(total)}</div></div>${f.calcLines.length?f.calcLines.map(l=>`<div class="calc-line" data-calc="${l.id}"><span>${escapeHtml(l.label)}</span><span>${Number(l.hours)} hrs × ${money(l.rate)}</span><strong>${money(Number(l.hours)*Number(l.rate))}</strong><button class="icon-btn delCalc">🗑️</button></div>`).join(''):`<div class="muted">Add weekday, Saturday, Sunday or overtime lines above.</div>`}<button class="btn full" id="saveCalcAsPayslip">Save estimate as payslip</button></section>`
}
function financeRates(){
  const f=state.finance, rates=f.rates.filter(r=>r.person===f.person);
  return `${financePersonToggle()}<section class="card finance-form"><h2>Saved rates</h2><div class="finance-grid">
    <label>Employer<input class="input" id="rateEmployer" placeholder="Studio Pilates / Goodlife"></label>
    <label>Rate type<input class="input" id="rateLabel" placeholder="Weekday / Saturday / overtime"></label>
    <label>Hourly rate<input class="input" id="rateAmount" type="number" step="0.01" placeholder="0"></label>
  </div><button class="btn full" id="addRate">➕ Add saved rate</button></section>
  <section>${rates.map(r=>`<div class="rate-row" data-rate="${r.id}"><div><strong>${escapeHtml(r.employer)}</strong><div class="muted">${escapeHtml(r.label)}</div></div><div class="pay-net">${money(r.rate)}/hr</div><button class="icon-btn delRate">🗑️</button></div>`).join('')||`<div class="empty"><div>💸<strong>No rates yet</strong><span>Add your first saved rate above.</span></div></div>`}</section>`
}
function financeInsights(){
  const p=state.finance.person, s=financeStats(p), c=financeStats('Combined'), custom=financeAvg(p,state.finance.customWeeks);
  return `${financePersonToggle()}<section class="stat-grid finance-top">
    <div class="small-card stat-card"><div class="stat-num gold">${money(s.last4)}</div><div class="muted">Last 4 weeks</div></div>
    <div class="small-card stat-card"><div class="stat-num gold">${money(s.last13)}</div><div class="muted">Last 13 weeks</div></div>
    <div class="small-card stat-card"><div class="stat-num gold">${money(s.last26)}</div><div class="muted">Last 26 weeks</div></div>
    <div class="small-card stat-card"><div class="stat-num gold">${money(s.allTime)}</div><div class="muted">All-time weekly avg</div></div>
  </section>
  <section class="card"><h2>Custom average</h2><label>Weeks<input class="input" id="customWeeks" type="number" min="1" max="520" value="${state.finance.customWeeks}"></label><div class="pay-net custom-result">${money(custom)} / week</div></section>
  <section class="card"><h2>Year totals</h2><div class="about-row"><span class="muted">${p} net this year</span><span>${money(s.yearNet)}</span></div><div class="about-row"><span class="muted">${p} gross this year</span><span>${money(s.yearGross)}</span></div><div class="about-row"><span class="muted">Combined net this year</span><span>${money(c.yearNet)}</span></div><div class="about-row"><span class="muted">Combined 4 week avg</span><span>${money(c.last4)}</span></div></section>`
}
function financeStats(person){return {last4:financeAvg(person,4),last13:financeAvg(person,13),last26:financeAvg(person,26),allTime:financeAllTimeAvg(person),yearNet:financeYearTotal(person,'net'),yearGross:financeYearTotal(person,'gross')}}
function financePayslipsFor(person){return state.finance.payslips.filter(x=>person==='Combined'||x.person===person)}
function financeAvg(person,weeks){const cutoff=Date.now()-weeks*7*86400000; const items=financePayslipsFor(person).filter(x=>new Date((x.payDate||todayKey())+'T00:00:00').getTime()>=cutoff); return items.reduce((a,x)=>a+Number(x.net||0),0)/weeks}
function financeAllTimeAvg(person){const items=financePayslipsFor(person).filter(x=>x.payDate); if(!items.length)return 0; const times=items.map(x=>new Date(x.payDate+'T00:00:00').getTime()); const weeks=Math.max(1,Math.ceil((Math.max(...times)-Math.min(...times)+86400000)/(7*86400000))); return items.reduce((a,x)=>a+Number(x.net||0),0)/weeks}
function financeYearTotal(person,key){const y=new Date().getFullYear(); return financePayslipsFor(person).filter(x=>(x.payDate||'').slice(0,4)==String(y)).reduce((a,x)=>a+Number(x[key]||0),0)}

function mentor(){
  const icons=['⌛','🗺️','🧭','🌊','🌧️','⚔️','🔭','🔄','🚧'];
  return `<section class="header"><div><h1 class="title">Mentor</h1><div class="sub">What do you need right now?</div></div></section>
  ${Object.keys(MENTOR).map((k,i)=>`<section class="mentor-card ${state.mentorOpen===k?'open':''}"><button class="mentor-item" data-mentor="${escapeHtml(k)}"><span>${icons[i]} &nbsp; ${escapeHtml(k)}</span><span class="muted">${state.mentorOpen===k?'⌃':'›'}</span></button>${state.mentorOpen===k?`<div class="mentor-drop">${escapeHtml(MENTOR[k])}</div>`:''}</section>`).join('')}
  <div class="section-label">RECENT</div>${state.mentorRecent.slice(0,3).map(x=>`<div class="note-card"><span>${escapeHtml(x.text)}</span><span class="muted">${prettyDate(x.date)}</span></div>`).join('')}`
}
function stats(){
  const p=profile(), total=countTasks(p.wins), ach=countAchievements(p.wins), notes=Object.keys(p.notes).length;
  const checklistTotal=p.checklist.length+1; const checklistDone=p.checklist.filter(x=>x.done).length+(waterComplete()?1:0); const checklist=checklistTotal?Math.round(checklistDone/checklistTotal*100):0;
  const partner=state.profile==='Frankie'?'Jade':'Frankie';
  const partnerActive=timeAgo(state.lastActive?.[partner]);
  return `<h1 class="title">Stats</h1>
  <section class="stat-grid" style="margin-top:24px">
    <div class="small-card stat-card"><div class="stat-num gold">${state.streak} 🔥</div><div class="muted">Shared Streak</div></div>
    <div class="small-card stat-card"><div class="stat-num partner-active">${partnerActive}</div><div class="muted">${partner} Last Active</div><div class="tiny">Local until sync is added</div></div>
    <div class="small-card stat-card"><div class="stat-num" style="color:var(--green)">${ach}</div><div class="muted">Achievements</div><div class="tiny">of ${total} tasks</div></div>
    <div class="small-card stat-card"><div class="stat-num" style="color:var(--blue)">${notes}</div><div class="muted">Notes Written</div></div>
    <div class="small-card stat-card"><div class="stat-num gold">${checklist}%</div><div class="muted">Checklist Rate</div><div class="tiny">${checklistDone}/${checklistTotal} today</div></div>
  </section>
  <section class="card stats-card"><div class="between"><h2>Daily Score — Last 7 Days</h2><span class="muted">Avg ${checklist}%</span></div><div class="bars">${['We','Th','Fr','Sa','Su','Mo','Tu'].map(d=>`<div><div class="bar" style="--h:${checklist||5}"></div><div class="tiny">${d}</div></div>`).join('')}</div></section>`
}
function settings(){return `<h1 class="title settings-title">Settings</h1>

  <div class="section-label">PROFILE</div>
  <section class="settings-group">
    <div class="settings-row">
      <div>
        <div class="settings-main">Active Profile</div>
        <div class="settings-sub">Switch between Frankie and Jade</div>
      </div>
      <button class="settings-pill" id="switchProfile2">${state.profile}</button>
    </div>
    <div class="settings-row">
      <div>
        <div class="settings-main">Partner Sync</div>
        <div class="settings-sub">Shared streak, message and check-ins later</div>
      </div>
      <span class="settings-value muted">Coming soon</span>
    </div>
  </section>

  <div class="section-label">APP</div>
  <section class="settings-group">
    <button class="settings-row settings-action" id="replayAnim">
      <div>
        <div class="settings-main">Replay Daily Animation</div>
        <div class="settings-sub">Preview the streak intro again</div>
      </div>
      <span class="settings-icon">▶</span>
    </button>
    <button class="settings-row settings-action" id="incStreak">
      <div>
        <div class="settings-main">Increment Streak</div>
        <div class="settings-sub">Manual test control while building</div>
      </div>
      <span class="settings-icon">＋</span>
    </button>
    <button class="settings-row settings-action" id="changePass">
      <div>
        <div class="settings-main">Change Reset Passcode</div>
        <div class="settings-sub">Controls streak reset protection</div>
      </div>
      <span class="settings-icon">🔒</span>
    </button>
    <button class="settings-row settings-action danger-row" id="resetStreak">
      <div>
        <div class="settings-main">Reset Streak</div>
        <div class="settings-sub">Protected by reset passcode</div>
      </div>
      <span class="settings-icon">›</span>
    </button>
  </section>

  <div class="section-label">DATA</div>
  <section class="settings-group">
    <button class="settings-row settings-action" id="backupData">
      <div>
        <div class="settings-main">Backup Data</div>
        <div class="settings-sub">Export your current app data</div>
      </div>
      <span class="settings-icon">↓</span>
    </button>
    <button class="settings-row settings-action" id="restoreData">
      <div>
        <div class="settings-main">Restore Data</div>
        <div class="settings-sub">Import a previous backup file</div>
      </div>
      <span class="settings-icon">↑</span>
    </button>
    <input id="restoreFile" type="file" accept="application/json" hidden>
  </section>

  <div class="section-label">ABOUT</div>
  <section class="settings-group">
    <div class="settings-row">
      <div class="settings-main">Version</div>
      <span class="settings-value">2.5</span>
    </div>
    <div class="settings-row">
      <div>
        <div class="settings-main">Privacy</div>
        <div class="settings-sub">Data is stored locally on this device for now</div>
      </div>
      <span class="settings-value">Local</span>
    </div>
    <div class="settings-row">
      <div>
        <div class="settings-main">Shared Data</div>
        <div class="settings-sub">Streak, Message of the Day and future check-ins</div>
      </div>
      <span class="settings-value">Limited</span>
    </div>
  </section>`}

function maybeShowPhoenix(){
  if(state.activeTab!=='home') return;
  if(state.phoenixSeenDate===todayKey()) return;
  showPhoenix();
}
function showPhoenix(){
  if(document.querySelector('.phoenix-overlay')) return;
  state.phoenixSeenDate=todayKey();
  save();
  const overlay=document.createElement('div');
  overlay.className='phoenix-overlay';
  overlay.innerHTML = `
    <div class="phoenix-burst burst-1"></div>
    <div class="phoenix-burst burst-2"></div>
    <div class="phoenix">
      <div class="phoenix-wing wing-left"></div>
      <div class="phoenix-wing wing-right"></div>
      <div class="phoenix-tail"></div>
      <div class="phoenix-body"></div>
      <div class="phoenix-head"></div>
      <div class="phoenix-crown"></div>
      <div class="phoenix-core"></div>
      <div class="phoenix-streak">${state.streak}</div>
    </div>
    <div class="phoenix-text">${state.streak} day streak</div>
  `;
  document.body.appendChild(overlay);
  const cleanup=()=>{overlay.classList.add('fade-out'); setTimeout(()=>overlay.remove(), 420);};
  overlay.addEventListener('click', cleanup, {once:true});
  setTimeout(cleanup, 2450);
}



function focusPendingEditable(){
  if(!focusAfterRender) return;
  const {type,id}=focusAfterRender;
  focusAfterRender=null;
  setTimeout(()=>focusEditable(type,id,true),20);
}
function focusEditable(type,id,selectAll=false){
  const el=document.querySelector(`[data-edit-type="${type}"][data-edit-id="${id}"]`);
  if(!el) return;
  el.focus();
  const range=document.createRange();
  range.selectNodeContents(el);
  if(!selectAll) range.collapse(false);
  const sel=window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
function getPlainText(el){
  return (el.innerText || el.textContent || '').replace(/\n/g,' ').trim();
}
function updateEditable(type,id,value){
  if(type==='win'){
    const w=profile().wins.find(w=>w.id===id);
    if(w) w.title=value;
  }
  if(type==='sub'){
    for(const w of profile().wins){
      const s=w.subs.find(s=>s.id===id);
      if(s){ s.title=value; break; }
    }
  }
  if(type==='task'){
    const t=findTask(profile().wins,id);
    if(t) t.text=value;
  }
  save();
}
document.addEventListener('input', e=>{
  const el=e.target.closest?.('[contenteditable="true"][data-edit-type]');
  if(!el) return;
  updateEditable(el.dataset.editType, el.dataset.editId, getPlainText(el));
});
document.addEventListener('blur', e=>{
  const el=e.target.closest?.('[contenteditable="true"][data-edit-type]');
  if(!el) return;
  updateEditable(el.dataset.editType, el.dataset.editId, getPlainText(el));
}, true);
document.addEventListener('keydown', e=>{
  const el=e.target.closest?.('[contenteditable="true"][data-edit-type]');
  if(!el) return;
  if(e.key==='Enter'){
    e.preventDefault();
    updateEditable(el.dataset.editType, el.dataset.editId, getPlainText(el));
    el.blur();
  }
});

let focusCheckAfterRender = null;
let focusAfterRender = null;
let dragInfo = null;
let longPressTimer = null;
let dragPoint = null;

function isInteractiveTarget(el){
  return !!el.closest('button,input,textarea,.btn,.icon-btn,.tick,[contenteditable="true"]');
}
function getDragElement(el){
  const task = el.closest('.task-row[data-task]');
  if(task) return task;
  const sub = el.closest('.sub-block[data-sub]');
  if(sub) return sub;
  const win = el.closest('.win-card[data-win]');
  if(win && el.closest('.win-drag-zone')) return win;
  return null;
}
function startLongPressDrag(el, x, y){
  const type = el.dataset.dragType;
  dragInfo = {
    type,
    id: type==='task' ? el.dataset.task : type==='sub' ? el.dataset.sub : el.dataset.win,
    fromWin: el.dataset.win || null,
    fromSub: el.dataset.sub || null,
    beforeX:x, beforeY:y
  };
  el.classList.add('dragging');
  document.body.classList.add('drag-active');
  navigator.vibrate?.(20);
}
function clearDragVisuals(){
  $$('.drop-hover').forEach(x=>x.classList.remove('drop-hover'));
  $$('.dragging').forEach(x=>x.classList.remove('dragging'));
  document.body.classList.remove('drag-active');
}
function removeTaskById(taskId){
  for(const w of profile().wins){
    const i=w.tasks.findIndex(t=>t.id===taskId);
    if(i>-1) return w.tasks.splice(i,1)[0];
    for(const s of w.subs){
      const j=s.tasks.findIndex(t=>t.id===taskId);
      if(j>-1) return s.tasks.splice(j,1)[0];
    }
  }
  return null;
}
function getTaskContainer(winId, subId){
  const w=profile().wins.find(x=>x.id===winId);
  if(!w) return null;
  if(!subId || subId==='main') return w.tasks;
  const s=w.subs.find(x=>x.id===subId);
  return s?.tasks || null;
}
function locateTask(taskId){
  for(const w of profile().wins){
    let i=w.tasks.findIndex(t=>t.id===taskId);
    if(i>-1) return {win:w, sub:null, list:w.tasks, index:i};
    for(const s of w.subs){
      i=s.tasks.findIndex(t=>t.id===taskId);
      if(i>-1) return {win:w, sub:s, list:s.tasks, index:i};
    }
  }
  return null;
}
function removeSubById(subId){
  for(const w of profile().wins){
    const i=w.subs.findIndex(s=>s.id===subId);
    if(i>-1) return w.subs.splice(i,1)[0];
  }
  return null;
}
function locateSub(subId){
  for(const w of profile().wins){
    const i=w.subs.findIndex(s=>s.id===subId);
    if(i>-1) return {win:w, list:w.subs, index:i};
  }
  return null;
}
function moveDraggedItem(dropEl, clientY){
  if(!dragInfo || !dropEl) return false;

  if(dragInfo.type==='win'){
    const targetWin = dropEl.closest('.win-card[data-win]');
    if(!targetWin) return false;
    const fromIndex=profile().wins.findIndex(w=>w.id===dragInfo.id);
    const toIndex=profile().wins.findIndex(w=>w.id===targetWin.dataset.win);
    if(fromIndex<0 || toIndex<0 || fromIndex===toIndex) return false;
    const item=profile().wins.splice(fromIndex,1)[0];
    const rect=targetWin.getBoundingClientRect();
    let insertIndex=profile().wins.findIndex(w=>w.id===targetWin.dataset.win);
    if(clientY > rect.top + rect.height/2) insertIndex++;
    profile().wins.splice(Math.max(0,insertIndex),0,item);
    return true;
  }

  if(dragInfo.type==='sub'){
    const sub = removeSubById(dragInfo.id);
    if(!sub) return false;
    let targetWinId = dropEl.closest('.win-card[data-win]')?.dataset.win;
    let targetSub = dropEl.closest('.sub-block[data-sub]');
    const targetWin = profile().wins.find(w=>w.id===targetWinId);
    if(!targetWin) return false;

    if(targetSub && targetSub.dataset.sub !== dragInfo.id){
      const loc=locateSub(targetSub.dataset.sub);
      if(loc){
        const rect=targetSub.getBoundingClientRect();
        let idx=loc.index + (clientY > rect.top + rect.height/2 ? 1 : 0);
        loc.list.splice(idx,0,sub);
        return true;
      }
    }
    targetWin.subs.push(sub);
    return true;
  }

  if(dragInfo.type==='task'){
    const task = removeTaskById(dragInfo.id);
    if(!task) return false;

    const targetTask = dropEl.closest('.task-row[data-task]');
    if(targetTask && targetTask.dataset.task !== dragInfo.id){
      const loc=locateTask(targetTask.dataset.task);
      if(loc){
        const rect=targetTask.getBoundingClientRect();
        let idx=loc.index + (clientY > rect.top + rect.height/2 ? 1 : 0);
        loc.list.splice(idx,0,task);
        return true;
      }
    }

    const subBlock = dropEl.closest('.sub-block[data-sub]');
    if(subBlock){
      const list=getTaskContainer(subBlock.dataset.win, subBlock.dataset.sub);
      if(list){ list.push(task); return true; }
    }

    const winCard = dropEl.closest('.win-card[data-win]');
    if(winCard){
      const list=getTaskContainer(winCard.dataset.win,'main');
      if(list){ list.push(task); return true; }
    }
  }
  return false;
}

document.addEventListener('pointerdown', e=>{
  if(isInteractiveTarget(e.target)) return;
  const el=getDragElement(e.target);
  if(!el || state.activeTab!=='wins') return;
  dragPoint={x:e.clientX,y:e.clientY,el};
  clearTimeout(longPressTimer);
  longPressTimer=setTimeout(()=>startLongPressDrag(el,e.clientX,e.clientY),360);
},{passive:true});

document.addEventListener('pointermove', e=>{
  if(!dragPoint) return;
  if(!dragInfo && (Math.abs(e.clientX-dragPoint.x)>10 || Math.abs(e.clientY-dragPoint.y)>10)){
    clearTimeout(longPressTimer);
  }
  if(dragInfo){
    $$('.drop-hover').forEach(x=>x.classList.remove('drop-hover'));
    const el=document.elementFromPoint(e.clientX,e.clientY);
    const target=el?.closest('.task-row,.sub-block,.win-card');
    target?.classList.add('drop-hover');
  }
},{passive:true});

document.addEventListener('pointerup', e=>{
  clearTimeout(longPressTimer);
  if(dragInfo){
    const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.task-row,.sub-block,.win-card');
    const moved=moveDraggedItem(target,e.clientY);
    clearDragVisuals();
    dragInfo=null; dragPoint=null;
    if(moved){ save(); render(); }
    return;
  }
  dragPoint=null;
},{passive:true});

document.addEventListener('pointercancel', ()=>{
  clearTimeout(longPressTimer);
  dragInfo=null; dragPoint=null;
  clearDragVisuals();
},{passive:true});

function countTasks(wins){return wins.reduce((a,w)=>a+w.tasks.length+w.subs.reduce((b,s)=>b+s.tasks.length,0),0)}
function countAchievements(wins){return wins.reduce((a,w)=>a+w.tasks.filter(t=>t.done).length+w.subs.reduce((b,s)=>b+s.tasks.filter(t=>t.done).length,0),0)}
function findTask(wins,id){for(const w of wins){let t=w.tasks.find(t=>t.id===id); if(t)return t; for(const s of w.subs){t=s.tasks.find(t=>t.id===id); if(t)return t}}}


function getOrCreateSafeHoldingWin(excludeId){
  let holder = profile().wins.find(w => w.title === 'Moved Items' && w.id !== excludeId);
  if(!holder){
    holder = {id:uid(), title:'Moved Items', subs:[], tasks:[]};
    profile().wins.push(holder);
  }
  return holder;
}
function safeDeleteSub(winId, subId){
  const w = profile().wins.find(w => w.id === winId);
  if(!w) return;
  const index = w.subs.findIndex(s => s.id === subId);
  if(index < 0) return;
  const sub = w.subs.splice(index,1)[0];
  if(sub.tasks?.length){
    w.tasks.push(...sub.tasks);
  }
}
function safeDeleteWin(winId){
  const index = profile().wins.findIndex(w => w.id === winId);
  if(index < 0) return;
  const removed = profile().wins.splice(index,1)[0];
  const hasContent = (removed.tasks?.length || 0) + removed.subs.reduce((a,s)=>a+(s.tasks?.length||0),0);
  if(hasContent || removed.subs.length){
    const holder = getOrCreateSafeHoldingWin(removed.id);
    holder.tasks.push(...removed.tasks);
    holder.subs.push(...removed.subs);
  }
}


let waterDragActive = false;

function waterLabelFor(count){
  const ml = count * 250;
  return (ml>=1000 ? (ml/1000).toFixed(ml%1000===0?0:2)+'L' : ml+'ml') + ' / 2.5L';
}
function updateWaterVisual(count){
  count = Math.max(0, Math.min(10, Number(count)||0));
  profile().water[todayKey()] = count;
  save();
  const wrap = $('#waterDroplets');
  if(wrap){
    wrap.dataset.count = count;
    $$('.drop', wrap).forEach((d,i)=>d.classList.toggle('filled', i < count));
  }
  const amount = $('#waterAmount');
  if(amount) amount.textContent = waterLabelFor(count);
}
function waterCountFromPoint(x, y){
  const wrap = $('#waterDroplets');
  if(!wrap) return null;
  const rect = wrap.getBoundingClientRect();
  const verticalBuffer = 26;
  if(y < rect.top - verticalBuffer || y > rect.bottom + verticalBuffer) return null;
  if(x <= rect.left) return 0;
  if(x >= rect.right) return 10;
  const ratio = (x - rect.left) / rect.width;
  return Math.max(0, Math.min(10, Math.ceil(ratio * 10)));
}
function handleWaterPointer(e){
  const count = waterCountFromPoint(e.clientX, e.clientY);
  if(count === null) return;
  updateWaterVisual(count);
}
document.addEventListener('pointerdown', e=>{
  if(!e.target.closest?.('#waterDroplets,.drop')) return;
  waterDragActive = true;
  e.preventDefault();
  handleWaterPointer(e);
},{passive:false});
document.addEventListener('pointermove', e=>{
  if(!waterDragActive) return;
  e.preventDefault();
  handleWaterPointer(e);
},{passive:false});
document.addEventListener('pointerup', ()=>{
  if(!waterDragActive) return;
  waterDragActive = false;
  render();
},{passive:true});
document.addEventListener('pointercancel', ()=>{
  if(!waterDragActive) return;
  waterDragActive = false;
  render();
},{passive:true});


document.addEventListener('input', e=>{
  const el=e.target.closest?.('.check-editable[data-check-id]');
  if(!el) return;
  const item=profile().checklist.find(x=>x.id===el.dataset.checkId);
  if(item){
    item.text=(el.innerText||el.textContent||'').replace(/\n/g,' ').trim();
    save();
  }
});
document.addEventListener('keydown', e=>{
  const el=e.target.closest?.('.check-editable[data-check-id]');
  if(!el) return;
  if(e.key==='Enter'){
    e.preventDefault();
    el.blur();
  }
});
document.addEventListener('blur', e=>{
  const el=e.target.closest?.('.check-editable[data-check-id]');
  if(!el) return;
  const item=profile().checklist.find(x=>x.id===el.dataset.checkId);
  if(item){
    const text=(el.innerText||el.textContent||'').replace(/\n/g,' ').trim();
    item.text=text || 'New task';
    save();
  }
}, true);

// delegated interactions
document.addEventListener('click', e=>{
 const id=e.target.id, btn=e.target.closest('button'), row=e.target.closest('[data-id]'), winEl=e.target.closest('[data-win]'), subEl=e.target.closest('[data-sub]'), taskEl=e.target.closest('[data-task]');
 if(id==='switchProfile'||id==='switchProfile2')return setState(s=>{s.profile=s.profile==='Frankie'?'Jade':'Frankie'; s.lastActive=s.lastActive||{}; s.lastActive[s.profile]=Date.now(); seedNotesIfEmpty()});
 if(id==='addCheck'){const newId=uid(); focusCheckAfterRender=newId; setState(s=>profile().checklist.push({id:newId,text:'New task',done:false}))}
 if(btn?.classList.contains('drop')){setWater(Number(btn.dataset.water));}
 if(btn?.classList.contains('checkTick'))setState(s=>{const it=profile().checklist.find(x=>x.id===row.dataset.id); it.done=!it.done});
 
 if(btn?.classList.contains('delCheck'))setState(s=>profile().checklist=profile().checklist.filter(x=>x.id!==row.dataset.id));
 if(id==='addMain'){const newId=uid(); focusAfterRender={type:'win',id:newId}; setState(s=>profile().wins.push({id:newId,title:'',subs:[],tasks:[]}))}
 if(btn?.classList.contains('delWin'))setState(s=>safeDeleteWin(winEl.dataset.win));
 if(btn?.classList.contains('addSub')){const newId=uid(); focusAfterRender={type:'sub',id:newId}; setState(s=>profile().wins.find(w=>w.id===winEl.dataset.win).subs.push({id:newId,title:'',tasks:[]}))}
 if(btn?.classList.contains('addMainTask')){const newId=uid(); focusAfterRender={type:'task',id:newId}; setState(s=>profile().wins.find(w=>w.id===winEl.dataset.win).tasks.push({id:newId,text:'',done:false}))}
 if(btn?.classList.contains('addSubTask')){const newId=uid(); focusAfterRender={type:'task',id:newId}; setState(s=>profile().wins.find(w=>w.id===winEl.dataset.win).subs.find(x=>x.id===subEl.dataset.sub).tasks.push({id:newId,text:'',done:false}))}
 if(btn?.classList.contains('delSub'))setState(s=>safeDeleteSub(winEl.dataset.win, subEl.dataset.sub));
 if(btn?.classList.contains('winTick'))setState(s=>{const t=findTask(profile().wins,taskEl.dataset.task); t.done=!t.done});
 if(btn?.classList.contains('editTask')){focusEditable('task',taskEl.dataset.task)}
 if(btn?.classList.contains('delTask'))setState(s=>{for(const w of profile().wins){w.tasks=w.tasks.filter(t=>t.id!==taskEl.dataset.task); for(const sub of w.subs)sub.tasks=sub.tasks.filter(t=>t.id!==taskEl.dataset.task)}});
 if(btn?.classList.contains('mentor-item')){const text=btn.dataset.mentor; setState(s=>{s.mentorOpen=s.mentorOpen===text?null:text; s.mentorRecent=[{text,date:todayKey()},...s.mentorRecent.filter(x=>x.text!==text)].slice(0,8)})}
 if(id==='incStreak')setState(s=>{s.streak++; s.activeTab='home'; s.phoenixSeenDate='';});
 if(id==='replayAnim')setState(s=>{s.activeTab='home'; s.phoenixSeenDate='';});
 if(id==='resetStreak'){const p=prompt('Enter reset passcode'); if(p===state.resetPasscode && confirm('Reset shared streak?'))setState(s=>s.streak=0)}
 if(id==='changePass'){const p=prompt('New passcode'); if(p)setState(s=>s.resetPasscode=p)}
 if(id==='backupData')download('frankie-2-backup.json',JSON.stringify(state,null,2),'application/json')
 if(id==='restoreData')$('#restoreFile')?.click();
});
function bindNotes(){
 $$('.seg-btn').forEach(b=>b.onclick=()=>setState(s=>s.notesView=b.dataset.view));
 $('#saveNote')?.addEventListener('click',()=>{const v=$('#noteText').value; setState(s=>{profile().notes[state.selectedNoteDate]=v})});
 $('#copyNote')?.addEventListener('click',()=>navigator.clipboard?.writeText($('#noteText').value));
 $('#todayNote')?.addEventListener('click',()=>setState(s=>{s.selectedNoteDate=todayKey(); s.notesView='today'; s.calendarYear=new Date().getFullYear()}));
 $('#goDate')?.addEventListener('click',()=>{const k=parseDateInput(prompt('Enter date, e.g. 26/05/2026')); if(k)setState(s=>{s.selectedNoteDate=k; s.notesView='today'; s.calendarYear=Number(k.slice(0,4))})});
 $('#exportNotes')?.addEventListener('click',()=>{const notes=profile().notes; const md=Object.entries(notes).sort().map(([k,v])=>`# ${prettyDate(k)}\n\n${v}`).join('\n\n---\n\n'); download(`${state.profile}-notes.md`,md,'text/markdown')});
 $('#prevYear')?.addEventListener('click',()=>setState(s=>s.calendarYear--)); $('#nextYear')?.addEventListener('click',()=>setState(s=>s.calendarYear++));
 $$('.day').forEach(b=>b.onclick=()=>setState(s=>{s.selectedNoteDate=b.dataset.date; s.notesView='today'}));
 $$('.note-card[data-date]').forEach(card=>card.onclick=e=>{if(e.target.closest('.copyOne')){navigator.clipboard?.writeText(profile().notes[card.dataset.date]); return;} setState(s=>{s.selectedNoteDate=card.dataset.date; s.notesView='today'})});
 $('#restoreFile')?.addEventListener('change',async e=>{const f=e.target.files[0]; if(!f)return; const text=await f.text(); state=JSON.parse(text); save(); render()});
}

function readAttachment(file){
  return new Promise(resolve=>{
    if(!file) return resolve(null);
    if(file.type && file.type.startsWith('image/')){
      const reader=new FileReader();
      reader.onload=()=>{
        const img=new Image();
        img.onload=()=>{
          const max=1000, scale=Math.min(1,max/Math.max(img.width,img.height));
          const c=document.createElement('canvas');
          c.width=Math.round(img.width*scale); c.height=Math.round(img.height*scale);
          const ctx=c.getContext('2d'); ctx.drawImage(img,0,0,c.width,c.height);
          resolve(c.toDataURL('image/jpeg',.76));
        };
        img.onerror=()=>resolve(reader.result);
        img.src=reader.result;
      };
      reader.readAsDataURL(file);
    }else{
      const reader=new FileReader();
      reader.onload=()=>resolve(reader.result);
      reader.readAsDataURL(file);
    }
  });
}
async function savePayslipFromForm(){
  const f=state.finance, file=$('#fpFile')?.files?.[0], existing=f.payslips.find(x=>x.id===f.editPayslipId);
  const attachment=await readAttachment(file);
  const entry={
    id:existing?.id||uid(),
    person:f.person,
    payDate:$('#fpDate')?.value||todayKey(),
    employer:$('#fpEmployer')?.value||'',
    periodFrom:$('#fpFrom')?.value||'',
    periodTo:$('#fpTo')?.value||'',
    hours:Number($('#fpHours')?.value||0),
    gross:Number($('#fpGross')?.value||0),
    net:Number($('#fpNet')?.value||0),
    tax:Number($('#fpTax')?.value||0),
    superAmount:Number($('#fpSuper')?.value||0),
    notes:$('#fpNotes')?.value||'',
    attachment:attachment||existing?.attachment||null
  };
  setState(s=>{const i=s.finance.payslips.findIndex(x=>x.id===entry.id); if(i>-1)s.finance.payslips[i]=entry; else s.finance.payslips.push(entry); s.finance.editPayslipId=null;});
}
function bindFinance(){
  $$('[data-finance-view]').forEach(b=>b.onclick=()=>setState(s=>s.finance.view=b.dataset.financeView));
  $$('[data-finance-person]').forEach(b=>b.onclick=()=>setState(s=>{s.finance.person=b.dataset.financePerson; s.finance.editPayslipId=null;}));
  $('#savePayslip')?.addEventListener('click',savePayslipFromForm);
  $('#clearPayslipForm')?.addEventListener('click',()=>setState(s=>s.finance.editPayslipId=null));
  $$('.editPayslip').forEach(b=>b.onclick=e=>{const id=e.target.closest('[data-payslip]').dataset.payslip; setState(s=>s.finance.editPayslipId=id)});
  $$('.delPayslip').forEach(b=>b.onclick=e=>{const id=e.target.closest('[data-payslip]').dataset.payslip; setState(s=>s.finance.payslips=s.finance.payslips.filter(x=>x.id!==id))});
  $('#calcRateSelect')?.addEventListener('change',e=>{const r=state.finance.rates.find(x=>x.id===e.target.value); if(r){$('#calcLabel').value=`${r.employer} - ${r.label}`; $('#calcRate').value=r.rate;}});
  $('#addCalcLine')?.addEventListener('click',()=>{const label=$('#calcLabel').value||'Pay line', hours=Number($('#calcHours').value||0), rate=Number($('#calcRate').value||0); if(!hours&&!rate)return; setState(s=>s.finance.calcLines.push({id:uid(),label,hours,rate}))});
  $('#clearCalc')?.addEventListener('click',()=>setState(s=>s.finance.calcLines=[]));
  $$('.delCalc').forEach(b=>b.onclick=e=>{const id=e.target.closest('[data-calc]').dataset.calc; setState(s=>s.finance.calcLines=s.finance.calcLines.filter(x=>x.id!==id))});
  $('#saveCalcAsPayslip')?.addEventListener('click',()=>{const total=state.finance.calcLines.reduce((a,l)=>a+(Number(l.hours)||0)*(Number(l.rate)||0),0), hours=state.finance.calcLines.reduce((a,l)=>a+Number(l.hours||0),0); if(!total)return; setState(s=>{s.finance.payslips.push({id:uid(),person:s.finance.person,payDate:todayKey(),employer:'Calculator estimate',periodFrom:'',periodTo:'',hours,gross:total,net:0,tax:0,superAmount:0,notes:'Saved from calculator. Enter actual net pay once payslip arrives.',attachment:null}); s.finance.view='payslips'; s.finance.calcLines=[];})});
  $('#addRate')?.addEventListener('click',()=>{const employer=$('#rateEmployer').value||'Employer', label=$('#rateLabel').value||'Rate', rate=Number($('#rateAmount').value||0); setState(s=>s.finance.rates.push({id:uid(),person:s.finance.person,employer,label,rate}))});
  $$('.delRate').forEach(b=>b.onclick=e=>{const id=e.target.closest('[data-rate]').dataset.rate; setState(s=>s.finance.rates=s.finance.rates.filter(x=>x.id!==id))});
  $('#customWeeks')?.addEventListener('change',e=>setState(s=>s.finance.customWeeks=Math.max(1,Number(e.target.value||8))));
}

function download(name,content,type){const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([content],{type})); a.download=name; a.click(); URL.revokeObjectURL(a.href)}
if('serviceWorker' in navigator)navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
render();
