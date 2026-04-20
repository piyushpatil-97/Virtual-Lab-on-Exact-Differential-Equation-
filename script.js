document.addEventListener('DOMContentLoaded', function () {

  // ─── Navigation ────────────────────────────────────────────────────────────
  const navItems = document.querySelectorAll('.nav-item');
  const contentSections = document.querySelectorAll('.content-section');
  const currentSectionSpan = document.getElementById('current-section');

  let activeSection = 'aim';
  let simulationInitialized = false;  // FIX: prevent duplicate listener registration

  navItems.forEach(item => {
    // FIX: add keyboard accessibility
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    const activate = () => {
      const sectionId = item.getAttribute('data-section');

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      contentSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `${sectionId}-section`) {
          section.classList.add('active');
          activeSection = sectionId;
          // FIX: single span update (breadcrumbSection was redundant)
          currentSectionSpan.textContent =
            sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
          loadSectionContent(sectionId);
        }
      });
    };

    item.addEventListener('click', activate);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
  });

  function loadSectionContent(sectionId) {
    if (sectionId === 'pretest')    initQuiz(PRETEST_CONFIG);
    if (sectionId === 'posttest')   initQuiz(POSTTEST_CONFIG);
    if (sectionId === 'simulation' && !simulationInitialized) {
      simulationInitialized = true;  // FIX: only init once
      initSimulation();
    }
  }

  // ─── Quiz data ──────────────────────────────────────────────────────────────
  const pretestQuestions = [
    { question: "What is the derivative of sin(x)?",                                              options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],   correct: 0 },
    { question: "What is ∫x dx?",                                                                 options: ["x²/2", "x²", "2x", "1"],                    correct: 0 },
    { question: "What is ∂/∂x (xy)?",                                                            options: ["y", "x", "xy", "0"],                        correct: 0 },
    { question: "What is the order of d²y/dx² + 3dy/dx + 2y = 0?",                              options: ["0", "1", "2", "3"],                          correct: 2 },
    { question: "Which is a first order differential equation?",                                  options: ["y'' + y = 0", "dy/dx = x", "d³y/dx³ = y", "y' + y'' = x"], correct: 1 },
    { question: "What is the general solution of dy/dx = 2x?",                                   options: ["y = x²", "y = x² + C", "y = 2x + C", "y = x"], correct: 1 },
    { question: "What is ∂/∂y (x²y)?",                                                           options: ["x²", "2xy", "xy", "y"],                      correct: 0 },
    { question: "What is ∫eˣ dx?",                                                               options: ["eˣ", "eˣ + C", "ln(x)", "1/eˣ"],             correct: 1 },
    { question: "Which is a separable differential equation?",                                    options: ["dy/dx = xy", "dy/dx + y = x", "y'' + y' = 0", "dy/dx = sin(x+y)"], correct: 0 },
    { question: "What is the degree of (dy/dx)² + x = 0?",                                      options: ["1", "2", "0", "Undefined"],                   correct: 1 },
  ];

  const posttestQuestions = [
    { question: "Which is an exact differential equation?",                                       options: ["(2x + y)dx + (x + 2y)dy = 0", "(y²)dx + (2xy)dy = 0", "(sin y)dx + (x cos y)dy = 0", "All of the above"], correct: 3 },
    { question: "For exactness of M dx + N dy = 0, which condition must hold?",                  options: ["∂M/∂x = ∂N/∂y", "∂M/∂y = ∂N/∂x", "M = N", "∂²M/∂x∂y = ∂²N/∂y∂x"], correct: 1 },
    { question: "The equation (2xy + y²)dx + (x² + 2xy)dy = 0 is:",                             options: ["Exact", "Not exact", "Homogeneous", "Linear"], correct: 0 },
    { question: "The solution of (y dx + x dy) = 0 is:",                                         options: ["xy = C", "x + y = C", "x/y = C", "x² + y² = C"], correct: 0 },
    { question: "If M = eʸ and N = xeʸ + 2y, then ∂M/∂y equals:",                              options: ["eʸ", "xeʸ", "xeʸ + 2", "eʸ + 2"],            correct: 0 },
    { question: "An integrating factor for (y² - 2xy)dx + (3xy - 6x²)dy = 0 is:",              options: ["1/x", "1/y", "x", "y"],                       correct: 0 },
    { question: "The solution of (cos y dx − x sin y dy) = 0 is:",                               options: ["x cos y = C", "x sin y = C", "x + cos y = C", "x − sin y = C"], correct: 0 },
    { question: "Which method is used to solve exact differential equations?",                    options: ["Separation of variables", "Integrating factor", "Direct integration", "Partial integration"], correct: 3 },
    { question: "If ∂M/∂y ≠ ∂N/∂x, the equation is:",                                          options: ["Always solvable", "Not exact", "Exact with integrating factor", "Both B and C"], correct: 3 },
    { question: "The general solution of an exact differential equation has the form:",           options: ["y = f(x) + C", "F(x,y) = C", "y' = f(x)", "M = N"], correct: 1 },
  ];

  // ─── Quiz factory (DRY — replaces two identical copy-pasted blocks) ─────────
  const PRETEST_CONFIG  = { questions: pretestQuestions,  quizId: 'pretest-quiz',  startBtn: 'start-pretest',  prevBtn: 'prev-question',     nextBtn: 'next-question',     submitBtn: 'submit-pretest',  scoreId: 'pretest-score'  };
  const POSTTEST_CONFIG = { questions: posttestQuestions, quizId: 'posttest-quiz', startBtn: 'start-posttest', prevBtn: 'prev-postquestion', nextBtn: 'next-postquestion', submitBtn: 'submit-posttest', scoreId: 'posttest-score' };

  const quizState = {};

  function initQuiz(cfg) {
    if (quizState[cfg.quizId]) return;  // already bound

    const state = { current: 0, answers: new Array(cfg.questions.length).fill(-1) };
    quizState[cfg.quizId] = state;

    const qs = document.getElementById(cfg.quizId);
    const container = qs.querySelector('.questions-container');

    function render() {
      const q = cfg.questions[state.current];
      container.innerHTML = `
        <div class="question-item">
          <div class="question-number">Question ${state.current + 1} of ${cfg.questions.length}</div>
          <div class="question-text">${q.question}</div>
          <div class="options" role="radiogroup">
            ${q.options.map((opt, i) => `
              <div class="option ${state.answers[state.current] === i ? 'selected' : ''}"
                   role="radio" aria-checked="${state.answers[state.current] === i}"
                   tabindex="0" data-index="${i}">
                ${String.fromCharCode(65 + i)}) ${opt}
              </div>`).join('')}
          </div>
        </div>`;

      // FIX: scope querySelectorAll to THIS quiz container
      container.querySelectorAll('.option').forEach(opt => {
        const select = () => {
          const idx = parseInt(opt.getAttribute('data-index'));
          state.answers[state.current] = idx;
          container.querySelectorAll('.option').forEach(o => {
            o.classList.remove('selected');
            o.setAttribute('aria-checked', 'false');
          });
          opt.classList.add('selected');
          opt.setAttribute('aria-checked', 'true');
        };
        opt.addEventListener('click', select);
        opt.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
      });

      document.getElementById(cfg.prevBtn).disabled = state.current === 0;
      document.getElementById(cfg.nextBtn).disabled = state.current === cfg.questions.length - 1;
    }

    document.getElementById(cfg.startBtn)?.addEventListener('click', function () {
      state.current = 0;
      state.answers.fill(-1);
      render();
      this.disabled = true;
    });

    document.getElementById(cfg.prevBtn)?.addEventListener('click', () => { if (state.current > 0) { state.current--; render(); } });
    document.getElementById(cfg.nextBtn)?.addEventListener('click', () => { if (state.current < cfg.questions.length - 1) { state.current++; render(); } });

    document.getElementById(cfg.submitBtn)?.addEventListener('click', function () {
      let score = 0;
      cfg.questions.forEach((q, i) => { if (state.answers[i] === q.correct) score++; });
      document.getElementById(cfg.scoreId).textContent = score;

      // FIX: replace alert() with inline result banner
      const existing = qs.querySelector('.quiz-result');
      if (existing) existing.remove();

      const passed = score >= 7;
      const banner = document.createElement('div');
      banner.className = 'quiz-result';
      banner.style.cssText = `margin-top:20px;padding:20px;border-radius:8px;text-align:center;
        background:${passed ? '#d4edda' : '#fff3cd'};
        border:1px solid ${passed ? '#c3e6cb' : '#ffeeba'};
        color:${passed ? '#155724' : '#856404'}`;
      banner.innerHTML = `
        <div style="font-size:24px;font-weight:600;margin-bottom:8px">${score} / ${cfg.questions.length}</div>
        <div style="margin-bottom:12px">${passed
          ? (cfg.quizId === 'pretest-quiz' ? 'Great! You are ready to proceed.' : 'Excellent! You have mastered the topic.')
          : (cfg.quizId === 'pretest-quiz' ? 'Review the basics before proceeding.' : 'You may want to review the material again.')
        }</div>
        <div style="background:#fff;border-radius:4px;height:10px;overflow:hidden">
          <div style="width:${(score/cfg.questions.length)*100}%;height:100%;background:${passed ? '#28a745' : '#ffc107'};transition:width .5s"></div>
        </div>`;
      qs.appendChild(banner);

      document.getElementById(cfg.startBtn).disabled = false;
    });
  }

  // ─── Exact DE Solver ────────────────────────────────────────────────────────
  class ExactDESolver {

    preprocess(expr) {
      return expr.trim()
        .replace(/\s+/g, '')
        .replace(/\*\*/g, '^')   // JS ** → nerdamer ^
        .replace(/Math\.sin/g, 'sin').replace(/Math\.cos/g, 'cos')
        .replace(/Math\.tan/g, 'tan').replace(/Math\.exp/g, 'exp')
        .replace(/Math\.log\b/g, 'log');
    }

    // Safely evaluate expression numerically at (x, y)
    evalAt(expr, xVal, yVal) {
      try {
        return parseFloat(nerdamer(expr, { x: String(xVal), y: String(yVal) }).evaluate().toString());
      } catch (_) {
        return NaN;
      }
    }

    // Compare two expressions numerically at several diverse points
    numericallyEqual(exprA, exprB) {
      const pts = [{ x: 1, y: 1 }, { x: 2, y: 3 }, { x: -1, y: 2 }, { x: 0.5, y: 1.5 }, { x: 3, y: -1 }];
      let matches = 0;
      for (const p of pts) {
        const a = this.evalAt(exprA, p.x, p.y);
        const b = this.evalAt(exprB, p.x, p.y);
        if (isNaN(a) || isNaN(b)) continue;
        if (Math.abs(a - b) <= 0.005 * (Math.abs(a) + Math.abs(b) + 1)) matches++;
      }
      return matches >= 4;  // require 4 of 5 points to agree
    }

    isFreeFromX(expr) {
      const y = 1;
      const v = [this.evalAt(expr, 0, y), this.evalAt(expr, 1, y), this.evalAt(expr, 5, y), this.evalAt(expr, -2, y)];
      const valid = v.filter(n => !isNaN(n));
      if (valid.length < 2) return true;
      return Math.max(...valid) - Math.min(...valid) < 0.005;
    }

    addStep(steps, header, body, equations, type) {
      steps.push({ header, body, equations: Array.isArray(equations) ? equations : (equations ? [equations] : []), type: type || 'normal' });
    }

    solve(M_raw, N_raw, dMdy_raw, dNdx_raw) {
      const steps = [];

      const M = this.preprocess(M_raw);
      const N = this.preprocess(N_raw);
      const dMdy_user = this.preprocess(dMdy_raw);
      const dNdx_user = this.preprocess(dNdx_raw);

      // ── Step 1: Show the equation
      this.addStep(steps, 'Step 1: Given equation',
        'The differential equation M(x,y) dx + N(x,y) dy = 0 is:',
        [`( ${M} ) dx  +  ( ${N} ) dy  =  0`]);

      // ── Step 2: Identify M and N
      this.addStep(steps, 'Step 2: Identify M and N',
        'We identify the component functions:',
        [`M(x,y) = ${M}`, `N(x,y) = ${N}`]);

      // ── Step 3: Compute symbolic partial derivatives
      let dMdy_sym, dNdx_sym;
      try {
        dMdy_sym = nerdamer(`diff(${M}, y)`).toString();
        dNdx_sym = nerdamer(`diff(${N}, x)`).toString();
      } catch (e) {
        this.addStep(steps, 'Error', `Could not compute symbolic derivatives: ${e.message}. Check your input.`, [], 'error');
        return { steps, isExact: false, solution: null };
      }

      // ── Step 3a: Verify user's ∂M/∂y
      const dMdy_ok = this.numericallyEqual(dMdy_user, dMdy_sym);
      this.addStep(steps,
        'Step 3: Verify ∂M/∂y',
        `You entered: ∂M/∂y = ${dMdy_user}`,
        [
          `Computed:  ∂M/∂y = ${dMdy_sym}`,
          dMdy_ok ? '✓ Your value is correct.' : `✗ Incorrect. The correct value is ${dMdy_sym} — this will be used for the solution.`,
        ],
        dMdy_ok ? 'correct' : 'incorrect');

      // ── Step 3b: Verify user's ∂N/∂x
      const dNdx_ok = this.numericallyEqual(dNdx_user, dNdx_sym);
      this.addStep(steps,
        'Step 4: Verify ∂N/∂x',
        `You entered: ∂N/∂x = ${dNdx_user}`,
        [
          `Computed:  ∂N/∂x = ${dNdx_sym}`,
          dNdx_ok ? '✓ Your value is correct.' : `✗ Incorrect. The correct value is ${dNdx_sym} — this will be used for the solution.`,
        ],
        dNdx_ok ? 'correct' : 'incorrect');

      // ── Step 4: Exactness check
      const isExact = this.numericallyEqual(dMdy_sym, dNdx_sym);

      if (!isExact) {
        this.addStep(steps,
          'Step 5: Exactness check — Not exact',
          `Since ∂M/∂y = ${dMdy_sym}  ≠  ∂N/∂x = ${dNdx_sym}, the equation is NOT exact.`,
          [], 'incorrect');

        // Suggest integrating factors
        this.addIntegratingFactorSteps(steps, M, N, dMdy_sym, dNdx_sym);
        return { steps, isExact: false, solution: null };
      }

      this.addStep(steps,
        'Step 5: Exactness check — Exact ✓',
        `Since ∂M/∂y = ${dMdy_sym}  =  ∂N/∂x = ${dNdx_sym}, the equation IS EXACT.`,
        [], 'correct');

      // ── Step 5: Integrate M w.r.t x
      let psi;
      try {
        psi = nerdamer(`integrate(${M}, x)`).toString();
      } catch (e) {
        this.addStep(steps, 'Error', `Could not integrate M: ${e.message}`, [], 'error');
        return { steps, isExact: true, solution: null };
      }

      this.addStep(steps,
        'Step 6: Integrate M with respect to x',
        'Find ψ(x,y) = ∫M dx + g(y) where g(y) is an unknown function of y only:',
        [`ψ(x,y) = ∫( ${M} ) dx + g(y) = ${psi} + g(y)`]);

      // ── Step 6: ∂ψ/∂y and derive g′(y)
      let dPsi_dy, g_prime;
      try {
        dPsi_dy = nerdamer(`diff(${psi}, y)`).toString();
        g_prime = nerdamer.simplify(nerdamer(`${N} - (${dPsi_dy})`).toString()).toString();
      } catch (e) {
        this.addStep(steps, 'Error', `Could not compute g′(y): ${e.message}`, [], 'error');
        return { steps, isExact: true, solution: null };
      }

      this.addStep(steps,
        'Step 7: Differentiate ψ w.r.t y and find g′(y)',
        'Set ∂ψ/∂y = N to find g′(y):',
        [
          `∂ψ/∂y = ∂/∂y[ ${psi} ] + g′(y)  =  ${dPsi_dy} + g′(y)`,
          `Setting equal to N:  ${dPsi_dy} + g′(y)  =  ${N}`,
          `Therefore g′(y) = ${N} − ( ${dPsi_dy} )  =  ${g_prime}`,
        ]);

      // Check g′(y) is truly free from x
      if (!this.isFreeFromX(g_prime)) {
        this.addStep(steps,
          'Warning',
          `g′(y) = ${g_prime} appears to still contain x. The equation may not actually be exact, or symbolic simplification failed. Check your input.`,
          [], 'incorrect');
      }

      // ── Step 7: Integrate g′(y)
      let g_y;
      try {
        g_y = (g_prime === '0' || g_prime === '') ? '0' : nerdamer(`integrate(${g_prime}, y)`).toString();
      } catch (e) {
        g_y = `∫( ${g_prime} ) dy`;
      }

      this.addStep(steps,
        'Step 8: Find g(y)',
        'Integrate g′(y) with respect to y:',
        [`g(y) = ∫( ${g_prime} ) dy  =  ${g_y}`]);

      // ── Step 8: Write final solution
      let solution;
      try {
        solution = (g_y === '0')
          ? `${psi} = C`
          : nerdamer(`${psi} + ${g_y}`).toString() + ' = C';
      } catch (_) {
        solution = `${psi} + ${g_y} = C`;
      }

      this.addStep(steps,
        'Step 9: General Solution',
        'The general solution ψ(x,y) = C is:',
        [solution], 'final');

      return { steps, isExact: true, solution };
    }

    addIntegratingFactorSteps(steps, M, N, dMdy, dNdx) {
      const suggestions = [];

      // Check if (∂M/∂y − ∂N/∂x) / N is a function of x only
      try {
        const fExpr = nerdamer.simplify(nerdamer(`(${dMdy} - (${dNdx})) / (${N})`).toString()).toString();
        if (this.isFreeFromY(fExpr)) {
          suggestions.push(`(∂M/∂y − ∂N/∂x) / N = ${fExpr}  (function of x only)`);
          suggestions.push(`→  Integrating factor: μ(x) = exp( ∫ ${fExpr} dx )`);
        }
      } catch (_) {}

      // Check if (∂N/∂x − ∂M/∂y) / M is a function of y only
      try {
        const gExpr = nerdamer.simplify(nerdamer(`(${dNdx} - (${dMdy})) / (${M})`).toString()).toString();
        if (this.isFreeFromX(gExpr)) {
          suggestions.push(`(∂N/∂x − ∂M/∂y) / M = ${gExpr}  (function of y only)`);
          suggestions.push(`→  Integrating factor: μ(y) = exp( ∫ ${gExpr} dy )`);
        }
      } catch (_) {}

      if (suggestions.length === 0) {
        suggestions.push('No standard integrating factor found automatically.');
        suggestions.push('Try manually: μ = 1/x, μ = 1/y, μ = 1/(xy), μ = 1/(x²+y²), or μ = xᵃyᵇ.');
      }

      this.addStep(steps, 'Step 6: Integrating factor suggestions',
        'To make the equation exact, try the following integrating factors:',
        suggestions);
    }

    isFreeFromY(expr) {
      const x = 1;
      const v = [this.evalAt(expr, x, 0.5), this.evalAt(expr, x, 1), this.evalAt(expr, x, 5)];
      const valid = v.filter(n => !isNaN(n));
      if (valid.length < 2) return true;
      return Math.max(...valid) - Math.min(...valid) < 0.005;
    }
  }

  // ─── Simulation UI ──────────────────────────────────────────────────────────
  function initSimulation() {
    const MInput        = document.getElementById('M-input');
    const NInput        = document.getElementById('N-input');
    const dMdyInput     = document.getElementById('dMdy-input');    // NEW
    const dNdxInput     = document.getElementById('dNdx-input');    // NEW
    const equationDisplay = document.getElementById('equation-display');
    const solveButton   = document.getElementById('solve-equation');
    const clearButton   = document.getElementById('clear-input');
    const exampleBtns   = document.querySelectorAll('.example-btn');
    const stepsContainer = document.getElementById('solution-steps');

    function updateEquationDisplay() {
      const M = MInput.value || 'M(x,y)';
      const N = NInput.value || 'N(x,y)';
      equationDisplay.textContent = `( ${M} ) dx + ( ${N} ) dy = 0`;
    }

    function displaySteps(steps, solution) {
      stepsContainer.innerHTML = '';

      steps.forEach(step => {
        const div = document.createElement('div');
        const typeClass = step.type === 'final' ? 'final-step'
                        : step.type === 'correct' ? 'correct-step'
                        : step.type === 'incorrect' ? 'incorrect-step'
                        : step.type === 'error' ? 'error-step'
                        : '';
        div.className = `solution-step ${typeClass}`;

        const eqsHTML = step.equations.map(eq =>
          `<div class="step-equation">${eq}</div>`).join('');

        div.innerHTML = `
          <div class="step-header">${step.header}</div>
          <div class="step-content">
            <p>${step.body}</p>
            ${eqsHTML}
          </div>`;
        stepsContainer.appendChild(div);
      });

      if (solution) {
        const summary = document.createElement('div');
        summary.className = 'solution-step final-step solution-summary';
        summary.innerHTML = `
          <div class="step-header">General Solution</div>
          <div class="step-content">
            <div class="final-solution">${solution}</div>
          </div>`;
        stepsContainer.appendChild(summary);
      }

      stepsContainer.scrollTop = 0;

      // Render with KaTeX auto-render if available (use requestAnimationFrame, not setTimeout)
      requestAnimationFrame(() => {
        if (typeof renderMathInElement !== 'undefined') {
          renderMathInElement(stepsContainer, { throwOnError: false, delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }] });
        }
      });
    }

    function showPlaceholder(msg, icon) {
      stepsContainer.innerHTML = `
        <div class="placeholder-text">
          <i class="fas ${icon || 'fa-arrow-up'}"></i>
          <p>${msg}</p>
        </div>`;
    }

    solveButton.addEventListener('click', () => {
      const M = MInput.value.trim();
      const N = NInput.value.trim();
      const dMdy = dMdyInput.value.trim();
      const dNdx = dNdxInput.value.trim();

      if (!M || !N) {
        showPlaceholder('Please enter both M(x,y) and N(x,y).', 'fa-exclamation-circle');
        return;
      }
      if (!dMdy || !dNdx) {
        showPlaceholder('Please enter your computed ∂M/∂y and ∂N/∂x values before solving.', 'fa-exclamation-circle');
        return;
      }

      stepsContainer.innerHTML = `<div class="placeholder-text"><i class="fas fa-cog fa-spin"></i><p>Solving step by step...</p></div>`;

      // Run solver after a frame so the spinner renders
      requestAnimationFrame(() => {
        try {
          const solver = new ExactDESolver();
          const result = solver.solve(M, N, dMdy, dNdx);
          displaySteps(result.steps, result.solution);
        } catch (err) {
          console.error('Solver error:', err);
          showPlaceholder(`Error: ${err.message}. Check your input format.`, 'fa-exclamation-triangle');
        }
      });
    });

    clearButton.addEventListener('click', () => {
      MInput.value = '';
      NInput.value = '';
      dMdyInput.value = '';
      dNdxInput.value = '';
      updateEquationDisplay();
      showPlaceholder('Enter an equation above and click "Verify & Solve".');
    });

    exampleBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        MInput.value = this.dataset.m;
        NInput.value = this.dataset.n;
        // Clear derivative inputs so student computes them
        dMdyInput.value = '';
        dNdxInput.value = '';
        updateEquationDisplay();
        dMdyInput.focus();
      });
    });

    MInput.addEventListener('input', updateEquationDisplay);
    NInput.addEventListener('input', updateEquationDisplay);

    [MInput, NInput, dMdyInput, dNdxInput].forEach(el => {
      el.addEventListener('keydown', e => { if (e.key === 'Enter') solveButton.click(); });
    });

    // Add input format tips
    const inputSection = document.querySelector('.input-section');
    if (inputSection && !inputSection.querySelector('.format-tips')) {
      const tips = document.createElement('div');
      tips.className = 'format-tips';
      tips.innerHTML = `
        <h5><i class="fas fa-info-circle"></i> Input Format Tips:</h5>
        <ul>
          <li>Use * for multiplication: <code>2*x*y</code></li>
          <li>Use ^ for powers: <code>x^2</code>, <code>y^3</code></li>
          <li>Functions: <code>sin(x)</code>, <code>cos(x)</code>, <code>exp(x)</code></li>
          <li>Enter M and N, then manually compute ∂M/∂y and ∂N/∂x and enter them above</li>
        </ul>`;
      inputSection.appendChild(tips);
    }

    // FIX: use local SVG data URI fallback instead of via.placeholder.com
    document.querySelectorAll('img').forEach(img => {
      img.onerror = function () {
        const initials = (this.alt || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        this.onerror = null;
        this.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'><rect width='150' height='150' fill='%232c3e50'/><text x='75' y='95' font-size='48' text-anchor='middle' fill='white' font-family='sans-serif'>${initials}</text></svg>`;
      };
    });

    updateEquationDisplay();
  }

  // Kick off aim section
  loadSectionContent(activeSection);
});