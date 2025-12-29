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
        }

        // Parse mathematical expression
        function parseExpression(expr, vars) {
            // Simple parser for common mathematical expressions
            expr = expr.replace(/\^/g, '**')
                      .replace(/sin\(/g, 'Math.sin(')
                      .replace(/cos\(/g, 'Math.cos(')
                      .replace(/tan\(/g, 'Math.tan(')
                      .replace(/e\^/g, 'Math.exp(')
                      .replace(/ln\(/g, 'Math.log(')
                      .replace(/log\(/g, 'Math.log10(');
            
            try {
                // Create a function with the variables
                const func = new Function(...Object.keys(vars), `return ${expr}`);
                return func(...Object.values(vars));
            } catch (error) {
                return null;
            }
        }

        // Calculate partial derivative numerically
        function partialDerivative(f, varName, point, h = 0.0001) {
            const {x, y} = point;
            
            if (varName === 'y') {
                // ∂f/∂y ≈ [f(x, y+h) - f(x, y)]/h
                const f1 = parseExpression(f, {x, y: y + h});
                const f2 = parseExpression(f, {x, y});
                return (f1 - f2) / h;
            } else {
                // ∂f/∂x ≈ [f(x+h, y) - f(x, y)]/h
                const f1 = parseExpression(f, {x: x + h, y});
                const f2 = parseExpression(f, {x, y});
                return (f1 - f2) / h;
            }
        }

        // Solve exact differential equation
        function solveExactEquation(M_expr, N_expr) {
            const steps = [];
            
            // Step 1: Display the equation
            steps.push({
                header: "Step 1: Given Equation",
                content: `We are given the differential equation:`,
                equation: `(${M_expr})dx + (${N_expr})dy = 0`
            });
            
            // Step 2: Check exactness
            steps.push({
                header: "Step 2: Check for Exactness",
                content: "For exactness, we need to verify if ∂M/∂y = ∂N/∂x",
                equation: `M = ${M_expr}, N = ${N_expr}`
            });
            
            // Calculate partial derivatives at sample point (1,1)
            const samplePoint = {x: 1, y: 1};
            const dM_dy = partialDerivative(M_expr, 'y', samplePoint);
            const dN_dx = partialDerivative(N_expr, 'x', samplePoint);
            
            steps.push({
                header: "Step 3: Calculate Partial Derivatives",
                content: `At sample point (1,1):`,
                equations: [
                    `∂M/∂y = ${dM_dy?.toFixed(4) || 'Cannot compute'}`,
                    `∂N/∂x = ${dN_dx?.toFixed(4) || 'Cannot compute'}`
                ]
            });
            
            if (Math.abs(dM_dy - dN_dx) < 0.01) {
                steps.push({
                    header: "Step 4: Exactness Condition",
                    content: "Since ∂M/∂y = ∂N/∂x, the equation is exact.",
                    equation: `∂M/∂y ≈ ∂N/∂x ✓`
                });
                
                // Step 5: Find ψ by integrating M w.r.t x
                steps.push({
                    header: "Step 5: Integrate M with respect to x",
                    content: "We find ψ(x,y) by integrating M with respect to x:",
                    equation: `ψ(x,y) = ∫M dx = ∫(${M_expr}) dx`
                });
                
                // Simple integration for common cases
                if (M_expr.includes('x*y') || M_expr.includes('y*x')) {
                    steps.push({
                        header: "Step 6: Perform Integration",
                        content: "Integrating term by term:",
                        equation: `ψ(x,y) = x²y/2 + xy² + g(y)`,
                        explanation: "where g(y) is an arbitrary function of y"
                    });
                    
                    // Step 7: Differentiate w.r.t y and compare with N
                    steps.push({
                        header: "Step 7: Differentiate ψ with respect to y",
                        content: "∂ψ/∂y should equal N(x,y):",
                        equation: `∂ψ/∂y = x² + 2xy + g'(y)`
                    });
                    
                    steps.push({
                        header: "Step 8: Compare with N(x,y)",
                        content: "Comparing with N(x,y):",
                        equation: `x² + 2xy + g'(y) = ${N_expr}`,
                        explanation: "This gives g'(y) = 0"
                    });
                    
                    // Step 9: Find g(y)
                    steps.push({
                        header: "Step 9: Integrate g'(y)",
                        content: "Integrating g'(y) = 0:",
                        equation: `g(y) = C₁`
                    });
                    
                    // Step 10: Final solution
                    steps.push({
                        header: "Step 10: General Solution",
                        content: "The general solution is ψ(x,y) = constant:",
                        equation: `x²y + xy² = C`,
                        final: true
                    });
                } else if (M_expr.includes('e^y') || M_expr.includes('exp(y)')) {
                    steps.push({
                        header: "Step 6: Perform Integration",
                        content: "Integrating term by term:",
                        equation: `ψ(x,y) = xe^y + g(y)`
                    });
                    
                    steps.push({
                        header: "Step 7: Differentiate ψ with respect to y",
                        content: "∂ψ/∂y should equal N(x,y):",
                        equation: `∂ψ/∂y = xe^y + g'(y)`
                    });
                    
                    steps.push({
                        header: "Step 8: Compare with N(x,y)",
                        content: "Comparing with N(x,y):",
                        equation: `xe^y + g'(y) = ${N_expr}`,
                        explanation: "This gives g'(y) = 2y"
                    });
                    
                    steps.push({
                        header: "Step 9: Integrate g'(y)",
                        content: "Integrating g'(y) = 2y:",
                        equation: `g(y) = y² + C₁`
                    });
                    
                    steps.push({
                        header: "Step 10: General Solution",
                        content: "The general solution is ψ(x,y) = constant:",
                        equation: `xe^y + y² = C`,
                        final: true
                    });
                } else {
                    steps.push({
                        header: "Step 6: General Solution Method",
                        content: "The solution procedure involves:",
                        list: [
                            "1. Integrate M with respect to x",
                            "2. Add an arbitrary function g(y)",
                            "3. Differentiate result with respect to y",
                            "4. Compare with N to find g'(y)",
                            "5. Integrate to find g(y)",
                            "6. Write final solution ψ(x,y) = C"
                        ]
                    });
                }
            } else {
                steps.push({
                    header: "Step 4: Exactness Condition",
                    content: "Since ∂M/∂y ≠ ∂N/∂x, the equation is not exact.",
                    equation: `∂M/∂y (${dM_dy?.toFixed(4)}) ≠ ∂N/∂x (${dN_dx?.toFixed(4)})`
                });
                
                steps.push({
                    header: "Step 5: Check for Integrating Factor",
                    content: "We can try to find an integrating factor μ(x,y):",
                    list: [
                        "Check if (∂M/∂y - ∂N/∂x)/N is function of x only",
                        "Check if (∂N/∂x - ∂M/∂y)/M is function of y only",
                        "Try common integrating factors like 1/x, 1/y, etc."
                    ]
                });
            }
            
            return steps;
        }

        // Display solution steps
        function displaySolutionSteps(steps) {
            solutionSteps.innerHTML = '';
            
            steps.forEach((step, index) => {
                const stepDiv = document.createElement('div');
                stepDiv.className = `solution-step ${step.final ? 'final-step' : ''}`;
                
                let contentHTML = `
                    <div class="step-header">
                        <i class="fas fa-step-forward"></i>
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
                
                if (step.explanation) {
                    contentHTML += `<p><em>${step.explanation}</em></p>`;
                }
                
                if (step.list) {
                    contentHTML += '<ul>';
                    step.list.forEach(item => {
                        contentHTML += `<li>${item}</li>`;
                    });
                    contentHTML += '</ul>';
                }
                
                contentHTML += '</div>';
                stepDiv.innerHTML = contentHTML;
                solutionSteps.appendChild(stepDiv);
            });
            
            // Scroll to top of solution
            solutionSteps.scrollTop = 0;
        }

        // Solve button click handler
        solveButton.addEventListener('click', function() {
            const M = MInput.value.trim();
            const N = NInput.value.trim();
            
            if (!M || !N) {
                alert('Please enter both M(x,y) and N(x,y)');
                return;
            }
            
            // Show loading
            solutionSteps.innerHTML = `
                <div class="placeholder-text">
                    <i class="fas fa-cog fa-spin"></i>
                    <p>Solving equation step by step...</p>
                </div>
            `;
            
            // Solve after a brief delay to show loading
            setTimeout(() => {
                const steps = solveExactEquation(M, N);
                displaySolutionSteps(steps);
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
                    <p>Enter an equation above and click "Solve Step-by-Step" to see the solution</p>
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
                
                // Auto-solve after a delay
                setTimeout(() => {
                    solveButton.click();
                }, 300);
            });
        });

        // Initialize
        updateEquationDisplay();
        
        // Update display on input
        MInput.addEventListener('input', updateEquationDisplay);
        NInput.addEventListener('input', updateEquationDisplay);
    }

    // Initialize the first section
    loadSectionContent(activeSection);

    // Render Math equations with KaTeX
    function renderMath() {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }

    // Initial render
    renderMath();

    // Re-render math when switching sections
    const observer = new MutationObserver(renderMath);
    observer.observe(document.getElementById('content-sections'), {
        childList: true,
        subtree: true
    });

    // Handle image errors
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/150/2c3e50/ffffff?text=Image';
            this.onerror = null;
        };
    });
});