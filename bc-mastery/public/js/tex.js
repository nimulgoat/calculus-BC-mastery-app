/* TX: LaTeX filter. Every string that reaches the page goes through TX.render().
   1. Protects math spans ($..$, $$..$$, \(..\), \[..\]) before any HTML handling.
   2. fix(): repairs converter artifacts (OpenStax/pandoc), unicode math, bad braces, entities.
   3. kx(): KaTeX with strict-off + graceful fallback (never throws, never shows raw errors).
   4. Bare unicode math symbols in prose (<=, pi, infinity, ...) become typeset inline math. */
(function (root) {
  'use strict';
  const FN = 'sin|cos|tan|cot|sec|csc|ln|log|lim|exp|max|min|arcsin|arccos|arctan|sinh|cosh|tanh|gcd|det';
  const IN = { '≤': '\\le ', '≥': '\\ge ', '≠': '\\ne ', '±': '\\pm ', '×': '\\times ', '∞': '\\infty ', 'π': '\\pi ', 'θ': '\\theta ', 'Δ': '\\Delta ', '∫': '\\int ', '∑': '\\sum ', '≈': '\\approx ', '∈': '\\in ', '→': '\\to ', 'α': '\\alpha ', 'β': '\\beta ', 'λ': '\\lambda ', 'μ': '\\mu ', 'σ': '\\sigma ', 'ω': '\\omega ', 'φ': '\\varphi ' };
  const INONLY = { '−': '-', '–': '-', '—': '-', '⋯': '\\cdots ', '…': '\\ldots ', '·': '\\cdot ', '′': "'", '″': "''", '〈': '\\langle ', '〉': '\\rangle ', '⟨': '\\langle ', '⟩': '\\rangle ', '°': '^{\\circ}', '¢': '\\text{c}' };
  const ALL = Object.assign({}, IN, INONLY);
  const cls = (o) => new RegExp('[' + Object.keys(o).join('').replace(/[\\\]\-^]/g, '\\$&') + ']', 'g');
  const reAll = cls(ALL), reOut = cls(IN), hasOut = new RegExp(cls(IN).source);
  const macros = { '\\R': '\\mathbb{R}', '\\dd': '\\,d', '\\abs': '\\left|#1\\right|' };

  function balance(t) { // close or drop unbalanced braces (ignoring escaped \{ \})
    let d = 0, o = '', p = '';
    for (const c of t) {
      if (c === '{' && p !== '\\') d++;
      if (c === '}' && p !== '\\') { if (d === 0) { p = c; continue; } d--; }
      o += c; p = c;
    }
    return o + '}'.repeat(d);
  }
  function fix(t) {
    t = String(t).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
    t = t.replace(/\\mspace\{[^}]*\}/g, '\\,').replace(/\\mathop\{([^{}]*)\}/g, '$1')
      .replace(new RegExp('\\\\text\\{\\s*(' + FN + ')\\s*\\}', 'g'), '\\$1')
      .replace(/\\underset\{([^{}]*)\}\{\\lim\}/g, '\\lim_{$1}')
      .replace(/\\overset\{\\text\{[^{}]*\}\}\{([^{}]*)\}/g, '\\overline{$1}')
      .replace(/\\overset\{[^{}]*\}\{([^{}]*)\}/g, '$1')
      .replace(/\\limits/g, '').replace(/\\(?:long)?rightarrow/g, '\\to ').replace(/\\text\{\s*\/\s*\}/g, '/')
      .replace(/\\mathrm\{d\}/g, 'd').replace(/\\[;:]/g, '\\,').replace(/(\\ ){2,}/g, '\\ ')
      .replace(/\\ ?\\ ?(?=\})/g, '').replace(/\^\{\}/g, '').replace(/_\{\}/g, '');
    for (let i = 0; i < 4 && /\{\{[^{}]*\}\}/.test(t); i++) t = t.replace(/\{\{([^{}]*)\}\}/g, '{$1}');
    t = t.replace(reAll, (c) => ALL[c]);
    return balance(t).trim();
  }
  function kx(tex, disp) {
    const s = fix(tex);
    const o = { displayMode: !!disp, strict: 'ignore', trust: false, macros: macros, errorColor: '#b3362c', maxExpand: 2000 };
    try { return root.katex.renderToString(s, Object.assign({ throwOnError: true }, o)); }
    catch (e) {
      try { return root.katex.renderToString(s, Object.assign({ throwOnError: false }, o)); }
      catch (e2) { return '<code>' + s.replace(/</g, '&lt;') + '</code>'; }
    }
  }
  const MATH = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;
  function render(h) {
    if (!root.katex || typeof h !== 'string') return h;
    if (h.indexOf('$') < 0 && h.indexOf('\\(') < 0 && h.indexOf('\\[') < 0 && !hasOut.test(h)) return h;
    const stash = [];
    // 1) math first, so '<' or '>' inside formulas can never be mistaken for HTML tags
    let s = h.replace(MATH, (_, a, b, c, d) => {
      stash.push(kx(a !== undefined ? a : b !== undefined ? b : c !== undefined ? c : d, a !== undefined || d !== undefined));
      return '\u0001' + (stash.length - 1) + '\u0002';
    });
    // 2) bare unicode math in prose (outside tags only)
    s = s.split(/(<[^>]*>)/).map((p, i) => (i % 2 ? p : p.replace(reOut, (ch) => kx(IN[ch].trim())))).join('');
    return s.replace(/\u0001(\d+)\u0002/g, (_, n) => stash[+n]);
  }
  root.TX = { fix: fix, kx: kx, render: render };
  if (typeof module !== 'undefined') module.exports = root.TX;
})(typeof window !== 'undefined' ? window : globalThis);
