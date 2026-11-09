/* Idea Donna Studio Look — source portraits remain unchanged. All tinting is a local display effect. */
(() => {
  'use strict';
  const q = selector => document.querySelector(selector);
  const qa = selector => [...document.querySelectorAll(selector)];
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const COLORS = [
    {id:'espresso',name:'Espresso',swatch:['#231b17','#49362b','#a4846d'],note:'Profondo, morbido, senza tempo.',mood:'Un colore pieno, con tutta la sua profondità.',stops:[[4,3,3],[22,16,13],[51,37,29],[103,80,65],[178,153,132],[232,218,202]]},
    {id:'chocolate',name:'Cioccolato',swatch:['#332219','#805437','#c89d73'],note:'Il calore di un grande classico.',mood:'Riflessi avvolgenti, un carattere naturale.',stops:[[5,3,2],[36,23,16],[88,55,34],[147,105,68],[208,174,133],[247,231,203]]},
    {id:'caramel',name:'Caramello',swatch:['#563a27','#b78450','#e9c28d'],note:'Caldo. Luminoso. Tutto tuo.',mood:'La luce giusta, senza cambiare chi sei.',stops:[[6,4,3],[57,38,24],[141,96,54],[199,154,100],[237,208,162],[255,244,218]]},
    {id:'honey',name:'Biondo miele',swatch:['#755431','#c7a06b','#f0dbac'],note:'La luce del sole, tra i capelli.',mood:'Un biondo caldo, fatto di mille sfumature.',stops:[[9,6,4],[79,57,33],[171,134,82],[221,188,136],[249,227,185],[255,250,232]]},
    {id:'copper',name:'Rame',swatch:['#4c2418','#ae5934','#e6a06a'],note:'Un’idea calda, con personalità.',mood:'Rame, luce e quella voglia di osare.',stops:[[6,3,2],[51,22,13],[133,56,28],[198,106,57],[242,173,114],[255,235,204]]},
    {id:'rose',name:'Rosa cipria',swatch:['#493039','#bd8996','#eac3c9'],note:'Delicato, ma con qualcosa da dire.',mood:'Una sfumatura inattesa, da sentire tua.',stops:[[7,4,5],[52,32,41],[137,87,105],[194,140,159],[235,194,207],[255,241,244]]}
  ];
  const MODELS = {
    waves:{id:'waves',gender:'donna',name:'Onde morbide',index:'01',src:'assets/look/women-waves.jpg',
      path:'M505 53 C423 47 353 74 307 127 C270 171 247 237 246 297 C241 355 237 405 221 452 C209 493 198 537 177 592 C163 636 172 682 189 719 C196 760 204 809 233 849 C253 884 270 911 309 929 C345 949 387 944 423 931 C463 947 491 953 526 942 C555 952 592 950 621 936 C658 945 683 930 704 905 C737 886 755 859 770 824 C791 797 799 764 801 729 C817 697 820 668 806 632 C795 599 784 565 783 526 C776 487 765 449 768 415 C777 366 769 312 756 264 C753 212 730 158 692 118 C643 71 580 50 505 53 Z'},
    straight:{id:'straight',gender:'donna',name:'Liscio setoso',index:'02',src:'assets/look/women-straight.jpg',
      path:'M504 53 C422 48 352 76 305 128 C273 172 253 224 252 291 C251 345 244 398 237 453 C227 506 219 563 216 620 C208 685 218 750 231 807 C249 862 267 906 306 930 C351 955 414 961 494 958 C578 961 639 953 686 928 C733 902 752 862 765 808 C782 751 789 694 780 636 C776 575 769 519 770 462 C776 407 778 354 771 300 C767 238 749 178 706 131 C656 77 584 51 504 53 Z'},
    bob:{id:'bob',gender:'donna',name:'Caschetto',index:'03',src:'assets/look/women-bob.jpg',
      path:'M507 53 C414 47 345 79 300 134 C268 178 251 237 251 295 C243 349 240 401 246 448 C250 485 277 515 313 527 C335 534 357 530 377 521 C426 513 466 513 507 516 C549 514 593 518 632 527 C677 539 714 530 745 506 C776 478 786 439 793 392 C796 348 790 303 779 257 C767 200 745 156 703 116 C653 72 585 51 507 53 Z'},
    texture:{id:'texture',gender:'uomo',name:'Mosso naturale',index:'04',src:'assets/look/men-texture.jpg',
      path:'M505 46 C448 38 394 54 353 70 C311 78 284 104 254 126 C223 149 193 183 178 221 C161 259 154 303 161 348 C162 381 171 408 188 428 L209 440 C214 467 224 496 238 524 C254 562 275 591 310 611 C355 644 424 661 501 664 C575 662 643 650 691 622 C729 598 749 562 762 527 L778 469 L793 432 C816 409 828 380 835 345 C849 307 849 269 834 232 C823 186 792 148 762 124 C725 89 682 70 637 59 C593 44 546 42 505 46 Z',skin:true},
    natural:{id:'natural',gender:'uomo',name:'Classico scalato',index:'05',src:'assets/look/men-natural.jpg',
      path:'M510 53 C437 48 382 62 333 88 C289 108 249 139 219 177 C189 214 173 253 168 295 C162 341 169 392 189 427 L211 441 C216 476 228 511 247 544 C264 578 290 605 326 626 C376 651 434 664 503 665 C574 664 637 650 686 624 C725 601 746 566 760 529 L780 468 L793 431 C817 397 832 357 836 317 C843 276 830 231 810 195 C787 157 752 123 714 98 C653 61 582 49 510 53 Z',skin:true},
    short:{id:'short',gender:'uomo',name:'Corto sfumato',index:'06',src:'assets/look/men-short.jpg',
      path:'M507 67 C436 63 378 78 331 101 C287 124 247 156 219 192 C187 231 174 274 171 321 C166 363 175 400 194 433 L216 451 L236 504 C249 536 263 562 288 582 C338 622 423 638 505 640 C585 639 660 622 707 587 C734 563 753 531 767 494 L783 453 L795 431 C816 398 832 358 834 316 C835 274 822 231 798 192 C769 150 727 118 680 97 C623 73 564 64 507 67 Z',skin:true,fade:true}
  };
  const STYLES = {donna:['waves','straight','bob'],uomo:['texture','natural','short']};
  const state={gender:'donna',style:'waves',color:2,intensity:85,roots:true,compare:false,zoom:false};
  const photo=q('#hair-model'), surfaces=q('#look-surfaces'), original=q('#look-original'), before=q('#look-before');
  const canvases={a:q('#look-canvas-a'),b:q('#look-canvas-b')};
  const contexts={a:canvases.a.getContext('2d'),b:canvases.b.getContext('2d')};
  const comparison=q('#look-compare-range');
  const loading=new Map(), cache=new Map();
  let active='a', current=null, imageRequest=0, renderFrame=0, renderVersion=0;

  function styleButtons(){
    q('#style-options').innerHTML=STYLES[state.gender].map(id=>{const m=MODELS[id];return `<button class="ls-style-choice ${id===state.style?'active':''}" data-style="${id}" aria-label="${m.name}" aria-pressed="${id===state.style}"><img src="${m.src}" alt="" loading="lazy" decoding="async"><span>${m.name}</span><i class="ls-choice-check" aria-hidden="true">✓</i></button>`;}).join('');
  }
  q('#color-options').innerHTML=COLORS.map((c,i)=>`<button class="ls-color-choice ${i===state.color?'active':''}" data-color="${i}" aria-label="${c.name}" aria-pressed="${i===state.color}" title="${c.name}" style="--tone-shadow:${c.swatch[0]};--tone-mid:${c.swatch[1]};--tone-light:${c.swatch[2]}"><span class="ls-color-chip" aria-hidden="true"></span><span>${c.name}</span></button>`).join('');
  function updateUI(){
    const m=MODELS[state.style],c=COLORS[state.color];
    qa('[data-gender]').forEach(b=>{const on=b.dataset.gender===state.gender;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
    qa('#style-options [data-style]').forEach(b=>{const on=b.dataset.style===state.style;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
    qa('#color-options [data-color]').forEach(b=>{const on=Number(b.dataset.color)===state.color;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
    q('#color-name').textContent=c.name;q('#color-note').textContent=c.note;
    q('#stage-label').textContent=m.name;
    q('#look-summary-color').replaceChildren(document.createTextNode(c.name+' '));
    const rootNote=document.createElement('span');rootNote.textContent='· '+(state.roots?'radice sfumata':'colore pieno');q('#look-summary-color').append(rootNote);
    q('#look-mood').textContent=c.mood;
    q('#look-photo-caption').textContent=m.name;q('#look-photo-color').textContent=c.name+' · '+(state.roots?'radice naturale':'colore pieno');
    q('#look-model-index').textContent='LOOK N° '+m.index;
    const sample=q('#look-tone-sample');sample.style.setProperty('--tone-shadow',c.swatch[0]);sample.style.setProperty('--tone-mid',c.swatch[1]);sample.style.setProperty('--tone-light',c.swatch[2]);
    q('#look-intensity-value').textContent=state.intensity+'%';q('#look-intensity').value=state.intensity;q('#look-intensity').setAttribute('aria-valuetext',state.intensity+' per cento');q('#look-intensity').style.setProperty('--range-progress',((state.intensity-45)/55*100)+'%');
    q('#look-roots').checked=state.roots;
    photo.setAttribute('aria-label',`Anteprima fotografica: ${m.name}, ${c.name}, intensità ${state.intensity} per cento, ${state.roots?'radice naturale':'colore pieno'}`);
    q('#look-download').disabled=!current||current.id!==state.style;
    window.dispatchEvent(new CustomEvent('idea-donna-look-change',{detail:getSelection()}));
  }
  function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.decoding='async';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Immagine non disponibile'));img.src=src;});}
  function makeCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  function prepareModel(model,img){
    const width=Math.min(img.naturalWidth,960),height=Math.round(width*img.naturalHeight/img.naturalWidth);
    const sourceCanvas=makeCanvas(width,height),sourceCtx=sourceCanvas.getContext('2d',{willReadFrequently:true});
    sourceCtx.drawImage(img,0,0,width,height);
    const source=sourceCtx.getImageData(0,0,width,height),pixels=source.data;
    const path=new Path2D(model.path);
    const maskCanvas=makeCanvas(width,height),maskCtx=maskCanvas.getContext('2d',{willReadFrequently:true});
    maskCtx.save();maskCtx.scale(width/1000,height/1000);maskCtx.fillStyle='#fff';maskCtx.fill(path);maskCtx.restore();
    // A narrow, softly matted edge excludes backdrop and preserves existing flyaway detail.
    const coreCanvas=makeCanvas(width,height),coreCtx=coreCanvas.getContext('2d',{willReadFrequently:true});
    coreCtx.drawImage(maskCanvas,0,0);coreCtx.save();coreCtx.scale(width/1000,height/1000);coreCtx.globalCompositeOperation='destination-out';coreCtx.strokeStyle='#fff';coreCtx.lineWidth=32;coreCtx.stroke(path);coreCtx.restore();
    const core=coreCtx.getImageData(0,0,width,height).data;
    const featherCanvas=makeCanvas(width,height),featherCtx=featherCanvas.getContext('2d',{willReadFrequently:true});
    featherCtx.filter='blur(1.25px)';featherCtx.drawImage(maskCanvas,0,0);const edge=featherCtx.getImageData(0,0,width,height).data;
    const count=width*height,matte=new Float32Array(count),luma=new Uint8Array(count),rootMask=new Float32Array(count);
    const rowBg=new Float32Array(height*3);
    for(let y=0;y<height;y++){
      const left=(y*width+Math.round(width*.045))*4,right=(y*width+Math.round(width*.955))*4;
      for(let c=0;c<3;c++)rowBg[y*3+c]=(pixels[left+c]+pixels[right+c])*.5;
    }
    for(let n=0,j=0;n<count;n++,j+=4){
      const r=pixels[j],g=pixels[j+1],b=pixels[j+2],gray=.299*r+.587*g+.114*b;
      luma[n]=Math.round(gray);
      if(edge[j+3]===0)continue;
      const y=Math.floor(n/width),x=n%width,yn=y/height,xn=x/width;
      const dr=r-rowBg[y*3],dg=g-rowBg[y*3+1],db=b-rowBg[y*3+2];
      const bgDistance=Math.sqrt(dr*dr+dg*dg+db*db);
      const bodyGate=smooth(5,22,r-b)*smooth(18,43,gray);
      const backgroundChroma=(rowBg[y*3]-rowBg[y*3+2])/Math.max(1,rowBg[y*3]);
      const fiberChroma=(r-b)/Math.max(1,r);
      const fiberSeparation=smooth(.008,.105,fiberChroma-backgroundChroma);
      const edgeGate=fiberSeparation*lerp(smooth(14,46,bgDistance),1,core[j+3]/255);
      let skinGate=1;
      if(model.skin){
        skinGate=1-smooth(4,19,r-2*g+b)*smooth(88,160,gray);
        if(model.fade)skinGate*=1-.92*smooth(.45,.635,yn);
      }
      matte[n]=edge[j+3]/255*bodyGate*edgeGate*skinGate;
      const distance=Math.sqrt(Math.pow((xn-.5)*.85,2)+Math.pow((yn-.07)*1.75,2));
      rootMask[n]=.22+.78*smooth(.09,.40,distance);
    }
    // Release temporary full-resolution matting buffers; keep only source and compact descriptors.
    for(const c of [sourceCanvas,maskCanvas,coreCanvas,featherCanvas]){c.width=1;c.height=1;}
    return {id:model.id,img,width,height,source,matte,luma,rootMask};
  }
  async function getModel(id){
    if(cache.has(id)){const value=cache.get(id);cache.delete(id);cache.set(id,value);return value;}
    if(loading.has(id))return loading.get(id);
    const job=loadImage(MODELS[id].src).then(img=>prepareModel(MODELS[id],img)).then(data=>{cache.set(id,data);while(cache.size>3){const first=cache.keys().next().value;if(first===state.style){const item=cache.get(first);cache.delete(first);cache.set(first,item);}else cache.delete(first);}return data;}).finally(()=>loading.delete(id));
    loading.set(id,job);return job;
  }
  function toneTable(color){
    const stops=[0,45,105,165,215,255],table=new Float32Array(256*3);
    for(let value=0;value<256;value++){
      let lo=0;while(lo<stops.length-2&&value>stops[lo+1])lo++;
      const t=clamp((value-stops[lo])/(stops[lo+1]-stops[lo]));
      for(let c=0;c<3;c++)table[value*3+c]=lerp(color.stops[lo][c],color.stops[lo+1][c],t);
    }
    return table;
  }
  function render(options={}){
    renderFrame=0;if(!current||current.id!==state.style)return;
    const data=current,color=COLORS[state.color],table=toneTable(color),source=data.source.data;
    const next=active==='a'?'b':'a',canvas=canvases[next];
    if(canvas.width!==data.width||canvas.height!==data.height){canvas.width=data.width;canvas.height=data.height;}
    const output=contexts[next].createImageData(data.width,data.height),out=output.data;
    const strength=state.intensity/100;
    for(let n=0,j=0;n<data.matte.length;n++,j+=4){
      const alpha=data.matte[n]*strength*(state.roots?data.rootMask[n]:1),value=data.luma[n],ti=value*3;
      if(alpha>.001){
        // A monotonic photographic gradient keeps fiber contrast, dark recesses and neutral specular light.
        for(let c=0;c<3;c++){const detail=(source[j+c]-value)*.10;out[j+c]=lerp(source[j+c],clamp(table[ti+c]+detail,0,255),alpha);}
      }else{out[j]=source[j];out[j+1]=source[j+1];out[j+2]=source[j+2];}
      out[j+3]=255;
    }
    contexts[next].putImageData(output,0,0);
    if(options.instant){canvases[next].style.transition='none';canvases[active].style.transition='none';}
    surfaces.dataset.active=next;active=next;
    if(options.instant)requestAnimationFrame(()=>{canvases.a.style.transition='';canvases.b.style.transition='';});
    photo.dataset.renderVersion=String(++renderVersion);
    photo.dataset.style=state.style;photo.dataset.color=color.id;photo.classList.add('is-ready');photo.setAttribute('aria-busy','false');q('#look-loading').hidden=true;
    q('#look-download').disabled=false;
  }
  function scheduleRender(instant=false){if(renderFrame)cancelAnimationFrame(renderFrame);renderFrame=requestAnimationFrame(()=>render({instant}));}
  async function selectStyle(id){
    if(!MODELS[id])return;
    const request=++imageRequest;state.style=id;updateUI();photo.setAttribute('aria-busy','true');q('#look-status').textContent='';
    if(!cache.has(id)){photo.classList.remove('is-ready');q('#look-loading').hidden=false;}
    try{
      const model=await getModel(id);if(request!==imageRequest)return;
      current=model;original.src=MODELS[id].src;before.src=MODELS[id].src;
      render();
    }catch{
      if(request!==imageRequest)return;photo.classList.add('is-ready');photo.setAttribute('aria-busy','false');q('#look-loading').hidden=true;q('#look-status').textContent='Questa foto non si è caricata. Riprova scegliendo un altro taglio.';
    }
  }
  function getSelection(){const m=MODELS[state.style],c=COLORS[state.color];return {gender:state.gender,style:m.id,styleName:m.name,color:c.name,colorId:c.id,intensity:state.intensity,roots:state.roots,description:`${m.name} · ${c.name} · ${state.roots?'radice sfumata':'colore pieno'} · intensità ${state.intensity}%`};}
  q('#style-options').addEventListener('click',e=>{const b=e.target.closest('[data-style]');if(b&&b.dataset.style!==state.style)selectStyle(b.dataset.style);});
  q('#color-options').addEventListener('click',e=>{const b=e.target.closest('[data-color]');if(!b)return;state.color=Number(b.dataset.color);updateUI();scheduleRender();});
  qa('[data-gender]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.gender===state.gender)return;state.gender=b.dataset.gender;state.style=STYLES[state.gender][0];styleButtons();selectStyle(state.style);}));
  q('#look-intensity').addEventListener('input',e=>{state.intensity=Number(e.target.value);updateUI();scheduleRender(true);});
  q('#look-roots').addEventListener('change',e=>{state.roots=e.target.checked;updateUI();scheduleRender();});
  q('#look-compare').addEventListener('click',()=>{state.compare=!state.compare;photo.classList.toggle('comparing',state.compare);q('#look-compare-ui').setAttribute('aria-hidden',String(!state.compare));q('#look-compare').setAttribute('aria-pressed',String(state.compare));comparison.disabled=!state.compare;comparison.tabIndex=state.compare?0:-1;if(state.compare){comparison.value='50';photo.style.setProperty('--split','50%');comparison.setAttribute('aria-valuetext','50 per cento prima, 50 per cento nuova idea');}});
  comparison.addEventListener('input',e=>{const value=Number(e.target.value);photo.style.setProperty('--split',value+'%');comparison.setAttribute('aria-valuetext',value+' per cento prima, '+(100-value)+' per cento nuova idea');});
  q('#look-zoom').addEventListener('click',()=>{state.zoom=!state.zoom;photo.classList.toggle('is-zoomed',state.zoom);q('#look-zoom').setAttribute('aria-pressed',String(state.zoom));q('#look-zoom span').textContent=state.zoom?'Vista completa':'Guarda da vicino';});
  q('#look-reset').addEventListener('click',()=>{Object.assign(state,{gender:'donna',style:'waves',color:2,intensity:85,roots:true,compare:false,zoom:false});photo.classList.remove('comparing','is-zoomed');q('#look-compare-ui').setAttribute('aria-hidden','true');q('#look-compare').setAttribute('aria-pressed','false');q('#look-zoom').setAttribute('aria-pressed','false');q('#look-zoom span').textContent='Guarda da vicino';comparison.disabled=true;comparison.tabIndex=-1;styleButtons();selectStyle('waves');});
  q('#look-download').addEventListener('click',()=>{
    if(!current||current.id!==state.style)return;
    if(renderFrame){cancelAnimationFrame(renderFrame);renderFrame=0;render({instant:true});}
    const selection=getSelection(),source=canvases[active],width=source.width,footer=Math.round(width*.235),result=makeCanvas(width,source.height+footer),ctx=result.getContext('2d');
    ctx.fillStyle='#f6f2e9';ctx.fillRect(0,0,result.width,result.height);ctx.drawImage(source,0,0);
    const pad=Math.round(width*.055),base=source.height;
    ctx.fillStyle='#722f42';ctx.font=`${Math.round(width*.041)}px Georgia`;ctx.fillText('idea donna.',pad,base+pad);
    ctx.fillStyle='#352d29';ctx.font=`${Math.round(width*.029)}px Georgia`;ctx.fillText(selection.styleName+' · '+selection.color,pad,base+pad+width*.048);
    ctx.fillStyle='#827970';ctx.font=`${Math.round(width*.014)}px Arial`;ctx.fillText(`${selection.roots?'Radice sfumata':'Colore pieno'} · Intensità ${selection.intensity}%`,pad,base+pad+width*.08);
    ctx.font=`${Math.round(width*.011)}px Arial`;ctx.fillText('ISPIRAZIONE DIGITALE · MODELLO GENERATO CON AI · RISULTATO DA DEFINIRE IN SALONE',pad,base+footer-width*.035);
    const c=COLORS[state.color];const grad=ctx.createLinearGradient(width-pad-width*.1,0,width-pad,0);grad.addColorStop(0,c.swatch[0]);grad.addColorStop(.5,c.swatch[2]);grad.addColorStop(1,c.swatch[1]);ctx.fillStyle=grad;ctx.fillRect(width-pad-width*.1,base+pad,width*.1,width*.08);
    result.toBlob(blob=>{if(!blob){q('#look-status').textContent='Il browser non permette il salvataggio dell’immagine.';return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`idea-donna-${selection.style}-${c.id}.png`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);q('#look-status').textContent='Il tuo look è pronto da portare in salone.';result.width=1;result.height=1;},'image/png');
  });
  styleButtons();updateUI();window.ideaDonnaLook={getSelection};
  if(!contexts.a||!contexts.b){q('#look-status').textContent='Questo browser mostra solo la foto originale. Prova un browser aggiornato per il colore interattivo.';photo.classList.add('is-ready');photo.setAttribute('aria-busy','false');q('#look-loading').hidden=true;return;}
  selectStyle(state.style);
})();
