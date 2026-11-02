// Orbit home + search pages, ported from the original self-contained page.
// Markup is trusted static content (no user input), injected once per mount.
import { useEffect, useRef } from 'react'
import '@/orbit.css'
import { runOrbitScripts } from '@/data/orbit-runtime'
import homeHero from '@/assets/home-hero.jpg'

const searchSession: { current: unknown } = { current: null }

const ORBIT_HTML = String.raw`
<div id="veil" aria-hidden="true"><i class="ring"></i><span class="vlogo">
  <svg viewBox="0 0 26.9 16.6" fill="none" aria-hidden="true">
    <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25"/>
    <circle cx="13.25" cy="8.4" r="8.8" fill="#e8edf5"/>
    <circle cx="13.25" cy="8.4" r="8.1" fill="currentColor"/>
    <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="#e8edf5" stroke-width="0.9" stroke-dasharray="28.2 28.2"/>
    <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25" stroke-dasharray="28.2 28.2"/>
  </svg>Code-X-Ray</span></div>
<div id="view-home">
<div class="frame">
  <img class="sky" id="sky" aria-hidden="true" alt="" draggable="false"
       src="${homeHero}" />
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="skyTurb" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence id="skyTurbN" type="fractalNoise" baseFrequency="0.006 0.016" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G">
      <animate attributeName="scale" values="2.4;3.6;2.4" dur="9s" repeatCount="indefinite"/>
    </feDisplacementMap>
  </filter>
</svg>
<div id="mirror" aria-hidden="true">
  <div class="m-ring"></div>
  <div class="m-ring2"></div>
  <div class="m-gloss"></div>
  <div class="m-sweep"></div>
  <div class="m-touch" id="m-touch"></div>
</div>
<div class="hero-scrim" aria-hidden="true"></div>
<div class="silver-grad" aria-hidden="true"></div>
<canvas id="fx-particles" aria-hidden="true"></canvas>
  <div class="veil"></div>

  <header class="bar" data-open="false">
    <a class="brand" href="#home" aria-label="Code-X-Ray — home">
      <svg viewBox="0 0 26.9 16.6" fill="none" aria-hidden="true">
        <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25"/>
        <circle cx="13.25" cy="8.4" r="8.8" fill="#000"/>
        <circle cx="13.25" cy="8.4" r="8.1" fill="currentColor"/>
        <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="#000" stroke-width="0.9" stroke-dasharray="28.2 28.2"/>
        <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25" stroke-dasharray="28.2 28.2"/>
      </svg>
      <span class="word">Code-X-Ray</span>
    </a>

    <nav class="links" aria-label="Primary">
      <span class="seg">
        <a href="#home" aria-current="page">Home</a>
        <a href="#search">Browse</a>
        <a href="#/learn">Learn</a>
      </span>
    </nav>

    <div class="actions">

      <a class="icon-btn" href="https://github.com/Cissy4mA/Code-X-ray_Numpy-ml" target="_blank" rel="noopener" aria-label="GitHub">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
      </a>
      <button class="menu" id="menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu-sheet">
        <svg viewBox="0 0 20 14" fill="none" aria-hidden="true">
          <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
      <nav class="sheet" id="menu-sheet" aria-label="Menu">
        <a href="#home" aria-current="page">Home</a>
        <a href="#search">Browse</a>
        <a href="#/learn">Learn</a>
      </nav>
    </div>
  </header>

  <div class="screen">
    <main class="hero">
      <a class="pill" href="#search">
        <span class="chip">NumPy-ML</span>
        <span class="pill-label">From code retrieval to understanding</span>
        <svg class="arr" viewBox="0 0 9.5 8" fill="none" aria-hidden="true">
          <path d="M0.7 4H8.8M5.6 0.75 8.85 4 5.6 7.25" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>

      <h1>
        <span class="ln"><span class="ln-i">Code-X-Ray</span></span>
        <span class="ln"><span class="ln-i">ML Code Retrieval &amp; Learning</span></span>
      </h1>

      <p>A machine learning code retrieval and learning platform for NumPy-ML.</p>

      <form class="import-bar" id="import-form" action="#import" role="search">
        <svg class="imp-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="4.6" stroke="currentColor" stroke-width="1.4"/>
          <path d="M10.4 10.4 14 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <input id="import-input" type="text" autocomplete="off" spellcheck="false"
               placeholder="e.g. logistic regression"
               aria-label="Search an algorithm">
        <button class="imp-btn" id="import-btn" type="submit">X-Ray</button>
      </form>

      <div class="chip-row" aria-label="Sample kernel modules">
        <span class="chip-label">Indexed modules</span>
        <button class="kchip" type="button">bandits</button>
        <button class="kchip" type="button">gmm</button>
        <button class="kchip" type="button">hmm</button>
        <button class="kchip" type="button">lda</button>
        <button class="kchip" type="button">neural_nets</button>
        <button class="kchip" type="button">trees</button>
        <button class="kchip" type="button">rl_models</button>
      </div>

    </main>
  </div>
</div>
</div>

<div id="view-search" style="display:none">

<canvas id="fx2-particles" aria-hidden="true"></canvas>

<header class="s-top">
  <a class="s-brand" href="#home" aria-label="Code-X-Ray — home">
    <svg viewBox="0 0 26.9 16.6" fill="none" aria-hidden="true">
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25"/>
      <circle cx="13.25" cy="8.4" r="8.8" fill="#07090f"/>
      <circle cx="13.25" cy="8.4" r="8.1" fill="currentColor"/>
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="#07090f" stroke-width="0.9" stroke-dasharray="28.2 28.2"/>
      <ellipse cx="13.25" cy="8.4" rx="13.2" ry="2.9" transform="rotate(-25 13.25 8.4)" stroke="currentColor" stroke-width="1.25" stroke-dasharray="28.2 28.2"/>
    </svg>
    Code-X-Ray
  </a>
  <nav class="seg s-seg" aria-label="Primary">
    <a href="#home">Home</a>
    <a href="#module-search" aria-current="page">Browse</a>
    <a href="#/learn">Learn</a>
  </nav>
  <nav class="s-sub" aria-label="Sections">
    <a href="#module-search">1. Find a module</a>
    <a href="#algo-search">2. Find an algorithm</a>
  </nav>
</header>

<main class="wrap">
  <h1 class="page-title">Find your module. Then your algorithm.</h1>
  <p class="page-sub">Search NumPy-ML by topic or algorithm name, then narrow the results to a module.</p>
  <ol class="search-flow" aria-label="Retrieval and learning steps"><li>1. Find a module</li><li aria-hidden="true">&rarr;</li><li>2. Find an algorithm</li><li aria-hidden="true">&rarr;</li><li>3. Open the Learn Page</li></ol>

  <div class="grid">
    <!-- ============ 3.1 Module Search ============ -->
    <section class="panel" id="module-search">
      <h2>Step 1 &middot; Find a module</h2>
      <p class="desc">Find a module by algorithm name, topic or task.</p>
      <p class="rowlabel">What do you want to learn?</p>
      <div class="controls">
        <input id="mq" type="text" placeholder="e.g. reinforcement learning / neural networks / probabilistic models" aria-label="Module search query">
        <button class="sbtn" id="mgo" type="button">Search modules</button>
      </div>
      <details class="search-options"><summary>Search options</summary><label>Number of module results
        <select id="mk" aria-label="Number of module results">
          <option value="1" selected>Top-K 1</option>
          <option value="2">Top-K 2</option>
          <option value="3">Top-K 3</option>
        </select>
      </label></details>
      <p class="try">Try: <button type="button" class="tchip">reinforcement learning</button><button type="button" class="tchip">neural networks</button><button type="button" class="tchip">bandits</button></p>
      <div class="results" id="mres" aria-live="polite"></div>
    </section>

    <!-- ============ 3.2 Algorithm Search ============ -->
    <section class="panel" id="algo-search" data-ready="false">
      <h2>Step 2 &middot; Find an algorithm</h2>
      <p class="desc">Your query is carried over. Refine it to search within the selected module.</p>
      <p class="rowlabel" id="module-context" aria-live="polite">Select a module in Step 1 to continue.</p>
      <button class="sbtn change-module" id="change-module" type="button" hidden>Change module &uarr;</button>
      <div class="controls">
        <input id="aq" type="text" placeholder="Your query carries over after selecting a module" aria-label="Algorithm search query" disabled>
        <select id="amod" aria-label="Selected module" hidden disabled>
          <option value="" selected>Select a module first</option>
        </select>
        <button class="sbtn" id="ago" type="button" disabled>Search algorithms</button>
      </div>
      <details class="search-options"><summary>Search options</summary><label>Number of algorithm results
        <select id="ak" aria-label="Number of algorithm results" disabled>
          <option value="1">Top-K 1</option>
          <option value="2">Top-K 2</option>
          <option value="3" selected>Top-K 3</option>
          <option value="4">Top-K 4</option>
          <option value="5">Top-K 5</option>
          <option value="6">Top-K 6</option>
          <option value="7">Top-K 7</option>
          <option value="8">Top-K 8</option>
          <option value="9">Top-K 9</option>
          <option value="10">Top-K 10</option>
        </select>
      </label></details>
      <p class="try">Refine your query to search within the selected module.</p>
      <div id="score-summary"></div>
      <div class="results" id="ares" aria-live="polite"><div class="empty">First find and select a module. Algorithm results will appear here.</div></div>
    </section>
  </div>
</main>

</div>

<script>
(function(){
  var root=document.getElementById('view-home');
  if(!root)return;
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!RM)root.classList.add('intro');
  setTimeout(function(){root.classList.remove('intro');root.classList.remove('intro-play');},5000);
  function start(){
    if(root.classList.contains('intro-play'))return;
    root.classList.add('intro-play');
  }
  function end(){
    root.classList.remove('intro');root.classList.remove('intro-play');
  }
  if(root.classList.contains('intro')){
    var started=false;
    var kick=function(){
      if(started)return;started=true;
    requestAnimationFrame(function(){requestAnimationFrame(start);});
    };
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(kick);}
    setTimeout(kick,700);
    var done=false;
    var finish=function(){if(done)return;done=true;end();};
    setTimeout(finish,3000);
  }
})();
</script>
<script>
(function(){
  var bar=document.querySelector('.bar');
  var btn=document.getElementById('menu-btn');
  function set(open){
    bar.dataset.open=open?'true':'false';
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.setAttribute('aria-label',open?'Close menu':'Menu');
  }
  set(false);
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    set(bar.dataset.open!=='true');
  });
  document.addEventListener('click',function(e){
    if(!bar.contains(e.target))set(false);
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape')set(false);
  });
})();
</script>
<script>
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var veil=document.getElementById('veil');
  var home=document.getElementById('view-home');
  var srch=document.getElementById('view-search');
  var busy=false, cur='home', pending=null, target='home';
  function setView(v){
    cur=v; target=v;
    (veil.closest('.orbit-page')||veil).classList.toggle('v-search', v==='search');
    home.style.display=(v!=='home')?'none':'';
    srch.style.display=(v!=='search')?'none':'';
    if(v==='search'){
      window.scrollTo(0,0);
      if(window.__ensureSearchBooted)window.__ensureSearchBooted();
    }
  }
  var ring=veil.querySelector('.ring'), vlogo=veil.querySelector('.vlogo');
  function go(v,x,y,noPush){
    if(busy){pending={v:v,x:x,y:y,noPush:noPush};return;}
    if(v===cur&&v===target)return;
    busy=true;
    target=v;
    if(!noPush){try{history.pushState({v:v},'','#'+(v==='search'?'search':'home'));}catch(e){}}
    if(RM){setView(v);busy=false;if(pending){var q=pending;pending=null;go(q.v,q.x,q.y,q.noPush);}return;}
    x=(x==null)?window.innerWidth/2:x; y=(y==null)?window.innerHeight/2:y;
    var R=Math.hypot(window.innerWidth,window.innerHeight);
    // 复位
    veil.style.transition='none';
    veil.style.opacity='1';
    veil.style.transform='scale(1)';
    veil.style.clipPath='circle(0px at '+x+'px '+y+'px)';
    ring.style.transition='none';
    ring.style.opacity='0';
    ring.style.transform='scale(.2)';
    void veil.offsetWidth;
    // 第一幕:银光盘从点击处扩散,光环扫过全屏
    veil.style.transition='clip-path .56s cubic-bezier(.6,.05,.25,1)';
    veil.style.clipPath='circle('+(R*1.02).toFixed(0)+'px at '+x+'px '+y+'px)';
    ring.style.transition='transform .56s cubic-bezier(.6,.05,.25,1), opacity .25s ease';
    ring.style.opacity='1';
    ring.style.transform='scale('+(R*2.04/24).toFixed(1)+')';
    vlogo.style.opacity='1';
    setTimeout(function(){
      setView(v);
      ring.style.opacity='0';
      // 第二幕:光晕绽放消散
      setTimeout(function(){
        vlogo.style.opacity='0';
        veil.style.transition='opacity .42s ease, transform .42s ease';
        veil.style.opacity='0';
        veil.style.transform='scale(1.07)';
        setTimeout(function(){
          veil.style.transition='none';
          veil.style.clipPath='circle(0px at 50% 50%)';
          ring.style.transform='scale(.2)';
          busy=false;
          if(pending){var q=pending;pending=null;go(q.v,q.x,q.y,q.noPush);}
        },440);
      },130);
    },580);
  }
  window.__go=go;
  document.querySelectorAll('a[href="#search"]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      e.preventDefault(); go('search', e.clientX, e.clientY);
    });
  });
  document.querySelectorAll('#view-search a[href="#home"]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      e.preventDefault(); go('home', e.clientX, e.clientY);
    });
  });
  document.querySelectorAll('#view-search .s-top nav a[href^="#"]:not([href^="#/"])').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var t=document.querySelector('#view-search '+a.getAttribute('href'));
      if(t)t.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});
    });
  });
  function syncFromHash(){
    var v=location.hash==='#search'?'search':'home';
    if(v!==target)go(v,null,null,true);
  }
  window.addEventListener('popstate',syncFromHash);
  window.addEventListener('hashchange',syncFromHash);
  if(location.hash==='#search'){cur='home';go('search',null,null,true);}
})();
</script>
<script>
(function(){
  var form=document.getElementById('import-form');
  var btn=document.getElementById('import-btn');
  var input=document.getElementById('import-input');
  var busy=false;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(busy)return; busy=true;
    var v=btn.textContent; btn.textContent='Searching…';
    var q=input.value.trim();
    var mq=document.getElementById('mq');
    if(mq)mq.value=q;
    if(window.__go)window.__go('search');
    if(window.__ensureSearchBooted)window.__ensureSearchBooted().then(function(){
      if(mq)mq.value=q;
      if(window.__runModuleSearch)window.__runModuleSearch();
    });
    setTimeout(function(){
      var panel=document.getElementById('module-search');
      if(panel)panel.scrollIntoView({behavior:'smooth',block:'start'});
    },720);
    setTimeout(function(){btn.textContent=v; busy=false;},1600);
  });
  document.querySelectorAll('.kchip').forEach(function(c){
    c.addEventListener('click',function(){
      input.value=c.textContent.trim(); input.focus();
    });
  });
})();
</script>
<script>
(function(){
  var frame=document.querySelector('.frame');
  var sky=document.getElementById('sky');
  var mirror=document.getElementById('mirror');
  var touchPt=document.getElementById('m-touch');
  var turb=document.getElementById('skyTurbN');
  var cvs=document.getElementById('fx-particles');
  var ctx=cvs.getContext('2d');
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR=Math.min(window.devicePixelRatio||1,2);
  var NATW=1627,NATH=967;
  var MCX=1194,MCY=475,MR=318;      // 镜面圆心/半径(原图像素)
  var TXX=886,TXY=516;              // 触点(原图像素)

  var P=[],M=[],lastT=0,pmx=0,pmy=0,parX=0,parY=0,frame2=0;
  var SPR=document.createElement('canvas'); SPR.width=SPR.height=64;
  (function(){var g=SPR.getContext('2d');
    var rg=g.createRadialGradient(32,32,0,32,32,32);
    rg.addColorStop(0,'rgba(236,241,250,.9)');
    rg.addColorStop(.4,'rgba(228,235,248,.32)');
    rg.addColorStop(1,'rgba(228,235,248,0)');
    g.fillStyle=rg; g.fillRect(0,0,64,64);})();

  function unit(){var w=window.innerWidth,h=window.innerHeight;
    return Math.max(Math.min(w/1563,h/460),0.8);}

  function layout(){
    var W=frame.clientWidth,H=frame.clientHeight,u=unit();
    var ultra=matchMedia('(min-aspect-ratio:3/1)').matches;
    var boxH=Math.max(W*NATH/NATW,H+(ultra?0:1.5*u));
    var s=Math.max(W/NATW,boxH/NATH);
    var cw=NATW*s,ch=NATH*s;
    var ox=(W-cw)/2, oy=ultra?(H-ch):(-1.5*u);
    var r=MR*s,cx=MCX*s+ox,cy=MCY*s+oy,d=2*r;
    mirror.style.width=d+'px'; mirror.style.height=d+'px';
    mirror.style.left=(cx-r)+'px'; mirror.style.top=(cy-r)+'px';
    touchPt.style.left=((TXX*s+ox)-(cx-r))+'px';
    touchPt.style.top=((TXY*s+oy)-(cy-r))+'px';
    sizeCanvas(W,H);
  }

  function sizeCanvas(W,H){
    cvs.width=Math.round(W*DPR); cvs.height=Math.round(H*DPR);
    cvs.style.width=W+'px'; cvs.style.height=H+'px';
    var n=Math.max(14,Math.round(W*H/(W<700?52000:36000)));
    while(P.length<n)P.push(newP(true));
    P.length=n;
    var m=Math.max(6,Math.round(W*H/(W<700?260000:190000)));
    while(M.length<m)M.push(newM(true));
    M.length=m;
  }
  function newM(any){
    var topBias=Math.random()<0.72;
    return{x:Math.random()*cvs.width,
      y:any?(topBias?Math.random()*cvs.height*0.55:Math.random()*cvs.height):cvs.height+30,
      s:(14+Math.random()*34)*DPR,
      vy:(2+Math.random()*5)*DPR,
      vx:(Math.random()-.5)*2.4*DPR,
      ph:Math.random()*6.283,
      sp:0.2+Math.random()*0.5,
      a:0.05+Math.random()*0.09};
  }
  function newP(any){
    return{x:Math.random()*cvs.width,
      y:any?Math.random()*cvs.height:cvs.height+8,
      r:(0.6+Math.random()*1.7)*DPR,
      vy:(5+Math.random()*13)*DPR,
      vx:(Math.random()-.5)*3*DPR,
      ph:Math.random()*6.283,
      sp:0.5+Math.random()*1.5,
      a:0.22+Math.random()*0.5};
  }
  function drawParticles(t,dt){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    for(var i=0;i<P.length;i++){
      var p=P[i];
      p.y-=p.vy*dt; p.x+=p.vx*dt;
      if(p.y<-8||p.x<-8||p.x>cvs.width+8){P[i]=p=newP(false);}
      var tw=0.55+0.45*Math.sin(t*0.001*p.sp+p.ph);
      ctx.beginPath();
      ctx.fillStyle='rgba(228,234,244,'+(p.a*tw).toFixed(3)+')';
      ctx.arc(p.x,p.y,p.r,0,6.283);
      ctx.fill();
    }
    for(var j=0;j<M.length;j++){
      var q=M[j];
      q.y-=q.vy*dt; q.x+=q.vx*dt+Math.sin(t*0.0004+q.ph)*0.15;
      if(q.y<-40||q.x<-40||q.x>cvs.width+40){M[j]=q=newM(false);q.y=cvs.height+20;}
      var tw2=0.6+0.4*Math.sin(t*0.001*q.sp+q.ph);
      ctx.globalAlpha=(q.a*tw2).toFixed(3);
      var sz=q.s*(1+0.15*Math.sin(t*0.0005+q.ph));
      ctx.drawImage(SPR,q.x-sz/2,q.y-sz/2,sz,sz);
    }
    ctx.globalAlpha=1;
  }

  window.addEventListener('pointermove',function(e){
    pmx=e.clientX/window.innerWidth-.5;
    pmy=e.clientY/window.innerHeight-.5;
  },{passive:true});

  function tick(t){
    var dt=Math.min(0.05,(t-lastT)/1000||0.016); lastT=t;
    var veil=document.getElementById('veil');
    if(document.hidden||veil&&veil.closest('.orbit-page').classList.contains('v-search')){
      setTimeout(function(){requestAnimationFrame(tick);},250);
      return;
    }
    parX+=(pmx-parX)*0.05; parY+=(pmy-parY)*0.05;
    drawParticles(t,dt);
    if(frame2++%2===0){
      var bx=0.006+0.0018*Math.sin(t*0.0006);
      var by=0.016+0.004*Math.sin(t*0.00083+2);
      turb.setAttribute('baseFrequency',bx.toFixed(4)+' '+by.toFixed(4));
    }
    var rx=-parY*7+Math.sin(t*0.0009)*2.2;
    var ry=parX*9+Math.sin(t*0.0011+1)*2.6;
    var sc=1+0.006*Math.sin(t*0.0013);
    mirror.style.transform='perspective(1000px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) scale('+sc.toFixed(4)+')';
    requestAnimationFrame(tick);
  }

  var rzT=null;
  window.addEventListener('resize',function(){
    if(rzT)cancelAnimationFrame(rzT);
    rzT=requestAnimationFrame(layout);
  });

  layout();
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(layout);}
  window.addEventListener('load',layout);

  if(!RM){
    requestAnimationFrame(function(t){lastT=t;requestAnimationFrame(tick);});
  }else{
    drawParticles(0,0);
    mirror.style.transform='perspective(1000px) scale(1.005)';
  }
})();
</script>
<script>

/* ================= real database search ================= */
var MODULE_CACHE=[];
var API_READY=false;
var MODULE_SEARCH_VERSION=0;
var ALGO_SEARCH_VERSION=0;
var MODULE_QUERY='';
var MODULE_RESULTS=[];
var FREE_FUNCTION_RESULTS=[];

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function asList(v){return Array.isArray(v)?v:[]}
function firstText(){
  for(var i=0;i<arguments.length;i++){
    var v=arguments[i];
    if(typeof v==='string'&&v.trim())return v.trim();
  }
  return '';
}
function api(path, options){
  return fetch(path, Object.assign({headers:{'Content-Type':'application/json'}}, options||{})).then(readApiResponse);
}
function setBusy(el,msg){if(el)el.innerHTML='<div class="empty">'+esc(msg)+'</div>';}
function apiError(where, err){
  if(err&&err.name==='AbortError')return;
  console.error(err);
  var el=document.getElementById(where);
  if(!el)return;
  var problem=describeApiError(err);
  el.innerHTML='<div class="empty" role="alert">'+esc(problem.message)+(problem.retryable?'<br><button type="button" class="sbtn retry-search">Retry / 重试</button>':'')+'</div>';
  if(!problem.retryable)return;
  el.querySelector('.retry-search').addEventListener('click',function(){
    if(!API_READY||where==='mres')runModuleSearch();else runAlgoSearch();
  });
}
function moduleReadme(m){
  var readme=firstText(m.readme, m.description, m.summary);
  if(!readme){
    readme='# '+(m.name||'module')+'\n'+
      'Files: '+(m.file_count||0)+' · Classes: '+(m.class_count||0)+' · Functions: '+(m.function_count||0);
    if(asList(m.samples).length)readme+='\n\nContents\n- '+asList(m.samples).join('\n- ');
  }
  return readme;
}
function normalizeModuleResult(x){return x&&x.m?x.m:x}
function normalizeClassResult(x){return x&&x.c?x.c:x}
function memberFunctions(c){
  var f=asList(c.functions).map(function(fn){
    if(typeof fn==='string')return fn;
    var name=firstText(fn.name, fn.function, fn.signature);
    var sig=firstText(fn.signature);
    return sig||name;
  }).filter(Boolean);
  if(!f.length)f=asList(c.member_functions).filter(Boolean);
  return f.slice(0,12);
}
function algoDesc(c){
  var text=firstText(c.docstring_math, c.description, c.summary, c.task, c.family);
  if(!text&&c.code){text=String(c.code).split('\n').map(function(line){return line.trim()}).filter(Boolean)[0]||'';}
  return text||'Indexed from the numpy-ml source database.';
}
function scoreLine(c){
  var parts=[];
  if(c.path)parts.push(c.path);
  if(c.lines)parts.push('lines '+c.lines);
  if(c.fused!=null)parts.push('score '+Number(c.fused).toFixed(3));
  return parts.join(' · ');
}

/* ================= rendering ================= */
function renderModules(list){
  var el=document.getElementById('mres');
  if(!el)return;
  MODULE_RESULTS=list.map(normalizeModuleResult);
  if(!list.length){el.innerHTML='<div class="empty">No modules matched.</div>';return;}
  el.innerHTML=list.map(function(raw,i){
    var m=normalizeModuleResult(raw)||{};
    var reason=firstText(m.reason, m.why, asList(m.why).join(' · '));
    var rd=esc(moduleReadme(m))
      .replace(/^# (.+)$/m,'<span class="md-h">$1</span>')
      .replace(/^## (.+)$/gm,'<span class="md-h">$1</span>')
      .replace(/\n- /g,'<br>- ')
      .replace(/\n/g,'<br>');
    return '<article class="hit" style="animation-delay:'+(i*0.06)+'s">'
      +'<div class="hit-head"><span class="mname">'+esc(m.name||'module')+'</span>'
      +'<span class="path">'+esc(m.path||('numpy_ml/'+(m.name||'')+'/README.md'))+'</span></div>'
      +(reason?'<p class="module-reason">Why this module: '+esc(reason)+'</p>':'')
      +'<div class="readme">'+rd+'</div>'
      +'<button class="module-select sbtn" type="button" data-index="'+i+'">Select module &amp; continue &rarr;</button></article>';
  }).join('');
  el.querySelectorAll('.module-select').forEach(function(btn){
    btn.addEventListener('click',function(){selectModule(MODULE_RESULTS[+btn.dataset.index])});
  });
}
function resetModuleSelection(){
  ALGO_SEARCH_VERSION++;
  var sel=document.getElementById('amod');
  sel.value='';sel.disabled=true;
  document.getElementById('ago').disabled=true;
  document.getElementById('aq').disabled=true;
  document.getElementById('ak').disabled=true;
  document.getElementById('aq').value='';
  document.getElementById('change-module').hidden=true;
  document.getElementById('algo-search').dataset.ready='false';
  document.getElementById('score-summary').innerHTML='';
  document.getElementById('module-context').textContent='Select a module in Step 1 to continue.';
  window.__lastAlgoResults=[];
  FREE_FUNCTION_RESULTS=[];
  setBusy(document.getElementById('ares'),'First find and select a module. Algorithm results will appear here.');
}
function selectModule(m){
  if(!m||!m.name)return;
  var sel=document.getElementById('amod');
  if(!Array.from(sel.options).some(function(option){return option.value===m.name})){
    var option=document.createElement('option');option.value=m.name;option.textContent=m.name;sel.appendChild(option);
  }
  sel.value=m.name;sel.disabled=false;
  document.getElementById('ago').disabled=false;
  document.getElementById('aq').disabled=false;
  document.getElementById('ak').disabled=false;
  document.getElementById('change-module').hidden=false;
  document.getElementById('algo-search').dataset.ready='true';
  document.getElementById('aq').value=MODULE_QUERY||m.name;
  document.getElementById('module-context').textContent='Searching within '+m.name+' · selected in Step 1';
  runAlgoSearch();
  document.getElementById('algo-search').scrollIntoView({behavior:'smooth',block:'start'});
}
function rememberSearch(){
  if(typeof searchSession==='undefined')return;
  searchSession.current={
    query:document.getElementById('mq').value,moduleQuery:MODULE_QUERY,
    moduleTopK:document.getElementById('mk').value,algorithmQuery:document.getElementById('aq').value,
    algorithmTopK:document.getElementById('ak').value,module:document.getElementById('amod').value,
    modules:MODULE_RESULTS,classes:window.__lastAlgoResults||[],freeFunctions:FREE_FUNCTION_RESULTS
  };
}
function renderClasses(list,freeFunctions){
  var el=document.getElementById('ares');
  if(!el)return;
  FREE_FUNCTION_RESULTS=asList(freeFunctions);
  window.__lastAlgoResults=list.map(function(raw){return normalizeClassResult(raw)||{}}).concat(FREE_FUNCTION_RESULTS);
  renderScores(window.__lastAlgoResults);
  rememberSearch();
  if(!window.__lastAlgoResults.length){el.innerHTML='<div class="empty">No matching algorithms or functions. Refine your query within the selected module, or choose another module in Step 1.</div>';return;}
  el.innerHTML=window.__lastAlgoResults.map(function(c,i){
    var f=memberFunctions(c);
    var meta=scoreLine(c);
    return '<article class="acard" style="animation-delay:'+(i*0.06)+'s">'
      +'<div class="left"><div class="cname">'+esc(c.entity||c.name||c.class_name||'Algorithm')+'</div><span class="entity-kind">'+(c.type==='function'?'Function / 独立函数':'Class / 算法类')+'</span>'
      +'<div class="tagrow"><span class="mtag">'+esc(c.module||c.m||'module')+'</span>'+(c.family?'<span class="mtag">'+esc(c.family)+'</span>':'')+'</div>'
      +'<div class="desc2">'+esc(algoDesc(c))+'</div>'+(meta?'<div class="desc2">'+esc(meta)+'</div>':'')
      +renderScoreBreakdown(c,window.__lastAlgoResults)
      +'<p class="result-taxonomy"><b>Family / 算法族:</b> '+esc(c.family||'Not indexed')+' &middot; <b>Task / 任务:</b> '+esc(c.task||'Not indexed')+'</p>'
      +'<div class="result-source"><div class="flabel">Indexed source / 索引源码</div><pre tabindex="0" aria-label="Source code for '+esc(c.entity||c.name||'Algorithm')+'"><code>'+esc(c.code||'No source code is available in this index.')+'</code></pre></div>'
      +'<button class="learn-open" type="button" data-index="'+i+'">Open the Learn Page</button></div>'
      +'<div class="right"><div class="flabel">Member functions</div>'
      +'<div class="function-list">'+(asList(c.functions).length?asList(c.functions).map(function(fn){return '<div class="function-entry"><span class="fn">'+esc(typeof fn==='string'?fn:firstText(fn.signature,fn.name))+'</span>'+(fn&&typeof fn==='object'&&fn.meaning?'<p>'+esc(fn.meaning)+'</p>':'')+'</div>'}).join(''):(f.length?f.map(function(fn){return '<div class="function-entry"><span class="fn">'+esc(fn)+'</span></div>'}).join(''):'<span class="fn">No member functions indexed</span>'))+'</div>'
      +'</div></article>';
  }).join('');
  document.querySelectorAll('.learn-open').forEach(function(btn){
    btn.addEventListener('click',function(){
      var c=window.__lastAlgoResults[+btn.dataset.index];
      if(!c)return;
      rememberSearch();
      try{localStorage.setItem('codexray:selectedAlgorithm',JSON.stringify({entity:c.entity||c.name||c.class_name,module:c.module,path:c.path}));}catch(e){}
      location.hash='#/learn';
    });
  });
}
function renderScoreBreakdown(item,list){
  var channels=[{key:'fused',label:'Fused / 融合得分'},{key:'keyword',label:'Keyword / 关键词得分'},{key:'semantic',label:'Semantic / 语义得分'}];
  return '<div class="result-scores">'+channels.map(function(channel){
    var value=item[channel.key];
    if(typeof value!=='number'||!Number.isFinite(value))return '<div class="result-score"><span>'+channel.label+'</span><span class="score-value">Not available</span></div>';
    var values=list.map(function(result){return result[channel.key]}).filter(function(score){return typeof score==='number'&&Number.isFinite(score)});
    var min=channel.key==='semantic'?-1:0;
    var max=Math.max.apply(null,[1].concat(values));
    return '<div class="result-score score-'+channel.key+'"><label>'+channel.label+' <strong>'+value.toFixed(3)+'</strong><meter min="'+min+'" max="'+max+'" value="'+value+'" aria-label="'+channel.label+' for '+esc(item.entity||item.name||'Algorithm')+'"></meter></label></div>';
  }).join('')+'</div><p class="score-explanation">Ranking scores, not probabilities. Each channel uses its own scale.</p>';
}
function renderScores(list){
  var el=document.getElementById('score-summary');
  var scored=list.filter(function(item){return typeof item.fused==='number'&&Number.isFinite(item.fused)});
  if(!scored.length){el.innerHTML='';return;}
  var max=Math.max.apply(null,[1].concat(scored.map(function(item){return item.fused})));
  el.innerHTML='<details class="score-details"><summary>View relevance scores</summary><p>Scores rank these search results; they are not probabilities.</p>'
    +scored.map(function(item){return '<div class="score-row"><span>'+esc(item.entity||item.name)+'</span><meter min="0" max="'+max+'" value="'+Math.max(0,item.fused)+'" aria-label="Ranking score for '+esc(item.entity||item.name)+'"></meter><code>'+item.fused.toFixed(3)+'</code></div>'}).join('')+'</details>';
}

/* ================= API-backed search ================= */
function loadModules(){
  var sel=document.getElementById('amod');
  return api('/api/modules').then(function(data){
    MODULE_CACHE=asList(data.modules);
    if(sel){
      var previous=sel.value;
      sel.innerHTML='<option value="" selected>Select a module first</option>';
      MODULE_CACHE.forEach(function(m){
        var o=document.createElement('option');o.value=m.name;o.textContent=m.name;
        sel.appendChild(o);
      });
      if(previous)sel.value=previous;
    }
    API_READY=true;
    return MODULE_CACHE;
  });
}
function runModuleSearch(){
  if(!API_READY)return window.__ensureSearchBooted().then(function(){if(API_READY)runModuleSearch()});
  var q=(document.getElementById('mq').value||'').trim();
  var k=+document.getElementById('mk').value||3;
  var version=++MODULE_SEARCH_VERSION;
  MODULE_QUERY=q;
  resetModuleSelection();
  MODULE_RESULTS=[];
  rememberSearch();
  setBusy(document.getElementById('mres'),'Searching indexed modules...');
  var p=q?api('/api/modules/search',{method:'POST',body:JSON.stringify({query:q,top_k:k})}):Promise.resolve({results:MODULE_CACHE.slice(0,k)});
  p.then(function(data){
    if(version!==MODULE_SEARCH_VERSION)return;
    if(data.not_in_repo){
      renderModules([]);
      setBusy(document.getElementById('mres'),'Not included in NumPy-ML: '+(data.algorithm||q)+'. Try another algorithm or topic.');
      setBusy(document.getElementById('ares'),'This algorithm is not included in the repository, so Step 2 cannot continue.');
      return;
    }
    renderModules(asList(data.results));
    rememberSearch();
  }).catch(function(err){if(version===MODULE_SEARCH_VERSION)apiError('mres',err)});
}
function runAlgoSearch(){
  var mod=document.getElementById('amod').value;
  if(!mod)return;
  document.getElementById('module-context').textContent='Searching within '+mod+' · selected in Step 1';
  var version=++ALGO_SEARCH_VERSION;
  var q=(document.getElementById('aq').value||'').trim();
  var k=+document.getElementById('ak').value||3;
  if(!q){renderClasses([]);return;}
  document.getElementById('score-summary').innerHTML='';
  setBusy(document.getElementById('ares'),'Searching indexed algorithms...');
  api('/api/search',{method:'POST',body:JSON.stringify({query:q,top_k:k,module:mod,family:'',task:''})})
    .then(function(data){
      if(version!==ALGO_SEARCH_VERSION)return;
      renderClasses(asList(data.results),asList(data.free_functions));
      if(data.not_in_repo)setBusy(document.getElementById('ares'),'Not included in NumPy-ML: '+(data.algorithm||q)+'. Try another query.');
    })
    .catch(function(err){if(version===ALGO_SEARCH_VERSION)apiError('ares',err)});
}
function bootSearch(){
  return loadModules().then(function(){
    if(!MODULE_SEARCH_VERSION){
      var saved=typeof searchSession!=='undefined'?searchSession.current:null;
      if(saved){
        document.getElementById('mq').value=saved.query||'';
        document.getElementById('mk').value=saved.moduleTopK||'1';
        document.getElementById('ak').value=saved.algorithmTopK||'3';
        MODULE_QUERY=saved.moduleQuery||'';
        renderModules(asList(saved.modules));
        resetModuleSelection();
        if(saved.module&&MODULE_CACHE.some(function(item){return item.name===saved.module})){
          document.getElementById('amod').value=saved.module;
          document.getElementById('amod').disabled=false;
          document.getElementById('aq').value=saved.algorithmQuery||'';
          document.getElementById('aq').disabled=false;
          document.getElementById('ak').disabled=false;
          document.getElementById('ago').disabled=false;
          document.getElementById('change-module').hidden=false;
          document.getElementById('algo-search').dataset.ready='true';
          document.getElementById('module-context').textContent='Searching within '+saved.module+' · selected in Step 1';
          renderClasses(asList(saved.classes).filter(function(item){return item.type!=='function'}),asList(saved.freeFunctions));
        }
        return;
      }
      renderModules(MODULE_CACHE.slice(0,+document.getElementById('mk').value||3));
      resetModuleSelection();
    }
  }).catch(function(err){
    SEARCH_BOOTED=null;
    apiError('mres',err);apiError('ares',err);
  });
}

document.getElementById('mgo').addEventListener('click',runModuleSearch);
document.getElementById('change-module').addEventListener('click',function(){
  resetModuleSelection();
  rememberSearch();
  document.getElementById('module-search').scrollIntoView({behavior:'smooth',block:'start'});
  document.getElementById('mq').focus();
});
document.getElementById('mq').addEventListener('keydown',function(e){if(e.key==='Enter')runModuleSearch()});
document.getElementById('mk').addEventListener('change',runModuleSearch);
document.getElementById('ago').addEventListener('click',runAlgoSearch);
document.getElementById('aq').addEventListener('keydown',function(e){if(e.key==='Enter')runAlgoSearch()});
document.getElementById('ak').addEventListener('change',runAlgoSearch);
document.getElementById('amod').addEventListener('change',runAlgoSearch);
document.querySelectorAll('.tchip').forEach(function(c){
  c.addEventListener('click',function(){
    var panel=c.closest('.panel');
    var input=panel.querySelector('input[type=text]');
    input.value=c.textContent.trim();
    if(panel.id==='module-search')runModuleSearch();else runAlgoSearch();
    input.focus();
  });
});
window.__runAlgoSearch=runAlgoSearch;
window.__runModuleSearch=runModuleSearch;
var SEARCH_BOOTED=null;
window.__ensureSearchBooted=function(){
  if(!SEARCH_BOOTED)SEARCH_BOOTED=bootSearch();
  return SEARCH_BOOTED;
};
if(location.hash==='#search')window.__ensureSearchBooted();

/* ================= particles ================= */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var cvs=document.getElementById('fx2-particles'),ctx=cvs.getContext('2d');
  var DPR=Math.min(devicePixelRatio||1,2),P=[],last=0;
  function size(){cvs.width=innerWidth*DPR;cvs.height=innerHeight*DPR;
    cvs.style.width=innerWidth+'px';cvs.style.height=innerHeight+'px';
    var n=Math.round(innerWidth*innerHeight/52000);P=[];
    for(var i=0;i<n;i++)P.push(np());}
  function np(){return{x:Math.random()*cvs.width,y:Math.random()*cvs.height,
    r:(0.5+Math.random()*1.5)*DPR,vy:(4+Math.random()*10)*DPR,vx:(Math.random()-.5)*2*DPR,
    ph:Math.random()*6.28,sp:.5+Math.random()*1.4,a:.18+Math.random()*.4};}
  function tick(t){var dt=Math.min(.05,(t-last)/1000||.016);last=t;
    var veil=document.getElementById('veil');
    if(document.hidden||!(veil&&veil.closest('.orbit-page').classList.contains('v-search'))){
      setTimeout(function(){requestAnimationFrame(tick);},250);
      return;
    }
    ctx.clearRect(0,0,cvs.width,cvs.height);
    for(var i=0;i<P.length;i++){var p=P[i];p.y-=p.vy*dt;p.x+=p.vx*dt;
      if(p.y<-8||p.x<-8||p.x>cvs.width+8)P[i]=p=np(),p.y=cvs.height+8;
      var tw=.55+.45*Math.sin(t*.001*p.sp+p.ph);
      ctx.beginPath();ctx.fillStyle='rgba(98,110,134,'+(p.a*1.4*tw).toFixed(3)+')';
      ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fill();}
    requestAnimationFrame(tick);}
  addEventListener('resize',size);size();
  requestAnimationFrame(function(t){last=t;requestAnimationFrame(tick);});
})();

</script>
`

export default function OrbitPages({ view }: { view: 'home' | 'search' }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.innerHTML = ORBIT_HTML
    const scripts = Array.from(el.querySelectorAll('script')).map(script => {
      const source = script.textContent || ''
      script.remove()
      return source
    })
    const dispose = runOrbitScripts(el, scripts, searchSession)
    return () => {
      dispose()
      el.innerHTML = ''
    }
  }, [])

  // Deep-link sync: landing directly on #/search should open the search view.
  useEffect(() => {
    if (view === 'search' && location.hash !== '#search') {
      try {
        history.replaceState(null, '', '#search')
        window.dispatchEvent(new HashChangeEvent('hashchange'))
      } catch {
        /* noop */
      }
    }
  }, [view])

  return <div className="orbit-page" ref={ref} />
}
