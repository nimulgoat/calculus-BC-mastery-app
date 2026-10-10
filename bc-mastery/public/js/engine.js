/* ENG: unlimited typed-answer calculus problems, built on math.js.
   Each problem has a LaTeX prompt, a ground-truth answer, and a checker that accepts ANY equivalent form
   (expr: same values at sample points; anti: derivative matches, so +C is optional; num: numeric tolerance). */
(function (root) {
  'use strict';
  const m = root.math, tx = String.raw;
  m.import({ ln: Math.log, arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan }, { override: true, silent: true });
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), pk = (a) => a[R(0, a.length - 1)], fx = (x, d = 3) => String(+x.toFixed(d));
  const norm = (s) => String(s).replace(/[\u2212\u2013]/g, '-').replace(/π/g, 'pi').replace(/\|([^|]+)\|/g, 'abs($1)')
    .replace(/\b(arcsin|arccos|arctan|sin|cos|tan|cot|sec|csc|ln|sqrt|exp)\s+([a-z0-9.]+)/gi, '$1($2)').replace(/\^\s*-\s*(\d)/g, '^(-$1)');
  const fn = (s) => { const c = m.compile(norm(s)); return (x, v) => { const r = c.evaluate(Object.assign({ x: x }, v)); return typeof r === 'number' ? r : NaN; }; };
  const T = (s) => m.parse(norm(s)).toTex({ parenthesis: 'auto' }).replace(/(\d)\s*\\cdot\s*(?=[a-zA-Z\\(])/g, '$1').replace(/\\mathrm\{([A-Za-z]+)\}/g, '$1');
  const D = (s) => m.derivative(s, 'x').toString();
  const DS = (s) => m.simplify(m.derivative(s, 'x')).toString();
  const simp = (f, a, b, n = 2000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
  const FR = (v) => { try { const f = m.fraction(v); return f.d === 1 ? String(f.s * f.n) : (f.s < 0 ? '-' : '') + tx`\frac{${f.n}}{${f.d}}`; } catch (e) { return fx(v); } };
  const poly = (c) => c.map((k, i) => k ? k + '*x^' + (c.length - 1 - i) : '').filter(Boolean).join('+').replace(/\+-/g, '-') || '0';
  const Q = (o) => Object.assign({ kind: 'ty', a: 1, tol: 0.005 }, o);

  // function pool: [unit tag, generator]
  const FUN = [
    [2, () => poly([R(2, 5), -R(1, 7), R(1, 9), -R(1, 5)])], [2, () => `x^${R(2, 4)}*e^(${R(1, 3)}*x)`], [2, () => `(x^2+${R(1, 5)})/(x+${R(1, 4)})`],
    [2, () => 'x*log(x)'], [2, () => `${R(2, 5)}*sin(x)+${R(2, 5)}*cos(x)`], [2, () => `x^${R(2, 3)}*sin(x)`],
    [3, () => `sin(${R(2, 5)}*x^2)`], [3, () => `e^(x^2+${R(1, 4)}*x)`], [3, () => `log(x^2+${R(1, 6)})`], [3, () => `sqrt(${R(2, 6)}*x+${R(1, 8)})`],
    [3, () => `atan(${R(2, 5)}*x)`], [3, () => `cos(x)^${R(2, 4)}`], [3, () => 'e^(sin(x))'], [3, () => 'x*cos(x^2)'], [3, () => `tan(${R(2, 5)}*x)`], [3, () => 'log(sin(x)+2)'],
  ];
  let FORCE = null;
  const tagged = (u) => { u = u == null ? FORCE : u; const p = FUN.filter((f) => u == null || f[0] === u); return pk(p.length ? p : FUN); };
  const sampleOK = (a, b) => Number.isFinite(a) && Number.isFinite(b);
  const PTS = [0.3, 0.55, 0.9, 1.3, 1.7, 2.2];

  const F = [];
  const fam = (u, c, f) => F.push({ u, c, f });
  // ---- Unit 1
  fam(1, 0, () => { const a = R(1, 6), p = R(1, 4), r = R(-4, 4), s = R(1, 3), t = R(1, 6); const num = [p, r - a * p, -a * r], den = [s, t - a * s, -a * t];
    return Q({ u: 1, mode: 'num', ans: (p * a + r) / (s * a + t), q: tx`Evaluate $\displaystyle\lim_{x\to ${a}}\frac{${T(poly(num))}}{${T(poly(den))}}$. (Enter a number or fraction.)`, sol: tx`Factor out $(x-${a})$: the limit is $\frac{${p * a + r}}{${s * a + t}}=${FR((p * a + r) / (s * a + t))}$.` }); });
  fam(1, 0, () => { const n = R(2, 4), a = R(2, 9), b = R(1, 9), k = R(1, 5); return Q({ u: 1, mode: 'num', ans: a / b, q: tx`Evaluate $\displaystyle\lim_{x\to\infty}\frac{${a}x^{${n}}+${k}x}{${b}x^{${n}}-${k + 1}}$.`, sol: tx`Equal degrees: ratio of leading coefficients, $\frac{${a}}{${b}}$.` }); });
  // ---- Derivatives
  fam(2, 0, () => { const [u, g] = tagged(); const f = g(); return Q({ u, mode: 'expr', ans: D(f), q: tx`Find $\dfrac{d}{dx}\left[${T(f)}\right]$.`, sol: tx`$\dfrac{d}{dx}\left[${T(f)}\right]=${T(DS(f))}$` }); });
  fam(2, 1, () => { const [u, g] = tagged(); const f = g(), a = pk([1, 2]); const d2 = m.derivative(m.derivative(f, 'x'), 'x'); const v = d2.evaluate({ x: a });
    return Q({ u, c: true, mode: 'num', ans: v, tol: 0.003, q: tx`Calculator: if $f(x)=${T(f)}$, find $f''(${a})$ to 3 decimals.`, sol: tx`$f''(x)=${T(m.simplify(d2).toString())}$, so $f''(${a})\approx${fx(v)}$.` }); });
  fam(2, 0, () => { const [u, g] = tagged(2); const f = g(), a = pk([1, 2]); const fa = fn(f)(a), da = fn(D(f))(a);
    return Q({ u: 2, mode: 'expr', tol: 0.002, ans: `${fa}+${da}*(x-${a})`, q: tx`Find the tangent line to $y=${T(f)}$ at $x=${a}$. Enter $y$ as an expression in $x$ (decimals to 3 places are fine).`, sol: tx`$f(${a})\approx${fx(fa)},\ f'(${a})\approx${fx(da)}$, so $y\approx${fx(fa)}+${fx(da)}(x-${a})$.` }); });
  // ---- Integrals
  fam(6, 0, () => { const [, g] = tagged(); const G = g(); const f = D(G); return Q({ u: 6, mode: 'anti', ans: f, ref: G, q: tx`Find $\displaystyle\int ${T(m.simplify(f).toString())}\,dx$. (Any correct antiderivative is accepted.)`, sol: tx`$${T(G)}+C$` }); });
  fam(6, 1, () => { const f = pk(['x*e^(x^2)', 'sin(x^2)', 'e^(-x^2)', 'sqrt(x^3+1)', 'log(x)/x', 'x^2*cos(x)', '1/(1+x^2)', 'x*sin(x)']), b = R(2, 3); const v = simp(fn(f), 1, b);
    return Q({ u: 6, c: true, mode: 'num', ans: v, tol: 0.003, q: tx`Calculator: evaluate $\displaystyle\int_1^{${b}} ${T(f)}\,dx$ to 3 decimals.`, sol: tx`$\int_1^{${b}} ${T(f)}\,dx\approx${fx(v)}$` }); });
  fam(6, 0, () => { const f = pk(['sin(x)', 'e^x', 'cos(x)', 'x^2+1', 'sqrt(x)+1']), g = pk(['x^2', `${R(2, 5)}*x`, 'x^3', 'e^x']); const dg = D(g);
    const comp = f.replace(/\bx\b/g, `(${g})`) + `*(${dg})`;
    return Q({ u: 6, mode: 'expr', ans: comp, q: tx`Find $\dfrac{d}{dx}\displaystyle\int_0^{${T(g)}} ${T(f.replace(/\bx\b/g, 't'))}\,dt$.`, sol: tx`FTC with the chain rule: $f(g(x))\,g'(x)$.` }); });
  // ---- Applications
  fam(8, 1, () => { const f = pk(['x^2+1', 'sqrt(x)+2', 'e^(x/2)', 'sin(x)+2', '1/(x+1)']), b = R(2, 4); const v = simp(fn(f), 0, b) / b;
    return Q({ u: 8, c: true, mode: 'num', ans: v, tol: 0.003, q: tx`Calculator: find the average value of $f(x)=${T(f)}$ on $[0,${b}]$ (3 decimals).`, sol: tx`$\frac{1}{${b}}\int_0^{${b}}f\,dx\approx${fx(v)}$` }); });
  fam(8, 0, () => { const k = R(2, 7); return Q({ u: 8, mode: 'num', ans: k ** 3 / 6, q: tx`Find the area of the region bounded by $y=${k}x$ and $y=x^2$.`, sol: tx`$\int_0^{${k}}(${k}x-x^2)\,dx=\frac{${k ** 3}}{6}$` }); });
  fam(8, 1, () => { const f = pk(['sqrt(x)', 'x^2', 'e^x', 'sin(x)+2', 'x+1']), b = R(1, 3); const v = Math.PI * simp((x) => fn(f)(x) ** 2, 0, b);
    return Q({ u: 8, c: true, mode: 'num', ans: v, tol: 0.003, q: tx`Calculator: the region under $y=${T(f)}$ on $[0,${b}]$ revolves about the $x$-axis. Find the volume (3 decimals).`, sol: tx`$\pi\int_0^{${b}}\left(${T(f)}\right)^2dx\approx${fx(v)}$` }); });
  // ---- Parametric / polar
  fam(9, 0, () => { const a = R(1, 4), b = R(1, 5), c = R(1, 4), d = R(1, 5), t = R(1, 3); const v = (3 * c * t * t + d) / (2 * a * t + b);
    return Q({ u: 9, mode: 'num', ans: v, q: tx`For $x=${a}t^2+${b}t,\ y=${c}t^3+${d}t$, find $\dfrac{dy}{dx}$ at $t=${t}$.`, sol: tx`$\frac{dy/dt}{dx/dt}=\frac{${3 * c}t^2+${d}}{${2 * a}t+${b}}=${FR(v)}$ at $t=${t}$.` }); });
  fam(9, 0, () => { const a = R(1, 4), b = R(1, 4); const v = Math.PI * (a * a + b * b / 2); return Q({ u: 9, mode: 'num', ans: v, q: tx`Find the area enclosed by the limaçon $r=${a}+${b}\cos\theta$. (Type e.g. 5*pi/2 or a decimal.)`, sol: tx`$\frac12\int_0^{2\pi}r^2d\theta=\pi\left(${a * a}+\frac{${b * b}}{2}\right)\approx${fx(v)}$` }); });
  fam(9, 1, () => { const b = R(1, 3); const v = simp((t) => Math.sqrt(4 * t * t + 9 * t ** 4), 0, b); return Q({ u: 9, c: true, mode: 'num', ans: v, tol: 0.003, q: tx`Calculator: find the length of the curve $x=t^2,\ y=t^3$ for $0\le t\le ${b}$ (3 decimals).`, sol: tx`$\int_0^{${b}}\sqrt{(2t)^2+(3t^2)^2}\,dt\approx${fx(v)}$` }); });
  // ---- Series
  fam(10, 0, () => { const k = R(2, 4), n = R(2, 5), f = pk([`e^(${k}*x)`, `sin(${k}*x)`, `cos(${k}*x)`, `1/(1-${k}*x)`, `log(1+${k}*x)`, `atan(${k}*x)`]); let d = f; for (let i = 0; i < n; i++) d = m.derivative(d, 'x'); const v = d.evaluate({ x: 0 }) / m.factorial(n);
    return Q({ u: 10, mode: 'num', ans: v, q: tx`Find the coefficient of $x^{${n}}$ in the Maclaurin series of $f(x)=${T(f)}$. (Number or fraction.)`, sol: tx`$\frac{f^{(${n})}(0)}{${n}!}=${FR(v)}$` }); });
  fam(10, 1, () => { const k = R(1, 3), n = pk([3, 5]), x0 = pk([0.5, 1]); let s = 0; for (let i = 0; i <= n; i++) s += Math.pow(k * x0, i) / m.factorial(i);
    return Q({ u: 10, c: true, mode: 'num', ans: s, tol: 0.003, q: tx`Calculator: use the degree-${n} Maclaurin polynomial of $e^{${k}x}$ to approximate $e^{${k * x0}}$ (3 decimals).`, sol: tx`$P_{${n}}(${x0})=\sum_{i=0}^{${n}}\frac{(${k * x0})^i}{i!}\approx${fx(s)}$` }); });
  fam(10, 0, () => { const k = R(2, 6); return Q({ u: 10, mode: 'num', ans: 1 / k, q: tx`Find the radius of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{${k}^n x^n}{n^2}$. (Number or fraction.)`, sol: tx`Ratio test: $${k}|x|<1\Rightarrow R=\frac1{${k}}$.` }); });
  fam(10, 0, () => { const a = R(1, 6), p = R(1, 3), q = p + R(1, 4), v = a / (1 - p / q); return Q({ u: 10, mode: 'num', ans: v, q: tx`Find $\displaystyle\sum_{n=0}^{\infty}${a}\left(\frac{${p}}{${q}}\right)^n$. (Number or fraction.)`, sol: tx`$\frac{a}{1-r}=\frac{${a}}{1-\frac{${p}}{${q}}}=${FR(v)}$` }); });
  // ---- Related rates, linearization, extrema, DE
  fam(4, 0, () => { const r = R(2, 9), k = R(1, 5), sph = Math.random() < .5; const v = sph ? 4 * Math.PI * r * r * k : 2 * Math.PI * r * k;
    return Q({ u: 4, mode: 'num', ans: v, q: sph ? tx`A sphere's radius grows at $${k}$ cm/s. How fast is the volume growing when $r=${r}$ cm? (Type e.g. 16*pi or a decimal.)` : tx`A circle's radius grows at $${k}$ cm/s. How fast is the circumference growing when $r=${r}$ cm?`, sol: sph ? tx`$\frac{dV}{dt}=4\pi r^2\frac{dr}{dt}=${4 * r * r * k}\pi\approx${fx(v)}$ cm$^3$/s` : tx`$\frac{dC}{dt}=2\pi\frac{dr}{dt}=${2 * k}\pi\approx${fx(v)}$ cm/s` }); });
  fam(4, 0, () => { const s = pk([4, 9, 16, 25]), d = pk([0.2, 0.5, 1]); const v = Math.sqrt(s) + d / (2 * Math.sqrt(s)); return Q({ u: 4, mode: 'num', ans: v, tol: 0.002, q: tx`Use the linearization of $f(x)=\sqrt{x}$ at $x=${s}$ to estimate $\sqrt{${s + d}}$ (3 decimals).`, sol: tx`$L(x)=${Math.sqrt(s)}+\frac{x-${s}}{${2 * Math.sqrt(s)}}$, so $L(${s + d})\approx${fx(v)}$.` }); });
  fam(5, 0, () => { const k = R(1, 4), b = R(-6, 6) * 1, c = R(-9, 3); const f = (x) => x ** 3 + b * x * x + c * x; const lo = -R(1, 3), hi = R(2, 4); const disc = 4 * b * b - 12 * c; const cand = [lo, hi]; if (disc >= 0) [(-2 * b + Math.sqrt(disc)) / 6, (-2 * b - Math.sqrt(disc)) / 6].forEach((x) => { if (x > lo && x < hi) cand.push(x); });
    const mx = Math.max(...cand.map(f)); return Q({ u: 5, c: true, mode: 'num', ans: mx, tol: 0.003, q: tx`Calculator: find the absolute maximum value of $f(x)=${T(poly([1, b, c, 0]))}$ on $[${lo},${hi}]$ (3 decimals).`, sol: tx`Compare $f$ at the endpoints and at critical points where $f'(x)=3x^2+${2 * b}x+${c}=0$ inside the interval. Maximum $\approx${fx(mx)}$.` }); });
  fam(5, 0, () => { const b = R(-4, 4) * 3, c = R(-6, 6); return Q({ u: 5, mode: 'num', ans: -b / 3, q: tx`Find the $x$-coordinate of the inflection point of $f(x)=x^3${b >= 0 ? '+' : ''}${b}x^2${c >= 0 ? '+' : ''}${c}x$. (Number or fraction.)`, sol: tx`$f''(x)=6x+${2 * b}=0\Rightarrow x=${FR(-b / 3)}$` }); });
  fam(7, 0, () => { const a = R(1, 3), b = R(1, 3), y0 = R(1, 3); let x = 0, y = y0; for (let i = 0; i < 2; i++) { y += 0.5 * (a * x + b * y); x += 0.5; }
    return Q({ u: 7, mode: 'num', ans: y, q: tx`$\frac{dy}{dx}=${a}x+${b}y,\ y(0)=${y0}$. Use Euler's method with $h=0.5$ (two steps) to estimate $y(1)$.`, sol: tx`$y_{n+1}=y_n+h(${a}x_n+${b}y_n)$ gives $y(1)\approx${fx(y)}$.` }); });
  fam(7, 0, () => { const k = R(1, 3), y0 = R(1, 4); const v = y0 * Math.exp(k / 2); return Q({ u: 7, mode: 'num', ans: v, q: tx`Solve $\dfrac{dy}{dx}=${k}xy,\ y(0)=${y0}$ and find $y(1)$. (Type e.g. 2*e^(1/2) or a decimal.)`, sol: tx`$y=${y0}e^{${FR(k / 2)}x^2}$, so $y(1)=${y0}e^{${FR(k / 2)}}\approx${fx(v)}$.` }); });

  // ---- checking
  const num = (s) => { try { const r = m.evaluate(norm(s)); return typeof r === 'number' ? r : (r && typeof r.valueOf() === 'number' ? r.valueOf() : NaN); } catch (e) { return NaN; } };
  function check(q, input) {
    try {
      if (!String(input).trim()) return false;
      if (q.mode === 'num') { const v = num(input); return Number.isFinite(v) && Math.abs(v - q.ans) <= q.tol * Math.max(1, Math.abs(q.ans)); }
      const u = fn(input), f = fn(q.ans); let n = 0;
      for (const x of PTS) {
        let a, b;
        if (q.mode === 'anti') { const h = 1e-5; a = (u(x + h) - u(x - h)) / (2 * h); b = f(x); } else { a = u(x); b = f(x); }
        if (!Number.isFinite(b)) continue; if (!Number.isFinite(a)) return false;
        if (Math.abs(a - b) > (q.mode === 'anti' ? 2e-3 : (q.tol || 0.005)) * Math.max(1, Math.abs(b))) return false; n++;
      }
      return n >= 3;
    } catch (e) { return false; }
  }
  function preview(input) { try { return String.raw`$${T(input)}$`; } catch (e) { return ''; } }
  function make(u, c) { const p = F.filter((x) => (u == null || x.u === u || (u === 3 && x.u === 2)) && (c == null || !!x.c === !!c)); FORCE = u === 2 || u === 3 ? u : null; if (u === 3) { const q = p.filter((x) => !x.c); if (!q.length) return null; } let r = null; for (let i = 0; i < 12; i++) { r = p.length ? pk(p).f() : null; if (!r || u == null || r.u === u) break; } FORCE = null; return r; }
  root.ENG = { make: make, check: check, preview: preview, count: F.length, units: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };
  if (typeof module !== 'undefined') module.exports = root.ENG;
})(typeof window !== 'undefined' ? window : globalThis);
