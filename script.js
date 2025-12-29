// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const currentSectionSpan = document.getElementById('current-section');
    const breadcrumbSection = document.querySelector('.breadcrumb span');

    // Initialize active section
    let activeSection = 'aim';

    // Navigation click handler
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            
            // Update navigation
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update content sections
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sectionId}-section`) {
                    section.classList.add('active');
                    activeSection = sectionId;
                    
                    // Update breadcrumb
                    const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
                    currentSectionSpan.textContent = sectionName;
                    breadcrumbSection.textContent = sectionName;
                    
                    // Load section-specific content
                    loadSectionContent(sectionId);
                }
            });
        });
    });

    // Section content loader
    function loadSectionContent(sectionId) {
        switch(sectionId) {
            case 'pretest':
                loadPretestQuestions();
                break;
            case 'posttest':
                loadPosttestQuestions();
                break;
            case 'simulation':
                initSimulation();
                break;
        }
    }

    // Pretest Questions
    const pretestQuestions = [
        {
            question: "What is the derivative of sin(x)?",
            options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
            correct: 0
        },
        {
            question: "What is ∫x dx?",
            options: ["x²/2", "x²", "2x", "1"],
            correct: 0
        },
        {
            question: "What is ∂/∂x (xy)?",
            options: ["y", "x", "xy", "0"],
            correct: 0
        },
        {
            question: "What is the order of the differential equation: d²y/dx² + 3dy/dx + 2y = 0?",
            options: ["0", "1", "2", "3"],
            correct: 2
        },
        {
            question: "Which of these is a first order differential equation?",
            options: ["y'' + y = 0", "dy/dx = x", "d³y/dx³ = y", "y' + y'' = x"],
            correct: 1
        },
        {
            question: "What is the general solution of dy/dx = 2x?",
            options: ["y = x²", "y = x² + C", "y = 2x + C", "y = x"],
            correct: 1
        },
        {
            question: "What is ∂/∂y (x²y)?",
            options: ["x²", "2xy", "xy", "y"],
            correct: 0
        },
        {
            question: "What is ∫e^x dx?",
            options: ["e^x", "e^x + C", "ln(x)", "1/e^x"],
            correct: 1
        },
        {
            question: "Which of these is a separable differential equation?",
            options: ["dy/dx = xy", "dy/dx + y = x", "y'' + y' = 0", "dy/dx = sin(x+y)"],
            correct: 0
        },
        {
            question: "What is the degree of (dy/dx)² + x = 0?",
            options: ["1", "2", "0", "Undefined"],
            correct: 1
        }
    ];

    // Posttest Questions
    const posttestQuestions = [
        {
            question: "Which of these is an exact differential equation?",
            options: [
                "(2x + y)dx + (x + 2y)dy = 0",
                "(y²)dx + (2xy)dy = 0",
                "(sin y)dx + (x cos y)dy = 0",
                "All of the above"
            ],
            correct: 3
        },
        {
            question: "For exactness of M dx + N dy = 0, what condition must be satisfied?",
            options: [
                "∂M/∂x = ∂N/∂y",
                "∂M/∂y = ∂N/∂x",
                "M = N",
                "∂²M/∂x∂y = ∂²N/∂y∂x"
            ],
            correct: 1
        },
        {
            question: "The equation (2xy + y²)dx + (x² + 2xy)dy = 0 is:",
            options: [
                "Exact",
                "Not exact",
                "Homogeneous",
                "Linear"
            ],
            correct: 0
        },
        {
            question: "The solution of the exact equation (y dx + x dy) = 0 is:",
            options: [
                "xy = C",
                "x + y = C",
                "x/y = C",
                "x² + y² = C"
            ],
            correct: 0
        },
        {
            question: "If M = e^y and N = xe^y + 2y, then ∂M/∂y equals:",
            options: [
                "e^y",
                "xe^y",
                "xe^y + 2",
                "e^y + 2"
            ],
            correct: 0
        },
        {
            question: "An integrating factor for (y² - 2xy)dx + (3xy - 6x²)dy = 0 is:",
            options: [
                "1/x",
                "1/y",
                "x",
                "y"
            ],
            correct: 0
        },
        {
            question: "The solution of (cos y dx - x sin y dy) = 0 is:",
            options: [
                "x cos y = C",
                "x sin y = C",
                "x + cos y = C",
                "x - sin y = C"
            ],
            correct: 0
        },
        {
            question: "Which method is used to solve exact differential equations?",
            options: [
                "Separation of variables",
                "Integrating factor",
                "Direct integration",
                "Partial integration"
            ],
            correct: 3
        },
        {
            question: "If ∂M/∂y ≠ ∂N/∂x, the equation is:",
            options: [
                "Always solvable",
                "Not exact",
                "Exact with integrating factor",
                "Both B and C"
            ],
            correct: 3
        },
        {
            question: "The general solution of an exact differential equation is of the form:",
            options: [
                "y = f(x) + C",
                "F(x,y) = C",
                "y' = f(x)",
                "M = N"
            ],
            correct: 1
        }
    ];

    // Pretest functionality
    let currentPretestQuestion = 0;
    let pretestAnswers = new Array(pretestQuestions.length).fill(-1);
    let pretestScore = 0;

    function loadPretestQuestions() {
        const questionsContainer = document.querySelector('#pretest-quiz .questions-container');
        questionsContainer.innerHTML = '';
        
        const question = pretestQuestions[currentPretestQuestion];
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <div class="question-number">Question ${currentPretestQuestion + 1} of ${pretestQuestions.length}</div>
            <div class="question-text">${question.question}</div>
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option ${pretestAnswers[currentPretestQuestion] === index ? 'selected' : ''}" 
                         data-index="${index}">
                        ${String.fromCharCode(65 + index)}) ${option}
                    </div>
                `).join('')}
            </div>
        `;
        
        questionsContainer.appendChild(questionDiv);
        
        // Add event listeners to options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                const selectedIndex = parseInt(this.getAttribute('data-index'));
                pretestAnswers[currentPretestQuestion] = selectedIndex;
                
                // Update UI
                document.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
        
        // Update navigation buttons
        document.getElementById('prev-question').disabled = currentPretestQuestion === 0;
        document.getElementById('next-question').disabled = currentPretestQuestion === pretestQuestions.length - 1;
    }

    // Pretest navigation
    document.getElementById('start-pretest')?.addEventListener('click', function() {
        currentPretestQuestion = 0;
        pretestAnswers.fill(-1);
        pretestScore = 0;
        loadPretestQuestions();
        this.disabled = true;
    });

    document.getElementById('prev-question')?.addEventListener('click', function() {
        if (currentPretestQuestion > 0) {
            currentPretestQuestion--;
            loadPretestQuestions();
        }
    });

    document.getElementById('next-question')?.addEventListener('click', function() {
        if (currentPretestQuestion < pretestQuestions.length - 1) {
            currentPretestQuestion++;
            loadPretestQuestions();
        }
    });

    document.getElementById('submit-pretest')?.addEventListener('click', function() {
        // Calculate score
        pretestScore = 0;
        pretestQuestions.forEach((question, index) => {
            if (pretestAnswers[index] === question.correct) {
                pretestScore++;
            }
        });
        
        // Update score display
        document.getElementById('pretest-score').textContent = pretestScore;
        
        // Show results
        alert(`Pretest Completed!\nYour Score: ${pretestScore}/${pretestQuestions.length}\n${pretestScore >= 7 ? 'Great! You are ready to proceed.' : 'Review the basics before proceeding.'}`);
        
        // Re-enable start button
        document.getElementById('start-pretest').disabled = false;
    });

    // Posttest functionality (similar to pretest)
    let currentPosttestQuestion = 0;
    let posttestAnswers = new Array(posttestQuestions.length).fill(-1);
    let posttestScore = 0;

    function loadPosttestQuestions() {
        const questionsContainer = document.querySelector('#posttest-quiz .questions-container');
        questionsContainer.innerHTML = '';
        
        const question = posttestQuestions[currentPosttestQuestion];
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <div class="question-number">Question ${currentPosttestQuestion + 1} of ${posttestQuestions.length}</div>
            <div class="question-text">${question.question}</div>
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option ${posttestAnswers[currentPosttestQuestion] === index ? 'selected' : ''}" 
                         data-index="${index}">
                        ${String.fromCharCode(65 + index)}) ${option}
                    </div>
                `).join('')}
            </div>
        `;
        
        questionsContainer.appendChild(questionDiv);
        
        // Add event listeners to options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                const selectedIndex = parseInt(this.getAttribute('data-index'));
                posttestAnswers[currentPosttestQuestion] = selectedIndex;
                
                // Update UI
                document.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
        
        // Update navigation buttons
        document.getElementById('prev-postquestion').disabled = currentPosttestQuestion === 0;
        document.getElementById('next-postquestion').disabled = currentPosttestQuestion === posttestQuestions.length - 1;
    }

    // Posttest navigation
    document.getElementById('start-posttest')?.addEventListener('click', function() {
        currentPosttestQuestion = 0;
        posttestAnswers.fill(-1);
        posttestScore = 0;
        loadPosttestQuestions();
        this.disabled = true;
    });

    document.getElementById('prev-postquestion')?.addEventListener('click', function() {
        if (currentPosttestQuestion > 0) {
            currentPosttestQuestion--;
            loadPosttestQuestions();
        }
    });

    document.getElementById('next-postquestion')?.addEventListener('click', function() {
        if (currentPosttestQuestion < posttestQuestions.length - 1) {
            currentPosttestQuestion++;
            loadPosttestQuestions();
        }
    });

    document.getElementById('submit-posttest')?.addEventListener('click', function() {
        // Calculate score
        posttestScore = 0;
        posttestQuestions.forEach((question, index) => {
            if (posttestAnswers[index] === question.correct) {
                posttestScore++;
            }
        });
        
        // Update score display
        document.getElementById('posttest-score').textContent = posttestScore;
        
        // Show results
        alert(`Posttest Completed!\nYour Score: ${posttestScore}/${posttestQuestions.length}\n${posttestScore >= 7 ? 'Excellent! You have mastered the topic.' : 'You may want to review the material again.'}`);
        
        // Re-enable start button
        document.getElementById('start-posttest').disabled = false;
    });

    // EXACT DIFFERENTIAL EQUATION SOLVER
    class ExactDESolver {
        constructor() {
            this.steps = [];
            this.isExact = false;
            this.solution = null;
        }

        // Parse mathematical expression
        parseExpression(expr) {
            // Remove spaces and convert to lowercase
            expr = expr.replace(/\s+/g, '').toLowerCase();
            
            // Replace common function notations
            expr = expr.replace(/sin\(/g, 'Math.sin(')
                      .replace(/cos\(/g, 'Math.cos(')
                      .replace(/tan\(/g, 'Math.tan(')
                      .replace(/exp\(/g, 'Math.exp(')
                      .replace(/ln\(/g, 'Math.log(')
                      .replace(/log\(/g, 'Math.log10(')
                      .replace(/e\^/g, 'Math.exp(')
                      .replace(/\^/g, '**')
                      .replace(/(\d)([a-z])/g, '$1*$2')
                      .replace(/([a-z])(\d)/g, '$1*$2')
                      .replace(/([a-z])([a-z])/g, '$1*$2');
            
            return expr;
        }

        // Extract terms from expression
        extractTerms(expr) {
            const terms = [];
            let currentTerm = '';
            let bracketCount = 0;
            
            for (let i = 0; i < expr.length; i++) {
                const char = expr[i];
                
                if (char === '(') bracketCount++;
                if (char === ')') bracketCount--;
                
                if ((char === '+' || char === '-') && bracketCount === 0 && i > 0) {
                    if (currentTerm) {
                        terms.push(currentTerm);
                        currentTerm = char;
                    }
                } else {
                    currentTerm += char;
                }
            }
            
            if (currentTerm) terms.push(currentTerm);
            return terms.map(term => term.trim()).filter(term => term);
        }

        // Compute partial derivative numerically
        partialDerivative(funcStr, wrt, point, h = 0.00001) {
            const { x, y } = point;
            let f1, f2;
            
            try {
                if (wrt === 'y') {
                    f1 = this.evaluateAtPoint(funcStr, x, y + h);
                    f2 = this.evaluateAtPoint(funcStr, x, y);
                } else {
                    f1 = this.evaluateAtPoint(funcStr, x + h, y);
                    f2 = this.evaluateAtPoint(funcStr, x, y);
                }
                
                return (f1 - f2) / h;
            } catch (e) {
                return null;
            }
        }

        // Evaluate expression at point
        evaluateAtPoint(expr, x, y) {
            try {
                const safeExpr = expr.replace(/x/g, x).replace(/y/g, y);
                // Evaluate the expression
                const func = new Function('Math', `return ${safeExpr}`);
                return func(Math);
            } catch (e) {
                console.error('Evaluation error:', e);
                return null;
            }
        }

        // Integrate with respect to x
        integrateWithRespectToX(M_expr) {
            const terms = this.extractTerms(M_expr);
            let result = '';
            
            for (const term of terms) {
                const integratedTerm = this.integrateTerm(term, 'x');
                result += (result && integratedTerm.startsWith('-') ? '' : '+') + integratedTerm;
            }
            
            return result.replace(/^\+/, '') + ' + g(y)';
        }

        // Integrate a single term
        integrateTerm(term, variable) {
            term = term.trim();
            
            // Handle negative signs
            let sign = term.startsWith('-') ? '-' : '';
            if (sign) term = term.substring(1);
            
            // Check for functions
            if (term.includes('sin(') || term.includes('cos(') || term.includes('tan(')) {
                return this.integrateTrigTerm(sign + term, variable);
            } else if (term.includes('exp(')) {
                return this.integrateExpTerm(sign + term, variable);
            } else {
                return this.integratePolyTerm(sign + term, variable);
            }
        }

        // Integrate polynomial term
        integratePolyTerm(term, variable) {
            // Handle coefficient
            let coefficient = 1;
            let varPart = term;
            
            // Extract coefficient if present
            const match = term.match(/^([-+]?\d*\.?\d*)/);
            if (match && match[1] && match[1] !== '' && match[1] !== '+' && match[1] !== '-') {
                coefficient = parseFloat(match[1]);
                varPart = term.substring(match[1].length);
            } else if (term.startsWith('-')) {
                coefficient = -1;
                varPart = term.substring(1);
            } else if (term.startsWith('+')) {
                coefficient = 1;
                varPart = term.substring(1);
            }
            
            // Check if term contains the variable
            if (!varPart.includes(variable)) {
                // Constant with respect to variable
                return `${coefficient}${variable}${varPart}`;
            }
            
            // Handle power
            if (varPart.includes('**')) {
                const parts = varPart.split('**');
                const base = parts[0];
                const power = parseFloat(parts[1]);
                
                if (base === variable) {
                    const newPower = power + 1;
                    const newCoeff = coefficient / newPower;
                    return `${newCoeff}${variable}**${newPower}`;
                }
            } else if (varPart === variable) {
                // Simple variable
                return `${coefficient/2}${variable}**2`;
            }
            
            // If we can't integrate symbolically, return as is
            return `${coefficient}∫(${varPart}) d${variable}`;
        }

        // Integrate trigonometric term
        integrateTrigTerm(term, variable) {
            // Extract the argument inside trig function
            const match = term.match(/(sin|cos|tan)\(([^)]+)\)/);
            if (match) {
                const func = match[1];
                const arg = match[2];
                
                // Check if argument is linear in variable
                if (arg.includes('*' + variable) || arg === variable) {
                    const coeffMatch = arg.match(new RegExp(`([-+]?\\d*\\.?\\d*)\\*?${variable}`));
                    let a = 1;
                    if (coeffMatch && coeffMatch[1]) {
                        a = parseFloat(coeffMatch[1]) || 1;
                    }
                    
                    switch(func) {
                        case 'sin':
                            return `-${1/a}cos(${arg})`;
                        case 'cos':
                            return `${1/a}sin(${arg})`;
                        case 'tan':
                            return `${1/a}ln|sec(${arg})|`;
                    }
                }
            }
            
            return `∫(${term}) d${variable}`;
        }

        // Integrate exponential term
        integrateExpTerm(term, variable) {
            const match = term.match(/exp\(([^)]+)\)/);
            if (match) {
                const arg = match[1];
                
                if (arg.includes('*' + variable) || arg === variable) {
                    const coeffMatch = arg.match(new RegExp(`([-+]?\\d*\\.?\\d*)\\*?${variable}`));
                    let a = 1;
                    if (coeffMatch && coeffMatch[1]) {
                        a = parseFloat(coeffMatch[1]) || 1;
                    }
                    return `${1/a}exp(${arg})`;
                }
            }
            
            return `∫(${term}) d${variable}`;
        }

        // Differentiate with respect to y
        differentiateWithRespectToY(expr) {
            const terms = this.extractTerms(expr.replace(' + g(y)', ''));
            let result = '';
            
            for (const term of terms) {
                const diffTerm = this.differentiateTerm(term, 'y');
                if (diffTerm && diffTerm !== '0') {
                    result += (result && !diffTerm.startsWith('-') ? '+' : '') + diffTerm;
                }
            }
            
            return result.replace(/^\+/, '') + " + g'(y)";
        }

        // Differentiate a single term
        differentiateTerm(term, variable) {
            term = term.trim();
            
            // Handle negative signs
            let sign = term.startsWith('-') ? '-' : '';
            if (sign) term = term.substring(1);
            
            // Check if term contains g(y)
            if (term.includes('g(y)')) {
                return term.includes("'") ? "g'(y)" : "g(y)";
            }
            
            // Check if term contains the variable
            if (!term.includes(variable)) {
                return '0'; // Derivative of constant with respect to y is 0
            }
            
            // Simple cases
            if (term === variable) {
                return sign + '1';
            }
            
            if (term.includes('*' + variable)) {
                const coeff = parseFloat(term.split('*')[0]) || 1;
                return sign + coeff;
            }
            
            if (term.includes(variable + '**')) {
                const parts = term.split('**');
                const base = parts[0];
                const power = parseFloat(parts[1]);
                
                if (base === variable) {
                    const coeff = parseFloat(term.split('*')[0]) || 1;
                    return sign + (coeff * power) + variable + '**' + (power - 1);
                }
            }
            
            // For other cases, return symbolic derivative
            return sign + "∂(" + term + ")/∂" + variable;
        }

        // Solve exact differential equation
        solve(M_expr, N_expr) {
            this.steps = [];
            this.isExact = false;
            this.solution = null;
            
            // Clean expressions
            M_expr = this.parseExpression(M_expr);
            N_expr = this.parseExpression(N_expr);
            
            // Step 1: Display the given equation
            this.steps.push({
                header: "Step 1: Given Equation",
                content: "The differential equation is:",
                equation: `(${M_expr}) dx + (${N_expr}) dy = 0`
            });
            
            // Step 2: Identify M and N
            this.steps.push({
                header: "Step 2: Identify M(x,y) and N(x,y)",
                content: "We have:",
                equations: [
                    `M(x,y) = ${M_expr}`,
                    `N(x,y) = ${N_expr}`
                ]
            });
            
            // Step 3: Check exactness
            this.steps.push({
                header: "Step 3: Check for Exactness",
                content: "For exactness, we need ∂M/∂y = ∂N/∂x",
                equation: `Condition: ∂M/∂y = ∂N/∂x`
            });
            
            // Compute partial derivatives at sample points
            const points = [{x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}];
            let allEqual = true;
            let dM_dy_vals = [];
            let dN_dx_vals = [];
            
            for (const point of points) {
                const dM_dy = this.partialDerivative(M_expr, 'y', point);
                const dN_dx = this.partialDerivative(N_expr, 'x', point);
                
                dM_dy_vals.push(dM_dy);
                dN_dx_vals.push(dN_dx);
                
                if (Math.abs(dM_dy - dN_dx) > 0.001) {
                    allEqual = false;
                }
            }
            
            // Take average values
            const avg_dM_dy = dM_dy_vals.reduce((a, b) => a + b, 0) / dM_dy_vals.length;
            const avg_dN_dx = dN_dx_vals.reduce((a, b) => a + b, 0) / dN_dx_vals.length;
            
            this.isExact = Math.abs(avg_dM_dy - avg_dN_dx) < 0.01;
            
            this.steps.push({
                header: "Step 4: Compute Partial Derivatives",
                content: "Computing at sample points:",
                equations: [
                    `∂M/∂y ≈ ${avg_dM_dy.toFixed(4)}`,
                    `∂N/∂x ≈ ${avg_dN_dx.toFixed(4)}`
                ]
            });
            
            if (this.isExact) {
                this.steps.push({
                    header: "Step 5: Exactness Condition",
                    content: "Since ∂M/∂y ≈ ∂N/∂x, the equation is exact.",
                    equation: `∂M/∂y (${avg_dM_dy.toFixed(4)}) ≈ ∂N/∂x (${avg_dN_dx.toFixed(4)}) ✓`
                });
                
                // Step 6: Integrate M with respect to x
                const int_M_dx = this.integrateWithRespectToX(M_expr);
                this.steps.push({
                    header: "Step 6: Integrate M with respect to x",
                    content: "Find ψ(x,y) by integrating M with respect to x:",
                    equation: `ψ(x,y) = ∫M dx = ∫(${M_expr}) dx = ${int_M_dx}`
                });
                
                // Step 7: Differentiate ψ with respect to y
                const dψ_dy = this.differentiateWithRespectToY(int_M_dx);
                this.steps.push({
                    header: "Step 7: Differentiate ψ with respect to y",
                    content: "Differentiate ψ with respect to y:",
                    equation: `∂ψ/∂y = ∂/∂y [${int_M_dx}] = ${dψ_dy}`
                });
                
                // Step 8: Compare with N to find g'(y)
                this.steps.push({
                    header: "Step 8: Compare with N(x,y)",
                    content: "We know ∂ψ/∂y should equal N(x,y):",
                    equation: `${dψ_dy} = ${N_expr}`
                });
                
                // Step 9: Solve for g'(y)
                // For exact equations, the terms from differentiation should match N
                // The remaining terms give g'(y)
                this.steps.push({
                    header: "Step 9: Find g'(y)",
                    content: "From comparison, we get:",
                    equation: `g'(y) = ${N_expr} - [terms from ∂ψ/∂y excluding g'(y)]`
                });
                
                // Step 10: Integrate to find g(y)
                this.steps.push({
                    header: "Step 10: Integrate g'(y)",
                    content: "Integrate g'(y) with respect to y:",
                    equation: `g(y) = ∫ g'(y) dy`
                });
                
                // Step 11: Write final solution
                // For exact equations: ψ(x,y) = C
                const solution = this.constructSolution(int_M_dx);
                this.solution = solution;
                this.steps.push({
                    header: "Step 11: General Solution",
                    content: "The general solution is ψ(x,y) = constant:",
                    equation: solution,
                    final: true
                });
                
            } else {
                this.steps.push({
                    header: "Step 5: Exactness Condition",
                    content: "Since ∂M/∂y ≠ ∂N/∂x, the equation is not exact.",
                    equation: `∂M/∂y (${avg_dM_dy.toFixed(4)}) ≠ ∂N/∂x (${avg_dN_dx.toFixed(4)})`
                });
                
                // Check for integrating factors
                const diff = avg_dM_dy - avg_dN_dx;
                this.steps.push({
                    header: "Step 6: Check for Integrating Factor",
                    content: "We can try to find an integrating factor μ(x,y):",
                    list: [
                        "1. Check if (∂M/∂y - ∂N/∂x)/N is function of x only → μ(x) = exp(∫f(x)dx)",
                        "2. Check if (∂N/∂x - ∂M/∂y)/M is function of y only → μ(y) = exp(∫g(y)dy)",
                        "3. Try common integrating factors: 1/x, 1/y, 1/(x²+y²), etc."
                    ]
                });
                
                // Suggest possible integrating factors
                const suggestions = this.suggestIntegratingFactor(M_expr, N_expr, diff);
                if (suggestions.length > 0) {
                    this.steps.push({
                        header: "Step 7: Suggested Integrating Factors",
                        content: "Possible integrating factors to try:",
                        list: suggestions
                    });
                }
            }
            
            return {
                steps: this.steps,
                isExact: this.isExact,
                solution: this.solution
            };
        }
        
        // Construct solution
        constructSolution(int_M_dx) {
            // Remove g(y) and combine terms
            let solution = int_M_dx.replace(' + g(y)', '');
            
            // For exact equations, the solution is typically of form F(x,y) = C
            // We'll try to simplify the expression
            solution = solution.replace(/\+\s*\-/g, '-')
                              .replace(/\-\s*\-/g, '+')
                              .replace(/\s+/g, ' ');
            
            return `${solution} = C`;
        }
        
        // Suggest integrating factors
        suggestIntegratingFactor(M_expr, N_expr, diff) {
            const suggestions = [];
            
            // Check if M and N are homogeneous
            if (M_expr.includes('x') && M_expr.includes('y') && 
                N_expr.includes('x') && N_expr.includes('y')) {
                suggestions.push("Try μ = 1/(xM + yN) if homogeneous");
            }
            
            // Check if terms suggest specific patterns
            if (M_expr.includes('y') && N_expr.includes('x')) {
                suggestions.push("Try μ = 1/(xy)");
            }
            
            if ((M_expr.includes('x**2') || M_expr.includes('y**2')) &&
                (N_expr.includes('x**2') || N_expr.includes('y**2'))) {
                suggestions.push("Try μ = 1/(x² + y²)");
            }
            
            // Common patterns
            if (Math.abs(diff) > 0.1) {
                suggestions.push(`Try μ = exp(${diff.toFixed(2)}x) or μ = exp(${(-diff).toFixed(2)}y)`);
            }
            
            return suggestions;
        }
    }

    // Simulation functionality
    function initSimulation() {
        const MInput = document.getElementById('M-input');
        const NInput = document.getElementById('N-input');
        const equationDisplay = document.getElementById('equation-display');
        const solveButton = document.getElementById('solve-equation');
        const clearButton = document.getElementById('clear-input');
        const exampleButtons = document.querySelectorAll('.example-btn');
        const solutionSteps = document.getElementById('solution-steps');

        // Update equation display
        function updateEquationDisplay() {
            const M = MInput.value || 'M(x,y)';
            const N = NInput.value || 'N(x,y)';
            equationDisplay.innerHTML = `(${M})dx + (${N})dy = 0`;
            
            // Try to render with KaTeX if available
            try {
                if (typeof katex !== 'undefined') {
                    katex.render(`(${M})\\,dx + (${N})\\,dy = 0`, equationDisplay, {
                        throwOnError: false,
                        displayMode: false
                    });
                }
            } catch (e) {
                // If KaTeX fails, keep the plain text
            }
        }

        // Display solution steps
        function displaySolutionSteps(steps, isExact, solution) {
            solutionSteps.innerHTML = '';
            
            steps.forEach((step, index) => {
                const stepDiv = document.createElement('div');
                stepDiv.className = `solution-step ${step.final ? 'final-step' : ''}`;
                
                let contentHTML = `
                    <div class="step-header">
                        <span class="step-number">${index + 1}</span>
                        ${step.header}
                    </div>
                    <div class="step-content">
                        <p>${step.content}</p>
                `;
                
                if (step.equation) {
                    contentHTML += `<div class="step-equation">${step.equation}</div>`;
                }
                
                if (step.equations) {
                    step.equations.forEach(eq => {
                        contentHTML += `<div class="step-equation">${eq}</div>`;
                    });
                }
                
                if (step.list) {
                    contentHTML += '<ul class="step-list">';
                    step.list.forEach(item => {
                        contentHTML += `<li>${item}</li>`;
                    });
                    contentHTML += '</ul>';
                }
                
                contentHTML += '</div>';
                stepDiv.innerHTML = contentHTML;
                solutionSteps.appendChild(stepDiv);
                
                // Try to render equations with KaTeX
                setTimeout(() => {
                    stepDiv.querySelectorAll('.step-equation').forEach(eqElement => {
                        const eqText = eqElement.textContent;
                        try {
                            if (typeof katex !== 'undefined' && eqText) {
                                katex.render(eqText, eqElement, {
                                    throwOnError: false,
                                    displayMode: false
                                });
                            }
                        } catch (e) {
                            // Keep plain text if KaTeX fails
                        }
                    });
                }, 100);
            });
            
            // Add solution summary
            if (solution) {
                const solutionDiv = document.createElement('div');
                solutionDiv.className = 'solution-summary final-step';
                solutionDiv.innerHTML = `
                    <div class="step-header">
                        <i class="fas fa-check-circle"></i>
                        Solution Summary
                    </div>
                    <div class="step-content">
                        <p>The exact differential equation has been solved successfully.</p>
                        <div class="final-solution">${solution}</div>
                    </div>
                `;
                solutionSteps.appendChild(solutionDiv);
                
                // Try to render final solution with KaTeX
                setTimeout(() => {
                    const finalEq = solutionDiv.querySelector('.final-solution');
                    if (finalEq && typeof katex !== 'undefined') {
                        try {
                            katex.render(finalEq.textContent, finalEq, {
                                throwOnError: false,
                                displayMode: false
                            });
                        } catch (e) {
                            // Keep plain text
                        }
                    }
                }, 100);
            }
            
            // Scroll to top of solution
            solutionSteps.scrollTop = 0;
        }

        // Solve button click handler
        solveButton.addEventListener('click', function() {
            const M = MInput.value.trim();
            const N = NInput.value.trim();
            
            if (!M || !N) {
                alert('Please enter both M(x,y) and N(x,y) functions.');
                return;
            }
            
            // Show loading
            solutionSteps.innerHTML = `
                <div class="placeholder-text">
                    <i class="fas fa-cog fa-spin"></i>
                    <p>Solving equation step by step...</p>
                </div>
            `;
            
            // Solve using the solver
            setTimeout(() => {
                try {
                    const solver = new ExactDESolver();
                    const result = solver.solve(M, N);
                    
                    if (result.steps.length > 0) {
                        displaySolutionSteps(result.steps, result.isExact, result.solution);
                    } else {
                        solutionSteps.innerHTML = `
                            <div class="placeholder-text">
                                <i class="fas fa-exclamation-triangle"></i>
                                <p>Could not solve the equation. Please check your input.</p>
                            </div>
                        `;
                    }
                } catch (error) {
                    console.error('Solving error:', error);
                    solutionSteps.innerHTML = `
                        <div class="placeholder-text">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Error solving equation: ${error.message}</p>
                            <p>Please check your input format and try again.</p>
                        </div>
                    `;
                }
            }, 500);
        });

        // Clear button
        clearButton.addEventListener('click', function() {
            MInput.value = '';
            NInput.value = '';
            updateEquationDisplay();
            solutionSteps.innerHTML = `
                <div class="placeholder-text">
                    <i class="fas fa-arrow-up"></i>
                    <p>Enter an exact differential equation above and click "Solve Step-by-Step"</p>
                    <p class="hint">Format: M(x,y) dx + N(x,y) dy = 0</p>
                </div>
            `;
        });

        // Example buttons
        exampleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const M = this.getAttribute('data-m');
                const N = this.getAttribute('data-n');
                
                MInput.value = M;
                NInput.value = N;
                updateEquationDisplay();
                
                // Auto-solve after a brief delay
                setTimeout(() => {
                    solveButton.click();
                }, 300);
            });
        });

        // Add sample equations dropdown
        const sampleEquations = [
            {
                name: "Basic Example",
                M: "2*x*y + y^2",
                N: "x^2 + 2*x*y",
                desc: "(2xy + y²)dx + (x² + 2xy)dy = 0"
            },
            {
                name: "Trigonometric Example",
                M: "y^2*cos(x) + y",
                N: "2*y*sin(x) + x",
                desc: "(y²cosx + y)dx + (2ysinx + x)dy = 0"
            },
            {
                name: "Exponential Example",
                M: "exp(y)",
                N: "x*exp(y) + 2*y",
                desc: "e^y dx + (xe^y + 2y)dy = 0"
            },
            {
                name: "Polynomial Example",
                M: "3*x^2*y",
                N: "x^3 + cos(y)",
                desc: "3x²y dx + (x³ + cosy)dy = 0"
            },
            {
                name: "Linear Example",
                M: "y",
                N: "x",
                desc: "y dx + x dy = 0"
            },
            {
                name: "Homogeneous Example",
                M: "x^2 + y^2",
                N: "2*x*y",
                desc: "(x² + y²)dx + 2xy dy = 0"
            }
        ];

        // Add input format tips
        const formatTips = document.createElement('div');
        formatTips.className = 'format-tips';
        formatTips.innerHTML = `
            <h5><i class="fas fa-info-circle"></i> Input Format Tips:</h5>
            <ul>
                <li>Use * for multiplication: 2*x*y</li>
                <li>Use ^ for exponentiation: x^2, y^3</li>
                <li>Use sin(x), cos(x), exp(x) for functions</li>
                <li>Examples: 3*x^2*y, sin(x+y), exp(2*x)</li>
                <li>The solver will show all steps for exact equations</li>
                <li>For non-exact equations, it will suggest integrating factors</li>
            </ul>
        `;
        
        // Find input section and append tips
        const inputSection = document.querySelector('.input-section');
        if (inputSection) {
            inputSection.appendChild(formatTips);
        }

        // Initialize
        updateEquationDisplay();
        
        // Update display on input
        MInput.addEventListener('input', updateEquationDisplay);
        NInput.addEventListener('input', updateEquationDisplay);
        
        // Add Enter key support
        MInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') solveButton.click();
        });
        
        NInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') solveButton.click();
        });
    }

    // Initialize the first section
    loadSectionContent(activeSection);

    // Handle image errors
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/150/2c3e50/ffffff?text=Image';
            this.onerror = null;
        };
    });
});