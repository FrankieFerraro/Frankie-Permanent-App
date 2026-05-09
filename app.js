(function(){
  'use strict';

  const APP_KEY = 'frankie2_life_os_v2';
  const DAILY_KEY_PREFIX = 'frankie2_daily_';
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const defaults = {
    startingInvestments: 60000,
    weeklyInvestment: 521,
    annualReturn: 8,
    projectionYears: 20,
    targetIncome: 65000,
    propertyValue: 650000,
    loanBalance: 600000,
    weeklyRent: 500,
    interestRate: 6.2,
    annualCosts: 6500
  };

  let state = loadState();
  let projection = [];

  function loadState(){
    try{
      const raw = localStorage.getItem(APP_KEY);
      return raw ? {...defaults, ...JSON.parse(raw)} : {...defaults};
    }catch(e){ return {...defaults}; }
  }

  function saveState(){
    localStorage.setItem(APP_KEY, JSON.stringify(state));
  }

  function n(id){
    const el = $(id);
    const value = Number(el ? el.value : 0);
    return Number.isFinite(value) ? value : 0;
  }

  function money(value){
    return new Intl.NumberFormat('en-AU', {style:'currency', currency:'AUD', maximumFractionDigits:0}).format(value || 0);
  }

  function percent(value){
    return `${Math.max(0, Math.min(100, value)).toFixed(0)}%`;
  }

  function todayKey(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function initInputs(){
    $$('[data-save]').forEach(input => {
      if(state[input.id] !== undefined) input.value = state[input.id];
      input.addEventListener('input', () => {
        state[input.id] = n(input.id);
        saveState();
        calculateAll();
      });
      input.addEventListener('change', () => {
        state[input.id] = n(input.id);
        saveState();
        calculateAll();
      });
    });
  }

  function calculateMoney(){
    const start = n('startingInvestments');
    const weekly = n('weeklyInvestment');
    const annualReturn = n('annualReturn') / 100;
    const years = Math.max(1, Math.min(60, n('projectionYears')));
    const targetIncome = Math.max(0, n('targetIncome'));
    const monthlyDeposit = weekly * 52 / 12;
    const monthlyRate = Math.pow(1 + annualReturn, 1/12) - 1;
    let balance = start;
    projection = [{year:0, balance}];
    for(let month = 1; month <= years * 12; month++){
      balance = balance * (1 + monthlyRate) + monthlyDeposit;
      if(month % 12 === 0) projection.push({year: month / 12, balance});
    }
    const contributed = start + weekly * 52 * years;
    const growth = balance - contributed;
    const monthlyPassive = balance * 0.04 / 12;
    const targetPortfolio = targetIncome > 0 ? targetIncome / 0.04 : 0;
    const progress = targetPortfolio > 0 ? (balance / targetPortfolio) * 100 : 0;

    setText('finalPortfolio', money(balance));
    setText('totalContributed', money(contributed));
    setText('portfolioGrowth', money(growth));
    setText('monthlyPassive', money(monthlyPassive));
    setText('dashFinal', money(balance));
    setText('fireProgressText', percent(progress));
    setWidth('fireProgressBar', `${Math.max(0, Math.min(100, progress))}%`);

    return {balance, contributed, growth, monthlyPassive, progress};
  }

  function calculateProperty(){
    const value = n('propertyValue');
    const loan = n('loanBalance');
    const rent = n('weeklyRent') * 52;
    const interest = loan * (n('interestRate') / 100);
    const costs = n('annualCosts');
    const equity = Math.max(0, value * 0.8 - loan);
    const cashflow = rent - interest - costs;

    setText('usableEquity', money(equity));
    setText('dashEquity', money(equity));
    setText('grossRent', money(rent));
    setText('annualInterest', money(interest));
    setText('propertyCashflow', money(cashflow));

    const cashEl = $('propertyCashflow');
    if(cashEl) cashEl.style.color = cashflow >= 0 ? 'var(--green)' : 'var(--red)';

    return {equity, rent, interest, cashflow};
  }

  function calculateDaily(){
    const boxes = $$('[data-daily]');
    const completed = boxes.filter(b => b.checked).length;
    const score = boxes.length ? completed / boxes.length * 100 : 0;
    setText('dashToday', percent(score));
    setText('lifeScore', Math.round(score));
    const ring = $('scoreRing');
    if(ring){
      ring.style.background = `conic-gradient(var(--gold) 0 ${score * 3.6}deg, rgba(255,255,255,.11) ${score * 3.6}deg 360deg)`;
    }
    setText('dashJade', percent(Math.min(100, calculateMoney().progress / 4))); // rough 4-year focus signal
    updateHeatmap(score);
    return score;
  }

  function calculateAll(){
    calculateMoney();
    calculateProperty();
    drawChart();
    calculateDaily();
  }

  function setText(id, text){ const el = $(id); if(el) el.textContent = text; }
  function setWidth(id, w){ const el = $(id); if(el) el.style.width = w; }

  function drawChart(){
    const canvas = $('assetChart');
    if(!canvas || !projection.length) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const pad = 48;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,.025)';
    ctx.fillRect(0,0,w,h);

    const max = Math.max(...projection.map(d=>d.balance), 1);
    ctx.strokeStyle = 'rgba(255,255,255,.11)';
    ctx.lineWidth = 1;
    for(let i=0;i<5;i++){
      const y = pad + (h - pad*2) * i / 4;
      ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(w-pad,y); ctx.stroke();
    }

    const grad = ctx.createLinearGradient(0,0,w,0);
    grad.addColorStop(0,'#e9c46a'); grad.addColorStop(.55,'#7ef0b2'); grad.addColorStop(1,'#83bfff');
    ctx.beginPath();
    projection.forEach((d,i)=>{
      const x = pad + (w - pad*2) * (d.year / projection[projection.length-1].year);
      const y = h - pad - (h - pad*2) * (d.balance / max);
      if(i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.strokeStyle = grad;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.fillStyle = '#aeb6c7';
    ctx.font = '18px system-ui';
    ctx.fillText('Projected portfolio', pad, 30);
    ctx.fillStyle = '#e9c46a';
    ctx.fillText(money(max), w - pad - 140, 30);
    ctx.fillStyle = '#aeb6c7';
    ctx.font = '14px system-ui';
    ctx.fillText('Year 0', pad, h - 15);
    ctx.fillText(`Year ${projection[projection.length-1].year}`, w - pad - 70, h - 15);
  }

  function initTabs(){
    $$('.tabs button').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.tabs button').forEach(b => b.classList.remove('active'));
        $$('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = $(btn.dataset.tab);
        if(panel) panel.classList.add('active');
        setTimeout(drawChart, 80);
      });
    });
  }

  function initDaily(){
    const key = DAILY_KEY_PREFIX + todayKey();
    setText('todayDate', new Date().toLocaleDateString('en-AU', {weekday:'long', day:'numeric', month:'short'}));
    let daily = {};
    try{ daily = JSON.parse(localStorage.getItem(key) || '{}'); }catch(e){ daily = {}; }
    $$('[data-daily]').forEach(box => {
      box.checked = Boolean(daily[box.dataset.daily]);
      box.addEventListener('change', () => {
        daily[box.dataset.daily] = box.checked;
        localStorage.setItem(key, JSON.stringify(daily));
        calculateDaily();
      });
    });
    const reset = $('resetDaily');
    if(reset){
      reset.addEventListener('click', () => {
        localStorage.removeItem(key);
        $$('[data-daily]').forEach(box => box.checked = false);
        calculateDaily();
      });
    }
  }

  function updateHeatmap(score){
    const heatmap = $('heatmap');
    if(!heatmap) return;
    heatmap.innerHTML = '';
    const active = Math.round(score / 100 * 42);
    for(let i=0;i<42;i++){
      const d = document.createElement('div');
      if(i < active) d.classList.add('on');
      heatmap.appendChild(d);
    }
  }

  function mentorResponse(mode, custom=''){
    const lower = custom.toLowerCase();
    if(mode === 'behind' || lower.includes('behind')) return `You are not behind. You are under-systemised.\n\nToday’s correction:\n1. Pick the one highest leverage action.\n2. Do it before comfort activities.\n3. Record the win.\n4. Repeat tomorrow.\n\nBlunt truth - the fastest way forward is not panic. It is boring consistency stacked daily.`;
    if(mode === 'discipline' || lower.includes('discipline')) return `Discipline mode.\n\nYour minimum today:\n1. Move your body for 25 minutes.\n2. Eat clean for the next meal.\n3. Do one money action.\n4. Do one career action.\n5. Sleep like a man with a mission.\n\nRule - do not negotiate with the weak version of yourself.`;
    if(mode === 'money' || lower.includes('money') || lower.includes('invest')) return `Money mode.\n\nDo not make a decision from escape energy or prove-it energy.\n\nProcess:\n1. Write the numbers.\n2. Check downside first.\n3. Make sure cashflow survives.\n4. Only invest inside a plan.\n\nThe goal is not to look rich fast. The goal is to become financially unbreakable.`;
    if(mode === 'career' || lower.includes('real estate') || lower.includes('career')) return `Real estate mode.\n\nThis week:\n1. Study one suburb deeply.\n2. Practise one listing presentation.\n3. Speak to 10 people.\n4. Learn one objection response.\n5. Follow up like a professional.\n\nConfidence will come after reps, not before them.`;
    if(mode === 'family' || lower.includes('jade') || lower.includes('family')) return `Family mode.\n\nRemember the actual mission - Jade and your future kids need your stability more than your stress.\n\nToday:\n1. Communicate clearly.\n2. Do not bring panic home.\n3. Make the plan feel safe.\n4. Be present, not just productive.\n\nA peaceful home is part of the wealth plan.`;
    return `Today’s operating plan.\n\n1. Health - train or move.\n2. Wealth - update one number or buy one asset inside the plan.\n3. Career - take one real estate action.\n4. Family - give genuine presence.\n5. Purpose - help one person.\n\nThat is the game. One clean day at a time.`;
  }

  function initMentor(){
    $$('[data-mentor]').forEach(btn => {
      btn.addEventListener('click', () => setText('mentorOutput', mentorResponse(btn.dataset.mentor)));
    });
    const custom = $('customMentor');
    if(custom){ custom.addEventListener('click', () => setText('mentorOutput', mentorResponse('custom', $('mentorInput').value || ''))); }
  }

  function initBackup(){
    const exportBtn = $('exportData');
    if(exportBtn){
      exportBtn.addEventListener('click', () => {
        const payload = {app:'Frankie 2.0 Life OS', version:'2.0', exportedAt:new Date().toISOString(), state, daily: collectDaily()};
        const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'frankie-2-life-os-backup.json'; a.click();
        URL.revokeObjectURL(url);
        setText('backupStatus', 'Backup exported. Keep this file safe.');
      });
    }
    const importEl = $('importData');
    if(importEl){
      importEl.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        try{
          const data = JSON.parse(await file.text());
          if(data.state){
            state = {...defaults, ...data.state};
            saveState();
            initInputs();
            calculateAll();
            setText('backupStatus', 'Backup imported successfully.');
          }
        }catch(err){ setText('backupStatus', 'Import failed - file was not valid JSON.'); }
      });
    }
    const clear = $('clearData');
    if(clear){
      clear.addEventListener('click', () => {
        if(confirm('Clear all saved Frankie 2.0 data on this device?')){
          Object.keys(localStorage).filter(k => k.startsWith('frankie2_')).forEach(k => localStorage.removeItem(k));
          state = {...defaults}; saveState(); initInputs(); initDaily(); calculateAll();
          setText('backupStatus', 'Saved data cleared.');
        }
      });
    }
  }

  function collectDaily(){
    const out = {};
    Object.keys(localStorage).filter(k => k.startsWith(DAILY_KEY_PREFIX)).forEach(k => out[k] = JSON.parse(localStorage.getItem(k) || '{}'));
    return out;
  }

  function initPWA(){
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    try{
      initInputs(); initTabs(); initDaily(); initMentor(); initBackup(); initPWA(); calculateAll();
      const status = $('engineStatus');
      if(status){ status.textContent = 'Engine ready - inputs are live'; status.classList.remove('loading'); status.classList.add('ready'); }
    }catch(err){
      const status = $('engineStatus');
      if(status){ status.textContent = 'Engine error - ' + err.message; status.classList.remove('loading'); }
      console.error(err);
    }
  });
})();
