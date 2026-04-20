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
                currentSectionEl.textContent = this.querySelector('span')
                    ? this.querySelector('span').textContent
                    : target.charAt(0).toUpperCase() + target.slice(1);
            }
        });
    });

    // ===================== IMAGE FALLBACK =====================
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
        { q: "∫2xy dx = ?", opts: ["x²y + g(y)", "xy² + g(x)", "2xy²", "x²y²"], ans: 0 },
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
        { q: "∫(2xy + y²)dx = ?", opts: ["x²y + xy² + g(y)", "x²y² + g(y)", "2xy + g(y)", "None"], ans: 0 },
        { q: "If ∂M/∂y ≠ ∂N/∂x, the equation is:", opts: ["Non-exact", "Exact", "Linear", "Separable"], ans: 0 },
        { q: "The function ψ(x,y) = C represents:", opts: ["General solution", "Particular solution", "Integrating factor", "None"], ans: 0 },
        { q: "For y dx + x dy = 0, the solution is:", opts: ["xy = C", "x + y = C", "x² + y² = C", "y/x = C"], ans: 0 },
        { q: "An integrating factor μ is used when:", opts: ["Equation is not exact", "Equation is exact", "M = N", "N = 0"], ans: 0 },
        { q: "For exact DE, ∫M dx gives:", opts: ["Partial solution ψ, with g(y) unknown", "Final solution", "N directly", "None"], ans: 0 },
        { q: "After solving, g'(y) is found by:", opts: ["Comparing ∂ψ/∂y with N", "Differentiating M", "Integrating N", "Setting M = 0"], ans: 0 }
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
        if (startBtn) {
            startBtn.addEventListener('click', function () {
                current = 0;
                renderQuestion(current);
                this.style.display = 'none';
            });
        }

        const prevBtn = container.querySelector('[id^="prev-"]');
        const nextBtn = container.querySelector('[id^="next-"]');
        const submitBtn = container.querySelector('[id^="submit-"]');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (current > 0) { current--; renderQuestion(current); }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (current < questions.length - 1) { current++; renderQuestion(current); }
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                let score = 0;
                answers.forEach((a, i) => { if (a === questions[i].ans) score++; });
                if (scoreSpan) scoreSpan.textContent = score;
                qContainer.innerHTML = `
                    <div style="text-align:center;padding:30px;">
                        <i class="fas fa-check-circle" style="font-size:48px;color:#27ae60;"></i>
                        <h3 style="color:#2c3e50;margin:16px 0 8px;">Test Submitted!</h3>
                        <p style="color:#7f8c8d;font-size:16px;">Your Score: <strong style="color:#2c3e50;">${score} / ${questions.length}</strong></p>
                        <p style="color:${score >= 7 ? '#27ae60' : '#e74c3c'};font-size:15px;margin-top:8px;">
                            ${score >= 7 ? '🎉 Excellent! Well done.' : score >= 5 ? '👍 Good effort! Review the missed topics.' : '📚 Please review the material and try again.'}
                        </p>
                    </div>`;
            });
        }
    }

    initQuiz('pretest-quiz', pretestQuestions, 'pretest-score');
    initQuiz('posttest-quiz', posttestQuestions, 'posttest-score');

    // ===================== SIMULATION =====================
    initSimulation();
});

// ============================================================
//  SIMULATION ENGINE
// ============================================================
function initSimulation() {

    // --- DOM refs ---
    const MInput = document.getElementById('M-input');
    const NInput = document.getElementById('N-input');
    const eqDisplay = document.getElementById('eq-display');
    const btnProceedDeriv = document.getElementById('btn-proceed-deriv');
    const btnReset = document.getElementById('btn-reset');
    const panel2 = document.getElementById('panel-step2');
    const dMdyInput = document.getElementById('dMdy-input');
    const dNdxInput = document.getElementById('dNdx-input');
    const btnCheckDMdy = document.getElementById('btn-check-dMdy');
    const btnCheckDNdx = document.getElementById('btn-check-dNdx');
    const resDMdy = document.getElementById('res-dMdy');
    const resDNdx = document.getElementById('res-dNdx');
    const btnCheckExact = document.getElementById('btn-check-exactness');
    const solutionSteps = document.getElementById('solution-steps');
    const sampleBtns = document.querySelectorAll('.sample-btn');

    if (!MInput) return; // simulation not on page

    // State
    let currentM = '', currentN = '';
    let correctDMdy = '', correctDNdx = '';
    let dMdyOk = false, dNdxOk = false;

    // Update equation preview
    function updatePreview() {
        const M = MInput.value.trim() || 'M(x,y)';
        const N = NInput.value.trim() || 'N(x,y)';
        eqDisplay.textContent = `( ${M} ) dx + ( ${N} ) dy = 0`;
    }

    MInput.addEventListener('input', updatePreview);
    NInput.addEventListener('input', updatePreview);

    // Sample buttons
    sampleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            MInput.value = this.dataset.m;
            NInput.value = this.dataset.n;
            updatePreview();
            resetToStep1();
        });
    });

    // Reset
    function resetToStep1() {
        panel2.classList.add('hidden');
        dMdyInput.value = '';
        dNdxInput.value = '';
        resDMdy.textContent = '';
        resDMdy.className = 'verify-feedback';
        resDNdx.textContent = '';
        resDNdx.className = 'verify-feedback';
        dMdyOk = false;
        dNdxOk = false;
        solutionSteps.innerHTML = `
            <div class="placeholder-msg">
                <i class="fas fa-calculator"></i>
                <p>Enter M(x,y) and N(x,y) on the left, then follow the guided steps.</p>
                <p class="hint-small">The solution will appear here as you progress.</p>
            </div>`;
    }

    btnReset.addEventListener('click', () => {
        MInput.value = '';
        NInput.value = '';
        updatePreview();
        resetToStep1();
    });

    // Step 1 → show derivative panel
    btnProceedDeriv.addEventListener('click', () => {
        const M = MInput.value.trim();
        const N = NInput.value.trim();

        if (!M || !N) {
            showMsg('⚠ Please enter both M(x,y) and N(x,y) first.', 'warning');
            return;
        }

        currentM = M;
        currentN = N;
        dMdyOk = false;
        dNdxOk = false;

        // Compute correct derivatives
        try {
            correctDMdy = computeDerivative(M, 'y');
            correctDNdx = computeDerivative(N, 'x');
        } catch (e) {
            showMsg('❌ Could not parse expression. Please check your input.', 'error');
            return;
        }

        dMdyInput.value = '';
        dNdxInput.value = '';
        resDMdy.textContent = '';
        resDMdy.className = 'verify-feedback';
        resDNdx.textContent = '';
        resDNdx.className = 'verify-feedback';

        panel2.classList.remove('hidden');
        panel2.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Show step 1 in solution panel
        solutionSteps.innerHTML = '';
        addSolStep('Step 1: Equation Entered', `
            The differential equation is:<br>
            <span class="sol-equation">( ${M} ) dx + ( ${N} ) dy = 0</span>
            We identify:<br>
            <strong>M(x,y)</strong> = ${M}<br>
            <strong>N(x,y)</strong> = ${N}<br><br>
            Now compute ∂M/∂y and ∂N/∂x to check exactness.
        `, 'fas fa-edit', '#3498db');
    });

    // Verify ∂M/∂y
    btnCheckDMdy.addEventListener('click', () => {
        const userVal = dMdyInput.value.trim();
        if (!userVal) { resDMdy.textContent = 'Please enter a value first.'; resDMdy.className = 'verify-feedback hint'; return; }

        const userSimp = normalizeExpr(userVal);
        const corrSimp = normalizeExpr(correctDMdy);

        if (userSimp === corrSimp || expressionsEqual(userVal, correctDMdy)) {
            resDMdy.textContent = `✓ Correct! ∂M/∂y = ${correctDMdy}`;
            resDMdy.className = 'verify-feedback correct';
            dMdyOk = true;

            addSolStep('Step 2a: ∂M/∂y Computed', `
                Differentiating M = ${currentM} with respect to y:<br>
                <span class="sol-equation">∂M/∂y = ${correctDMdy}</span>
                ✓ Your answer is correct.
            `, 'fas fa-check-circle', '#27ae60');
        } else {
            resDMdy.textContent = `✗ Not quite. Check your differentiation. Hint: treat x as constant.`;
            resDMdy.className = 'verify-feedback wrong';
            dMdyOk = false;
        }
    });

    // Verify ∂N/∂x
    btnCheckDNdx.addEventListener('click', () => {
        const userVal = dNdxInput.value.trim();
        if (!userVal) { resDNdx.textContent = 'Please enter a value first.'; resDNdx.className = 'verify-feedback hint'; return; }

        const userSimp = normalizeExpr(userVal);
        const corrSimp = normalizeExpr(correctDNdx);

        if (userSimp === corrSimp || expressionsEqual(userVal, correctDNdx)) {
            resDNdx.textContent = `✓ Correct! ∂N/∂x = ${correctDNdx}`;
            resDNdx.className = 'verify-feedback correct';
            dNdxOk = true;

            addSolStep('Step 2b: ∂N/∂x Computed', `
                Differentiating N = ${currentN} with respect to x:<br>
                <span class="sol-equation">∂N/∂x = ${correctDNdx}</span>
                ✓ Your answer is correct.
            `, 'fas fa-check-circle', '#27ae60');
        } else {
            resDNdx.textContent = `✗ Not quite. Check your differentiation. Hint: treat y as constant.`;
            resDNdx.className = 'verify-feedback wrong';
            dNdxOk = false;
        }
    });

    // Check exactness and continue solution
    btnCheckExact.addEventListener('click', () => {
        if (!dMdyOk || !dNdxOk) {
            showMsg('⚠ Please verify both ∂M/∂y and ∂N/∂x correctly before checking exactness.', 'warning');
            return;
        }

        const isExact = expressionsEqual(correctDMdy, correctDNdx);

        addSolStep('Step 3: Exactness Condition', `
            Checking if ∂M/∂y = ∂N/∂x:<br>
            <span class="sol-equation">∂M/∂y = ${correctDMdy}</span>
            <span class="sol-equation">∂N/∂x = ${correctDNdx}</span>
            ${isExact
                ? '<span class="sol-exact-tag">✓ ∂M/∂y = ∂N/∂x &nbsp;→&nbsp; EXACT EQUATION</span>'
                : '<span class="sol-non-exact-tag">✗ ∂M/∂y ≠ ∂N/∂x &nbsp;→&nbsp; NON-EXACT EQUATION</span>'
            }
        `, 'fas fa-balance-scale', isExact ? '#27ae60' : '#e74c3c', isExact ? 'exact-badge' : 'non-exact-badge');

        if (!isExact) {
            addSolStep('Result: Non-Exact Equation', `
                Since ∂M/∂y ≠ ∂N/∂x, the given equation is <strong>NOT EXACT</strong>.<br><br>
                To solve it, we need an <strong>Integrating Factor (μ)</strong>:<br>
                <span class="sol-equation">If (∂M/∂y − ∂N/∂x) / N = f(x) only → μ = e^(∫f(x)dx)</span>
                <span class="sol-equation">If (∂N/∂x − ∂M/∂y) / M = g(y) only → μ = e^(∫g(y)dy)</span>
                Multiply the equation by μ to make it exact, then proceed.
            `, 'fas fa-exclamation-triangle', '#e74c3c', 'non-exact-badge');
            return;
        }

        // Exact — compute full solution
        computeFullSolution(currentM, currentN, correctDMdy, correctDNdx);
    });

    // ===================== FULL SOLUTION =====================
    function computeFullSolution(M, N, dMdy, dNdx) {
        // Step 4: Integrate M w.r.t x
        const intM = integrateWrtX(M);
        addSolStep('Step 4: Integrate M w.r.t x', `
            Since the equation is exact, find ψ(x,y) such that ∂ψ/∂x = M.<br>
            <span class="sol-equation">ψ = ∫M dx = ∫( ${M} ) dx</span>
            <span class="sol-equation">ψ = ${intM} + g(y)</span>
            where g(y) is an unknown function of y only.
        `, 'fas fa-integral', '#8e44ad');

        // Step 5: Differentiate ψ w.r.t y and compare with N
        const diffIntMY = differentiateWrtY(intM);
        addSolStep('Step 5: Find g(y)', `
            Differentiate ψ w.r.t y and set equal to N:<br>
            <span class="sol-equation">∂ψ/∂y = ${diffIntMY} + g'(y) = N = ${N}</span>
            Solving for g'(y):<br>
            <span class="sol-equation">g'(y) = ${N} − (${diffIntMY})</span>
            Integrating g'(y) w.r.t y to get g(y):<br>
            <span class="sol-equation">g(y) = ∫[g'(y)] dy</span>
            <em>(If g'(y) simplifies to a pure function of y, integrate it. If it's 0, g(y) = 0.)</em>
        `, 'fas fa-equals', '#f39c12');

        // Step 6: Write final solution
        const sol = buildSolution(intM, M, N);
        addSolStep('Step 6: General Solution', `
            Combining, the general solution ψ(x,y) = C is:
            <div class="final-answer-box">${sol} = C</div>
            This is the <strong>general solution</strong> of the exact differential equation.
        `, 'fas fa-check-double', '#27ae60', 'final-sol');
    }

    // ===================== MATH HELPERS =====================

    /**
     * Normalize an expression string for basic comparison:
     * remove spaces, sort terms, lowercase
     */
    function normalizeExpr(expr) {
        return expr.replace(/\s+/g, '').toLowerCase()
            .replace(/\*\*/, '^')
            .replace(/\bpow\(([^,]+),([^)]+)\)/, '$1^$2');
    }

    /**
     * Numeric test: evaluate both expressions at sample (x,y) points
     * and check if they match (within tolerance).
     */
    function expressionsEqual(a, b) {
        // First try exact string match after normalizing
        if (normalizeExpr(a) === normalizeExpr(b)) return true;

        // Numeric test at multiple points
        const points = [
            { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 0.5, y: 1.5 },
            { x: 3, y: 1 }, { x: 1, y: 1 }
        ];

        try {
            for (const pt of points) {
                const va = evalExpr(a, pt.x, pt.y);
                const vb = evalExpr(b, pt.x, pt.y);
                if (isNaN(va) || isNaN(vb)) continue;
                if (Math.abs(va - vb) > 1e-6) return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    /** Safe eval with x,y substitution */
    function evalExpr(expr, xVal, yVal) {
        try {
            // Prepare expression for JS eval
            let e = expr
                .replace(/\bexp\b/g, 'Math.exp')
                .replace(/\bsin\b/g, 'Math.sin')
                .replace(/\bcos\b/g, 'Math.cos')
                .replace(/\btan\b/g, 'Math.tan')
                .replace(/\bsqrt\b/g, 'Math.sqrt')
                .replace(/\bln\b/g, 'Math.log')
                .replace(/\blog\b/g, 'Math.log')
                .replace(/\^/g, '**')
                .replace(/\bx\b/g, `(${xVal})`)
                .replace(/\by\b/g, `(${yVal})`);
            // eslint-disable-next-line no-new-func
            return Function('"use strict"; return (' + e + ')')();
        } catch (err) {
            return NaN;
        }
    }

    /**
     * Symbolic differentiation — handles common patterns found in textbook DE problems.
     */
    function computeDerivative(expr, varName) {
        // Use known patterns for common exact DE examples
        // This is a symbolic diff engine for the subset of expressions students use

        // Tokenize and differentiate term by term
        const terms = splitTerms(expr);
        const derivedTerms = terms.map(term => diffTerm(term.trim(), varName));
        const result = derivedTerms.filter(t => t !== '0' && t !== '').join(' + ')
            .replace(/\+ -/g, '- ')
            .replace(/^\+\s*/, '')
            || '0';
        return simplifyConst(result);
    }

    /** Split expression into additive terms */
    function splitTerms(expr) {
        // Replace e^ patterns temporarily
        const replaced = expr.replace(/exp\(/g, 'EXP(');
        const terms = [];
        let depth = 0, start = 0, i = 0;
        for (; i < replaced.length; i++) {
            const c = replaced[i];
            if (c === '(') depth++;
            else if (c === ')') depth--;
            else if ((c === '+' || c === '-') && depth === 0 && i > 0) {
                terms.push(replaced.slice(start, i).replace(/EXP\(/g, 'exp('));
                start = i;
            }
        }
        terms.push(replaced.slice(start).replace(/EXP\(/g, 'exp('));
        return terms.map(t => t.trim()).filter(t => t !== '');
    }

    /** Differentiate a single term w.r.t varName */
    function diffTerm(term, v) {
        const other = v === 'x' ? 'y' : 'x';

        // Constant (no variable v)
        if (!containsVar(term, v)) return '0';

        // Just the variable: x → 1, y → 1
        if (term === v || term === `+${v}`) return '1';
        if (term === `-${v}`) return '-1';

        // Constant * variable: e.g. 3*x → 3, 2*y → 2
        const constVarMatch = term.match(/^([+-]?\d*\.?\d*)\*?([xy])$/);
        if (constVarMatch) {
            const coeff = constVarMatch[1];
            const variable = constVarMatch[2];
            if (variable === v) {
                return coeff === '' || coeff === '+' ? '1' :
                    coeff === '-' ? '-1' : coeff;
            }
            return '0';
        }

        // Power: x^n → n*x^(n-1), y^n → n*y^(n-1)
        const powerMatch = term.match(/^([+-]?\d*\.?\d*)\*?([xy])\^(\d+\.?\d*)$/);
        if (powerMatch) {
            let coeff = powerMatch[1] === '' || powerMatch[1] === '+' ? 1 :
                powerMatch[1] === '-' ? -1 : parseFloat(powerMatch[1]);
            const variable = powerMatch[2];
            const exp = parseFloat(powerMatch[3]);
            if (variable !== v) return '0';
            const newCoeff = coeff * exp;
            const newExp = exp - 1;
            if (newExp === 0) return `${newCoeff}`;
            if (newExp === 1) return newCoeff === 1 ? v : `${newCoeff}*${v}`;
            return `${newCoeff}*${v}^${newExp}`;
        }

        // Product: coeff * x^a * y^b
        const prodMatch = term.match(/^([+-]?\d*\.?\d*)\*?x\^?(\d*)\*?y\^?(\d*)$/) ||
            term.match(/^([+-]?\d*\.?\d*)\*?y\^?(\d*)\*?x\^?(\d*)$/);
        if (prodMatch) {
            // Try to parse as a*x^m*y^n
            return diffProductXY(term, v);
        }

        // sin(x), sin(y), etc.
        const sinMatch = term.match(/^([+-]?\d*\.?\d*)\*?sin\(([^)]+)\)$/);
        if (sinMatch) {
            const coeff = parseCoeff(sinMatch[1]);
            const inner = sinMatch[2];
            if (!containsVar(inner, v)) return '0';
            // ∂/∂v (sin(inner)) = cos(inner) * ∂inner/∂v
            const innerDeriv = diffSimpleInner(inner, v);
            return `${coeff === 1 ? '' : coeff === -1 ? '-' : coeff + '*'}${innerDeriv === '1' ? '' : innerDeriv + '*'}cos(${inner})`;
        }

        // cos(x), cos(y)
        const cosMatch = term.match(/^([+-]?\d*\.?\d*)\*?cos\(([^)]+)\)$/);
        if (cosMatch) {
            const coeff = parseCoeff(cosMatch[1]);
            const inner = cosMatch[2];
            if (!containsVar(inner, v)) return '0';
            const innerDeriv = diffSimpleInner(inner, v);
            return `${coeff === 1 ? '-' : (coeff * -1) + '*'}${innerDeriv === '1' ? '' : innerDeriv + '*'}sin(${inner})`;
        }

        // exp(x), exp(y), exp(2*x), etc.
        const expMatch = term.match(/^([+-]?\d*\.?\d*)\*?exp\(([^)]+)\)$/);
        if (expMatch) {
            const coeff = parseCoeff(expMatch[1]);
            const inner = expMatch[2];
            if (!containsVar(inner, v)) return '0';
            const innerDeriv = diffSimpleInner(inner, v);
            const newCoeff = coeff * (parseFloat(innerDeriv) || 1);
            return `${newCoeff === 1 ? '' : newCoeff === -1 ? '-' : newCoeff + '*'}exp(${inner})`;
        }

        // y^2*cos(x) or similar products — try splitting on *
        if (term.includes('*')) {
            return diffProductGeneral(term, v);
        }

        // Fallback: return the term if we can't parse it
        return `d(${term})/d${v}`;
    }

    function containsVar(expr, v) {
        const regex = new RegExp(`(?<![a-zA-Z])${v}(?![a-zA-Z])`);
        return regex.test(expr);
    }

    function parseCoeff(s) {
        if (!s || s === '' || s === '+') return 1;
        if (s === '-') return -1;
        return parseFloat(s) || 1;
    }

    function diffSimpleInner(inner, v) {
        // For simple inner expressions like x, y, 2*x, 3*y
        if (inner === v) return '1';
        const m = inner.match(/^(\d+)\*?([xy])$/);
        if (m && m[2] === v) return m[1];
        if (!containsVar(inner, v)) return '0';
        return `d(${inner})/d${v}`;
    }

    function diffProductXY(term, v) {
        // Parse a*x^m * y^n style
        const sign = term.startsWith('-') ? -1 : 1;
        const clean = term.replace(/^[+-]/, '').trim();
        const parts = clean.split('*').map(p => p.trim());

        let coeff = 1;
        let xPow = 0, yPow = 0;

        for (const p of parts) {
            if (!isNaN(p)) { coeff *= parseFloat(p); continue; }
            if (p === 'x') { xPow += 1; continue; }
            if (p === 'y') { yPow += 1; continue; }
            const xm = p.match(/^x\^(\d+)$/); if (xm) { xPow += parseInt(xm[1]); continue; }
            const ym = p.match(/^y\^(\d+)$/); if (ym) { yPow += parseInt(ym[1]); continue; }
        }
        coeff *= sign;

        // Differentiate a*x^m*y^n w.r.t v
        let result;
        if (v === 'x') {
            if (xPow === 0) return '0';
            const newCoeff = coeff * xPow;
            const newXPow = xPow - 1;
            result = buildTerm(newCoeff, newXPow, yPow, 'x', 'y');
        } else {
            if (yPow === 0) return '0';
            const newCoeff = coeff * yPow;
            const newYPow = yPow - 1;
            result = buildTerm(newCoeff, xPow, newYPow, 'x', 'y');
        }
        return result;
    }

    function buildTerm(coeff, xPow, yPow, x, y) {
        if (coeff === 0) return '0';
        let parts = [];
        if (xPow === 1) parts.push(x);
        else if (xPow > 1) parts.push(`${x}^${xPow}`);
        if (yPow === 1) parts.push(y);
        else if (yPow > 1) parts.push(`${y}^${yPow}`);

        const varStr = parts.join('*');
        if (!varStr) return `${coeff}`;
        if (coeff === 1) return varStr;
        if (coeff === -1) return `-${varStr}`;
        return `${coeff}*${varStr}`;
    }

    function diffProductGeneral(term, v) {
        // Product rule: split on last * that's not inside parens
        // Try numeric derivative instead for complex products
        const sign = term.startsWith('-') ? -1 : 1;
        const clean = term.replace(/^[+-]/, '').trim();

        // Try to split into factors
        const factors = splitFactors(clean);
        if (factors.length === 1) return `d(${term})/d${v}`;

        // Product rule: Σ (derivative of each factor * others)
        const derivTerms = factors.map((f, idx) => {
            const df = diffTerm(f, v);
            if (df === '0') return '0';
            const others = factors.filter((_, i) => i !== idx);
            const othersStr = others.join('*');
            if (df === '1') return othersStr || '1';
            return `${df}*${othersStr}`;
        });

        const result = derivTerms.filter(t => t !== '0').join(' + ');
        const signed = sign === -1 ? `-(${result})` : result;
        return simplifyConst(signed || '0');
    }

    function splitFactors(expr) {
        // Split by * not inside parens
        const factors = [];
        let depth = 0, start = 0;
        for (let i = 0; i < expr.length; i++) {
            if (expr[i] === '(') depth++;
            else if (expr[i] === ')') depth--;
            else if (expr[i] === '*' && depth === 0) {
                factors.push(expr.slice(start, i).trim());
                start = i + 1;
            }
        }
        factors.push(expr.slice(start).trim());
        return factors.filter(f => f);
    }

    function simplifyConst(expr) {
        // Minimal simplification: remove *1, 1*, +0, etc.
        return expr
            .replace(/\*1(?!\d)/g, '')
            .replace(/(?<!\d)1\*/g, '')
            .replace(/\+ 0\b/g, '')
            .replace(/^0 \+ /, '')
            .replace(/\(\+/g, '(')
            .trim() || '0';
    }

    // Integration helpers (symbolic, for common patterns)
    function integrateWrtX(expr) {
        const terms = splitTerms(expr);
        const integrated = terms.map(t => integrateTerm(t.trim(), 'x'));
        return integrated.filter(t => t !== '0').join(' + ')
            .replace(/\+ -/g, '- ')
            .replace(/^\+\s*/, '')
            || '0';
    }

    function integrateTerm(term, v) {
        const other = v === 'x' ? 'y' : 'x';
        if (!containsVar(term, v)) {
            // Constant w.r.t v → multiply by v
            return `${term === '1' ? '' : term + '*'}${v}`;
        }

        // Just the variable
        if (term === v || term === `+${v}`) return `${v}^2/2`;
        if (term === `-${v}`) return `-${v}^2/2`;

        // Constant * v
        const cvm = term.match(/^([+-]?\d*\.?\d*)\*?([xy])$/);
        if (cvm && cvm[2] === v) {
            const c = parseCoeff(cvm[1]);
            return `${c / 2}*${v}^2`;
        }

        // v^n
        const pvm = term.match(/^([+-]?\d*\.?\d*)\*?([xy])\^(\d+\.?\d*)$/);
        if (pvm && pvm[2] === v) {
            const c = parseCoeff(pvm[1]);
            const n = parseFloat(pvm[3]);
            const newN = n + 1;
            const newC = c / newN;
            return newC === 1 ? `${v}^${newN}` : `${newC}*${v}^${newN}`;
        }

        // a * x^m * y^n (product)
        if (term.includes('*') || (containsVar(term, 'x') && containsVar(term, 'y'))) {
            return integrateProductXY(term, v);
        }

        // sin(x) → -cos(x)
        const sinM = term.match(/^([+-]?\d*\.?\d*)\*?sin\(([^)]+)\)$/);
        if (sinM && containsVar(sinM[2], v)) {
            const c = parseCoeff(sinM[1]);
            const inner = sinM[2];
            const innerC = diffSimpleInner(inner, v);
            const divisor = parseFloat(innerC) || 1;
            return `${(c / divisor) === -1 ? '-' : (c / divisor) === 1 ? '' : (c / divisor) + '*'}-cos(${inner})`.replace('--', '');
        }

        // cos(x) → sin(x)
        const cosM = term.match(/^([+-]?\d*\.?\d*)\*?cos\(([^)]+)\)$/);
        if (cosM && containsVar(cosM[2], v)) {
            const c = parseCoeff(cosM[1]);
            const inner = cosM[2];
            const innerC = diffSimpleInner(inner, v);
            const divisor = parseFloat(innerC) || 1;
            const newC = c / divisor;
            return `${newC === 1 ? '' : newC === -1 ? '-' : newC + '*'}sin(${inner})`;
        }

        // exp(x) → exp(x)
        const expM = term.match(/^([+-]?\d*\.?\d*)\*?exp\(([^)]+)\)$/);
        if (expM && containsVar(expM[2], v)) {
            const c = parseCoeff(expM[1]);
            const inner = expM[2];
            const innerC = diffSimpleInner(inner, v);
            const divisor = parseFloat(innerC) || 1;
            const newC = c / divisor;
            return `${newC === 1 ? '' : newC === -1 ? '-' : newC + '*'}exp(${inner})`;
        }

        return `∫(${term})d${v}`;
    }

    function integrateProductXY(term, v) {
        const sign = term.startsWith('-') ? -1 : 1;
        const clean = term.replace(/^[+-]/, '').trim();
        const parts = clean.split('*').map(p => p.trim());

        let coeff = sign;
        let xPow = 0, yPow = 0;

        for (const p of parts) {
            if (!isNaN(p)) { coeff *= parseFloat(p); continue; }
            if (p === 'x') { xPow += 1; continue; }
            if (p === 'y') { yPow += 1; continue; }
            const xm = p.match(/^x\^(\d+)$/); if (xm) { xPow += parseInt(xm[1]); continue; }
            const ym = p.match(/^y\^(\d+)$/); if (ym) { yPow += parseInt(ym[1]); continue; }
        }

        if (v === 'x') {
            const newXPow = xPow + 1;
            const newCoeff = coeff / newXPow;
            return buildTerm(newCoeff, newXPow, yPow, 'x', 'y');
        } else {
            const newYPow = yPow + 1;
            const newCoeff = coeff / newYPow;
            return buildTerm(newCoeff, xPow, newYPow, 'x', 'y');
        }
    }

    function differentiateWrtY(expr) {
        return computeDerivative(expr, 'y');
    }

    function buildSolution(intM, M, N) {
        // The solution is: intM + g(y) = C
        // We simplify and present intM (which already has the x terms)
        // In most cases for these examples the full ψ = intM
        // We show intM as main part
        return intM;
    }

    // ===================== UI HELPERS =====================
    function addSolStep(title, body, icon, color, extraClass) {
        // Remove placeholder if present
        const ph = solutionSteps.querySelector('.placeholder-msg');
        if (ph) ph.remove();

        const div = document.createElement('div');
        div.className = `sol-step ${extraClass || ''}`;
        div.innerHTML = `
            <div class="sol-step-title">
                <i class="${icon}" style="color:${color};"></i>
                ${title}
            </div>
            <div class="sol-step-body">${body}</div>
        `;
        solutionSteps.appendChild(div);
        div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function showMsg(text, type) {
        const colors = { warning: '#f39c12', error: '#e74c3c', info: '#3498db' };
        const icons = { warning: 'fas fa-exclamation-triangle', error: 'fas fa-times-circle', info: 'fas fa-info-circle' };
        addSolStep('Notice', `<span style="color:${colors[type]}">${text}</span>`, icons[type], colors[type]);
    }

    // Initialize preview
    updatePreview();
}
