(function(){const d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');for(const id of['m','auth']){const e=document.getElementById(id);Object.defineProperty(e,'innerHTML',{get(){return d.get.call(this)},set(v){d.set.call(this,TX.render(v))}})}})();

// ===== data =====
const FM='https://calculus.flippedmath.com/',CB='https://apcentral.collegeboard.org/courses/ap-calculus-bc/exam/past-exam-questions';
const D=(m,d,y=2026)=>new Date(y,m-1,d),EXAM=D(5,10,2027);
const UN=[
{id:0,n:'Prerequisites',s:D(10,7),e:D(10,25),url:'https://www.khanacademy.org/math/precalculus',f:'Functions, trig & unit circle, rational functions, algebra, calculator setup.',t:['Composite & inverse functions','Unit circle & identities','Rational functions','Exponent/log rules','Calculator skills']},
{id:1,n:'Limits & Continuity',s:D(10,26),e:D(11,8),url:FM+'unit-1.html',f:'One-sided limits, algebraic limits, continuity (3 parts), IVT.',t:['Limits from graphs/tables','Algebraic limits','Squeeze theorem','Continuity & discontinuities','Asymptotes','IVT']},
{id:2,n:'Derivative Definition & Rules',s:D(11,9),e:D(11,22),url:FM+'unit-2.html',f:'Power/product/quotient rules, trig & exp/log derivatives, tangent lines.',t:['Limit definition','Differentiability vs continuity','Power rule','Product & quotient','Trig derivatives']},
{id:3,n:'Chain, Implicit & Inverse',s:D(11,23),e:D(12,6),url:FM+'unit-3.html',f:'Chain rule everywhere, implicit dy/dx, inverse & inverse-trig derivatives.',t:['Chain rule','Implicit differentiation','Inverse functions','Inverse trig','Higher-order']},
{id:4,n:'Contextual Applications',s:D(12,7),e:D(12,20),url:FM+'unit-4.html',f:'Derivative in context with units, motion, related rates, linearization, L’Hôpital.',t:['Meaning in context','Motion','Related rates','Linearization','L’Hôpital']},
{id:5,n:'Analytical Applications',s:D(12,21),e:D(1,10,2027),url:FM+'unit-5.html',f:'Justify extrema, concavity, inflection; MVT/EVT; optimization.',t:['MVT & EVT','First derivative test','Concavity & 2nd derivative test','Absolute extrema','Optimization','f, f′, f″ graphs']},
{id:6,n:'Integration & Accumulation',s:D(1,11,2027),e:D(1,31,2027),url:FM+'unit-6.html',f:'Riemann sums, FTC, u-sub, parts, partial fractions, improper integrals.',t:['Riemann & trapezoid sums','FTC & accumulation functions','u-substitution','Integration by parts','Partial fractions','Improper integrals']},
{id:7,n:'Differential Equations',s:D(2,1,2027),e:D(2,14,2027),url:FM+'unit-7.html',f:'Slope fields, separation of variables, Euler, exponential & logistic models.',t:['Slope fields','Separation of variables','Euler’s method','Exponential models','Logistic models']},
{id:8,n:'Applications of Integration',s:D(2,15,2027),e:D(3,7,2027),url:FM+'unit-8.html',f:'Average value, motion, area between curves, volumes, arc length.',t:['Average value','Motion via integrals','Area between curves','Cross-sections','Discs & washers','Arc length']},
{id:9,n:'Parametric, Vector & Polar',s:D(3,8,2027),e:D(3,21,2027),url:FM+'unit-9.html',f:'Parametric derivatives, speed, arc length, vector motion, polar slope & area.',t:['Parametric derivatives','Parametric arc length','Vector-valued motion','Polar derivatives','Polar area']},
{id:10,n:'Series',s:D(3,22),e:D(4,4,2027),url:FM+'unit-10.html',f:'Convergence tests, error bounds, Taylor/Maclaurin, radius & interval.',t:['Convergence tests','Geometric & p-series','Alternating & Lagrange error','Taylor/Maclaurin','Radius/interval of convergence']}];
UN[10].s=D(3,22,2027);
const STAGE6={s:D(4,5,2027),e:D(5,9,2027)};
let LES={},OS=[];
// ===== state =====
let USER=null,S=null,PS={src:'mix'},SEEN=new Set();const DEF=()=>({chk:{},st:{},log:[],frq:[],hist:[],seen:{},ts:0});S=DEF();
const kS=u=>'apbc:'+u;
function save(){if(!USER)return;S.ts=Date.now();try{localStorage[kS(USER.id)]=JSON.stringify(S)}catch(e){}if(USER.g)gPushSoon();if(USER.srv)srvSoon()}
// ===== accounts (local) =====
const H=async(p,s)=>{const d=new TextEncoder().encode(s+p);if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest('SHA-256',d);return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}let h=5381;for(const c of s+p)h=(h*33^c.charCodeAt(0))>>>0;return String(h)};
const UR=()=>JSON.parse(localStorage['apbc:users']||'{}');
function authUI(msg=''){auth.style.display='flex';auth.innerHTML=`<div class=box><h1>BC Mastery</h1><p class=muted>AP Calculus BC · sign in to save your progress.</p>${msg?`<p class=lock>${msg}</p>`:''}<input id=au type=text placeholder="Username" style="width:100%;margin:4px 0" value="${localStorage['apbc:last']||''}"><input id=ap type=password placeholder="PIN or password (4+ characters)" style="width:100%;margin:4px 0"><div class=row><button onclick="lSign()">Sign in</button><button class=alt onclick="lNew()">Create account</button></div><hr><button style="width:100%;margin:4px 0" onclick="gLogin()">Sign in with Google (Drive sync)</button><button class=alt style="width:100%" onclick="guest()">Continue as guest</button><p class=muted style="font-size:12px">Local accounts and guest data stay in this browser. Google sign-in also keeps a small backup file in your own Drive.</p></div>`}
async function lNewLocal(){const n=au.value.trim(),p=ap.value;if(!n||p.length<4)return authUI('Enter a username and a 4+ character PIN.');const U=UR();if(U[n.toLowerCase()])return authUI('That username exists. Sign in instead.');const s=Math.random().toString(36).slice(2);U[n.toLowerCase()]={s,h:await H(p,s),n};localStorage['apbc:users']=JSON.stringify(U);login({id:'u:'+n.toLowerCase(),name:n})}
async function lSignLocal(){const n=au.value.trim().toLowerCase(),r=UR()[n];if(!r||r.h!==await H(ap.value,r.s))return authUI('Wrong username or PIN.');login({id:'u:'+n,name:r.n})}
const guest=()=>login({id:'guest',name:'Guest'});
function login(u,prog){USER=u;localStorage['apbc:last']=u.name;let loc=null;try{loc=JSON.parse(localStorage[kS(u.id)])}catch(e){}S=Object.assign(DEF(),prog&&Object.keys(prog).length&&(!loc||(prog.ts||0)>=(loc.ts||0))?prog:loc||{});afterLogin()}
function afterLogin(){auth.style.display='none';who.innerHTML=`${USER.name}${USER.g?' · Google':''}<br><a style="cursor:pointer;text-decoration:underline" onclick="logout()">Sign out</a>`;go2('dash')}
function logout(){if(USER&&USER.srv){api('logout',{method:'POST'});TOK=null;localStorage.removeItem('apbc:tok')}clearInterval(timer);E=null;setCalc(false);USER=null;gTok=null;authUI()}
// ===== server accounts =====
const API=location.protocol!=='file:';let TOK=localStorage['apbc:tok']||null,srvT;
async function api(p,o={}){try{const r=await fetch('/api/'+p,{method:o.method||'GET',headers:{'Content-Type':'application/json',...(TOK?{Authorization:'Bearer '+TOK}:{})},body:o.body?JSON.stringify(o.body):undefined});return await r.json()}catch(e){return{error:'Server unreachable'}}}
const srvSoon=()=>{clearTimeout(srvT);srvT=setTimeout(()=>api('progress',{method:'PUT',body:S}),1500)};
const srvIn=r=>{TOK=r.token;localStorage['apbc:tok']=TOK;login({id:'s:'+r.id,name:r.name,srv:1},r.progress)};
async function lNew(){if(!API)return lNewLocal();const n=au.value.trim(),p=ap.value;if(n.length<2||p.length<4)return authUI('Enter a username (2+ chars) and a 4+ character PIN.');const r=await api('register',{method:'POST',body:{name:n,pin:p}});if(r.error)return authUI(r.error);srvIn(r)}
async function lSign(){if(!API)return lSignLocal();const r=await api('login',{method:'POST',body:{name:au.value.trim(),pin:ap.value}});if(r.error)return authUI(r.error);srvIn(r)}
async function boot(){try{[OS,LES]=await Promise.all([fetch('data/openstax.json').then(r=>r.json()),fetch('data/lessons.json').then(r=>r.json())]);OS.forEach((x,i)=>x.i=i)}catch(e){m.innerHTML='<div class=card>Could not load data files. Start the server with <code>node server.js</code> and open http://localhost:3000</div>';auth.style.display='none';return}
 if(API&&TOK){const r=await api('progress');if(r&&r.id)return login({id:'s:'+r.id,name:r.name,srv:1},r.progress);TOK=null}authUI()}
// ===== Google sign-in + Drive appData sync =====
let gTok=null,gT=null,gTm;const GID=()=>localStorage['apbc:gcid']||'';
const gf=(u,o={})=>fetch(u,{...o,headers:{...(o.headers||{}),Authorization:'Bearer '+gTok}});
const syncMsg=t=>{const e=document.getElementById('sm');if(e)e.textContent=t};
function gLogin(){if(!GID()){authUI('Google sign-in needs your OAuth Client ID. Continue as guest, open Settings → Google Drive sync, and follow the 4 setup steps.');return}
 if(location.protocol==='file:'){authUI('Google sign-in does not work from a file. Serve the folder: run “node server.js” and open http://localhost:3000');return}
 const go=()=>{gT=google.accounts.oauth2.initTokenClient({client_id:GID(),scope:'https://www.googleapis.com/auth/drive.appdata openid profile email',callback:async r=>{if(r.error)return authUI('Google: '+r.error);gTok=r.access_token;const u=await gf('https://www.googleapis.com/oauth2/v3/userinfo').then(r=>r.json());gUser(u)}});gT.requestAccessToken()};
 if(window.google&&google.accounts)return go();const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.onload=go;document.head.appendChild(s)}
async function gUser(u){const id='g'+u.sub;let loc=null;try{loc=JSON.parse(localStorage[kS(id)])}catch(e){}USER={id,name:u.name||u.email,g:1};let rem=null;
 try{const l=await gf("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name%3D'bcmastery.json'&fields=files(id)").then(r=>r.json());if(l.files&&l.files[0]){USER.fid=l.files[0].id;rem=await gf('https://www.googleapis.com/drive/v3/files/'+USER.fid+'?alt=media').then(r=>r.json())}}catch(e){}
 S=Object.assign(DEF(),rem&&(!loc||rem.ts>=loc.ts)?rem:loc||{});afterLogin();gPush()}
async function gPush(){if(!USER||!USER.g||!gTok)return;const body=JSON.stringify(S);try{let r;if(USER.fid)r=await gf('https://www.googleapis.com/upload/drive/v3/files/'+USER.fid+'?uploadType=media',{method:'PATCH',headers:{'Content-Type':'application/json'},body});else{const b='bcm',meta={name:'bcmastery.json',parents:['appDataFolder']};r=await gf('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',{method:'POST',headers:{'Content-Type':'multipart/related; boundary='+b},body:`--${b}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(meta)}\r\n--${b}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${b}--`});const j=await r.json();USER.fid=j.id}
 if(r.status===401)throw 0;syncMsg('Synced to Google Drive '+new Date().toLocaleTimeString())}catch(e){syncMsg('Sync failed. Use “Sync now” to re-authorize.')}}
const gPushSoon=()=>{clearTimeout(gTm);gTm=setTimeout(gPush,3000)};
const gResync=()=>{if(gT)gT.requestAccessToken({callback:0});else gLogin()};
function exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='bc-mastery-backup.json';a.click()}
function imp(i){const f=i.files[0];if(!f)return;f.text().then(t=>{try{S=Object.assign(DEF(),JSON.parse(t));save();go2('dash')}catch(e){alert('Not a valid backup file')}})}
// ===== question generators (LaTeX) =====
const tx=String.raw,R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),sh=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]),fx=(x,d=3)=>String(+x.toFixed(d)),pk=a=>a[R(0,a.length-1)];
const M=s=>'$'+s+'$',fr=(a,b)=>tx`\frac{${a}}{${b}}`;
function mc(q,c,w,o={}){c=M(c);const ws=[...new Set([...w.map(M),M('0'),M('1'),M('2'),M('-1')])].filter(x=>x!==c).slice(0,3);const opts=sh([c,...ws]);return{q,opts,a:opts.indexOf(c),...o}}
function nm(q,v,o={}){const c=fx(v),ws=[...new Set([fx(v*2),fx(v/2),fx(v+.5*R(1,3)),fx(v-1.1),fx(-v)])].filter(x=>x!==c).slice(0,3),opts=sh([c,...ws]);return{q,opts,a:opts.indexOf(c),...o}}
const simp=(f,a,b,n=400)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
const G=[];const g=(u,c,f)=>G.push({u,c,f});
// Unit 1
g(1,0,()=>{const a=R(2,9);return mc(tx`Evaluate $\displaystyle\lim_{x\to ${a}}\frac{x^2-${a*a}}{x-${a}}$.`,`${2*a}`,[`${a}`,`${a*a}`,tx`\text{DNE}`],{ex:tx`Factor: $\frac{(x-a)(x+a)}{x-a}\to x+a=${2*a}$.`})});
g(1,0,()=>{const a=R(2,7),b=a+R(1,5);return mc(tx`Evaluate $\displaystyle\lim_{x\to\infty}\frac{${a}x^2+3x}{${b}x^2-1}$.`,fr(a,b),[fr(b,a),'0',tx`\infty`],{ex:'Equal degrees: ratio of leading coefficients.'})});
g(1,0,()=>{const a=R(2,5);return mc(tx`For what value of $k$ is $f(x)=\begin{cases}x^2 & x\ge ${a}\\ x+k & x<${a}\end{cases}$ continuous at $x=${a}$?`,`${a*a-a}`,[`${a*a}`,`${a}`,`${a*a+a}`],{ex:tx`Need $${a}^2=${a}+k$, so $k=${a*a-a}$.`})});
g(1,0,()=>{const a=R(2,6);return mc(tx`Evaluate $\displaystyle\lim_{x\to0}\frac{\sin ${a}x}{x}$.`,`${a}`,['1','0',fr(1,a)],{ex:tx`$\frac{\sin ax}{x}=a\cdot\frac{\sin ax}{ax}\to a$.`})});
// Unit 2
g(2,0,()=>{const a=R(2,6),n=R(3,5),c=R(1,3);return mc(tx`If $f(x)=${a}x^{${n}}$, find $f'(${c})$.`,`${a*n*c**(n-1)}`,[`${a*n*c**n}`,`${a*c**(n-1)}`,`${n*c**(n-1)}`],{ex:tx`$f'=${a*n}x^{${n-1}}$.`})});
g(2,0,()=>{const n=R(2,5);return mc(tx`Find $\dfrac{d}{dx}\left[x^{${n}}e^x\right]$ at $x=1$.`,`${n+1}e`,[`${n}e`,'e',`${n+2}e`],{ex:tx`Product rule: $e^x(x^{n}+nx^{n-1})$ at $1$ is $(n+1)e$.`})});
g(2,0,()=>{const a=R(2,7);return mc(tx`Find $\dfrac{d}{dx}\left[\dfrac{x}{x+${a}}\right]$ at $x=0$.`,fr(1,a),[fr(1,a*a),'0',`${a}`],{ex:tx`Quotient rule: $\frac{(x+a)-x}{(x+a)^2}=\frac{a}{(x+a)^2}$; at $0$ this is $\frac1a$.`})});
g(2,0,()=>{const a=R(2,6);return mc(tx`Find $\dfrac{d}{dx}\left[x\ln x\right]$ at $x=e^{${a}}$.`,`${a+1}`,[`${a}`,`${a-1}`,`e^{${a}}`],{ex:tx`$\ln x+1$ at $x=e^a$ is $a+1$.`})});
// Unit 3
g(3,0,()=>{const a=R(2,5);return mc(tx`Find $\dfrac{d}{dx}\sin(${a}x^2)$.`,tx`${2*a}x\cos(${a}x^2)`,[tx`\cos(${a}x^2)`,tx`${a}x\cos(${a}x^2)`,tx`-${2*a}x\cos(${a}x^2)`],{ex:'Chain rule: derivative of the outside times derivative of the inside.'})});
g(3,0,()=>{const [p,q,r]=pk([[3,4,5],[4,3,5],[5,12,13],[12,5,13]]);return mc(tx`For $x^2+y^2=${r*r}$, find $\dfrac{dy}{dx}$ at $(${p},${q})$.`,`-\\frac{${p}}{${q}}`,[fr(p,q),`-\\frac{${q}}{${p}}`,fr(q,p)],{ex:tx`$2x+2y\,y'=0\Rightarrow y'=-\frac xy$.`})});
g(3,0,()=>{const k=R(1,5);return mc(tx`Let $f(x)=x^3+${k}x$. Find $\left(f^{-1}\right)'(${1+k})$.`,fr(1,3+k),[fr(1,3*(1+k)),`${3+k}`,fr(1,1+k)],{ex:tx`$f(1)=${1+k}$ and $f'(1)=${3+k}$, so $(f^{-1})'=\frac{1}{f'(1)}$.`})});
g(3,1,()=>{const a=R(2,4);return nm(tx`Calculator: find $\dfrac{d}{dx}\left[x^x\right]$ at $x=${a}$ (3 decimals).`,a**a*(Math.log(a)+1),{ex:tx`Use nDeriv, or $x^x(\ln x+1)$.`})});
g(3,0,()=>{const a=R(2,6);return mc(tx`Find $\dfrac{d}{dx}\arctan(${a}x)$.`,fr(a,tx`1+${a*a}x^2`),[fr(1,tx`1+${a*a}x^2`),fr(a,tx`1+${a}x^2`),fr(a,tx`\sqrt{1-${a*a}x^2}`)],{ex:tx`$\frac{1}{1+u^2}\cdot u'$.`})});
// Unit 4
g(4,0,()=>{const r=R(2,8),k=R(1,4);return mc(tx`A circle's radius grows at $${k}$ cm/s. How fast is the area changing when $r=${r}$ cm?`,tx`${2*r*k}\pi\ \text{cm}^2/\text{s}`,[tx`${r*k}\pi\ \text{cm}^2/\text{s}`,tx`${r*r*k}\pi\ \text{cm}^2/\text{s}`,tx`${2*k}\pi\ \text{cm}^2/\text{s}`],{ex:tx`$\frac{dA}{dt}=2\pi r\frac{dr}{dt}$. Units matter.`})});
g(4,0,()=>{const s=R(2,6),d=pk([.2,.4,.6]);return nm(tx`Use the linearization of $\sqrt x$ at $x=${s*s}$ to approximate $\sqrt{${s*s+d}}$.`,s+d/(2*s),{ex:tx`$L(x)=${s}+\frac{x-${s*s}}{${2*s}}$.`})});
g(4,0,()=>{const a=R(2,6),b=R(2,6)+a;return mc(tx`Evaluate $\displaystyle\lim_{x\to0}\frac{e^{${a}x}-1}{${b}x}$.`,fr(a,b),[fr(b,a),'1','0'],{ex:tx`L'Hôpital ($\frac00$): $\frac{ae^{ax}}{b}\to\frac ab$.`})});
g(4,0,()=>{const k=R(1,4);return mc(tx`A particle has $s(t)=t^3-${3*k}t^2$ for $t>0$. At what time does it change direction?`,`t=${2*k}`,[`t=${k}`,`t=${3*k}`,`t=${k*k}`],{ex:tx`$v=3t^2-${6*k}t=3t(t-${2*k})$; sign change at $t=${2*k}$.`})});
// Unit 5
g(5,0,()=>{const k=R(2,5);return mc(tx`Where does $f(x)=x^3-${3*k*k}x$ have a relative minimum?`,`x=${k}`,[`x=-${k}`,'x=0',`x=${3*k}`],{ex:tx`$f'=3x^2-${3*k*k}=0\Rightarrow x=\pm${k}$; $f''(${k})>0$.`})});
g(5,0,()=>{const a=R(0,3),b=a+2*R(1,4);return mc(tx`By the MVT on $[${a},${b}]$ for $f(x)=x^2$, find $c$.`,`${(a+b)/2}`,[`${a}`,`${b}`,`${(a+b)/2+1}`],{ex:tx`$f'(c)=2c=a+b$.`})});
g(5,0,()=>{const k=R(1,5);return mc(tx`Find the $x$-coordinate of the inflection point of $f(x)=x^3-${3*k}x^2$.`,`${k}`,[`${2*k}`,'0',`${3*k}`],{ex:tx`$f''=6x-${6*k}$ changes sign at $x=${k}$.`})});
g(5,0,()=>{const k=R(2,6);return mc(tx`${8*k} m of fencing encloses a rectangle. What is the maximum area?`,tx`${4*k*k}\ \text{m}^2`,[tx`${2*k*k}\ \text{m}^2`,tx`${8*k*k}\ \text{m}^2`,tx`${4*k}\ \text{m}^2`],{ex:`Perimeter ${8*k} gives sides summing to ${4*k}; the square (side ${2*k}) maximizes area.`})});
// Unit 6
g(6,0,()=>{const a=R(2,6),b=R(1,4);return nm(tx`Evaluate $\displaystyle\int_0^{${b}} ${a}x^2\,dx$.`,a*b**3/3,{ex:tx`$\frac{a b^3}{3}$.`})});
g(6,0,()=>{const k=R(2,6)*2;return mc(tx`Find $\displaystyle\int ${k}x\cos(x^2)\,dx$.`,tx`${k/2}\sin(x^2)+C`,[tx`${k}\sin(x^2)+C`,tx`${k}x\sin(x^2)+C`,tx`-${k/2}\sin(x^2)+C`],{ex:tx`$u=x^2,\ du=2x\,dx$.`})});
g(6,0,()=>{const a=R(2,7);return mc(tx`Find $\dfrac{d}{dx}\displaystyle\int_0^{${a}x}\cos t\,dt$.`,tx`${a}\cos(${a}x)`,[tx`\cos(${a}x)`,tx`\sin(${a}x)`,tx`${a}\sin(${a}x)`],{ex:'FTC with the chain rule: $f(g(x))\\,g\'(x)$.'})});
g(6,0,()=>{const p=R(2,6);return mc(tx`Evaluate $\displaystyle\int_1^\infty x^{-${p}}\,dx$.`,fr(1,p-1),[fr(1,p),tx`\infty`,'1'],{ex:tx`$\left[\frac{x^{1-p}}{1-p}\right]_1^\infty=\frac{1}{p-1}$.`})});
g(6,0,()=>mc(tx`Evaluate $\displaystyle\int_0^{\pi}x\sin x\,dx$.`,tx`\pi`,[tx`2\pi`,'0',tx`-\pi`],{ex:tx`Parts: $u=x,\ dv=\sin x\,dx$: $[-x\cos x]_0^\pi+\int_0^\pi\cos x\,dx=\pi$.`}));
g(6,1,()=>{const b=R(1,3);return nm(tx`Calculator: $\displaystyle\int_0^{${b}}\sin(x^2)\,dx$ (3 decimals).`,simp(x=>Math.sin(x*x),0,b),{ex:'Use fnInt / the calculator’s definite integral.'})});
g(6,0,()=>{const a=R(2,5);return mc(tx`Find $\displaystyle\int\frac{${a}}{x^2+1}\,dx$.`,tx`${a}\arctan x+C`,[tx`${a}\ln(x^2+1)+C`,tx`\arctan(${a}x)+C`,tx`\frac{${a}}{x}+C`],{ex:tx`$\int\frac{dx}{1+x^2}=\arctan x$.`})});
// Unit 7
g(7,0,()=>{const k=R(2,5),c=R(1,4);return mc(tx`Solve $\frac{dy}{dx}=${k}y,\ y(0)=${c}$.`,tx`y=${c}e^{${k}x}`,[tx`y=e^{${k}x}+${c}`,tx`y=${k}e^{${c}x}`,tx`y=${c}e^{x}`],{ex:tx`$y=y_0e^{kx}$.`})});
g(7,0,()=>{const y0=R(1,3);let x=0,y=y0;for(let i=0;i<2;i++){y+=.5*(x+y);x+=.5}return nm(tx`$\frac{dy}{dx}=x+y,\ y(0)=${y0}$. Use Euler's method with $h=0.5$ (two steps) to estimate $y(1)$.`,y,{ex:tx`$y_{n+1}=y_n+h(x_n+y_n)$.`})});
g(7,0,()=>{const K=R(2,9)*100;return mc(tx`$\frac{dP}{dt}=0.1P\left(1-\frac{P}{${K}}\right)$. For what $P$ is $P$ growing fastest?`,`P=${K/2}`,[`P=${K}`,'P=0',`P=${K/4}`],{ex:'Logistic growth is fastest at $K/2$.'})});
g(7,0,()=>{const a=R(1,4);return mc(tx`Solve $\frac{dy}{dx}=${a}x\,y,\ y(0)=1$.`,tx`y=e^{${fr(a,2)}x^2}`,[tx`y=e^{${a}x^2}`,tx`y=e^{${a}x}`,tx`y=${a}e^{x^2/2}`],{ex:tx`$\ln y=\frac{a x^2}{2}$.`})});
// Unit 8
g(8,0,()=>{const b=R(2,9);return mc(tx`Find the average value of $f(x)=x^2$ on $[0,${b}]$.`,fr(b*b,3),[`${b*b}`,fr(b**3,3),fr(b*b,2)],{ex:tx`$\frac1b\int_0^b x^2dx=\frac{b^2}{3}$.`})});
g(8,0,()=>{const b=R(2,6);return mc(tx`Find the volume when the region under $y=\sqrt x$ on $[0,${b}]$ revolves about the $x$-axis.`,tx`\frac{${b*b}\pi}{2}`,[tx`${b*b}\pi`,tx`\frac{${b}\pi}{2}`,tx`\frac{${b**3}\pi}{3}`],{ex:tx`$\pi\int_0^b x\,dx$.`})});
g(8,0,()=>{const k=R(2,6);return mc(tx`Find the area between $y=${k}x$ and $y=x^2$.`,fr(k**3,6),[fr(k**3,3),fr(k*k,2),fr(k**3,2)],{ex:tx`$\int_0^k(kx-x^2)dx=\frac{k^3}{6}$.`})});
g(8,1,()=>{const a=R(2,5),b=R(2,6),T=R(2,5);return nm(tx`Calculator: water enters at $r(t)=${b}+${a}\sin t$ gal/min. How many gallons enter for $0\le t\le ${T}$? (3 decimals)`,b*T+a*(1-Math.cos(T)),{ex:tx`$\int_0^T r(t)\,dt$.`})});
// Unit 9
g(9,0,()=>{const a=R(1,6);return mc(tx`For $x=t^2,\ y=t^3$, find $\frac{dy}{dx}$ at $t=${a}$.`,fr(3*a,2),[fr(3*a*a,2),`${a}`,fr(2,3*a)],{ex:tx`$\frac{3t^2}{2t}=\frac{3t}{2}$.`})});
g(9,0,()=>{const a=R(2,7);return mc(tx`Find the area enclosed by $r=${a}$.`,tx`${a*a}\pi`,[tx`${a}\pi`,tx`${a*a}\pi/2`,tx`${2*a}\pi`],{ex:tx`$\frac12\int_0^{2\pi}r^2d\theta$.`})});
g(9,0,()=>{const [a,b]=pk([[3,4],[5,12],[6,8],[8,15]]);return mc(tx`A particle has $x=${a}t,\ y=${b}t$. Find its speed.`,`${Math.hypot(a,b)}`,[`${a+b}`,`${a*b}`,`${Math.abs(a-b)}`],{ex:tx`$\sqrt{a^2+b^2}$.`})});
g(9,0,()=>{const a=R(2,5);return mc(tx`Find the area enclosed by the cardioid $r=${a}(1+\cos\theta)$.`,tx`\frac{${3*a*a}\pi}{2}`,[tx`${3*a*a}\pi`,tx`${a*a}\pi`,tx`\frac{${a*a}\pi}{2}`],{ex:tx`$\frac12\int_0^{2\pi}a^2(1+\cos\theta)^2d\theta=\frac{3\pi a^2}{2}$.`})});
// Unit 10
g(10,0,()=>{const a=R(1,6),m=R(2,5);return mc(tx`Evaluate $\displaystyle\sum_{n=0}^{\infty}${a}\left(\frac1{${m}}\right)^n$.`,fr(a*m,m-1),[fr(a,m-1),fr(a*m,m),tx`\text{diverges}`],{ex:tx`$\frac{a}{1-r}$, $|r|<1$.`})});
g(10,0,()=>{const k=R(2,4);return mc(tx`Find the coefficient of $x^3$ in the Maclaurin series of $e^{${k}x}$.`,fr(k**3,6),[fr(k,6),fr(k**3,3),fr(3*k,6)],{ex:tx`$\frac{(kx)^3}{3!}$.`})});
g(10,0,()=>{const n=R(3,6);return mc(tx`$\sum_{n=1}^\infty\frac{(-1)^n}{n^2}$ is approximated by its first $${n}$ terms. Give the alternating series error bound.`,fr(1,(n+1)**2),[fr(1,n*n),fr(1,n+1),fr(1,(n+2)**2)],{ex:'Error is at most the first omitted term.'})});
g(10,0,()=>{const a=R(2,6);return mc(tx`Find the radius of convergence of $\displaystyle\sum_{n=1}^\infty\frac{x^n}{n\,${a}^n}$.`,`${a}`,[`1`,`${a*a}`,tx`\infty`],{ex:tx`Ratio test: $\frac{|x|}{${a}}<1$.`})});
g(10,0,()=>{const k=R(2,4);return mc(tx`Find the coefficient of $x^3$ in the Maclaurin series of $\sin(${k}x)$.`,`-${fr(k**3,6)}`,[fr(k**3,6),`-${fr(k,6)}`,fr(k**3,3)],{ex:tx`$-\frac{(kx)^3}{3!}$.`})});
g(10,0,()=>{const p=pk([2,3,4]);return mc(tx`Which series converges?`,tx`\sum\frac{1}{n^{${p}}}`,[tx`\sum\frac{1}{n}`,tx`\sum\frac{1}{\sqrt n}`,tx`\sum\frac{n}{n+1}`],{ex:'p-series converge only for $p>1$; the last diverges by the nth-term test.'})});
const gen1=(u,c)=>{let p=G.filter(x=>(u==null||x.u===u)&&(c==null||!!x.c===c));if(!p.length)p=G.filter(x=>c==null||!!x.c===c);const x=p[R(0,p.length-1)];return{...x.f(),u:x.u,c:x.c}};
const gen=(u,c)=>{const O=()=>{const p=OS.filter(x=>(u==null||x.u===u)&&(c==null||!!x.c===c)&&!S.seen[x.i]);if(!p.length)return null;const x=p[R(0,p.length-1)];return{kind:'os',q:x.q,sol:x.s,num:x.n,u:x.u,c:!!x.c,i:x.i,a:1}},Tq=()=>ENG.make(u,c),Gq=()=>gen1(u,c);
 for(let t=0;t<60;t++){const r=Math.random(),s=PS.src,ord=s==='gen'?[Gq]:s==='ty'?[Tq,Gq]:s==='os'?[O,Tq,Gq]:r<.4?[Tq,O,Gq]:r<.75?[O,Tq,Gq]:[Gq,Tq,O];let q=null;for(const f of ord){q=f();if(q)break}if(q&&!SEEN.has(q.q)){SEEN.add(q.q);return q}}return Gq()};
// ===== helpers: calculator gating =====
let cal=null,calcOK=false;
function showCalc(){if(!calcOK||typeof Desmos==='undefined'){toast();return}calc.style.display='block';if(!cal)cal=Desmos.GraphingCalculator(cc,{expressions:true})}
function hideCalc(){calc.style.display='none'}
function setCalc(ok){calcOK=ok;if(!ok){hideCalc();if(cal){cal.destroy();cal=null}}}
const toast=()=>alert('Desmos is locked: this section is no-calculator. It unlocks only in calculator-active questions (Part B) and calculator practice.');
// ===== session engine =====
let E=null,timer=null;
function start(segs,mode,unit){SEEN=new Set();E={segs,mode,qs:[],ans:[],i:0,seg:0,mode};segs.forEach(s=>{for(let k=0;k<s.n;k++){const q=gen(unit,s.calc===null?(Math.random()<.2):s.calc);q.seg=s.name;E.qs.push(q)}});E.ans=Array(E.qs.length).fill(null);nextSegDeadline();clearInterval(timer);timer=setInterval(tick,1000);run()}
const segOf=i=>{let c=0;for(let s=0;s<E.segs.length;s++){c+=E.segs[s].n;if(i<c)return s}return E.segs.length-1},segStart=s=>E.segs.slice(0,s).reduce((a,b)=>a+b.n,0);
function nextSegDeadline(){const s=E.segs[segOf(E.i)];E.dl=s.min?Date.now()+s.min*60000:null}
function tick(){if(!E)return;const el=document.getElementById('tm');if(E.dl){const r=E.dl-Date.now();if(r<=0){advSeg();return}if(el)el.textContent=Math.floor(r/60000)+':'+String(Math.floor(r/1000)%60).padStart(2,'0')}else if(el)el.textContent='untimed'}
function advSeg(){const s=segOf(E.i);if(s+1>=E.segs.length)return finish();E.i=segStart(s+1);nextSegDeadline();run()}
function run(){const q=E.qs[E.i],ex=E.mode==='exam',a=E.ans[E.i],sg=E.segs[segOf(E.i)];setCalc(q.c&&(ex?sg.calc:true));if(q.kind==='os')return runOS(q,sg);if(q.kind==='ty')return runTy(q,sg);
const done=!ex&&a!==null;
m.innerHTML=`<div class=row><h2 style="flex:1">${sg.name}</h2><span class=tag>Q ${E.i+1}/${E.qs.length}</span><span class=tag>⏱ <b id=tm></b></span><button class=alt onclick="showCalc()">${calcOK?'🧮 Desmos':'🔒 Desmos'}</button></div>
<div class=card><span class=tag>Unit ${q.u}: ${UN[q.u].n}</span><span class=tag ${q.c?'':'class=lock'}>${q.c?'Calculator active':'No calculator'}</span><div class=q>${q.q}</div>
${q.opts.map((o,k)=>`<button class="opt ${a===k?'sel':''} ${done?(k===q.a?'ok':a===k?'bad':''):''}" ${done?'disabled':''} onclick="pick(${k})">${'ABCD'[k]}. ${o}</button>`).join('')}
${done?`<p><b>${a===q.a?'✔ Correct.':'✘ Incorrect.'}</b> ${q.ex||''}</p>`:''}</div>
<div class=row><button class=alt ${E.i<=segStart(segOf(E.i))?'disabled':''} onclick="go(-1)">← Prev</button><button onclick="go(1)">${E.i===E.qs.length-1?'Finish':'Next →'}</button>${ex?'<button class=alt onclick="advSeg()">End this section</button>':'<button class=alt onclick="finish()">End session</button>'}</div>`;tick()}
function runOS(q,sg){const a=E.ans[E.i],rv=(E.rv=E.rv||[])[E.i]||a!==null;
 m.innerHTML=`<div class=row><h2 style="flex:1">${sg.name}</h2><span class=tag>Q ${E.i+1}/${E.qs.length}</span><span class=tag>⏱ <b id=tm></b></span><button class=alt onclick="showCalc()">${calcOK?'🧮 Desmos':'🔒 Desmos'}</button></div>
 <div class=card><span class=tag>Unit ${q.u}: ${UN[q.u].n}</span><span class=tag>Textbook problem</span><span class=tag>${q.c?'Calculator active':'No calculator'}</span><div class=q>${q.q}</div>
 ${a===null&&!rv&&q.num!=null?`<div class=row><input id=ni type=text placeholder="Your answer (number or a/b)" style="width:220px"><button onclick="chkN()">Check</button></div><br>`:''}
 ${!rv?`<button class=alt onclick="E.rv[E.i]=1;run()">Reveal solution</button>`:`<div class=card style="background:#f6f4ee"><b>Solution:</b> ${q.sol}</div>${a===null?`<div class=row><button onclick="selfG(1)">I got it</button><button class=alt onclick="selfG(0)">I missed it</button></div>`:`<p><b>${a===1?'✔ Counted correct.':'✘ Counted as missed. Added to your Error Log.'}</b></p>`}`}
 <div class=src>Source: OpenStax Calculus, © Rice University, CC BY-NC-SA 4.0 (adapted)</div></div>
 <div class=row><button class=alt ${E.i<=segStart(segOf(E.i))?'disabled':''} onclick="go(-1)">← Prev</button><button onclick="go(1)">${E.i===E.qs.length-1?'Finish':'Next →'}</button><button class=alt onclick="finish()">End session</button></div>`;tick()}
const hdr=sg=>`<div class=row><h2 style="flex:1">${sg.name}</h2><span class=tag>Q ${E.i+1}/${E.qs.length}</span><span class=tag>⏱ <b id=tm></b></span><button class=alt onclick="showCalc()">${calcOK?'🧮 Desmos':'🔒 Desmos'}</button></div>`;
const navb=()=>`<div class=row><button class=alt ${E.i<=segStart(segOf(E.i))?'disabled':''} onclick="go(-1)">← Prev</button><button onclick="go(1)">${E.i===E.qs.length-1?'Finish':'Next →'}</button><button class=alt onclick="finish()">End session</button></div>`;
function runTy(q,sg){const a=E.ans[E.i],rv=(E.rv=E.rv||[])[E.i]||a!==null;
 m.innerHTML=hdr(sg)+`<div class=card><span class=tag>Unit ${q.u}: ${UN[q.u].n}</span><span class=tag>Typed answer</span><span class=tag>${q.c?'Calculator active':'No calculator'}</span><div class=q>${q.q}</div>
 ${!rv?`<div class=row><input id=ti type=text autocomplete=off placeholder="Type your answer, e.g. 3x^2*sin(x)" style="width:min(430px,100%)" oninput="pvT()" onkeydown="if(event.key==='Enter')chkT()"><button onclick="chkT()">Check</button><button class=alt onclick="E.rv[E.i]=1;run()">Show solution</button></div><div id=pvw style="min-height:2.2em;margin-top:8px"></div><div class=src>Any equivalent form is accepted. Use ^ for powers, pi, e, sqrt(), ln(), sin(), arctan(). Fractions like 2/3 are fine.</div>`:`<p><b>${a===1?'✔ Correct.':a===0?'✘ Not quite.':'Solution revealed (counted as missed).'}</b></p><div class=card style="background:#f6f4ee"><b>Solution:</b> ${q.sol}</div>`}</div>`+navb();tick()}
function pvT(){const e=document.getElementById('pvw');if(e)e.innerHTML=TX.render(ENG.preview(ti.value))}
function chkT(){const q=E.qs[E.i];E.ans[E.i]=ENG.check(q,ti.value)?1:0;E.rv[E.i]=1;run()}
const pv=s=>{s=s.replace(/\s/g,'');const m=s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);return m?m[1]/m[2]:+s};
function chkN(){const q=E.qs[E.i],v=pv(ni.value),ok=isFinite(v)&&Math.abs(v-q.num)<=.01*Math.max(1,Math.abs(q.num));E.rv[E.i]=1;E.ans[E.i]=ok?1:0;run()}
function selfG(g){E.ans[E.i]=g;run()}
function pick(k){E.ans[E.i]=k;run()}
function go(d){const n=E.i+d;if(n>=E.qs.length)return finish();if(segOf(n)!==segOf(E.i)&&d>0){if(E.mode==='exam'&&!confirm('Start next section? You cannot return.'))return;E.i=n;nextSegDeadline();return run()}E.i=n;run()}
function finish(){clearInterval(timer);setCalc(false);let c=0,wr=[];E.qs.forEach((q,i)=>{const ok=E.ans[i]===q.a;if(q.kind==='os'&&E.ans[i]!==null)S.seen[q.i]=1;(S.st[q.u]=S.st[q.u]||{a:0,c:0,t:0}).a++;if(ok){S.st[q.u].c++;c++}else{wr.push(q);S.log.unshift({u:q.u,q:q.q,ans:(q.opts?q.opts[q.a]:q.sol),ex:q.ex,d:Date.now()})}S.st[q.u].t=Date.now()});
S.hist.push({d:Date.now(),m:E.mode,c,n:E.qs.length});S.log=S.log.slice(0,300);save();const p=Math.round(100*c/E.qs.length);
m.innerHTML=`<h2>Session complete</h2><div class=card><h1>${c} / ${E.qs.length} (${p}%)</h1><p>${p>=80?'Above the 80% target. Keep it up.':'Below the 80% target. Misses were added to your Error Log; retry them there.'}</p>
${wr.slice(0,12).map(q=>`<p><b>${q.q}</b><br>Answer: ${(q.opts?q.opts[q.a]:q.sol)} — <span class=muted>${q.ex||''}</span></p>`).join('')}</div><button onclick="go2('dash')">Dashboard</button>`;E=null}
// ===== views =====
const days=(a,b)=>Math.round((b-a)/864e5),today=()=>new Date(),pct=u=>{const t=UN[u].t,d=t.filter((_,i)=>S.chk[u+'_'+i]).length;return Math.round(100*d/t.length)},acc=u=>{const s=S.st[u];return s&&s.a?Math.round(100*s.c/s.a):null};
const V={
les(){return`<h1>Lessons</h1><p class=muted>All ${Object.values(LES).flat().length} Flipped Math Version #1 lessons (video + notes), in order. If a page won’t embed, use “Open in new tab”.</p>`+UN.filter(u=>u.id).map(u=>{const L=LES[u.id]||[],d=L.filter(l=>S.chk['L'+l[1]]).length;return`<div class=card><div class=row><h3 style="flex:1">Unit ${u.id}: ${u.n}</h3><span class=muted>${d}/${L.length} watched</span></div><div class=bar><i style="width:${100*d/L.length}%"></i></div>${L.map(l=>`<div class=lesson><input type=checkbox ${S.chk['L'+l[1]]?'checked':''} onchange="S.chk['L${l[1]}']=this.checked;save();go2('les')"><span style="flex:1">${l[0]}</span><button onclick="view('${FM+l[1]}.html','${l[0].replace(/'/g,"\\'")}')">▶ Watch</button></div>`).join('')}</div>`}).join('')},
dash(){const t=today(),cur=UN.find(u=>t>=u.s&&t<=new Date(u.e.getTime()+864e5))||(t>=STAGE6.s?{n:'AP Exam Training',s:STAGE6.s,e:STAGE6.e,f:'Full simulations, FRQs by topic, weakness repair.',url:CB,id:-1}:null);
const wk=[...Array(11).keys()].filter(u=>acc(u)!==null).sort((a,b)=>acc(a)-acc(b))[0],due=UN.filter(u=>u.id&&S.st[u.id]&&Date.now()-S.st[u.id].t>6*864e5);
return`<h1>Welcome back.</h1><div class=grid><div class=card><h3>Exam in</h3><h1>${Math.max(0,days(t,EXAM))} days</h1><span class=muted>Mon, May 10, 2027 · Bluebook</span></div>
<div class=card><h3>Today</h3>${cur?`<b>${cur.n}</b><br><span class=muted>${cur.f}</span><div class=row style="margin-top:8px"><button onclick="go2('road')">Open roadmap</button>${cur.id>=1?`<button class=alt onclick="startU(${cur.id})">Practice it</button>`:''}</div>`:'Starts Oct 7, 2026.'}</div>
<div class=card><h3>Smart practice</h3><p class=muted>10 questions weighted to your weakest units${wk!=null?` (start: Unit ${wk})`:''}.</p><button onclick="smart()">Start</button></div></div>
<h2>Mastery by unit</h2>${UN.filter(u=>u.id).map(u=>`<div class=card><div class=row><b style="flex:1">Unit ${u.id}: ${u.n}</b><span class=muted>topics ${pct(u.id)}% · accuracy ${acc(u.id)==null?'—':acc(u.id)+'%'}</span></div><div class=bar><i style="width:${acc(u.id)||0}%"></i></div></div>`).join('')}
${due.length?`<div class=card><h3>Due for review (6+ days)</h3>${due.map(u=>`<a class=tag style=cursor:pointer onclick="startU(${u.id})">Unit ${u.id}</a>`).join('')}</div>`:''}`},
road(){return`<h1>Roadmap</h1><p class=muted>Each unit: Flipped Math lessons → daily practice → Saturday unit test (≥80%) → FRQ checkpoint. Stage 6 (Apr 5–May 9) is exam training.</p>`+UN.map(u=>`<div class=card><div class=row><h3 style="flex:1">${u.id?'Unit '+u.id+': ':''}${u.n}</h3><span class=tag>${u.s.toLocaleDateString('en',{month:'short',day:'numeric'})} – ${u.e.toLocaleDateString('en',{month:'short',day:'numeric'})}</span></div><p class=muted>${u.f}</p>
${u.t.map((x,i)=>`<label class=chk><input type=checkbox ${S.chk[u.id+'_'+i]?'checked':''} onchange="S.chk['${u.id}_${i}']=this.checked;save()"> ${x}</label>`).join('')}
<div class=row style="margin-top:8px"><button onclick="view('${u.url}','${u.n}')">▶ Lessons</button>${u.id?`<button class=alt onclick="startU(${u.id})">Practice</button><a class=btn style="background:#fff;color:#14213d;border:1px solid #14213d" target=_blank href="${CB}">FRQs</a>`:''}</div></div>`).join('')},
prac(){return`<h1>Practice</h1><div class=card><div class=row><select id=pu><option value="">Mixed (all units)</option>${UN.filter(u=>u.id).map(u=>`<option value=${u.id}>Unit ${u.id}: ${u.n}</option>`).join('')}</select><select id=pc><option value=null>Mixed calc / no-calc</option><option value=false>No calculator only</option><option value=true>Calculator only (Desmos on)</option></select><input id=pn type=number value=10 min=3 max=40 style=width:70px><select id=ps><option value=mix>Mixed (all sources)</option><option value=ty>Typed answers (unlimited generator)</option><option value=os>Textbook problems only (OpenStax)</option><option value=gen>Generated (auto-graded) only</option></select><button onclick="startP()">Begin</button></div></div><p class=muted>Questions are generated fresh each time, with instant explanations. Desmos unlocks only on calculator-active questions.</p>`},
sim(){return`<h1>Exam Simulator</h1><div class=grid>${[['Full Section I (2027 format)','Part A: 29 Q, 62 min, no calculator → Part B: 13 Q, 38 min, Desmos',0],['Mini Part A','10 Q, 21 min, no calculator',1],['Mini Part B','6 Q, 15 min, Desmos',2]].map(x=>`<div class=card><h3>${x[0]}</h3><p class=muted>${x[1]}</p><button onclick="simGo(${x[2]})">Start</button></div>`).join('')}</div><p class=muted>No feedback until the end. You can’t go back across sections. Section II (FRQ) is in the FRQ Lab.</p>`},
frq(){return`<h1>FRQ Lab</h1><div class=card><p>Real released BC FRQs with official scoring guidelines are on College Board. Attempt in 15 min, then grade strictly.</p><div class=row><a class=btn target=_blank href="${CB}">Open released FRQs</a><button onclick="ft()">Start 15:00 timer</button><b id=ftm></b></div></div>
<div class=card><h3>Log a graded FRQ</h3><div class=row><input id=fn type=text placeholder="Year / question / topic" size=28><input id=fs type=number min=0 max=9 placeholder="score /9" style=width:90px><button onclick="S.frq.unshift({n:fn.value,s:fs.value,d:Date.now()});save();go2('frq')">Save</button></div></div>
<div class=card><h3>History</h3>${S.frq.map(f=>`<p>${new Date(f.d).toLocaleDateString()} — ${f.n}: <b>${f.s}/9</b></p>`).join('')||'<span class=muted>None yet.</span>'}</div>`},
log(){return`<h1>Error Log</h1><p class=muted>Every miss lands here. Redo them on Saturdays.</p>`+(S.log.map((l,i)=>`<div class=card><span class=tag>Unit ${l.u}</span>${l.q}<br><b>Answer:</b> ${l.ans}<br><span class=muted>${l.ex||''}</span><br><button class=alt onclick="S.log.splice(${i},1);save();go2('log')">Mastered ✓</button></div>`).join('')||'<div class=card>No errors logged yet.</div>')},
set(){const g=GID();return`<h1>Settings</h1><div class=card><h3>Account</h3><p>${USER.name} ${USER.g?'(Google, synced to your Drive)':USER.id==='guest'?'(Guest: progress stays in this browser)':'(local account)'}</p><div class=row><button class=alt onclick="logout()">Sign out</button><button class=alt onclick="exp()">Export backup</button><label class=btn style="background:#fff;color:#14213d;border:1px solid #14213d">Import backup<input type=file hidden onchange="imp(this)"></label><button class=alt onclick="if(confirm('Erase all progress for this account?')){S=DEF();save();go2('dash')}">Reset progress</button></div></div>
<div class=card><h3>Google Drive sync</h3><p class=muted>Sign-in uses your own Google OAuth client, so nothing passes through anyone else’s server. Progress is stored as one hidden file in your Drive’s app-data folder.</p><ol><li>In Google Cloud Console, create a project and enable the <b>Google Drive API</b>.</li><li>Create an <b>OAuth client ID</b> (type: Web application). Add <code>http://localhost:3000</code> under Authorized JavaScript origins.</li><li>Paste the Client ID below and save.</li><li>Run <code>node server.js</code>, open <code>http://localhost:3000</code>, then choose “Sign in with Google”.</li></ol><div class=row><input id=gid type=text value="${g}" placeholder="xxxx.apps.googleusercontent.com" style="width:380px"><button onclick="localStorage['apbc:gcid']=gid.value.trim();alert('Saved')">Save</button>${USER.g?'<button class=alt onclick="gResync()">Sync now</button>':''}</div><p id=sm class=muted></p></div>
<div class=card><h3>Content credits</h3>Textbook problems and answers: OpenStax <i>Calculus</i> Volumes 1 and 2, © Rice University, licensed CC BY-NC-SA 4.0. Adapted: filtered to AP Calculus BC topics and converted to LaTeX. For non-commercial study. Lessons: Flipped Math. Calculator: Desmos.</div>`},
ref(){return String.raw`<h1>Reference</h1><div class=card><h3>Derivatives</h3>$$\frac{d}{dx}\tan x=\sec^2x,\quad \frac{d}{dx}\sec x=\sec x\tan x,\quad \frac{d}{dx}\arcsin x=\frac1{\sqrt{1-x^2}},\quad \frac{d}{dx}\arctan x=\frac1{1+x^2}$$</div>
<div class=card><h3>Theorems</h3>MVT: $f'(c)=\dfrac{f(b)-f(a)}{b-a}$ · FTC: $\dfrac{d}{dx}\displaystyle\int_a^{g(x)}f(t)\,dt=f(g(x))\,g'(x)$ · IVT, EVT: state hypotheses.</div>
<div class=card><h3>Applications</h3>$$f_{avg}=\frac1{b-a}\int_a^b f,\quad V=\pi\int_a^b(R^2-r^2)\,dx,\quad L=\int_a^b\sqrt{1+f'(x)^2}\,dx,\quad A=\frac12\int_\alpha^\beta r^2\,d\theta$$</div>
<div class=card><h3>Parametric and DE</h3>$$\frac{dy}{dx}=\frac{dy/dt}{dx/dt},\quad \text{speed}=\sqrt{x'^2+y'^2},\quad y_{n+1}=y_n+f(x_n,y_n)\Delta x,\quad \frac{dP}{dt}=kP\left(1-\frac PK\right)$$</div>
<div class=card><h3>Series</h3>$$\sum_{n=0}^\infty ar^n=\frac a{1-r},\quad e^x=\sum\frac{x^n}{n!},\quad \sin x=\sum\frac{(-1)^nx^{2n+1}}{(2n+1)!},\quad |R_n(x)|\le\frac{M|x-a|^{n+1}}{(n+1)!}$$ Always test endpoints.</div>
<div class=card><h3>Pacing</h3>MCQ A ≈ 2:08 · MCQ B ≈ 2:55 · FRQ ≈ 15 min each.</div>`}};
function go2(v){document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.v===v));m.innerHTML=V[v]();scrollTo(0,0)}
document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>{if(E&&!confirm('Leave this session? Progress is lost.'))return;if(E){clearInterval(timer);E=null;setCalc(false)}go2(a.dataset.v)});
function view(u,t){if(/khanacademy/.test(u)){open(u,'_blank');return}vt.textContent=t;vl.href=u;vf.src=u;viewer.style.display='flex'}
const startU=u=>{PS.src='mix';start([{name:'Unit '+u+' Practice',n:10,calc:null,min:0}],'prac',u)},startP=()=>{PS.src=ps.value;const c=eval(pc.value);start([{name:'Practice',n:+pn.value,calc:c,min:0}],'prac',pu.value===''?null:+pu.value)};
function smart(){PS.src='mix';SEEN=new Set();const w=UN.filter(u=>u.id).map(u=>({u:u.id,w:100-(acc(u.id)??50)+5}));E={segs:[{name:'Smart Practice',n:10,calc:null,min:0}],mode:'prac',qs:[],ans:Array(10).fill(null),i:0};const tot=w.reduce((a,b)=>a+b.w,0);for(let k=0;k<10;k++){let r=Math.random()*tot,u=1;for(const x of w){r-=x.w;if(r<=0){u=x.u;break}}const q=gen(u,Math.random()<.2);q.seg='Smart Practice';E.qs.push(q)}E.dl=null;clearInterval(timer);timer=setInterval(tick,1000);run()}
function simGo(k){PS.src='gen';start(k===0?[{name:'Section I · Part A (no calculator)',n:29,calc:false,min:62},{name:'Section I · Part B (calculator)',n:13,calc:true,min:38}]:k===1?[{name:'Mini Part A',n:10,calc:false,min:21}]:[{name:'Mini Part B',n:6,calc:true,min:15}],'exam',null)}
let ftI;function ft(){clearInterval(ftI);const e=Date.now()+9e5;ftI=setInterval(()=>{const r=e-Date.now();if(r<=0){clearInterval(ftI);ftm.textContent='Time!'}else ftm.textContent=Math.floor(r/6e4)+':'+String(Math.floor(r/1e3)%60).padStart(2,'0')},500)}
boot();
