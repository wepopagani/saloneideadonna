'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORE_KEY = 'ideaDonna.demo.bookings.v1';
const readRecords = () => { try { const v = JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); return Array.isArray(v) ? v.filter(r => r && typeof r.id === 'string' && typeof r.date === 'string' && typeof r.time === 'string' && Number.isFinite(r.duration)) : []; } catch { return []; } };
const writeRecords = records => { try { localStorage.setItem(STORE_KEY, JSON.stringify(records)); return true; } catch { return false; } };
let toastTimer;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500); }
$('#year').textContent = new Date().getFullYear();
const menuButton = $('.menu-toggle');
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu'); $('#nav').classList.toggle('open', open); });
$$('#nav a').forEach(link => link.addEventListener('click', () => { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Apri menu'); $('#nav').classList.remove('open'); }));
window.addEventListener('scroll', () => $('#header').classList.toggle('scrolled', scrollY > 20), {passive: true});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold: .08});
  $$('.reveal').forEach(el => { el.classList.add('js-reveal'); observer.observe(el); });
  const bookObserver = new IntersectionObserver(entries => $('.mobile-book').classList.toggle('hidden', entries[0].isIntersecting), {threshold: .12});
  bookObserver.observe($('#prenota'));
}
$$('.service-row').forEach(detail => detail.addEventListener('toggle', () => { if (detail.open) $$('.service-row').forEach(other => { if (other !== detail) other.open = false; }); }));

const COLORS = [
  {name:'Espresso',base:'#39291f',light:'#785744',dark:'#1c1615',note:'PROFONDO, DECISO, SEMPLICEMENTE TU.'},
  {name:'Cioccolato',base:'#69432f',light:'#b38a62',dark:'#332117',note:'CALDO, NATURALE, SENZA TEMPO.'},
  {name:'Caramello',base:'#b17b4c',light:'#e7bc80',dark:'#69402b',note:'UN TOCCO DI LUCE, TUTTO TUO.'},
  {name:'Biondo miele',base:'#d2ae70',light:'#f6dfad',dark:'#8f673f',note:'RIFLESSI DORATI, VOGLIA DI SOLE.'},
  {name:'Rame',base:'#a34d2d',light:'#df9a63',dark:'#602d22',note:'LA SFUMATURA DI CHI AMA OSARE.'},
  {name:'Rosa cipria',base:'#bc8590',light:'#edc4c6',dark:'#704550',note:'UN’IDEA DIVERSA, DELICATAMENTE TUA.'}
];
const STYLE_OPTIONS = {donna:[{id:'waves',name:'Onde morbide'},{id:'straight',name:'Liscio setoso'},{id:'bob',name:'Caschetto'}],uomo:[{id:'natural',name:'Naturale'},{id:'texture',name:'Texturizzato'},{id:'short',name:'Corto classico'}]};
let look = {gender:'donna',style:'waves',color:2};
function hairSVG(style, colorIndex, id, mini = false) {
  const c = COLORS[colorIndex];
  const male = ['natural','texture','short'].includes(style);
  const bob = style === 'bob';
  const waves = style === 'waves';
  let outline = male ? 'M80 154 C64 113 75 62 115 48 C147 31 198 42 219 73 C234 98 228 135 221 154 L208 151 L204 115 C180 126 137 99 99 122 L94 155Z' : bob ? 'M150 40 C88 40 59 79 61 143 C63 181 45 213 57 239 Q102 265 150 249 Q199 266 244 239 C256 214 236 179 239 139 C242 77 213 40 150 40Z' : waves ? 'M150 39 C91 38 63 77 62 128 C59 171 41 194 55 226 C66 255 41 275 58 300 C79 322 65 335 82 345 Q112 353 137 337 Q166 358 189 342 Q229 355 243 323 C253 300 230 286 246 256 C263 226 239 205 241 172 C249 99 221 41 150 39Z' : 'M150 39 C86 39 61 82 61 137 L57 332 Q101 348 150 333 Q199 349 242 332 L239 137 C239 79 211 39 150 39Z';
  let strands = '';
  const count = mini ? 24 : 88;
  for(let i=0;i<count;i++) {
    const t = i/(count-1), x = 60 + t*180;
    const startY=45+Math.pow(Math.abs(t-.5)*2,2)*84;
    let d;
    if (male) {
      const shift = style === 'texture' ? Math.sin(i*2.1)*13 : style === 'short' ? 0 : Math.sin(i*.5)*6;
      d=`M${x} 150 C${x-18} 111 ${x+20+shift} 64 ${149+(t-.5)*48} 45`;
    } else if(waves) {
      const a=11+Math.sin(t*8)*7, end=343+Math.sin(t*17)*12;
      d=`M${x} ${startY} C${x-20} 110 ${x+22} 125 ${x} 166 C${x-a*2} 201 ${x-a} 216 ${x+8} 237 C${x+a*2} 272 ${x+a} 287 ${x-8} 312 Q${x-20} 333 ${x} ${end}`;
    } else if(bob) d=`M${x} ${startY} C${x-13} 114 ${x+10} 177 ${x} 219 Q${x-4} 240 ${x+(t-.5)*9} 258`;
    else d=`M${x} ${startY} C${x-10} 130 ${x+9} 220 ${x+(t-.5)*7} ${339+Math.sin(t*8)*6}`;
    const col = i%4===0?c.light:i%3===0?c.dark:c.base;
    strands+=`<path d="${d}" fill="none" stroke="${col}" stroke-width="${mini?1.5:(i%4===0?1.1:1.8)}" opacity="${i%4===0?.67:.56}"/>`;
  }
  const bust = male ? '<path d="M119 177 L117 226 Q85 229 47 258 L31 385 L269 385 L253 258 Q216 230 183 226 L181 177Z" fill="#ddbea3"/><path d="M115 226 Q150 254 185 226 L254 260 L269 385 H31 L46 260Z" fill="#342b31"/><path d="M115 225 L150 253 L185 225" stroke="#6c5c61" fill="none" stroke-width="3"/>' : '<path d="M120 180 L117 271 Q100 282 58 295 C32 306 20 345 13 395 H287 C280 345 268 306 242 295 L183 272 L180 180Z" fill="#e3c6ad"/><path d="M71 291 Q150 344 229 291 L256 311 Q278 354 287 395 H13 Q22 354 44 311Z" fill="#30282d"/><path d="M71 291 Q150 344 229 291" fill="none" stroke="#a99286" stroke-width="2"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" aria-hidden="true"><defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2=".3"><stop stop-color="${c.dark}"/><stop offset=".22" stop-color="${c.base}"/><stop offset=".43" stop-color="${c.light}"/><stop offset=".58" stop-color="${c.base}"/><stop offset=".82" stop-color="${c.light}"/><stop offset="1" stop-color="${c.dark}"/></linearGradient><linearGradient id="${id}root" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${c.dark}" stop-opacity=".65"/><stop offset=".6" stop-color="${c.dark}" stop-opacity="0"/></linearGradient><clipPath id="${id}clip"><path d="${outline}"/></clipPath></defs>${bust}<ellipse cx="150" cy="133" rx="62" ry="86" fill="#e3c6ad"/><path d="${outline}" fill="url(#${id}g)"/><g clip-path="url(#${id}clip)">${strands}<path d="${outline}" fill="url(#${id}root)"/></g>${!male?'<path d="M151 42 Q145 68 146 87" stroke="'+c.dark+'" fill="none" stroke-width="1.7" opacity=".6"/>':''}</svg>`;
}
function renderLook(animate = false) {
  const selected = STYLE_OPTIONS[look.gender].find(s => s.id===look.style);
  const color=COLORS[look.color];
  $('#style-options').innerHTML = STYLE_OPTIONS[look.gender].map((s,i) => `<button class="style-choice ${s.id===look.style?'active':''}" data-style="${s.id}" aria-pressed="${s.id===look.style}">${hairSVG(s.id,look.color,'mini'+i,true)}<span>${s.name}</span></button>`).join('');
  $('#color-options').innerHTML = COLORS.map((c,i) => `<button class="color-swatch ${i===look.color?'active':''}" style="--swatch:${c.base}" data-color="${i}" aria-label="${c.name}" title="${c.name}" aria-pressed="${i===look.color}"></button>`).join('');
  $('#hair-model').innerHTML=hairSVG(look.style,look.color,'main');
  $('#hair-model').setAttribute('aria-label',`Anteprima illustrata: ${selected.name}, ${color.name}`);
  $('#color-name').textContent=color.name;
  $('.chosen-color small').textContent=color.note;
  $('#stage-label').innerHTML=`${selected.name} <span>+ ${color.name}</span>`;
  $$('[data-gender]').forEach(b=>{const active=b.dataset.gender===look.gender;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  if(animate) { $('#hair-model').classList.remove('changing'); void $('#hair-model').offsetWidth; $('#hair-model').classList.add('changing'); }
}
$('#style-options').addEventListener('click', e=>{const b=e.target.closest('[data-style]');if(b){look.style=b.dataset.style;renderLook(true);}});
$('#color-options').addEventListener('click', e=>{const b=e.target.closest('[data-color]');if(b){look.color=Number(b.dataset.color);renderLook(true);}});
$$('[data-gender]').forEach(b=>b.addEventListener('click',()=>{look.gender=b.dataset.gender;look.style=STYLE_OPTIONS[look.gender][0].id;renderLook(true);}));
renderLook();
const gallery = [
 {image:'assets/straight.jpg',name:'Luce naturale',alt:'Capelli lisci con sfumature bionde naturali'},
 {image:'assets/hero.jpg',name:'Onde di luce',alt:'Onde morbide con balayage biondo e radici naturali'},
 {image:'assets/copper.jpg',name:'Riflessi ramati',alt:'Acconciatura con ricci lunghi e riflessi ramati'}
];
$('#gallery-grid').innerHTML=gallery.map((g,i)=>`<button class="gallery-item" data-gallery="${i}" aria-label="Ingrandisci: ${g.name}"><img src="${g.image}" alt="${g.alt}" loading="lazy"><div class="gallery-caption"><span>${g.name}</span><small aria-hidden="true">↗</small></div></button>`).join('');
$('#gallery-grid').addEventListener('click',e=>{const b=e.target.closest('[data-gallery]');if(!b)return;const g=gallery[Number(b.dataset.gallery)];$('#gallery-dialog img').src=g.image;$('#gallery-dialog img').alt=g.alt;$('.gallery-dialog-caption').textContent=g.name;$('#gallery-dialog').showModal();});
$$('dialog').forEach(d=>{ $('.dialog-close',d).addEventListener('click',()=>d.close()); d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}); });

const SERVICES = [
 {id:'taglio-donna',name:'Taglio donna & piega',duration:60,detail:'Una nuova forma, il tuo stile.'},
 {id:'taglio-uomo',name:'Taglio uomo',duration:30,detail:'Taglio e styling su misura.'},
 {id:'piega',name:'Piega',duration:45,detail:'Il piacere di sentirsi in ordine.'},
 {id:'colore',name:'Colore & piega',duration:120,detail:'La sfumatura che ti somiglia.'},
 {id:'balayage',name:'Balayage',duration:180,detail:'Luce e riflessi personalizzati.'},
 {id:'trattamento',name:'Trattamento capelli',duration:60,detail:'Una coccola per la tua chioma.'}
];
const zurichParts = () => Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Zurich',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
const nowParts=zurichParts();
const todayISO=`${nowParts.year}-${nowParts.month}-${nowParts.day}`;
const dateObj = iso => {const [y,m,d]=iso.split('-').map(Number);return new Date(y,m-1,d,12);};
const toISO = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const dateLabel=iso=>new Intl.DateTimeFormat('it-CH',{weekday:'long',day:'numeric',month:'long'}).format(dateObj(iso));
const durationLabel=min=>min>=60?(Math.floor(min/60)+' h'+(min%60?' '+(min%60)+' min':'')):min+' min';
const timeMinutes=t=>{const [h,m]=t.split(':').map(Number);return h*60+m;};
const minutesTime=m=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
const currentMonth=new Date(Number(nowParts.year),Number(nowParts.month)-1,1,12);
const maxMonth=new Date(currentMonth.getFullYear(),currentMonth.getMonth()+6,1,12);
let booking={step:1,service:'taglio-donna',date:null,time:null,month:new Date(currentMonth),look:'',form:{name:'',phone:'',email:'',notes:''},record:null};
const selectedService=()=>SERVICES.find(s=>s.id===booking.service);
function slotsFor(date,service=selectedService()) {
  const d=dateObj(date),day=d.getDay();
  if(!date || day===0 || day===1 || date<todayISO)return [];
  const parts=zurichParts(),liveToday=`${parts.year}-${parts.month}-${parts.day}`;
  const close=day===6?1020:1080;
  const existing=readRecords().filter(r=>r.date===date && r.status!=='annullata');
  const blocks=[{start:day%2?660:780,end:day%2?720:840}]; // Solo disponibilità simulate della demo.
  existing.forEach(r=>blocks.push({start:timeMinutes(r.time),end:timeMinutes(r.time)+r.duration}));
  const result=[];
  for(let m=510;m+service.duration<=close;m+=30){
    if(date===liveToday && m<=Number(parts.hour)*60+Number(parts.minute))continue;
    if(blocks.some(b=>m<b.end&&m+service.duration>b.start))continue;
    result.push(minutesTime(m));
  }
  return result;
}
function isBookable(date){return slotsFor(date).length>0;}
function recap(){const s=selectedService();return `<aside class="booking-recap"><span>IL TUO MOMENTO</span><h4>${s.name}</h4><p>Circa ${durationLabel(s.duration)} · Agno${booking.look?'<br>'+escapeHTML(booking.look):''}</p><p class="recap-date">${booking.date?escapeHTML(dateLabel(booking.date)):'Scegli un giorno'}${booking.time?'<br>ore '+booking.time:''}</p></aside>`;}
function updateSteps(){ $$('[data-step-label]').forEach(el=>{const active=Number(el.dataset.stepLabel)===booking.step;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');}); }
function renderBooking(focus = false) {
  updateSteps();
  const target=$('#booking-content');
  if(booking.step===1){
    target.innerHTML=`<h3 class="booking-step-title" tabindex="-1">Da dove cominciamo?</h3><p class="booking-step-subtitle">Scegli il servizio che desideri.${booking.look?' La tua idea: '+escapeHTML(booking.look)+'.':''}</p><div class="service-choices" role="group" aria-label="Scegli un servizio">${SERVICES.map(s=>`<button class="book-service ${booking.service===s.id?'selected':''}" data-service="${s.id}" aria-pressed="${booking.service===s.id}"><span>${s.name}<small>Circa ${durationLabel(s.duration)}</small></span><i class="radio" aria-hidden="true"></i></button>`).join('')}</div><div class="booking-bottom"><p>Durate indicative per questa demo. Prezzi e tempi effettivi si concordano con il salone.</p><button class="button" data-action="next">Scegli giorno e ora <span>→</span></button></div>`;
  } else if(booking.step===2){
    const year=booking.month.getFullYear(),month=booking.month.getMonth();
    const monthText=new Intl.DateTimeFormat('it-CH',{month:'long',year:'numeric'}).format(booking.month);
    const first=(new Date(year,month,1,12).getDay()+6)%7;
    const days=new Date(year,month+1,0,12).getDate();
    let cells=Array(first).fill('<span></span>').join('');
    for(let n=1;n<=days;n++){const iso=toISO(new Date(year,month,n,12));const disabled=!isBookable(iso);cells+=`<button class="calendar-day ${booking.date===iso?'selected':''}" data-date="${iso}" ${disabled?'disabled':''} aria-pressed="${booking.date===iso}" aria-label="${escapeHTML(dateLabel(iso))}${disabled?', non disponibile':''}">${n}</button>`;}
    target.innerHTML=`<h3 class="booking-step-title" tabindex="-1">Facciamo spazio alla tua idea.</h3><p class="booking-step-subtitle">Scegli giorno e orario. Le disponibilità sono simulate per la demo.</p><div class="calendar-layout"><div class="calendar"><div class="month-heading"><span style="text-transform:capitalize">${monthText}</span><div class="month-controls"><button data-action="prev-month" aria-label="Mese precedente" ${booking.month<=currentMonth?'disabled':''}>‹</button><button data-action="next-month" aria-label="Mese successivo" ${booking.month>=maxMonth?'disabled':''}>›</button></div></div><div class="calendar-grid">${['L','M','M','G','V','S','D'].map((v,i)=>`<span class="weekday" aria-label="${['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'][i]}">${v}</span>`).join('')}${cells}</div></div><div><p class="time-title">${booking.date?escapeHTML(dateLabel(booking.date)):'Prima scegli il tuo giorno'}</p><div class="time-options" role="group" aria-label="Orari disponibili">${booking.date?slotsFor(booking.date).map(t=>`<button class="time-slot ${booking.time===t?'selected':''}" data-time="${t}" aria-pressed="${booking.time===t}">${t}</button>`).join(''):'<p class="muted" style="font-size:10px;grid-column:1/-1">Trovi gli orari qui, dopo aver selezionato una data.</p>'}</div></div>${recap()}</div><div class="booking-bottom"><button class="back-button" data-action="back">← Torna ai servizi</button><button class="button" data-action="next" ${!booking.date||!booking.time?'disabled':''}>Continua <span>→</span></button></div>`;
  } else if(booking.step===3){
    const f=booking.form;
    target.innerHTML=`<h3 class="booking-step-title" tabindex="-1">Ci manca solo il tuo nome.</h3><p class="booking-step-subtitle">È una prova: nessun messaggio viene inviato al salone.</p><form id="booking-form"><div class="details-layout"><div class="form-fields"><label class="field">Nome e cognome *<input name="name" value="${escapeHTML(f.name)}" required maxlength="90" autocomplete="name" placeholder="Come ti chiami?"></label><label class="field">Telefono *<input name="phone" value="${escapeHTML(f.phone)}" required type="tel" maxlength="30" autocomplete="tel" placeholder="+41 ..."></label><label class="field full">E-mail (facoltativa)<input name="email" value="${escapeHTML(f.email)}" type="email" maxlength="150" autocomplete="email" placeholder="La tua e-mail"></label><label class="field full">La tua idea (facoltativa)<textarea name="notes" maxlength="600" placeholder="Un desiderio, una domanda, qualcosa da sapere…">${escapeHTML(f.notes)}</textarea></label><label class="consent"><input name="consent" type="checkbox" required><span>Ho capito che questa è una demo: la richiesta sarà salvata solo in questo browser e non sarà inviata al salone. Per provare posso usare dati di fantasia.</span></label></div>${recap()}</div><p class="form-errors" id="form-errors" role="alert"></p><div class="booking-bottom"><button type="button" class="back-button" data-action="back">← Torna a giorno e ora</button><button class="button" type="submit">Salva richiesta demo <span>↗</span></button></div></form>`;
    $('#booking-form').addEventListener('submit', submitBooking);
    $('#booking-form').addEventListener('input',saveDraft);
  } else if(booking.step===4){
    const r=booking.record;
    target.innerHTML=`<div class="booking-success"><div class="success-icon" aria-hidden="true">✓</div><h3>La tua idea è in agenda.<br><em>Per ora, nella demo.</em></h3><p>Grazie, ${escapeHTML(r.name)}. La richiesta è salvata in questo browser.<br>Non è un appuntamento confermato e il salone non ha ricevuto messaggi.</p><div class="success-summary">${escapeHTML(r.serviceName)} · ${escapeHTML(dateLabel(r.date))} · ore ${r.time}</div><div class="success-buttons"><a class="button" href="tel:+41916051359">Prenota davvero: 091 605 13 59 <span>↗</span></a><button class="text-link" data-action="ics">Aggiungi prova al calendario <span>↓</span></button><button class="text-link" data-action="restart">Fai un’altra prova <span>↻</span></button></div></div>`;
  }
  if(focus)$('.booking-step-title',target)?.focus({preventScroll:true});
}
function saveDraft(){const f=$('#booking-form');if(f)booking.form={name:f.elements.name.value,phone:f.elements.phone.value,email:f.elements.email.value,notes:f.elements.notes.value};}
function submitBooking(e){
  e.preventDefault();saveDraft();const f=$('#booking-form');if(!f.reportValidity())return;
  const form=booking.form;
  if(form.name.trim().length<2){$('#form-errors').textContent='Inserisci un nome di almeno due caratteri.';f.elements.name.focus();return;}
  if(!/^[+()\d\s.\/-]+$/.test(form.phone)||form.phone.replace(/\D/g,'').length<7){$('#form-errors').textContent='Inserisci un numero di telefono valido.';f.elements.phone.focus();return;}
  if(!booking.date||!booking.time||!slotsFor(booking.date).includes(booking.time)) {booking.time=null;booking.step=2;renderBooking(true);toast('Questo orario non è più disponibile nella demo. Scegline un altro.');return;}
  const service=selectedService();
  const record={id:crypto.randomUUID(),...form,name:form.name.trim(),phone:form.phone.trim(),date:booking.date,time:booking.time,service:service.id,serviceName:service.name,duration:service.duration,look:booking.look,status:'da confermare',createdAt:new Date().toISOString()};
  const records=readRecords();records.push(record);
  if(!writeRecords(records)){$('#form-errors').textContent='Il browser non permette il salvataggio locale. Abilita l’archiviazione del sito o prova in un’altra finestra.';return;}
  booking.record=record;booking.step=4;renderBooking();$('#booking-content').scrollIntoView({behavior:'smooth',block:'center'});
}
$('#booking-content').addEventListener('click', e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.service){booking.service=b.dataset.service;booking.date=null;booking.time=null;renderBooking();return;}
  if(b.dataset.date){booking.date=b.dataset.date;booking.time=null;renderBooking();return;}
  if(b.dataset.time){booking.time=b.dataset.time;renderBooking();return;}
  const a=b.dataset.action;
  if(a==='next'){if(booking.step===2&&(!booking.date||!booking.time))return;booking.step++;renderBooking(true);}
  if(a==='back'){saveDraft();booking.step--;renderBooking(true);}
  if(a==='prev-month'||a==='next-month'){const next=new Date(booking.month.getFullYear(),booking.month.getMonth()+(a==='next-month'?1:-1),1,12);if(next>=currentMonth&&next<=maxMonth){booking.month=next;renderBooking();}}
  if(a==='restart'){booking.step=1;booking.date=null;booking.time=null;booking.form={name:'',phone:'',email:'',notes:''};renderBooking(true);}
  if(a==='ics')downloadICS(booking.record);
});
$$('[data-book-service]').forEach(b=>b.addEventListener('click',()=>{booking.service=b.dataset.bookService;booking.step=1;booking.date=null;booking.time=null;renderBooking();$('#prenota').scrollIntoView({behavior:'smooth'});}));
$('#save-look').addEventListener('click',()=>{booking.look=STYLE_OPTIONS[look.gender].find(s=>s.id===look.style).name+' · '+COLORS[look.color].name;booking.service=look.gender==='uomo'?'taglio-uomo':'colore';booking.step=1;booking.date=null;booking.time=null;renderBooking();toast('La tua idea è stata aggiunta alla richiesta demo.');});
function downloadFile(content,type,name){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function downloadICS(r){
  const start=`${r.date.replaceAll('-','')}T${r.time.replace(':','')}00`;
  const end=`${r.date.replaceAll('-','')}T${minutesTime(timeMinutes(r.time)+r.duration).replace(':','')}00`;
  const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Idea Donna//Demo//IT','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${r.id}@idea-donna.demo`,`DTSTAMP:${stamp}`,`DTSTART;TZID=Europe/Zurich:${start}`,`DTEND;TZID=Europe/Zurich:${end}`,'SUMMARY:DEMO - Idea Donna - '+r.serviceName,'DESCRIPTION:Prova del calendario. Non è un appuntamento confermato. Per prenotare chiama 091 605 13 59.','LOCATION:Contrada San Marco 4\, 6982 Agno','STATUS:TENTATIVE','END:VEVENT','END:VCALENDAR'].join('\r\n');
  downloadFile(ics,'text/calendar;charset=utf-8','idea-donna-prenotazione-DEMO.ics');
}
renderBooking();

$('#privacy-open').addEventListener('click',()=>{
 $('#info-content').innerHTML='<div class="eyebrow">INFORMAZIONI SULLA DEMO</div><h2>Un po’ di chiarezza.</h2><p>Il calendario è una dimostrazione. Le richieste vengono salvate esclusivamente nella memoria locale di questo browser (localStorage): non vengono inviate al salone, a un server o a un indirizzo e-mail.</p><p>L’agenda demo, accessibile dal fondo della pagina, mostra solo le prove effettuate nello stesso browser. Non è un’area amministrativa protetta. Per le prove puoi usare dati di fantasia; dall’agenda puoi eliminare ciascuna richiesta o tutte le prove.</p><p>Le immagini sono state ricavate e ripulite con ImageGen a partire dagli screenshot forniti; possono differire dagli originali. Il configuratore mostra un’illustrazione di ispirazione, non una simulazione del risultato sui tuoi capelli.</p><p>I collegamenti a Maps, Instagram e WhatsApp aprono servizi esterni. Questo sito dimostrativo non contiene strumenti di analisi o pubblicità.</p><p>Per un appuntamento reale contatta Idea Donna al <a href="tel:+41916051359">091 605 13 59</a>. Prima della pubblicazione definitiva andranno completati backend, accessi admin e informativa privacy del salone.</p>';
 $('#info-dialog').showModal();
});
function showAgenda(){
 const records=readRecords().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 $('#info-content').innerHTML=`<div class="eyebrow">ANTEPRIMA AREA DI GESTIONE</div><h2>L’agenda demo.</h2><p>Qui trovi solo le richieste salvate in questo browser. È una bozza del flusso di gestione, senza backend o login. Nessun messaggio è stato inviato al salone.</p><h3>${records.length} ${records.length===1?'richiesta di prova':'richieste di prova'}</h3>${records.length?records.map(r=>`<article class="demo-record"><strong>${escapeHTML(r.name)} · ${escapeHTML(r.serviceName)}</strong><small>${escapeHTML(dateLabel(r.date))} · ${escapeHTML(r.time)} · ${escapeHTML(r.phone)}${r.email?' · '+escapeHTML(r.email):''}</small>${r.look?'<small>Look: '+escapeHTML(r.look)+'</small>':''}${r.notes?'<small>Note: '+escapeHTML(r.notes)+'</small>':''}<span class="record-status">${escapeHTML(r.status)} · DEMO</span><div>${r.status==='da confermare'?`<button data-record="${escapeHTML(r.id)}" data-record-action="confirm">Conferma nella demo</button>`:''}${r.status!=='annullata'?`<button data-record="${escapeHTML(r.id)}" data-record-action="cancel">Annulla nella demo</button>`:''}<button data-record="${escapeHTML(r.id)}" data-record-action="delete">Elimina</button></div></article>`).join(''):'<p>Ancora nessuna richiesta. Prova il calendario e torna qui per vedere come arriva una prenotazione nella bozza di agenda.</p>'}${records.length?'<div class="demo-tools"><button data-agenda-action="export">Esporta richieste demo</button><button data-agenda-action="clear">Elimina tutte le prove</button></div>':''}`;
 if(!$('#info-dialog').open)$('#info-dialog').showModal();
}
$('#demo-open').addEventListener('click',showAgenda);
$('#info-content').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.record){let records=readRecords();const id=b.dataset.record;if(b.dataset.recordAction==='delete')records=records.filter(r=>r.id!==id);else records=records.map(r=>r.id===id?{...r,status:b.dataset.recordAction==='confirm'?'confermata':'annullata'}:r);if(!writeRecords(records)){toast('Salvataggio locale non disponibile.');return;}showAgenda();if(booking.step===2)renderBooking();}
 if(b.dataset.agendaAction==='export')downloadFile(JSON.stringify({demo:true,exportedAt:new Date().toISOString(),bookings:readRecords()},null,2),'application/json','idea-donna-richieste-DEMO.json');
 if(b.dataset.agendaAction==='clear'){$('#info-content').innerHTML='<h2>Eliminare le prove?</h2><p>Verranno eliminate tutte le richieste salvate in questo browser.</p><div class="demo-tools"><button data-agenda-action="clear-confirm">Elimina tutte</button><button data-agenda-action="back">Torna all’agenda</button></div>';}
 if(b.dataset.agendaAction==='clear-confirm'){if(writeRecords([])){showAgenda();if(booking.step===2)renderBooking();toast('Richieste demo eliminate.');}else toast('Eliminazione non disponibile.');}
 if(b.dataset.agendaAction==='back')showAgenda();
});
window.addEventListener('storage',e=>{if(e.key===STORE_KEY&&booking.step===2){if(booking.date&&booking.time&&!slotsFor(booking.date).includes(booking.time))booking.time=null;renderBooking();}});
