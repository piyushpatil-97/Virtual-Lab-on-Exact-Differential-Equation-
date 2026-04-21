document.addEventListener('DOMContentLoaded', function () {

    // ===================== NAV TABS =====================
    const navTabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');
    const currentSectionEl = document.getElementById('current-section');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const target = this.getAttribute('data-section');
            navTabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            const targetSection = document.getElementById(target + '-section');
            if (targetSection) targetSection.classList.add('active');
            if (currentSectionEl) {
                const sp = this.querySelector('span');
                currentSectionEl.textContent = sp ? sp.textContent
                    : target.charAt(0).toUpperCase() + target.slice(1);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        img.onerror = function () {
            this.src = 'https://via.placeholder.com/150/2c3e50/ffffff?text=Image';
            this.onerror = null;
        };
    });

    // ===================== QUIZ DATA =====================
    const pretestQuestions = [
        { q: "What is a partial derivative?", opts: ["Derivative w.r.t one variable, others constant", "Full derivative", "Integral of a function", "None"], ans: 0 },
        { q: "If f(x,y) = x²y, then ∂f/∂x = ?", opts: ["2xy", "x²", "y", "2x"], ans: 0 },
        { q: "If f(x,y) = x²y, then ∂f/∂y = ?", opts: ["2xy", "x²", "2x", "y"], ans: 1 },
        { q: "∫2xy dx = ?", opts: ["x²y + C", "xy² + C", "2xy²", "x²y²"], ans: 0 },
        { q: "Which is the general form of an exact DE?", opts: ["M(x,y)dx + N(x,y)dy = 0", "dy/dx = f(x)", "y'' + y = 0", "None"], ans: 0 },
        { q: "The condition for exactness is:", opts: ["∂M/∂y = ∂N/∂x", "∂M/∂x = ∂N/∂y", "M = N", "∂²M/∂x² = 0"], ans: 0 },
        { q: "∫cos(y) dy = ?", opts: ["sin(y) + C", "-sin(y) + C", "cos(y) + C", "tan(y) + C"], ans: 0 },
        { q: "If M = y, then ∂M/∂y = ?", opts: ["1", "y", "0", "x"], ans: 0 },
        { q: "What does dψ = Mdx + Ndy mean?", opts: ["ψ is a potential function", "ψ is arbitrary", "M and N are equal", "None"], ans: 0 },
        { q: "For exact DE, the solution is written as:", opts: ["ψ(x,y) = C", "y = mx + b", "x² + y² = 0", "dy/dx = 0"], ans: 0 }
    ];

    const posttestQuestions = [
        { q: "Is (2xy + y²)dx + (x² + 2xy)dy = 0 exact?", opts: ["Yes", "No", "Cannot determine", "Need more info"], ans: 0 },
        { q: "For M = 2xy + y², ∂M/∂y = ?", opts: ["2x + 2y", "2x", "2y", "y²"], ans: 0 },
        { q: "For N = x² + 2xy, ∂N/∂x = ?", opts: ["2x + 2y", "2x", "2y", "x²"], ans: 0 },
        { q: "∫(2xy + y²)dx = ?", opts: ["x²y + xy²", "x²y²", "2xy", "None"], ans: 0 },
        { q: "If ∂M/∂y ≠ ∂N/∂x, the equation is:", opts: ["Non-exact", "Exact", "Linear", "Separable"], ans: 0 },
        { q: "The function ψ(x,y) = C represents:", opts: ["General solution", "Particular solution", "Integrating factor", "None"], ans: 0 },
        { q: "For y dx + x dy = 0, the solution is:", opts: ["xy = C", "x + y = C", "x² + y² = C", "y/x = C"], ans: 0 },
        { q: "An integrating factor μ is used when:", opts: ["Equation is not exact", "Equation is exact", "M = N", "N = 0"], ans: 0 },
        { q: "In the solution formula, ∫M dx is taken with:", opts: ["y as constant", "x as constant", "Both constant", "Neither"], ans: 0 },
        { q: "Terms from N not containing x are integrated because:", opts: ["They give the y-only part of the solution", "They equal M", "They are zero", "None"], ans: 0 }
    ];

    function initQuiz(containerId, questions, scoreId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const qContainer = container.querySelector('.questions-container');
        const scoreSpan = document.getElementById(scoreId);
        let current = 0;
        const answers = new Array(questions.length).fill(-1);

        function renderQuestion(idx) {
            const q = questions[idx];
            qContainer.innerHTML = `
                <div class="question-item">
                    <div class="question-text">Q${idx + 1}. ${q.q}</div>
                    <div class="options">
                        ${q.opts.map((o, i) => `
                            <div class="option ${answers[idx] === i ? 'selected' : ''}" data-idx="${i}">
                                ${String.fromCharCode(65 + i)}. ${o}
                            </div>`).join('')}
                    </div>
                </div>`;
            qContainer.querySelectorAll('.option').forEach(opt => {
                opt.addEventListener('click', function () {
                    answers[idx] = parseInt(this.getAttribute('data-idx'));
                    qContainer.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });
        }

        const startBtn = container.querySelector('[id^="start-"]');
        if (startBtn) startBtn.addEventListener('click', function () { current = 0; renderQuestion(current); this.style.display = 'none'; });

        const prevBtn = container.querySelector('[id^="prev-"]');
        const nextBtn = container.querySelector('[id^="next-"]');
        const submitBtn = container.querySelector('[id^="submit-"]');

        if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) { current--; renderQuestion(current); } });
        if (nextBtn) nextBtn.addEventListener('click', () => { if (current < questions.length - 1) { current++; renderQuestion(current); } });

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                let score = 0;
                answers.forEach((a, i) => { if (a === questions[i].ans) score++; });
                if (scoreSpan) scoreSpan.textContent = score;
                qContainer.innerHTML = `
                    <div style="text-align:center;padding:30px;">
                        <i class="fas fa-check-circle" style="font-size:48px;color:#27ae60;"></i>
                        <h3 style="color:#2c3e50;margin:16px 0 8px;">Test Submitted!</h3>
                        <p style="font-size:16px;">Score: <strong>${score} / ${questions.length}</strong></p>
                        <p style="color:${score >= 7 ? '#27ae60' : score >= 5 ? '#f39c12' : '#e74c3c'};margin-top:8px;">
                            ${score >= 7 ? '🎉 Excellent!' : score >= 5 ? '👍 Good — review missed topics.' : '📚 Please revise and try again.'}
                        </p>
                    </div>`;
            });
        }
    }

    initQuiz('pretest-quiz', pretestQuestions, 'pretest-score');
    initQuiz('posttest-quiz', posttestQuestions, 'posttest-score');
    initSimulation();
});


// ================================================================
//  SIMULATION ENGINE
//
//  Method (exactly as in student's handwritten notes):
//
//    G.S. = ∫M dx (y = const)
//           + ∫[terms in N NOT containing x] dy
//           = C
//
//  From Q2 notes (Image 1):
//    M = -tany + 2xy + y
//    ∫M dx (y const) = -x·tany + x²y + xy
//    Terms in N not having x: sec²y  →  ∫sec²y dy = tany
//    G.S. = -x·tany + x²y + xy + tany = C
//
//  From Q1 notes (Image 2):
//    M = sinx·cosy + e^(2x)
//    ∫M dx = -cosx·cosy + e^(2x)/2
//    Terms in N not having x: tany  →  ∫tany dy = ln|secy|
//    G.S. = -cosx·cosy + e^(2x)/2 + ln|secy| = C
// ================================================================
function initSimulation() {

    const MInput     = document.getElementById('M-input');
    const NInput     = document.getElementById('N-input');
    const eqDisplay  = document.getElementById('eq-display');
    const btnProceed = document.getElementById('btn-proceed-deriv');
    const btnReset   = document.getElementById('btn-reset');
    const panel2     = document.getElementById('panel-step2');
    const dMdyInput  = document.getElementById('dMdy-input');
    const dNdxInput  = document.getElementById('dNdx-input');
    const btnChkM    = document.getElementById('btn-check-dMdy');
    const btnChkN    = document.getElementById('btn-check-dNdx');
    const resDMdy    = document.getElementById('res-dMdy');
    const resDNdx    = document.getElementById('res-dNdx');
    const btnExact   = document.getElementById('btn-check-exactness');
    const solSteps   = document.getElementById('solution-steps');
    const sampleBtns = document.querySelectorAll('.sample-btn');

    if (!MInput) return;

    let curM = '', curN = '', cDMdy = '', cDNdx = '';
    let dMdyOk = false, dNdxOk = false;

    function updatePreview() {
        const M = MInput.value.trim() || 'M(x,y)';
        const N = NInput.value.trim() || 'N(x,y)';
        eqDisplay.textContent = `( ${M} ) dx  +  ( ${N} ) dy  =  0`;
    }
    MInput.addEventListener('input', updatePreview);
    NInput.addEventListener('input', updatePreview);

    sampleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            MInput.value = this.dataset.m;
            NInput.value = this.dataset.n;
            updatePreview();
            resetAll();
        });
    });

    function resetAll() {
        panel2.classList.add('hidden');
        dMdyInput.value = ''; dNdxInput.value = '';
        clearFB(resDMdy); clearFB(resDNdx);
        dMdyOk = false; dNdxOk = false;
        solSteps.innerHTML = `
            <div class="placeholder-msg">
                <i class="fas fa-calculator"></i>
                <p>Enter M(x,y) and N(x,y), then follow the guided steps.</p>
                <p class="hint-small">Solution will appear here step by step.</p>
            </div>`;
    }

    function clearFB(el) { el.textContent = ''; el.className = 'verify-feedback'; }
    function setFB(el, msg, cls) { el.textContent = msg; el.className = `verify-feedback ${cls}`; }

    btnReset.addEventListener('click', () => { MInput.value = ''; NInput.value = ''; updatePreview(); resetAll(); });

    // ---- Step 1: Proceed to derivatives ----
    btnProceed.addEventListener('click', () => {
        const M = MInput.value.trim();
        const N = NInput.value.trim();
        if (!M || !N) { pushAlert('Please enter both M(x,y) and N(x,y) first.'); return; }

        curM = M; curN = N;
        dMdyOk = false; dNdxOk = false;

        try { cDMdy = diffExpr(M, 'y'); cDNdx = diffExpr(N, 'x'); }
        catch (e) { pushAlert('Could not parse the expression. Check input format.'); return; }

        dMdyInput.value = ''; dNdxInput.value = '';
        clearFB(resDMdy); clearFB(resDNdx);
        panel2.classList.remove('hidden');
        panel2.scrollIntoView({ behavior: 'smooth', block: 'start' });

        solSteps.innerHTML = '';
        addStep('Step 1 — Compare with Mdx + Ndy = 0', `
            <span class="sol-eq"><strong>M(x,y)</strong> = ${M}</span>
            <span class="sol-eq"><strong>N(x,y)</strong> = ${N}</span>
            Next: compute ∂M/∂y and ∂N/∂x to test exactness.
        `, 'fas fa-edit', '#3498db');
    });

    // ---- Step 2a: Verify ∂M/∂y ----
    btnChkM.addEventListener('click', () => {
        const u = dMdyInput.value.trim();
        if (!u) { setFB(resDMdy, 'Enter a value first.', 'hint'); return; }
        if (exprsEqual(u, cDMdy)) {
            setFB(resDMdy, `✓ Correct!  ∂M/∂y = ${cDMdy}`, 'correct');
            dMdyOk = true;
            addStep('Step 2a — ∂M/∂y', `
                Differentiating M = ${curM} &nbsp;w.r.t.&nbsp;<strong>y</strong> (x = constant):<br>
                <span class="sol-eq">∂M/∂y  =  ${cDMdy}</span>
                ✓ Correct.
            `, 'fas fa-check-circle', '#27ae60');
        } else {
            setFB(resDMdy, '✗ Incorrect — differentiate w.r.t y, treating x as constant.', 'wrong');
            dMdyOk = false;
        }
    });

    // ---- Step 2b: Verify ∂N/∂x ----
    btnChkN.addEventListener('click', () => {
        const u = dNdxInput.value.trim();
        if (!u) { setFB(resDNdx, 'Enter a value first.', 'hint'); return; }
        if (exprsEqual(u, cDNdx)) {
            setFB(resDNdx, `✓ Correct!  ∂N/∂x = ${cDNdx}`, 'correct');
            dNdxOk = true;
            addStep('Step 2b — ∂N/∂x', `
                Differentiating N = ${curN} &nbsp;w.r.t.&nbsp;<strong>x</strong> (y = constant):<br>
                <span class="sol-eq">∂N/∂x  =  ${cDNdx}</span>
                ✓ Correct.
            `, 'fas fa-check-circle', '#27ae60');
        } else {
            setFB(resDNdx, '✗ Incorrect — differentiate w.r.t x, treating y as constant.', 'wrong');
            dNdxOk = false;
        }
    });

    // ---- Step 3: Check exactness ----
    btnExact.addEventListener('click', () => {
        if (!dMdyOk || !dNdxOk) { pushAlert('Verify both derivatives correctly first.'); return; }

        const exact = exprsEqual(cDMdy, cDNdx);

        addStep('Step 3 — Exactness Condition', `
            <table class="cond-table">
                <tr><td>∂M/∂y</td><td>=</td><td><strong>${cDMdy}</strong></td></tr>
                <tr><td>∂N/∂x</td><td>=</td><td><strong>${cDNdx}</strong></td></tr>
            </table>
            ${exact
                ? `<span class="tag-exact">∴ &nbsp;∂M/∂y = ∂N/∂x &nbsp;⟹&nbsp; Given D.E. is <strong>EXACT</strong></span>`
                : `<span class="tag-nonexact">∴ &nbsp;∂M/∂y ≠ ∂N/∂x &nbsp;⟹&nbsp; Given D.E. is <strong>NOT EXACT</strong></span>`
            }
        `, 'fas fa-balance-scale', exact ? '#27ae60' : '#e74c3c',
           exact ? 'exact-badge' : 'non-exact-badge');

        if (!exact) {
            addStep('Non-Exact — Integrating Factor Needed', `
                Since ∂M/∂y ≠ ∂N/∂x, use an <strong>Integrating Factor (μ)</strong>:<br>
                <span class="sol-eq">If &nbsp;(∂M/∂y − ∂N/∂x) / N &nbsp;= f(x) only &nbsp;→ &nbsp;μ = e<sup>∫f(x)dx</sup></span>
                <span class="sol-eq">If &nbsp;(∂N/∂x − ∂M/∂y) / M &nbsp;= g(y) only &nbsp;→ &nbsp;μ = e<sup>∫g(y)dy</sup></span>
                Multiply through by μ, then proceed with the exact formula.
            `, 'fas fa-exclamation-triangle', '#e74c3c', 'non-exact-badge');
            return;
        }

        solveExact(curM, curN);
    });

    // ================================================================
    //  EXACT SOLVER — Student's method (handwritten notes)
    //
    //  G.S. =  ∫M dx (y = const)
    //        + ∫[terms in N NOT containing x] dy
    //        = C
    // ================================================================
    function solveExact(M, N) {

        // Step 4 — Integrate M w.r.t x (y = constant)
        const intMTerms = splitTerms(M);
        const intMParts = intMTerms.map(t => intWrtX(t.trim())).filter(r => r !== '0');
        const intMStr   = joinTerms(intMParts) || '0';

        addStep('Step 4 — ∫M dx &nbsp;(y = constant)', `
            <div class="formula-box">∫ ( ${M} ) dx &nbsp;&nbsp;[y treated as constant]</div>
            Integrating term by term:<br>
            ${intMTerms.map((t,i) => `
                <div class="int-row">
                    <span class="int-term">∫ (${t.trim()}) dx</span>
                    <span class="int-arrow">→</span>
                    <span class="int-result">${intMParts[i] || '0'}</span>
                </div>`).join('')}
            <span class="sol-eq">${intMStr}</span>
        `, 'fas fa-calculator', '#8e44ad');

        // Step 5 — Identify terms in N not containing x
        const NTerms   = splitTerms(N);
        const noXTerms = NTerms.filter(t => !hasVar(t.trim(), 'x'));
        const hasXTerms = NTerms.filter(t => hasVar(t.trim(), 'x'));

        const noXStr  = noXTerms.length > 0 ? joinTerms(noXTerms.map(t => t.trim())) : '(none)';
        const hasXStr = hasXTerms.length > 0 ? joinTerms(hasXTerms.map(t => t.trim())) : '(none)';

        addStep('Step 5 — Identify Terms in N Not Containing x', `
            <strong>N(x,y)</strong> = ${N}<br><br>
            <table class="term-table">
                <tr>
                    <th>Terms containing x &nbsp;(skip — already covered by ∫M dx)</th>
                    <th>Terms NOT containing x &nbsp;✓ (integrate these w.r.t y)</th>
                </tr>
                <tr>
                    <td style="color:#c0392b;">${hasXStr}</td>
                    <td style="color:#27ae60;font-weight:600;">${noXStr}</td>
                </tr>
            </table>
        `, 'fas fa-filter', '#f39c12');

        // Step 6 — Integrate those terms w.r.t y
        let intNyStr = '0';
        let intNyParts = [];

        if (noXTerms.length > 0) {
            const noXJoined = joinTerms(noXTerms.map(t => t.trim()));
            const noXSplit  = splitTerms(noXJoined);
            intNyParts = noXSplit.map(t => intWrtY(t.trim())).filter(r => r !== '0');
            intNyStr   = joinTerms(intNyParts) || '0';

            addStep('Step 6 — ∫[Terms in N not containing x] dy', `
                <div class="formula-box">∫ ( ${noXStr} ) dy</div>
                Integrating term by term:<br>
                ${noXSplit.map((t, i) => `
                    <div class="int-row">
                        <span class="int-term">∫ (${t.trim()}) dy</span>
                        <span class="int-arrow">→</span>
                        <span class="int-result">${intNyParts[i] || '0'}</span>
                    </div>`).join('')}
                <span class="sol-eq">${intNyStr}</span>
            `, 'fas fa-calculator', '#16a085');
        } else {
            addStep('Step 6 — No Terms in N Free of x', `
                All terms of N contain x, so:<br>
                <span class="sol-eq">∫[terms in N not containing x] dy = 0</span>
                Nothing extra to add.
            `, 'fas fa-info-circle', '#7f8c8d');
        }

        // Step 7 — General Solution
        const gsParts = [intMStr];
        if (intNyStr !== '0') gsParts.push(intNyStr);
        const gsStr = joinTerms(gsParts);

        addStep('Step 7 — General Solution', `
            Using the formula:<br>
            <div class="formula-box">
                G.S. &nbsp;=&nbsp;
                <u>∫M dx</u><sub style="font-size:11px;"> (y=const)</sub>
                &nbsp;+&nbsp;
                <u>∫[terms in N not containing x] dy</u>
                &nbsp;= C
            </div>
            <div class="final-answer-box">
                ${gsStr} &nbsp;= C
            </div>
        `, 'fas fa-check-double', '#27ae60', 'final-sol');
    }


    // ================================================================
    //  MATH ENGINE
    // ================================================================

    /* Split "a + b - c + ..." into ["a", "+b", "-c", ...] at top-level +/- */
    function splitTerms(expr) {
        const s = expr.replace(/\s+/g, '');
        const terms = [];
        let depth = 0, start = 0;
        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (c === '(' || c === '[') depth++;
            else if (c === ')' || c === ']') depth--;
            else if ((c === '+' || c === '-') && depth === 0 && i > 0) {
                terms.push(s.slice(start, i));
                start = i;
            }
        }
        terms.push(s.slice(start));
        return terms.filter(t => t !== '');
    }

    /* Re-join an array of terms with proper +/- signs */
    function joinTerms(arr) {
        if (!arr.length) return '0';
        return arr.reduce((acc, t, i) => {
            if (i === 0) return t;
            if (t.startsWith('-')) return acc + ' ' + t;
            return acc + ' + ' + t;
        }, '');
    }

    function hasVar(expr, v) {
        return new RegExp(`(?<![a-zA-Z])${v}(?![a-zA-Z])`).test(expr);
    }

    function parseCoeff(s) {
        if (!s || s === '' || s === '+') return 1;
        if (s === '-') return -1;
        const n = parseFloat(s);
        return isNaN(n) ? 1 : n;
    }

    function fmtC(c, varStr) {
        if (!varStr) return `${c}`;
        if (c === 1) return varStr;
        if (c === -1) return `-${varStr}`;
        return `${c}*${varStr}`;
    }

    // ---- Differentiation ----
    function diffExpr(expr, v) {
        const terms = splitTerms(expr);
        const parts = terms.map(t => diffTerm(t.trim(), v)).filter(d => d !== '0' && d !== '');
        return joinTerms(parts) || '0';
    }

    function diffTerm(s, v) {
        if (!hasVar(s, v)) return '0';
        const other = v === 'x' ? 'y' : 'x';

        // just v
        if (s === v || s === `+${v}`) return '1';
        if (s === `-${v}`) return '-1';

        // sin(inner)
        const SIN = s.match(/^([+-]?\d*\.?\d*)\*?sin\(([^)]+)\)$/);
        if (SIN) {
            const c = parseCoeff(SIN[1]); const inner = SIN[2];
            if (!hasVar(inner, v)) return '0';
            const id = idiff(inner, v);
            return fmtC(c * id, `cos(${inner})`);
        }

        // cos(inner)
        const COS = s.match(/^([+-]?\d*\.?\d*)\*?cos\(([^)]+)\)$/);
        if (COS) {
            const c = parseCoeff(COS[1]); const inner = COS[2];
            if (!hasVar(inner, v)) return '0';
            const id = idiff(inner, v);
            const newC = -(c * id);
            return fmtC(newC, `sin(${inner})`);
        }

        // tan(inner) → sec²(inner)
        const TAN = s.match(/^([+-]?\d*\.?\d*)\*?tan\(([^)]+)\)$/);
        if (TAN) {
            const c = parseCoeff(TAN[1]); const inner = TAN[2];
            if (!hasVar(inner, v)) return '0';
            const id = idiff(inner, v);
            return fmtC(c * id, `sec^2(${inner})`);
        }

        // sec^2(inner) → 2*sec^2(inner)*tan(inner)  [rarely input, skip]
        // exp(inner)
        const EXP = s.match(/^([+-]?\d*\.?\d*)\*?exp\(([^)]+)\)$/);
        if (EXP) {
            const c = parseCoeff(EXP[1]); const inner = EXP[2];
            if (!hasVar(inner, v)) return '0';
            const id = idiff(inner, v);
            return fmtC(c * id, `exp(${inner})`);
        }

        // monomial: [coeff*]v^n
        const MONO = s.match(/^([+-]?\d*\.?\d*)\*?([xy])\^?(\d*\.?\d*)$/);
        if (MONO) {
            const c = parseCoeff(MONO[1]);
            const vrb = MONO[2]; const n = MONO[3] === '' ? 1 : parseFloat(MONO[3]);
            if (vrb !== v) return '0';
            if (n === 1) return fmtC(c, '');
            const newC = c * n; const newN = n - 1;
            if (newN === 0) return `${newC}`;
            if (newN === 1) return fmtC(newC, v);
            return fmtC(newC, `${v}^${newN}`);
        }

        // product x^a * y^b
        if (hasVar(s, 'x') && hasVar(s, 'y') && s.includes('*')) {
            return diffXYprod(s, v);
        }

        // product rule for other combos
        if (s.includes('*')) return diffProd(s, v);

        return `d(${s})/d${v}`;
    }

    function idiff(inner, v) {
        if (inner === v) return 1;
        const m = inner.replace(/\s+/g,'').match(/^([+-]?\d+\.?\d*)\*?([xy])$/);
        if (m && m[2] === v) return parseFloat(m[1]);
        if (!hasVar(inner, v)) return 0;
        return 1;
    }

    function diffXYprod(s, v) {
        const sign = s.startsWith('-') ? -1 : 1;
        const factors = s.replace(/^[+-]/, '').split('*');
        let coeff = sign, xP = 0, yP = 0;
        for (const f of factors) {
            const ft = f.trim();
            if (!isNaN(ft)) { coeff *= parseFloat(ft); continue; }
            if (ft === 'x') { xP++; continue; }
            if (ft === 'y') { yP++; continue; }
            const xm = ft.match(/^x\^(\d+\.?\d*)$/); if (xm) { xP += parseFloat(xm[1]); continue; }
            const ym = ft.match(/^y\^(\d+\.?\d*)$/); if (ym) { yP += parseFloat(ym[1]); continue; }
        }
        if (v === 'x') {
            if (xP === 0) return '0';
            return buildMono(coeff * xP, xP - 1, yP);
        } else {
            if (yP === 0) return '0';
            return buildMono(coeff * yP, xP, yP - 1);
        }
    }

    function diffProd(s, v) {
        const idx = s.indexOf('*');
        if (idx < 0) return `d(${s})/d${v}`;
        const A = s.slice(0, idx).trim(), B = s.slice(idx + 1).trim();
        const dA = diffTerm(A, v), dB = diffTerm(B, v);
        const parts = [];
        if (dA !== '0') parts.push(dA === '1' ? B : `${dA}*${B}`);
        if (dB !== '0') parts.push(dB === '1' ? A : `${A}*${dB}`);
        return joinTerms(parts) || '0';
    }

    function buildMono(coeff, xP, yP) {
        if (coeff === 0) return '0';
        const xStr = xP === 0 ? '' : xP === 1 ? 'x' : `x^${xP}`;
        const yStr = yP === 0 ? '' : yP === 1 ? 'y' : `y^${yP}`;
        const varStr = [xStr, yStr].filter(Boolean).join('*');
        return fmtC(coeff, varStr);
    }

    // ---- Integration w.r.t x (y = constant) ----
    function intWrtX(term) {
        if (!hasVar(term, 'x')) {
            // pure y-term or const → multiply by x
            if (term === '0') return '0';
            if (term === '1' || term === '+1') return 'x';
            if (term === '-1') return '-x';
            const clean = term.replace(/^\+/, '');
            return `${clean}*x`;
        }
        const s = term.replace(/\s+/g, '');

        // just x
        if (s === 'x' || s === '+x') return 'x^2/2';
        if (s === '-x') return '-x^2/2';

        // monomial c*x^n
        const MX = s.match(/^([+-]?\d*\.?\d*)\*?x\^?(\d*\.?\d*)$/);
        if (MX) {
            const c = parseCoeff(MX[1]); const n = MX[2] === '' ? 1 : parseFloat(MX[2]);
            const nn = n + 1; const nc = c / nn;
            return fmtC(nc, nn === 1 ? 'x' : `x^${nn}`);
        }

        // product x^a * y^b
        if (hasVar(s, 'y') && s.includes('*')) return intXYprod(s, 'x');

        // sin(inner) → -cos(inner)/id
        const SIN = s.match(/^([+-]?\d*\.?\d*)\*?sin\(([^)]+)\)$/);
        if (SIN && hasVar(SIN[2], 'x')) {
            const c = parseCoeff(SIN[1]); const id = idiff(SIN[2], 'x');
            return fmtC(-c / id, `cos(${SIN[2]})`);
        }

        // cos(inner) → sin(inner)/id
        const COS = s.match(/^([+-]?\d*\.?\d*)\*?cos\(([^)]+)\)$/);
        if (COS && hasVar(COS[2], 'x')) {
            const c = parseCoeff(COS[1]); const id = idiff(COS[2], 'x');
            return fmtC(c / id, `sin(${COS[2]})`);
        }

        // exp(inner) → exp(inner)/id
        const EXP = s.match(/^([+-]?\d*\.?\d*)\*?exp\(([^)]+)\)$/);
        if (EXP && hasVar(EXP[2], 'x')) {
            const c = parseCoeff(EXP[1]); const id = idiff(EXP[2], 'x');
            return fmtC(c / id, `exp(${EXP[2]})`);
        }

        // tan(x) → -ln|cos(x)|   (i.e. ln|sec(x)|)
        const TANX = s.match(/^([+-]?\d*\.?\d*)\*?tan\(([^)]+)\)$/);
        if (TANX && hasVar(TANX[2], 'x')) {
            const c = parseCoeff(TANX[1]);
            return fmtC(-c, `ln|cos(${TANX[2]})|`);
        }

        // product rule type: e.g. sin(x)*cos(y) already handled by splitTerms if separate
        // Try product split
        if (s.includes('*')) return intXYprod(s, 'x');

        return `∫(${term})dx`;
    }

    // ---- Integration w.r.t y ----
    function intWrtY(term) {
        if (!hasVar(term, 'y')) {
            if (term === '0') return '0';
            if (term === '1' || term === '+1') return 'y';
            if (term === '-1') return '-y';
            const clean = term.replace(/^\+/, '');
            return `${clean}*y`;
        }
        const s = term.replace(/\s+/g, '');

        if (s === 'y' || s === '+y') return 'y^2/2';
        if (s === '-y') return '-y^2/2';

        const MY = s.match(/^([+-]?\d*\.?\d*)\*?y\^?(\d*\.?\d*)$/);
        if (MY) {
            const c = parseCoeff(MY[1]); const n = MY[2] === '' ? 1 : parseFloat(MY[2]);
            const nn = n + 1; const nc = c / nn;
            return fmtC(nc, nn === 1 ? 'y' : `y^${nn}`);
        }

        if (hasVar(s, 'x') && s.includes('*')) return intXYprod(s, 'y');

        const SIN = s.match(/^([+-]?\d*\.?\d*)\*?sin\(([^)]+)\)$/);
        if (SIN && hasVar(SIN[2], 'y')) {
            const c = parseCoeff(SIN[1]); const id = idiff(SIN[2], 'y');
            return fmtC(-c / id, `cos(${SIN[2]})`);
        }

        const COS = s.match(/^([+-]?\d*\.?\d*)\*?cos\(([^)]+)\)$/);
        if (COS && hasVar(COS[2], 'y')) {
            const c = parseCoeff(COS[1]); const id = idiff(COS[2], 'y');
            return fmtC(c / id, `sin(${COS[2]})`);
        }

        // tan(y) → ln|sec(y)|
        const TAN = s.match(/^([+-]?\d*\.?\d*)\*?tan\(([^)]+)\)$/);
        if (TAN && hasVar(TAN[2], 'y')) {
            const c = parseCoeff(TAN[1]);
            return fmtC(c, `ln|sec(${TAN[2]})|`);
        }

        // sec^2(y) → tan(y)
        const SEC2 = s.match(/^([+-]?\d*\.?\d*)\*?sec\^2\(([^)]+)\)$/);
        if (SEC2 && hasVar(SEC2[2], 'y')) {
            const c = parseCoeff(SEC2[1]);
            return fmtC(c, `tan(${SEC2[2]})`);
        }

        // exp(y)
        const EXP = s.match(/^([+-]?\d*\.?\d*)\*?exp\(([^)]+)\)$/);
        if (EXP && hasVar(EXP[2], 'y')) {
            const c = parseCoeff(EXP[1]); const id = idiff(EXP[2], 'y');
            return fmtC(c / id, `exp(${EXP[2]})`);
        }

        if (s.includes('*')) return intXYprod(s, 'y');

        return `∫(${term})dy`;
    }

    function intXYprod(s, wrt) {
        const sign = s.startsWith('-') ? -1 : 1;
        const factors = s.replace(/^[+-]/, '').split('*');
        let coeff = sign, xP = 0, yP = 0, extra = [];
        for (const f of factors) {
            const ft = f.trim();
            if (!isNaN(ft)) { coeff *= parseFloat(ft); continue; }
            if (ft === 'x') { xP++; continue; }
            if (ft === 'y') { yP++; continue; }
            const xm = ft.match(/^x\^(\d+\.?\d*)$/); if (xm) { xP += parseFloat(xm[1]); continue; }
            const ym = ft.match(/^y\^(\d+\.?\d*)$/); if (ym) { yP += parseFloat(ym[1]); continue; }
            extra.push(ft);
        }
        if (wrt === 'x') { const np = xP + 1; return buildMono(coeff / np, np, yP); }
        else              { const np = yP + 1; return buildMono(coeff / np, xP, np); }
    }

    // ---- Numeric expression comparison ----
    function evalEx(e, x, y) {
        try {
            const r = e.replace(/\s+/g,'')
                .replace(/\bexp\b/g,'Math.exp')
                .replace(/\bsin\b/g,'Math.sin')
                .replace(/\bcos\b/g,'Math.cos')
                .replace(/\btan\b/g,'Math.tan')
                .replace(/\bsec\^2\b/g,'(1/Math.pow(Math.cos')
                .replace(/\bsqrt\b/g,'Math.sqrt')
                .replace(/\^/g,'**')
                .replace(/(?<![a-zA-Z])x(?![a-zA-Z])/g,`(${x})`)
                .replace(/(?<![a-zA-Z])y(?![a-zA-Z])/g,`(${y})`);
            // eslint-disable-next-line no-new-func
            return Function('"use strict";return('+r+')')();
        } catch { return NaN; }
    }

    function exprsEqual(a, b) {
        const norm = s => s.replace(/\s+/g,'').toLowerCase().replace(/\*\*/g,'^');
        if (norm(a) === norm(b)) return true;
        const pts = [{x:1,y:2},{x:2,y:3},{x:0.5,y:1.5},{x:3,y:1},{x:1.5,y:2.5}];
        let matched = 0;
        for (const p of pts) {
            const va = evalEx(a, p.x, p.y), vb = evalEx(b, p.x, p.y);
            if (isNaN(va) || isNaN(vb) || !isFinite(va) || !isFinite(vb)) continue;
            if (Math.abs(va - vb) > 0.01) return false;
            matched++;
        }
        return matched >= 2;
    }

    // ---- UI helpers ----
    function addStep(title, body, icon, color, extraClass) {
        const ph = solSteps.querySelector('.placeholder-msg');
        if (ph) ph.remove();
        const div = document.createElement('div');
        div.className = `sol-step ${extraClass || ''}`;
        div.innerHTML = `
            <div class="sol-step-title">
                <i class="${icon}" style="color:${color};font-size:15px;"></i>
                <span>${title}</span>
            </div>
            <div class="sol-step-body">${body}</div>`;
        solSteps.appendChild(div);
        div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function pushAlert(text) {
        addStep('Notice', `<span style="color:#e67e22;">⚠ ${text}</span>`,
                'fas fa-exclamation-triangle', '#e67e22');
    }

    updatePreview();
}
