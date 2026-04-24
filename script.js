// script.js：集中放置頁面狀態與互動函式。

let state = { persona: '', progress: 0 };

let bbIndex = 0;
let sg = { ...sgInit };
let sgIndex = 0;

function setClock(){const d=new Date();const p=n=>String(n).padStart(2,'0');document.getElementById('sysTime').textContent=`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`}
    setClock();setInterval(setClock,1000);

    function createLandingGreetings(){
      const layer=document.getElementById('landingHelloLayer');
      if(!layer) return;
      layer.innerHTML='';
      const items=[
        {text:'สวัสดี',cls:'is-indigo',size:60,left:14,top:8},{text:'Bonjour',cls:'is-violet',size:24,left:34,top:7},{text:'Hello',cls:'is-blue',size:54,left:78,top:8},{text:'Halo',cls:'is-amber',size:22,left:90,top:9},
        {text:'Xin chào',cls:'is-blue',size:32,left:10,top:26},{text:'你好',cls:'is-violet',size:46,left:89,top:28},{text:'Hello',cls:'is-slate',size:24,left:10,top:44},{text:'ជំរាបសួរ',cls:'is-slate',size:18,left:90,top:46},
        {text:'Halo',cls:'is-amber',size:20,left:10,top:63},{text:'Xin chào',cls:'is-indigo',size:34,left:89,top:65},{text:'你好',cls:'is-blue',size:44,left:12,top:82},{text:'Bonjour',cls:'is-slate',size:18,left:31,top:94},
        {text:'Hello',cls:'is-blue',size:64,left:52,top:95},{text:'សួស្តី',cls:'is-indigo',size:26,left:73,top:94},{text:'Halo',cls:'is-amber',size:22,left:89,top:83}
      ];
      items.forEach((it,i)=>{const el=document.createElement('span');el.className=`hello ${it.cls}`;el.textContent=it.text;el.style.fontSize=`${it.size}px`;el.style.left=`${it.left}%`;el.style.top=`${it.top}%`;el.style.animationDuration=`${4.2+(i%5)*.4}s`;el.style.animationDelay=`${(i%6)*.18}s`;layer.appendChild(el);});
    }

    function updateProgress(n){state.progress=n;document.getElementById('systemProgressBar').style.width=`${n}%`;document.getElementById('progressPercent').textContent=`${n}%`}

    function unlockNext(id){
      const el=document.getElementById(id);
      if(el){el.classList.remove('locked');el.classList.add('unlocked');el.scrollIntoView({behavior:'smooth',block:'start'});}
      if(id==='chapter2') updateProgress(50);
      if(id==='chapter3') updateProgress(75);
      if(id==='chapter4'){ updateProgress(100); renderEnding(); }
    }

    function continueAfterBlackboard(){
      const chapter2=document.getElementById('chapter2');
      if(chapter2){
        chapter2.classList.remove('locked');
        chapter2.classList.add('unlocked');
        updateProgress(50);
        chapter2.scrollIntoView({behavior:'smooth',block:'start'});
      }
    }

    function selectPersona(p){
      state.persona=p;
      document.getElementById('currentPersonaDisplay').textContent=personaData[p]||'GUEST';
      document.getElementById('sidebar').style.display='block';
      document.getElementById('personaSection').classList.add('hidden');
      unlockNext('chapter1');
      updateProgress(25);
    }

    function showPersonaQuiz(){
      const narrative=document.getElementById('chapter1Narrative');
      if(narrative){
        narrative.classList.remove('hidden');
        narrative.scrollIntoView({behavior:'smooth',block:'start'});
      }
    }

    function submitQuiz(item){
      const wrap=document.getElementById('quizContent');
      [...wrap.children].forEach(b=>b.disabled=true);
      document.getElementById('quizFeedbackText').textContent=item.f;
      document.getElementById('quizResult').classList.remove('hidden');
    }

    function submitCountryQuiz(correct,btn){
      const content=document.getElementById('countryQuizContent');
      const buttons=content.querySelectorAll('.country-option');
      const correctBtn=content.querySelector('.correct-country-option');
      buttons.forEach(b=>b.disabled=true);
      if(correct){
        content.classList.add('bg-green-100');
        btn.classList.remove('bg-white');
        btn.classList.add('bg-green-500','text-white');
        document.getElementById('countryQuizFeedbackText').innerHTML='<strong>系統確認正確：</strong> 目前跨轉生來臺前居住國最多的是越南。';
      }else{
        content.classList.add('bg-red-100');
        btn.classList.remove('bg-white');
        btn.classList.add('bg-red-500','text-white');
        correctBtn.classList.remove('bg-white');
        correctBtn.classList.add('bg-green-500','text-white');
        document.getElementById('countryQuizFeedbackText').innerHTML='<strong>系統分析偏差：</strong> 正確答案是「越南」。';
      }
      document.getElementById('countryQuizResult').classList.remove('hidden');
      document.getElementById('countryCharts').classList.remove('hidden');
      renderCountryCharts();
    }

    function polarToCartesian(cx,cy,r,a){const rad=(a-90)*Math.PI/180;return{x:cx+r*Math.cos(rad),y:cy+r*Math.sin(rad)}}
    function describeArc(cx,cy,r,s,e){const start=polarToCartesian(cx,cy,r,e);const end=polarToCartesian(cx,cy,r,s);const laf=e-s<=180?'0':'1';return`M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${laf} 0 ${end.x} ${end.y} Z`}
    function renderPieChart(containerId,data,theme={}){
      const el=document.getElementById(containerId);
      if(!el||!Array.isArray(data)) return;
      const width=460,height=300,cx=230,cy=150,r=90,labelR=136,total=data.reduce((s,x)=>s+x.value,0);
      const ns='http://www.w3.org/2000/svg';
      const svg=document.createElementNS(ns,'svg');
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      svg.classList.add('pie');
      let cur=0;
      data.forEach(item=>{
        const angle=item.value/total*360;const s=cur,e=cur+angle,m=s+angle/2;
        const g=document.createElementNS(ns,'g');
        const p=document.createElementNS(ns,'path');
        p.setAttribute('d',describeArc(cx,cy,r,s,e));
        p.setAttribute('fill',item.color);
        p.setAttribute('class','slice');
        if(theme.strokeColor) p.setAttribute('stroke', theme.strokeColor);
        const dx=Math.cos((m-90)*Math.PI/180)*12,dy=Math.sin((m-90)*Math.PI/180)*12;
        p.addEventListener('mouseenter',()=>{p.classList.add('active');p.setAttribute('transform',`translate(${dx.toFixed(2)} ${dy.toFixed(2)})`)});
        p.addEventListener('mouseleave',()=>{p.classList.remove('active');p.removeAttribute('transform')});
        const lp=polarToCartesian(cx,cy,labelR,m);
        const line=document.createElementNS(ns,'line');
        line.setAttribute('x1',polarToCartesian(cx,cy,r+4,m).x);
        line.setAttribute('y1',polarToCartesian(cx,cy,r+4,m).y);
        line.setAttribute('x2',lp.x);line.setAttribute('y2',lp.y);line.setAttribute('class','labelline');
        if(theme.lineColor) line.setAttribute('stroke', theme.lineColor);
        const txt=document.createElementNS(ns,'text');
        txt.setAttribute('x',lp.x);txt.setAttribute('y',lp.y);txt.setAttribute('class','label');
        txt.setAttribute('text-anchor',lp.x>cx?'start':'end');txt.setAttribute('dominant-baseline','middle');
        if(theme.labelColor) txt.setAttribute('fill', theme.labelColor);
        txt.textContent=`${item.label} ${item.value}%`;
        g.appendChild(p);g.appendChild(line);g.appendChild(txt);svg.appendChild(g);cur+=angle;
      });
      el.innerHTML='';el.appendChild(svg);
    }
    function renderCountryCharts(){renderPieChart('beforeCountryChart',beforeCountryData)}
    function renderStatCharts(){
      renderPieChart('statBeforeCountryChart', beforeCountryData);
      renderPieChart('afterCountyChart', afterCountyData, { labelColor:'#9a3412', lineColor:'#f59e0b', strokeColor:'#7c2d12' });
      renderNativeOriginDonutChart();
      renderTop3OriginByLevelChart();
      renderLevelTrendChart();
    }

    function initSim(){
      const data=simData[state.persona];
      if(!data) return;
      document.getElementById('simQuestionText').textContent=data.q;
      const box=document.getElementById('simContent');
      box.innerHTML='';
      document.getElementById('simFeedback').classList.add('hidden');
      data.a.forEach((t,i)=>{
        const b=document.createElement('button');
        b.className='w-full sys-button bg-gray-900 border border-green-400 p-3 hover:bg-green-400 hover:text-black transition';
        b.textContent=t;
        b.onclick=()=>playSim(i+1);
        box.appendChild(b);
      });
    }

    function playSim(choice){
      const map={
        student:{1:'你試圖溝通，但語言缺口讓每個手勢都顯得支離破碎。',2:'你把困難吞回肚子裡，最後只剩沉默。'},
        teacher:{1:'統一考卷看似公平，對跨轉生卻可能等於直接宣告失敗。',2:'調整評量雖然麻煩，卻是讓學生真正進入學習的第一步。'},
        admin:{1:'把責任交回學校，只會讓原本就稀缺的人力更加斷裂。',2:'真正的行政支持，不只是撥經費，而是建立能接住學生的師資系統。'},
        supporter:{1:'當你被迫概括承受，熱情很快就會被制度磨光。',2:'明確分工，才能讓支援成為橋樑，而不是替代正規教學的補丁。'}
      };
      document.getElementById('simResultText').textContent=map[state.persona][choice];
      const area=document.getElementById('personaAnalysisArea');
      const txt=comments[state.persona]||'';
      area.textContent=txt;
      area.style.display=txt?'block':'none';
      document.getElementById('simPersonaText').textContent=txt;
      document.getElementById('simFeedback').classList.remove('hidden');
    }

    function scrollToChapter2Quiz(){document.getElementById('chapter2QuizSection').scrollIntoView({behavior:'smooth',block:'start'})}
    function submitChapter2Quiz(correct,btn){
      const wrap=document.getElementById('chapter2QuizContent');
      const buttons=wrap.querySelectorAll('.chapter2-option');
      const right=wrap.querySelector('.correct-chapter2-option');
      buttons.forEach(b=>b.disabled=true);
      if(correct){
        btn.classList.add('bg-green-500','text-white');
        document.getElementById('chapter2QuizFeedbackText').innerHTML='<strong>系統確認正確：</strong> 關鍵不在是否會學生母語，而在具備華語教學專業，才能設計適性教學。';
      }else{
        btn.classList.add('bg-red-500','text-white');
        right.classList.add('bg-green-500','text-white');
        document.getElementById('chapter2QuizFeedbackText').innerHTML='<strong>系統分析偏差：</strong> 正確答案是「具備華語教學專業，以設計適性教學」。';
      }
      document.getElementById('chapter2QuizResult').classList.remove('hidden');
    }

    function bbStartGame(){document.getElementById('bb-start').classList.add('hidden');document.getElementById('bb-shell').classList.remove('hidden');bbLoad(0)}
    function bbLoad(i){
      bbIndex=i;
      document.getElementById('bbCompact').classList.remove('summary');
      const d=bbScenarios[i];
      document.querySelectorAll('.bb-progress-dot').forEach((dot,idx)=>dot.classList.toggle('active',idx===i));
      document.getElementById('bbMeta').innerHTML=`<span class="bb-badge">語言：${d.language}</span>`;
      document.getElementById('bbText').innerHTML=`<div>${d.plain}</div>`;
      const wrap=document.getElementById('bbOptions');
      wrap.innerHTML='';
      d.options.forEach((t,idx)=>{const b=document.createElement('button');b.className='bb-option';b.textContent=t;b.onclick=()=>bbAnswer(idx);wrap.appendChild(b)});
      document.getElementById('bbBoard').classList.remove('hidden');
      document.getElementById('bbQuiz').classList.remove('hidden');
      document.getElementById('bbControls').classList.add('hidden');
      document.getElementById('bbSummary').classList.add('hidden');
      document.getElementById('bbProgress').classList.remove('hidden');
    }
    function bbAnswer(idx){
      const d=bbScenarios[bbIndex];
      const buttons=[...document.querySelectorAll('.bb-option')];
      buttons.forEach(b=>b.disabled=true);
      if(idx===d.answer) buttons[idx].classList.add('correct');
      else { buttons[idx].classList.add('wrong'); buttons[d.answer].classList.add('correct'); }
      document.getElementById('bbText').innerHTML=`<div class="bb-detail"><div class="font-bold bb-original">${d.original}</div><div class="bb-translation">${d.translation}</div></div>`;
      document.getElementById('bbControls').classList.remove('hidden');
    }
    function bbNext(){
      if(bbIndex<bbScenarios.length-1) bbLoad(bbIndex+1);
      else {
        document.getElementById('bbQuiz').classList.add('hidden');
        document.getElementById('bbControls').classList.add('hidden');
        document.getElementById('bbBoard').classList.add('hidden');
        document.getElementById('bbProgress').classList.add('hidden');
        document.getElementById('bbSummary').classList.remove('hidden');
        document.getElementById('bbCompact').classList.add('summary');
      }
    }
    function bbRestart(){document.getElementById('bbCompact').classList.remove('summary');document.getElementById('bb-start').classList.remove('hidden');document.getElementById('bb-shell').classList.add('hidden');bbIndex=0}

    function sgStartGame(){document.getElementById('sgStart').classList.add('hidden');document.getElementById('sgResult').classList.add('hidden');document.getElementById('sgGame').classList.remove('hidden');sg={...sgInit};sgIndex=0;sgRender();sgUpdateUI()}
    function sgUpdateUI(){
      let emergency=false,gameOver=false;
      ['student','professional','energy','admin'].forEach(k=>{
        document.getElementById('sgVal-'+k).textContent=`${sg[k]}%`;
        document.getElementById('sgBar-'+k).style.width=`${Math.max(0,Math.min(100,sg[k]))}%`;
        const card=document.getElementById('sgStat-'+k);
        if(sg[k]<35){card.classList.add('sg-shake');emergency=true}else card.classList.remove('sg-shake');
        if(sg[k]<=0) gameOver=true;
      });
      document.getElementById('sgBlock').classList.toggle('sg-emergency',emergency);
      if(gameOver){sgEnd(false);return true}
      return false;
    }
    function sgRender(){
      if(sgIndex>=sgStages.length){sgEnd(true);return}
      const s=sgStages[sgIndex];
      document.getElementById('sgStageNum').textContent=sgIndex+1;
      document.getElementById('sgStageTitle').textContent=s.title;
      document.getElementById('sgStageDesc').textContent=s.desc;
      document.getElementById('sgStageIcon').className=`fas ${s.icon} text-xl opacity-60`;
      const wrap=document.getElementById('sgOptions');
      wrap.innerHTML='';
      s.options.forEach(o=>{const b=document.createElement('button');b.className='sg-option';b.innerHTML=`<span class="font-bold text-slate-900 text-[15px]">${o.text}</span>`;b.onclick=()=>sgChoose(o);wrap.appendChild(b)});
    }
    function sgChoose(o){
      Object.keys(o.impact).forEach(k=>sg[k]=Math.min(100,Math.max(-5,sg[k]+o.impact[k])));
      if(sgUpdateUI()) return;
      document.getElementById('sgCard').innerHTML=`<div class="p-10 text-center bg-slate-50 sg-frame flex flex-col justify-center"><div class="inline-block text-[10px] font-mono tracking-[0.18em] text-blue-900 bg-blue-50 border border-blue-900 px-3 py-1 mb-5">SYSTEM FEEDBACK</div><p class="text-2xl font-black text-slate-800 mb-8 leading-tight">${o.feedback}</p><button onclick="sgNext()" class="sys-button bg-slate-900 text-white px-10 py-3 rounded-full font-black text-sm">繼續前進</button></div>`;
    }
    function sgNext(){
      sgIndex++;
      document.getElementById('sgCard').innerHTML=`<div class="sg-head"><div class="flex justify-between items-center mb-2"><span class="text-[11px] font-mono font-black opacity-80 tracking-[0.2em]">MONTH <span id="sgStageNum"></span> / ${sgStages.length}</span><i id="sgStageIcon" class="fas fa-school text-xl opacity-60"></i></div><h3 id="sgStageTitle" class="text-2xl font-black"></h3></div><div class="p-7 sg-scroll"><p id="sgStageDesc" class="text-slate-700 mb-6 leading-relaxed text-base font-medium"></p><div id="sgOptions" class="grid grid-cols-1 md:grid-cols-2 gap-5"></div></div>`;
      sgRender();
    }
    function sgEnd(win){
      document.getElementById('sgGame').classList.add('hidden');
      document.getElementById('sgBlock').classList.remove('sg-emergency');
      document.getElementById('sgResult').classList.remove('hidden');
      document.getElementById('sgResIcon').textContent=win?'🎖️':'🥀';
      document.getElementById('sgResTitle').textContent=win?'奇蹟的守護者':'計畫終結：被遺忘的黑板';
      document.getElementById('sgResDesc').textContent=win?'在重重致命扣分的現實下，你竟然成功走完了這段路。你保住了學生的學習光火，也讓專業師資在貧瘠的土壤中扎根。':'指標歸零。你的決策雖可能出自好意，但現實的殘酷最終擊垮了這座橋樑。';
      document.getElementById('sgResStats').innerHTML=`<div class="p-4 bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0_rgba(31,41,55,0.12)]"><div class="text-[11px] text-blue-700 font-mono font-black mb-1">學生收穫</div><div class="text-3xl font-black">${Math.max(0,sg.student)}%</div></div><div class="p-4 bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0_rgba(31,41,55,0.12)]"><div class="text-[11px] text-violet-700 font-mono font-black mb-1">教學專業</div><div class="text-3xl font-black">${Math.max(0,sg.professional)}%</div></div><div class="p-4 bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0_rgba(31,41,55,0.12)]"><div class="text-[11px] text-orange-700 font-mono font-black mb-1">教學熱忱</div><div class="text-3xl font-black">${Math.max(0,sg.energy)}%</div></div><div class="p-4 bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0_rgba(31,41,55,0.12)]"><div class="text-[11px] text-green-700 font-mono font-black mb-1">行政穩定</div><div class="text-3xl font-black">${Math.max(0,sg.admin)}%</div></div>`;
      document.getElementById('sgResActions').innerHTML=win?`<button onclick="sgRevealReading()" class="sys-button bg-white text-slate-900 px-10 py-3 rounded-full font-black text-sm">繼續閱讀</button>`:`<button onclick="sgStartGame()" class="sys-button bg-slate-900 text-white px-10 py-3 rounded-full font-black text-sm">重新啟動計畫</button><button onclick="sgRevealReading()" class="sys-button bg-white text-slate-900 px-10 py-3 rounded-full font-black text-sm">繼續閱讀</button>`;
    }
    function sgRevealReading(){document.getElementById('sgReading').classList.remove('hidden');document.getElementById('sgReadingAnchor').scrollIntoView({behavior:'smooth',block:'start'})}


    
    
function renderNativeOriginDonutChart(){
      const el=document.getElementById('nativeOriginDonutChart');
      if(!el) return;

      const rankedData = [
        { rank: 1, name: '大陸地區', value: '11.6萬人', pct: '43.7%' },
        { rank: 2, name: '越南', value: '9.3萬人', pct: '35.2%' },
        { rank: 3, name: '印尼', value: '2.1萬人', pct: '7.8%' },
        { rank: 4, name: '菲律賓', value: '6,594人', pct: '2.5%' },
        { rank: 5, name: '泰國', value: '4,906人', pct: '1.9%' },
        { rank: 6, name: '柬埔寨', value: '3,640人', pct: '1.4%' },
        { rank: 7, name: '馬來西亞', value: '3,531人', pct: '1.3%' },
        { rank: 8, name: '緬甸', value: '2,723人', pct: '1.0%' }
      ];
      const unranked = { name: '其他', value: '1.4萬人', pct: '5.2%' };

      el.innerHTML = `
        <div class="origin-rank-card">
          <div class="origin-rank-title-wrap">
            <div class="origin-rank-title">113 學年新住民子女學生數</div>
            <div class="origin-rank-subtitle">按父（母）原生地區或國家分</div>
          </div>
          <div class="origin-rank-list">
            ${rankedData.map(item => `
              <div class="origin-rank-row">
                <div class="origin-rank-left">
                  <span class="origin-rank-no">${item.rank}.</span>
                  <span class="origin-rank-name">${item.name}</span>
                </div>
                <div class="origin-rank-right">${item.value}（${item.pct}）</div>
              </div>
            `).join('')}
            <div class="origin-rank-row origin-rank-row-other">
              <div class="origin-rank-left">
                <span class="origin-rank-name no-rank">${unranked.name}</span>
              </div>
              <div class="origin-rank-right">${unranked.value}（${unranked.pct}）</div>
            </div>
          </div>
        </div>`;
    }

    function describeDonutArc(cx,cy,rOuter,rInner,startDeg,endDeg){
      const startOuter=polarRaw(cx,cy,rOuter,startDeg);
      const endOuter=polarRaw(cx,cy,rOuter,endDeg);
      const startInner=polarRaw(cx,cy,rInner,endDeg);
      const endInner=polarRaw(cx,cy,rInner,startDeg);
      const laf=endDeg-startDeg>180?1:0;
      return `M ${startOuter.x} ${startOuter.y} A ${rOuter} ${rOuter} 0 ${laf} 1 ${endOuter.x} ${endOuter.y} L ${startInner.x} ${startInner.y} A ${rInner} ${rInner} 0 ${laf} 0 ${endInner.x} ${endInner.y} Z`;
    }
    function polarRaw(cx,cy,r,deg){const rad=deg*Math.PI/180;return{x:cx+r*Math.cos(rad),y:cy+r*Math.sin(rad)}}

    
    function renderTop3OriginByLevelChart(){
      const el=document.getElementById('top3OriginByLevelChart');
      if(!el) return;
      const ns='http://www.w3.org/2000/svg';
      const width=980,height=500,margin={l:60,r:44,t:104,b:92},chartW=width-margin.l-margin.r,chartH=292,max=4.2;
      const svg=document.createElementNS(ns,'svg');
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      svg.classList.add('stat-svg');

      const bg=document.createElementNS(ns,'rect');
      bg.setAttribute('x',20);bg.setAttribute('y',12);bg.setAttribute('width',width-40);bg.setAttribute('height',34);bg.setAttribute('fill','#f6e7bd');
      svg.appendChild(bg);
      const title=document.createElementNS(ns,'text');
      title.setAttribute('x',width/2);title.setAttribute('y',36);title.setAttribute('text-anchor','middle');title.setAttribute('class','stat-title');
      title.textContent='113 學年各級學校新住民子女學生數—按父(母)前 3 大原生地區或國家分';
      svg.appendChild(title);
      const unit=document.createElementNS(ns,'text');
      unit.setAttribute('x',width-40);unit.setAttribute('y',70);unit.setAttribute('text-anchor','end');unit.setAttribute('class','stat-unit rounded-body');
      unit.textContent='單位：萬人';svg.appendChild(unit);

      const legend=[['大陸地區','#cfb66b'],['越南','#e4c98d'],['印尼','#f1dec0']];
      legend.forEach((l,i)=>{
        const x=430+i*120,y=108;
        const rect=document.createElementNS(ns,'rect');
        rect.setAttribute('x',x);rect.setAttribute('y',y-10);rect.setAttribute('width',10);rect.setAttribute('height',10);rect.setAttribute('fill',l[1]);
        svg.appendChild(rect);
        const t=document.createElementNS(ns,'text');
        t.setAttribute('x',x+16);t.setAttribute('y',y);t.setAttribute('class','stat-legend-muted rounded-body');t.textContent=l[0];
        svg.appendChild(t);
      });

      const axisY=margin.t+chartH;
      const axis=document.createElementNS(ns,'line');
      axis.setAttribute('x1',margin.l);axis.setAttribute('y1',axisY);axis.setAttribute('x2',width-margin.r);axis.setAttribute('y2',axisY);
      axis.setAttribute('stroke','#73624a');axis.setAttribute('stroke-width','2.5');svg.appendChild(axis);

      const groupW=chartW/top3OriginByLevelData.length, barW=30, gap=10;
      top3OriginByLevelData.forEach((d,i)=>{
        const cxg=margin.l+groupW*i+groupW/2;
        const bars=[
          ['mainland',d.mainland,d.mainlandPct,'#cfb66b'],
          ['vietnam',d.vietnam,d.vietnamPct,'#e4c98d'],
          ['indonesia',d.indonesia,d.indonesiaPct,'#f1dec0']
        ];
        bars.forEach((b,j)=>{
          const x=cxg-(barW*3+gap*2)/2+j*(barW+gap);
          const h=b[1]/max*chartH;
          const y=axisY-h;
          const rect=document.createElementNS(ns,'rect');
          rect.setAttribute('x',x);rect.setAttribute('y',y);rect.setAttribute('width',barW);rect.setAttribute('height',h);rect.setAttribute('fill',b[3]);
          rect.setAttribute('stroke','#f3efe6');rect.setAttribute('stroke-width','1');
          svg.appendChild(rect);
          const tx=document.createElementNS(ns,'text');
          tx.setAttribute('x',x+barW/2);tx.setAttribute('y',y-10);tx.setAttribute('text-anchor','middle');tx.setAttribute('class','bar-label-muted rounded-body');
          tx.innerHTML=`<tspan x="${x+barW/2}" dy="0">${b[1].toFixed(1)}</tspan><tspan x="${x+barW/2}" dy="20">(${b[2].toFixed(1)}%)</tspan>`;
          svg.appendChild(tx);
        });
        const lx=document.createElementNS(ns,'text');
        lx.setAttribute('x',cxg);lx.setAttribute('y',axisY+34);lx.setAttribute('text-anchor','middle');lx.setAttribute('class','axis-label-muted rounded-body');
        lx.textContent=d.level;svg.appendChild(lx);
      });
      const note=document.createElementNS(ns,'text');
      note.setAttribute('x',margin.l);note.setAttribute('y',height-26);note.setAttribute('class','stat-note rounded-body');
      note.textContent='說明：括弧內數據為該父(母)原生地區或國家之學生數占比。';
      svg.appendChild(note);
      el.innerHTML='';el.appendChild(svg);
    }


    
    function renderLevelTrendChart(){
      const el=document.getElementById('levelTrendChart');
      if(!el) return;
      const ns='http://www.w3.org/2000/svg';
      const width=700,height=430,margin={l:54,r:138,t:58,b:58},chartW=468,chartH=260,totalMax=50,ratioMax=8;
      const svg=document.createElementNS(ns,'svg');
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      svg.classList.add('stat-svg');

      const title=document.createElementNS(ns,'text');
      title.setAttribute('x',width/2);title.setAttribute('y',36);title.setAttribute('text-anchor','middle');title.setAttribute('class','stat-title');
      title.textContent='各級學校新住民子女學生數';svg.appendChild(title);

      const accent='#7d6a4d', axis='#5b5b5b', lineColor='#b98939';
      const leftTitle=document.createElementNS(ns,'text');leftTitle.setAttribute('x',margin.l-34);leftTitle.setAttribute('y',76);leftTitle.setAttribute('class','left-axis-title-muted rounded-body');leftTitle.textContent='新住民子女學生數(萬人)';svg.appendChild(leftTitle);
      const rightTitle=document.createElementNS(ns,'text');rightTitle.setAttribute('x',margin.l+chartW-112);rightTitle.setAttribute('y',76);rightTitle.setAttribute('class','right-axis-title-muted rounded-body');rightTitle.textContent='占學生總數比率(%)';svg.appendChild(rightTitle);

      const x0=margin.l,y0=margin.t+chartH;
      const leftAxis=document.createElementNS(ns,'line');leftAxis.setAttribute('x1',x0);leftAxis.setAttribute('y1',margin.t);leftAxis.setAttribute('x2',x0);leftAxis.setAttribute('y2',y0);leftAxis.setAttribute('stroke',axis);leftAxis.setAttribute('stroke-width','2.5');svg.appendChild(leftAxis);
      const bottom=document.createElementNS(ns,'line');bottom.setAttribute('x1',x0);bottom.setAttribute('y1',y0);bottom.setAttribute('x2',x0+chartW);bottom.setAttribute('y2',y0);bottom.setAttribute('stroke',axis);bottom.setAttribute('stroke-width','2.5');svg.appendChild(bottom);
      const rightAxis=document.createElementNS(ns,'line');rightAxis.setAttribute('x1',x0+chartW);rightAxis.setAttribute('y1',margin.t);rightAxis.setAttribute('x2',x0+chartW);rightAxis.setAttribute('y2',y0);rightAxis.setAttribute('stroke',accent);rightAxis.setAttribute('stroke-width','2.5');svg.appendChild(rightAxis);

      [0,10,20,30,40,50].forEach(v=>{
        const y=y0-v/totalMax*chartH;
        const t=document.createElementNS(ns,'text');t.setAttribute('x',x0-20);t.setAttribute('y',y+5);t.setAttribute('text-anchor','end');t.setAttribute('class','left-axis-num-muted rounded-body');t.textContent=v;svg.appendChild(t);
        const tick=document.createElementNS(ns,'line');tick.setAttribute('x1',x0-6);tick.setAttribute('y1',y);tick.setAttribute('x2',x0);tick.setAttribute('y2',y);tick.setAttribute('stroke',axis);tick.setAttribute('stroke-width','2');svg.appendChild(tick);
      });
      [0,2,4,6,8].forEach(v=>{
        const y=y0-v/ratioMax*chartH;
        const t=document.createElementNS(ns,'text');t.setAttribute('x',x0+chartW+18);t.setAttribute('y',y+5);t.setAttribute('class','right-axis-num-muted rounded-body');t.textContent=v;svg.appendChild(t);
        const tick=document.createElementNS(ns,'line');tick.setAttribute('x1',x0+chartW);tick.setAttribute('y1',y);tick.setAttribute('x2',x0+chartW+6);tick.setAttribute('y2',y);tick.setAttribute('stroke',accent);tick.setAttribute('stroke-width','2');svg.appendChild(tick);
      });

      const stackKeys=[
        ['kindergarten','幼兒園','#d7d2c7'],
        ['elementary','國小','#cfc9bb'],
        ['junior','國中','#c2b8a5'],
        ['senior','高級中等學校','#d8c071'],
        ['college','大專校院','#a7a19a']
      ];
      const groupW=chartW/levelTrendData.length, barW=44;
      const linePts=[];
      levelTrendData.forEach((d,i)=>{
        const x=x0+groupW*i+groupW/2;
        let currentY=y0;
        stackKeys.forEach(k=>{
          const h=d[k[0]]/totalMax*chartH;
          const rect=document.createElementNS(ns,'rect');
          rect.setAttribute('x',x-barW/2);rect.setAttribute('y',currentY-h);rect.setAttribute('width',barW);rect.setAttribute('height',h);rect.setAttribute('fill',k[2]);
          rect.setAttribute('stroke','#f5f2eb');rect.setAttribute('stroke-width','1');
          svg.appendChild(rect);
          currentY-=h;
        });
        const totalY=y0-d.total/totalMax*chartH;
        const total=document.createElementNS(ns,'text');total.setAttribute('x',x);total.setAttribute('y',totalY-14);total.setAttribute('text-anchor','middle');total.setAttribute('class','total-label-muted rounded-body');total.textContent=d.total.toFixed(1);svg.appendChild(total);
        const year=document.createElementNS(ns,'text');year.setAttribute('x',x);year.setAttribute('y',y0+34);year.setAttribute('text-anchor','middle');year.setAttribute('class','axis-label-dark rounded-body');year.textContent=d.year;svg.appendChild(year);
        const ratioY=y0-d.ratio/ratioMax*chartH;
        linePts.push([x,ratioY,d.ratio]);
      });

      const poly=document.createElementNS(ns,'polyline');
      poly.setAttribute('points',linePts.map(p=>`${p[0]},${p[1]}`).join(' '));
      poly.setAttribute('fill','none');poly.setAttribute('stroke',lineColor);poly.setAttribute('stroke-width','4');svg.appendChild(poly);
      linePts.forEach(p=>{
        const c=document.createElementNS(ns,'circle');c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1]);c.setAttribute('r','7');c.setAttribute('fill','#fff');c.setAttribute('stroke',lineColor);c.setAttribute('stroke-width','4');svg.appendChild(c);
        const t=document.createElementNS(ns,'text');t.setAttribute('x',p[0]);t.setAttribute('y',p[1]-20);t.setAttribute('text-anchor','middle');t.setAttribute('class','ratio-label-muted rounded-body');t.textContent=p[2].toFixed(1);svg.appendChild(t);
      });

      const labels=[
        {year:'108',key:'kindergarten',text:'2.6'},
        {year:'108',key:'elementary',text:'9.1'},
        {year:'108',key:'junior',text:'6.2'},
        {year:'108',key:'senior',text:'8.0'},
        {year:'108',key:'college',text:'5.2'},
        {year:'113',key:'kindergarten',text:'2.1'},
        {year:'113',key:'elementary',text:'6.8'},
        {year:'113',key:'junior',text:'3.6'},
        {year:'113',key:'senior',text:'5.1'},
        {year:'113',key:'college',text:'9.0'}
      ];
      labels.forEach(l=>{
        const i=levelTrendData.findIndex(d=>d.year===l.year),d=levelTrendData[i];
        const x=x0+groupW*i+groupW/2;
        let y=y0;
        for(const k of stackKeys){
          const h=d[k[0]]/totalMax*chartH;
          if(k[0]===l.key){
            const t=document.createElementNS(ns,'text');t.setAttribute('x',x);t.setAttribute('y',y-h/2+5);t.setAttribute('text-anchor','middle');t.setAttribute('class','stack-label-muted rounded-body');t.textContent=l.text;svg.appendChild(t);
            break;
          }
          y-=h;
        }
      });

      const lx=560,ly=96;
      stackKeys.slice().reverse().forEach((k,i)=>{
        const y=ly+i*38;
        const line=document.createElementNS(ns,'line');line.setAttribute('x1',lx);line.setAttribute('y1',y);line.setAttribute('x2',lx+42);line.setAttribute('y2',y);line.setAttribute('stroke',k[2]);line.setAttribute('stroke-width','11');svg.appendChild(line);
        const t=document.createElementNS(ns,'text');t.setAttribute('x',lx+55);t.setAttribute('y',y+8);t.setAttribute('class','stat-legend-muted rounded-body');t.textContent=k[1];svg.appendChild(t);
      });
      const yLine=ly+5*38+14;
      const legendLine=document.createElementNS(ns,'line');legendLine.setAttribute('x1',lx);legendLine.setAttribute('y1',yLine);legendLine.setAttribute('x2',lx+42);legendLine.setAttribute('y2',yLine);legendLine.setAttribute('stroke',lineColor);legendLine.setAttribute('stroke-width','4');svg.appendChild(legendLine);
      const lc=document.createElementNS(ns,'circle');lc.setAttribute('cx',lx+21);lc.setAttribute('cy',yLine);lc.setAttribute('r','7');lc.setAttribute('fill','#fff');lc.setAttribute('stroke',lineColor);lc.setAttribute('stroke-width','4');svg.appendChild(lc);
      const lt=document.createElementNS(ns,'text');lt.setAttribute('x',lx+55);lt.setAttribute('y',yLine+8);lt.setAttribute('class','stat-legend-muted rounded-body');lt.textContent='占學生總數比率';svg.appendChild(lt);

      const foot=document.createElementNS(ns,'text');foot.setAttribute('x',14);foot.setAttribute('y',height-10);foot.setAttribute('class','stat-note rounded-body');foot.textContent='本提要分析國中、小部分之資料係由學校公務查報而得，至幼兒園、高級中等學校及大專校院部分，係將各該級學校學生學籍資料連結內政部移民署新住民子女資料後產生。';svg.appendChild(foot);
      el.innerHTML='';el.appendChild(svg);
    }


    function renderEnding(){const d=endingData[state.persona];if(!d) return;document.getElementById('endingTitle').textContent=d.title;document.getElementById('endingText').innerHTML=d.text.map(x=>`<p>${x}</p>`).join('');const ctaEl=document.getElementById('ctaText');ctaEl.textContent=d.cta||'';ctaEl.style.display=d.cta?'block':'none';}

    function showModal(type){
      const modal=document.getElementById('modal');
      const flowSteps=[
        '入學申請（家長、監護人申請）',
        '專業評估（多面向能力與需求分析）',
        '習得會議（專家、校方、家長共同制定量身計畫）',
        '編班作業（依評估結果妥善安排）',
        '適性輔導（持續性語言與生活支持）',
        '持續追蹤（定期評估、動態調整）'
      ];
      const flowHTML=`
        <div class="flow-chart">
          ${flowSteps.map((step,idx)=>`
            <div class="flow-step">
              <div class="flow-index">${String(idx+1).padStart(2,'0')}</div>
              <div class="flow-label">${step}</div>
            </div>
            ${idx<flowSteps.length-1?'<div class="flow-arrow">↓</div>':''}
          `).join('')}
        </div>
        <div class="mt-3 text-[10px] leading-relaxed text-gray-500 text-right">圖表製作／ 黃律齊　資料來源／ 台北市中山區濱江國民小學校長吳勝學</div>
        <div class="mt-5 bg-blue-50 border-l-4 border-blue-700 p-4 text-sm leading-relaxed text-slate-700">依教育部國民及學前教育署規定，跨轉生缺乏基礎華語表達溝通能力者可申請「華語文學習扶助課程」，每班最高可獲244節免費的扶助課程（上、下學期至多各72節、暑假80節、寒假20節），112學年度共計439名學生申請。</div>`;
      const views={
        case:{t:'個案心情（模擬）',b:`<div class="case-mood-list"><div class="mood-card">
          <div class="mood-name">宇薇<span>（從越南返台）</span></div>
          <p class="mood-foreign">Khi giáo viên hỏi tôi, tôi chỉ nghe hiểu được vài từ. Dù các bạn trong lớp không cười tôi, nhưng tôi vẫn cảm thấy rất xấu hổ.</p>
          <p class="mood-zh">老師問我問題的時候，我只聽懂幾個字，雖然同學沒有笑我，但我還是覺得很丟臉。</p>
        </div><div class="mood-card">
          <div class="mood-name">伯仲<span>（從緬甸返台）</span></div>
          <p class="mood-foreign">ကိုယ့်နိုင်ငံမှာတုန်းက ကျွန်တော်/ကျွန်မရဲ့အ成绩က မဆိုးခဲ့ပါဘူး။ ဒါပေမဲ့ ဒီကိုရောက်လာပြီးနောက်မှာတော့ ရုတ်တရက် ဘာမှမလုပ်တတ်တဲ့လူတစ်ယောက်လို ဖြစ်သွားသလိုခံစားရပြီး၊ အဲဒါက ကျွန်တော်/ကျွန်မအတွက် အတော်လေး မကျင့်သားရပါဘူး။</p>
          <p class="mood-zh">我以前在自己的國家成績不差，但來到這裡以後，突然變成什麼都不會的人，這讓我很不適應。</p>
        </div><div class="mood-card">
          <div class="mood-name">英屹<span>（從法國返台）</span></div>
          <p class="mood-foreign">Ce matin, un camarade de classe m’a spontanément accompagné à la coopérative scolaire. Même si je ne comprenais pas très bien ce qu’il disait, j’ai quand même ressenti une certaine chaleur dans mon cœur.</p>
          <p class="mood-zh">早上有同學主動帶我去福利社，我雖然聽不太懂他說什麼，但還是覺得心裡暖暖的。</p>
        </div><div class="mood-card">
          <div class="mood-name">佳薇<span>（從泰國返台）</span></div>
          <p class="mood-foreign">วันนี้ในที่สุดก็มีเพื่อนร่วมชั้นมาคุยกับฉันตอนพักหลังเลิกเรียน แต่ฉันฟังไม่เข้าใจว่าเขาพูดอะไร จึงไม่รู้จะตอบอย่างไร เขาดูเหมือนจะไม่ค่อยพอใจเพราะเรื่องนี้ ฉันจึงรู้สึกจนใจมาก</p>
          <p class="mood-zh">今天終於有同學在下課的時候跟我說話，但我聽不懂他說什麼，所以也無從回應，他好像因此不太開心，我覺得很無奈。</p>
        </div><div class="mood-card">
          <div class="mood-name">子恩<span>（從柬埔寨返台）</span></div>
          <p class="mood-foreign">ខ្ញុំសង្ឃឹមថាមិត្តរួមថ្នាក់មិនសួរខ្ញុំតែថា «អ្នកមកពីណា?» ប៉ុណ្ណោះទេ ប៉ុន្តែក៏អាចសួរខ្ញុំថាខ្ញុំចូលចិត្តអ្វី និងសាលាចាស់របស់ខ្ញុំមានលក្ខណៈយ៉ាងដូចម្តេចផងដែរ។</p>
          <p class="mood-zh">我希望同學不要只問我「你是哪裡人」，也可以問我喜歡什麼、以前的學校是什麼樣子。</p>
        </div><div class="mood-card">
          <div class="mood-name">巧芸<span>（從越南返台）</span></div>
          <p class="mood-foreign">Sự đồng hành của giáo viên tiếng Hoa rất quan trọng đối với tôi.</p>
          <p class="mood-zh">華語老師的陪伴對我而言很重要。</p>
        </div><div class="mood-card">
          <div class="mood-name">子靖<span>（從日本返台）</span></div>
          <p class="mood-foreign">三か月間の中国語補習授業を受けた後、私は先生が授業中に話していることを少しずつ聞き取れるようになり、とても達成感を感じました。</p>
          <p class="mood-zh">在上了三個月的華語輔導課後，我開始稍微聽得懂老師在課堂上說的話了，我覺得很有成就感。</p>
        </div><div class="mood-card">
          <div class="mood-name">綺貞<span>（從泰國返台）</span></div>
          <p class="mood-foreign">ฉันอยากมีเพื่อนมาก แต่ทุกครั้งก่อนจะอ้าปากพูด ฉันมักจะกังวลก่อนว่าจะพูดผิด สุดท้ายจึงไม่ได้พูดอะไรเลย</p>
          <p class="mood-zh">我很想交朋友，可是每次要開口前，都會先擔心自己說錯話，所以最後什麼也沒說。</p>
        </div><div class="mood-card">
          <div class="mood-name">俊霖<span>（從越南返台）</span></div>
          <p class="mood-foreign">Mỗi lần nghe hiểu trọn vẹn một câu tiếng Trung, tôi đều thầm vui trong lòng và cảm thấy hôm nay hình như mình lại tiến bộ thêm một chút.</p>
          <p class="mood-zh">每次聽懂一句完整的中文，我都會在心裡偷偷高興，覺得今天好像又前進了一點。</p>
        </div></div>`},
        stat:{t:'統計報表',b:`<div class="stat-grid">
          <div class="chart-card stat-card-uniform p-4">
            <div class="font-bold text-sm text-gray-800 text-center mb-1">跨轉生來臺前居住國</div>
            <div id="statBeforeCountryChart" class="pie-shell"></div>
            <div class="mt-3 text-[10px] leading-relaxed text-gray-500 text-right">圖表製作／ 黃律齊　資料來源／ 教育部國民及學前教育署新住民子女教育網</div>
          </div>
          <div class="chart-card stat-card-uniform p-4 bg-amber-50 border-amber-200">
            <div class="font-bold text-sm text-amber-900 text-center mb-1">跨轉生來台後居住縣市</div>
            <div id="afterCountyChart" class="pie-shell"></div>
            <div class="mt-3 text-[10px] leading-relaxed text-gray-500 text-right">圖表製作／ 黃律齊　資料來源／ 教育部國民及學前教育署新住民子女教育網</div>
          </div>
          <div class="chart-card stat-card-uniform p-4">
            <div class="chart-scroll compact-scroll flex-1"><div id="nativeOriginDonutChart"></div></div>
            <div class="mt-3 text-[10px] leading-relaxed text-gray-500 text-right">圖表製作／ 黃律齊　資料來源／教育部全球資訊網</div>
          </div>
          <div class="chart-card stat-card-uniform p-4">
            <div class="chart-scroll compact-scroll flex-1"><div id="levelTrendChart"></div></div>
            <div class="mt-3 text-[10px] leading-relaxed text-gray-500 text-right">圖表製作／ 黃律齊　資料來源／教育部全球資訊網</div>
          </div>
        </div>`},
        teach:{t:'教學支援',b:'<p>教學支援核心：穩定師資、華語專業、明確分工。</p>'},
        admin_work:{t:'行政作業',b:flowHTML}
      };
      const v=views[type];
      modal.innerHTML=`<div class="modal-card"><div class="modal-top"><span>${v.t}</span><button onclick="closeModal()" class="sys-button text-white hover:text-red-400 font-bold bg-gray-700 px-3 py-1 rounded">✕</button></div><div class="modal-body-inner">${v.b}</div></div>`;
      modal.style.display='flex';
      if(type==='stat') setTimeout(renderStatCharts,0);
    }
    function closeModal(){document.getElementById('modal').style.display='none'}

    function selfTests(){
      console.assert(typeof selectPersona === 'function', 'selectPersona should be defined');
      console.assert(Array.isArray(beforeCountryData), 'beforeCountryData should be an array');
      console.assert(Array.isArray(afterCountyData), 'afterCountyData should be an array');
      console.assert(beforeCountryData.length > 0, 'beforeCountryData should not be empty');
      console.assert(typeof renderCountryCharts === 'function', 'renderCountryCharts should be defined');
      console.assert(typeof showPersonaQuiz === 'function', 'showPersonaQuiz should be defined');
      console.assert(typeof bbStartGame === 'function', 'bbStartGame should be defined');
      console.assert(typeof sgStartGame === 'function', 'sgStartGame should be defined');
    }

    function resetStory(){
      state={persona:'',progress:0};
      document.getElementById('sidebar').style.display='none';
      document.getElementById('currentPersonaDisplay').textContent='GUEST';
      document.querySelectorAll('#articleContent section').forEach(s=>{s.classList.remove('unlocked');s.classList.add('locked')});
      document.getElementById('personaSection').classList.remove('hidden');
      document.getElementById('chapter1Narrative').classList.add('hidden');
      const quizSection=document.getElementById('quizSection');
      if(quizSection) quizSection.classList.add('hidden');
      document.getElementById('countryQuizResult').classList.add('hidden');
      document.getElementById('countryCharts').classList.add('hidden');
      document.getElementById('countryQuizContent').className='grid gap-2 transition-colors duration-300';
      document.querySelectorAll('.country-option').forEach(b=>{b.disabled=false;b.className='sys-button bg-white p-3 text-xs text-left country-option'+(b.classList.contains('correct-country-option')?' correct-country-option':'')});
      document.getElementById('chapter2QuizResult').classList.add('hidden');
      document.querySelectorAll('.chapter2-option').forEach(b=>{b.disabled=false;b.classList.remove('bg-green-500','bg-red-500','text-white')});
      document.getElementById('sgReading').classList.add('hidden');
      document.getElementById('sgStart').classList.remove('hidden');
      document.getElementById('sgGame').classList.add('hidden');
      document.getElementById('sgResult').classList.add('hidden');
      bbRestart();
      updateProgress(0);
      window.scrollTo({top:0,behavior:'smooth'});
    }

    function initPage(){
      createLandingGreetings();
      selfTests();
      resetStory();
      document.getElementById('personaSection').classList.remove('hidden');
    }

    initPage();
