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
$('#save-look').addEventListener('click',()=>{const chosen=window.ideaDonnaLook?.getSelection();if(!chosen)return;booking.look=chosen.description;booking.service=chosen.gender==='uomo'?'taglio-uomo':'colore';booking.step=1;booking.date=null;booking.time=null;renderBooking();toast('La tua idea è stata aggiunta alla richiesta demo.');});
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
 $('#info-content').innerHTML='<div class="eyebrow">INFORMAZIONI SULLA DEMO</div><h2>Un po’ di chiarezza.</h2><p>Il calendario è una dimostrazione. Le richieste vengono salvate esclusivamente nella memoria locale di questo browser (localStorage): non vengono inviate al salone, a un server o a un indirizzo e-mail.</p><p>L’agenda demo, accessibile dal fondo della pagina, mostra solo le prove effettuate nello stesso browser. Non è un’area amministrativa protetta. Per le prove puoi usare dati di fantasia; dall’agenda puoi eliminare ciascuna richiesta o tutte le prove.</p><p>Le immagini sono state ricavate e ripulite con ImageGen a partire dagli screenshot forniti; possono differire dagli originali. Lo Studio Look usa modelli fotografici generati con AI e simula il colore sui capelli dei modelli. Non è una prova personalizzata sui tuoi capelli: il risultato reale si definisce con il salone.</p><p>I collegamenti a Maps, Instagram e WhatsApp aprono servizi esterni. Questo sito dimostrativo non contiene strumenti di analisi o pubblicità.</p><p>Per un appuntamento reale contatta Idea Donna al <a href="tel:+41916051359">091 605 13 59</a>. Prima della pubblicazione definitiva andranno completati backend, accessi admin e informativa privacy del salone.</p>';
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
