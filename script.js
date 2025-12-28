// Virtual Lab for Exact Differential Equations - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApplication();
});

// Main Application Initialization
function initApplication() {
    // Initialize all components
    setupNavigation();
    setupUserInfo();
    loadInitialSection();
    setupEventListeners();
    setupProgressTracker();
    
    // Check for saved progress
    loadUserProgress();
}

// Navigation Setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const navMenu = document.getElementById('navMenu');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get section name from data attribute
            const sectionName = item.getAttribute('data-section');
            
            // Update navigation
            updateNavigation(item);
            
            // Load the section
            loadSection(sectionName);
            
            // Update progress
            updateProgress(sectionName);
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') navigateToPrevious();
        if (e.key === 'ArrowRight') navigateToNext();
    });
}

// Update Navigation State
function updateNavigation(activeItem) {
    // Remove active class from all items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    activeItem.classList.add('active');
    
    // Update breadcrumb
    updateBreadcrumb(activeItem);
}

// Load Section Content
async function loadSection(sectionName) {
    const contentContainer = document.getElementById('content-container');
    const sectionTitle = document.getElementById('sectionTitle');
    const sectionSubtitle = document.getElementById('sectionSubtitle');
    
    // Show loading state
    contentContainer.innerHTML = createLoadingSpinner();
    
    try {
        // Load section content
        const response = await fetch(`sections/${sectionName}.html`);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${sectionName} section`);
        }
        
        const html = await response.text();
        
        // Update content
        contentContainer.innerHTML = html;
        
        // Update section info
        updateSectionInfo(sectionName);
        
        // Initialize section-specific functionality
        initializeSection(sectionName);
        
        // Save current section to localStorage
        saveCurrentSection(sectionName);
        
    } catch (error) {
        console.error('Error loading section:', error);
        contentContainer.innerHTML = createErrorState(sectionName);
    }
}

// Create Loading Spinner
function createLoadingSpinner() {
    return `
        <div class="loading-container">
            <div class="spinner">
                <i class="fas fa-atom fa-spin"></i>
            </div>
            <p>Loading content...</p>
        </div>
    `;
}

// Create Error State
function createErrorState(sectionName) {
    return `
        <div class="error-container">
            <i class="fas fa-exclamation-triangle fa-3x"></i>
            <h3>Error Loading Content</h3>
            <p>Unable to load the ${sectionName} section. Please try again.</p>
            <button class="retry-btn" onclick="loadSection('${sectionName}')">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
}

// Update Section Information
function updateSectionInfo(sectionName) {
    const sectionTitles = {
        'aim': 'Aim of the Experiment',
        'theory': 'Theory & Concepts',
        'pretest': 'Pre-test Assessment',
        'simulation': 'Interactive Simulation',
        'posttest': 'Post-test Assessment',
        'references': 'References & Resources',
        'contributors': 'Contributors',
        'feedback': 'Feedback & Suggestions'
    };
    
    const sectionSubtitles = {
        'aim': 'Understanding the objectives of studying exact differential equations',
        'theory': 'Mathematical foundations and concepts behind exact differential equations',
        'pretest': 'Test your existing knowledge before proceeding',
        'simulation': 'Interactive step-by-step solver for exact differential equations',
        'posttest': 'Evaluate your learning after completing the lab',
        'references': 'Books, papers, and online resources for further study',
        'contributors': 'Meet the team behind this virtual lab',
        'feedback': 'Share your experience and suggestions for improvement'
    };
    
    document.getElementById('sectionTitle').textContent = sectionTitles[sectionName] || sectionName;
    document.getElementById('sectionSubtitle').textContent = sectionSubtitles[sectionName] || '';
    document.getElementById('currentSection').textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
}

// Update Breadcrumb
function updateBreadcrumb(activeItem) {
    const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
    const sectionName = activeItem.getAttribute('data-section');
    
    // Update active breadcrumb item
    breadcrumbItems.forEach(item => {
        if (item.classList.contains('active')) {
            item.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
        }
    });
}

// Initialize Section-Specific Functionality
function initializeSection(sectionName) {
    switch(sectionName) {
        case 'simulation':
            initializeSimulation();
            break;
        case 'pretest':
        case 'posttest':
            initializeTest(sectionName);
            break;
        case 'feedback':
            initializeFeedback();
            break;
        case 'contributors':
            initializeContributors();
            break;
    }
    
    // Scroll to top of content
    document.getElementById('content-container').scrollIntoView({ behavior: 'smooth' });
}

// Initialize Simulation Section
function initializeSimulation() {
    const solveBtn = document.getElementById('solve-equation');
    const equationInput = document.getElementById('equation-input');
    
    if (solveBtn && equationInput) {
        solveBtn.addEventListener('click', solveExactDE);
        
        // Add enter key support
        equationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                solveExactDE();
            }
        });
        
        // Setup example buttons
        setupExampleButtons();
        
        // Setup problem hints
        setupProblemHints();
    }
}

// Solve Exact Differential Equation
function solveExactDE() {
    const equationInput = document.getElementById('equation-input');
    const stepsContainer = document.getElementById('steps-container');
    
    if (!equationInput || !stepsContainer) return;
    
    const equation = equationInput.value.trim();
    
    if (!equation) {
        showAlert('Please enter a differential equation in the form M(x,y)dx + N(x,y)dy = 0', 'warning');
        return;
    }
    
    try {
        // Parse equation
        const { M, N, isValid } = parseEquation(equation);
        
        if (!isValid) {
            showAlert('Invalid equation format. Use format: M(x,y)dx + N(x,y)dy = 0', 'error');
            return;
        }
        
        // Generate solution steps
        const steps = generateSolutionSteps(M, N);
        
        // Display solution
        displaySolution(steps, stepsContainer);
        
        // Save to history
        saveToHistory(equation, steps);
        
    } catch (error) {
        console.error('Error solving equation:', error);
        showAlert('Error solving equation. Please check the format and try again.', 'error');
    }
}

// Parse Equation
function parseEquation(equation) {
    // Simple parser for demonstration
    // In a real application, use a proper mathematical parser
    
    // Remove spaces
    equation = equation.replace(/\s/g, '');
    
    // Basic validation
    if (!equation.includes('dx') || !equation.includes('dy')) {
        return { M: '', N: '', isValid: false };
    }
    
    // Extract M and N (simplified)
    const parts = equation.split('dx');
    if (parts.length !== 2) return { M: '', N: '', isValid: false };
    
    let M = parts[0];
    if (M.startsWith('(') && M.endsWith(')')) {
        M = M.slice(1, -1);
    }
    
    let N = parts[1].split('dy')[0];
    if (N.startsWith('+') || N.startsWith('-')) {
        N = N.slice(1);
    }
    
    return { M, N, isValid: true };
}

// Generate Solution Steps
function generateSolutionSteps(M, N) {
    const steps = [];
    
    // Step 1: Identify M and N
    steps.push({
        number: 1,
        title: "Identify M and N",
        equation: `M(x, y) = ${M}\nN(x, y) = ${N}`,
        explanation: "From the given differential equation, identify the functions M and N.",
        type: "identification"
    });
    
    // Step 2: Check exactness
    steps.push({
        number: 2,
        title: "Check for Exactness",
        equation: `Condition: ∂M/∂y = ∂N/∂x`,
        explanation: "Compute partial derivatives to verify if the equation is exact.",
        type: "verification"
    });
    
    // Step 3: Integrate M with respect to x
    steps.push({
        number: 3,
        title: "Integrate M with respect to x",
        equation: `F(x, y) = ∫ M dx = ∫ (${M}) dx + g(y)`,
        explanation: "Integrate M treating y as constant, and add an arbitrary function g(y).",
        type: "integration"
    });
    
    // Step 4: Differentiate with respect to y
    steps.push({
        number: 4,
        title: "Differentiate F with respect to y",
        equation: `∂F/∂y = ∂/∂y [∫ M dx] + g'(y) = N = ${N}`,
        explanation: "Differentiate the result from step 3 with respect to y.",
        type: "differentiation"
    });
    
    // Step 5: Solve for g'(y)
    steps.push({
        number: 5,
        title: "Solve for g'(y)",
        equation: `g'(y) = N - ∂/∂y [∫ M dx]`,
        explanation: "Find g'(y) by comparing with N(x, y).",
        type: "solving"
    });
    
    // Step 6: Integrate to find g(y)
    steps.push({
        number: 6,
        title: "Integrate to find g(y)",
        equation: `g(y) = ∫ g'(y) dy`,
        explanation: "Integrate g'(y) to find the function g(y).",
        type: "integration"
    });
    
    // Step 7: Write general solution
    steps.push({
        number: 7,
        title: "Write General Solution",
        equation: `F(x, y) = C`,
        explanation: "The general solution is F(x, y) = C, where C is an arbitrary constant.",
        type: "solution"
    });
    
    return steps;
}

// Display Solution
function displaySolution(steps, container) {
    let html = `
        <div class="solution-header">
            <h3><i class="fas fa-calculator"></i> Step-by-Step Solution</h3>
            <p>Follow each step carefully to understand the procedure:</p>
        </div>
        
        <div class="steps-timeline">
    `;
    
    steps.forEach(step => {
        html += `
            <div class="step-card step-${step.type}">
                <div class="step-number">${step.number}</div>
                <div class="step-content">
                    <h4>${step.title}</h4>
                    <div class="step-equation">${step.equation}</div>
                    <p class="step-explanation">${step.explanation}</p>
                    ${step.number === 2 ? getPartialDerivativesHelp() : ''}
                    ${step.number === 3 ? getIntegrationHelp() : ''}
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        
        <div class="solution-summary">
            <h4><i class="fas fa-lightbulb"></i> Key Takeaways:</h4>
            <ul>
                <li>Always verify exactness condition first</li>
                <li>Remember to add g(y) when integrating M with respect to x</li>
                <li>Differentiate carefully, treating the correct variable as constant</li>
                <li>The solution represents a family of curves parameterized by C</li>
            </ul>
            
            <button class="practice-btn" onclick="loadSection('simulation')">
                <i class="fas fa-redo"></i> Try Another Equation
            </button>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Add step navigation
    addStepNavigation();
}

// Get Partial Derivatives Help
function getPartialDerivativesHelp() {
    return `
        <div class="help-box">
            <h5><i class="fas fa-info-circle"></i> Partial Derivatives Guide:</h5>
            <ul>
                <li>∂/∂y of constant = 0</li>
                <li>∂/∂y of x = 0 (treat x as constant)</li>
                <li>∂/∂y of y = 1</li>
                <li>∂/∂y of y² = 2y</li>
                <li>∂/∂y of e^y = e^y</li>
                <li>∂/∂y of sin(y) = cos(y)</li>
            </ul>
        </div>
    `;
}

// Get Integration Help
function getIntegrationHelp() {
    return `
        <div class="help-box">
            <h5><i class="fas fa-info-circle"></i> Integration Rules:</h5>
            <ul>
                <li>∫ x dx = x²/2</li>
                <li>∫ y dx = xy (treat y as constant)</li>
                <li>∫ x² dx = x³/3</li>
                <li>∫ sin(x) dx = -cos(x)</li>
                <li>∫ cos(x) dx = sin(x)</li>
                <li>∫ e^x dx = e^x</li>
            </ul>
        </div>
    `;
}

// Setup Example Buttons
function setupExampleButtons() {
    const exampleButtons = document.querySelectorAll('.example-btn');
    
    exampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const equation = btn.getAttribute('data-eq');
            document.getElementById('equation-input').value = equation;
        });
    });
}

// Setup Problem Hints
function setupProblemHints() {
    const hintButtons = document.querySelectorAll('.hint-btn');
    
    hintButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const problemId = btn.getAttribute('data-problem');
            const hintBox = document.getElementById(`hint-${problemId}`);
            
            if (hintBox) {
                hintBox.style.display = hintBox.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
}

// Initialize Test Sections
function initializeTest(testName) {
    const testForm = document.getElementById(`${testName}-form`);
    const submitBtn = document.getElementById('submit-test');
    
    if (submitBtn && testForm) {
        submitBtn.addEventListener('click', () => submitTest(testName));
        
        // Setup option selection
        setupTestOptions();
    }
}

// Setup Test Options
function setupTestOptions() {
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from siblings
            const question = this.closest('.question');
            question.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
}

// Submit Test
function submitTest(testName) {
    const selectedOptions = document.querySelectorAll('.option.selected');
    const totalQuestions = document.querySelectorAll('.question').length;
    
    if (selectedOptions.length < totalQuestions) {
        showAlert('Please answer all questions before submitting.', 'warning');
        return;
    }
    
    // Calculate score (simplified for demo)
    const score = calculateScore(selectedOptions);
    const percentage = (score / totalQuestions) * 100;
    
    // Display results
    displayTestResults(score, totalQuestions, percentage, testName);
    
    // Save results
    saveTestResults(testName, score, totalQuestions);
}

// Calculate Score
function calculateScore(selectedOptions) {
    let score = 0;
    
    selectedOptions.forEach(option => {
        if (option.getAttribute('data-correct') === 'true') {
            score++;
        }
    });
    
    return score;
}

// Display Test Results
function displayTestResults(score, total, percentage, testName) {
    const resultsContainer = document.getElementById('test-results');
    
    if (!resultsContainer) return;
    
    const performance = getPerformanceLevel(percentage);
    
    resultsContainer.innerHTML = `
        <div class="results-card ${performance.class}">
            <div class="results-header">
                <i class="fas fa-chart-bar"></i>
                <h3>${testName === 'pretest' ? 'Pre-test' : 'Post-test'} Results</h3>
            </div>
            
            <div class="results-content">
                <div class="score-display">
                    <div class="score-circle" style="--percentage: ${percentage}%">
                        <span class="score-value">${score}/${total}</span>
                        <span class="score-percentage">${percentage.toFixed(1)}%</span>
                    </div>
                </div>
                
                <div class="performance-info">
                    <h4>${performance.title}</h4>
                    <p>${performance.message}</p>
                    
                    <div class="performance-details">
                        <div class="detail-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Correct: ${score}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-times-circle"></i>
                            <span>Incorrect: ${total - score}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>Time: Just now</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${testName === 'pretest' ? `
            <div class="results-recommendation">
                <h5><i class="fas fa-lightbulb"></i> Recommendation:</h5>
                <p>Based on your score, we recommend focusing on: ${getRecommendations(percentage)}</p>
                <button class="action-btn" onclick="loadSection('theory')">
                    <i class="fas fa-book"></i> Review Theory
                </button>
            </div>
            ` : ''}
        </div>
    `;
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Get Performance Level
function getPerformanceLevel(percentage) {
    if (percentage >= 90) {
        return {
            class: 'excellent',
            title: 'Excellent!',
            message: 'You have a strong understanding of exact differential equations.'
        };
    } else if (percentage >= 70) {
        return {
            class: 'good',
            title: 'Very Good!',
            message: 'You understand the key concepts well.'
        };
    } else if (percentage >= 50) {
        return {
            class: 'average',
            title: 'Good Effort',
            message: 'Review the theory section to strengthen your understanding.'
        };
    } else {
        return {
            class: 'needs-improvement',
            title: 'Needs Improvement',
            message: 'Please revisit the theory and examples carefully.'
        };
    }
}

// Get Recommendations
function getRecommendations(percentage) {
    if (percentage >= 80) {
        return 'proceed directly to the simulation';
    } else if (percentage >= 60) {
        return 'theory section, then simulation';
    } else {
        return 'theory section thoroughly, then examples, then simulation';
    }
}

// Initialize Feedback Section
function initializeFeedback() {
    const feedbackForm = document.getElementById('feedback-form');
    const ratingStars = document.querySelectorAll('.rating-star');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', submitFeedback);
    }
    
    if (ratingStars.length > 0) {
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                setRating(rating);
            });
            
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                highlightStars(rating);
            });
        });
        
        document.querySelector('.rating').addEventListener('mouseleave', resetStarHighlight);
    }
}

// Set Rating
function setRating(rating) {
    const stars = document.querySelectorAll('.rating-star');
    const ratingInput = document.getElementById('rating-value');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
            star.classList.remove('hover');
        } else {
            star.classList.remove('active', 'hover');
        }
    });
    
    if (ratingInput) {
        ratingInput.value = rating;
    }
}

// Highlight Stars on Hover
function highlightStars(rating) {
    const stars = document.querySelectorAll('.rating-star');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('hover');
        } else {
            star.classList.remove('hover');
        }
    });
}

// Reset Star Highlight
function resetStarHighlight() {
    const stars = document.querySelectorAll('.rating-star');
    const ratingInput = document.getElementById('rating-value');
    const currentRating = ratingInput ? parseInt(ratingInput.value) : 0;
    
    stars.forEach((star, index) => {
        star.classList.remove('hover');
        if (index < currentRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Submit Feedback
function submitFeedback(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const rating = formData.get('rating');
    
    if (!rating || rating === '0') {
        showAlert('Please provide a rating.', 'warning');
        return;
    }
    
    // In a real app, send data to server
    showAlert('Thank you for your feedback! Your response has been recorded.', 'success');
    
    // Reset form
    form.reset();
    setRating(0);
}

// Initialize Contributors Section
function initializeContributors() {
    // Add any contributors-specific initialization here
    console.log('Contributors section initialized');
}

// Progress Tracking
function setupProgressTracker() {
    const sections = ['aim', 'theory', 'pretest', 'simulation', 'posttest', 'references', 'contributors', 'feedback'];
    
    // Update progress on section load
    window.addEventListener('sectionLoaded', (e) => {
        const sectionName = e.detail.section;
        updateProgress(sectionName);
    });
}

// Update Progress
function updateProgress(sectionName) {
    const sections = ['aim', 'theory', 'pretest', 'simulation', 'posttest', 'references', 'contributors', 'feedback'];
    const currentIndex = sections.indexOf(sectionName);
    
    if (currentIndex === -1) return;
    
    const progressPercentage = ((currentIndex + 1) / sections.length) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${currentIndex + 1}/${sections.length} Sections Completed`;
    }
    
    // Save progress
    saveProgress(sectionName, progressPercentage);
}

// User Info Setup
function setupUserInfo() {
    const userName = localStorage.getItem('virtualLabUserName') || 'Student';
    document.getElementById('userName').textContent = `Welcome, ${userName}`;
}

// Setup Event Listeners
function setupEventListeners() {
    // Previous/Next buttons
    document.getElementById('prevBtn').addEventListener('click', navigateToPrevious);
    document.getElementById('nextBtn').addEventListener('click', navigateToNext);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'ArrowLeft') navigateToPrevious();
        if (e.ctrlKey && e.key === 'ArrowRight') navigateToNext();
    });
}

// Navigate to Previous Section
function navigateToPrevious() {
    const sections = ['aim', 'theory', 'pretest', 'simulation', 'posttest', 'references', 'contributors', 'feedback'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        document.querySelector(`[data-section="${prevSection}"]`).click();
    }
}

// Navigate to Next Section
function navigateToNext() {
    const sections = ['aim', 'theory', 'pretest', 'simulation', 'posttest', 'references', 'contributors', 'feedback'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        document.querySelector(`[data-section="${nextSection}"]`).click();
    }
}

// Get Current Section
function getCurrentSection() {
    const activeItem = document.querySelector('.nav-item.active');
    return activeItem ? activeItem.getAttribute('data-section') : 'aim';
}

// Load Initial Section
function loadInitialSection() {
    const savedSection = localStorage.getItem('currentSection') || 'aim';
    document.querySelector(`[data-section="${savedSection}"]`).click();
}

// Save Current Section
function saveCurrentSection(sectionName) {
    localStorage.setItem('currentSection', sectionName);
}

// Save Progress
function saveProgress(sectionName, percentage) {
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    progress[sectionName] = {
        completed: true,
        timestamp: new Date().toISOString(),
        progressPercentage: percentage
    };
    localStorage.setItem('userProgress', JSON.stringify(progress));
}

// Load User Progress
function loadUserProgress() {
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    return progress;
}

// Save Test Results
function saveTestResults(testName, score, total) {
    const results = JSON.parse(localStorage.getItem('testResults') || '{}');
    results[testName] = {
        score: score,
        total: total,
        percentage: (score / total) * 100,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('testResults', JSON.stringify(results));
}

// Save to History
function saveToHistory(equation, steps) {
    const history = JSON.parse(localStorage.getItem('equationHistory') || '[]');
    
    history.unshift({
        equation: equation,
        steps: steps.length,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 items
    if (history.length > 10) {
        history.pop();
    }
    
    localStorage.setItem('equationHistory', JSON.stringify(history));
}

// Show Alert
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) existingAlert.remove();
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Get Alert Icon
function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Add Step Navigation
function addStepNavigation() {
    const stepCards = document.querySelectorAll('.step-card');
    
    stepCards.forEach((card, index) => {
        const navBtn = document.createElement('button');
        navBtn.className = 'step-nav-btn';
        navBtn.innerHTML = `<i class="fas fa-arrow-right"></i>`;
        navBtn.title = 'Next Step';
        
        if (index < stepCards.length - 1) {
            card.appendChild(navBtn);
            
            navBtn.addEventListener('click', () => {
                stepCards[index + 1].scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
}

// Export functions for HTML onclick handlers
window.solveExactDE = solveExactDE;
window.loadSection = loadSection;
window.showAlert = showAlert;
// Add these functions to your existing script.js

// Parse mathematical expression
function parseMathExpression(expr) {
    try {
        // Replace common mathematical notations
        expr = expr.replace(/\^/g, '**'); // Convert ^ to **
        expr = expr.replace(/sin\(/g, 'Math.sin(');
        expr = expr.replace(/cos\(/g, 'Math.cos(');
        expr = expr.replace(/tan\(/g, 'Math.tan(');
        expr = expr.replace(/exp\(/g, 'Math.exp(');
        expr = expr.replace(/ln\(/g, 'Math.log(');
        expr = expr.replace(/log\(/g, 'Math.log10(');
        expr = expr.replace(/e\b/g, 'Math.E');
        expr = expr.replace(/pi\b/g, 'Math.PI');
        
        // Ensure multiplication signs are explicit
        expr = expr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
        expr = expr.replace(/([a-zA-Z])(\d)/g, '$1*$2');
        expr = expr.replace(/([a-zA-Z])([a-zA-Z])/g, '$1*$2');
        
        return expr;
    } catch (error) {
        throw new Error('Error parsing mathematical expression: ' + error.message);
    }
}

// Compute partial derivative numerically
function computePartialDerivative(expr, variable, point = {x: 1, y: 1}) {
    try {
        const h = 0.0001; // Small step for numerical differentiation
        
        // Create functions for evaluation
        const f = (x, y) => {
            const evalExpr = expr
                .replace(/x/g, x)
                .replace(/y/g, y);
            return eval(evalExpr);
        };
        
        if (variable === 'y') {
            // Compute ∂f/∂y
            const f_x_y = f(point.x, point.y);
            const f_x_yh = f(point.x, point.y + h);
            return (f_x_yh - f_x_y) / h;
        } else {
            // Compute ∂f/∂x
            const f_x_y = f(point.x, point.y);
            const f_xh_y = f(point.x + h, point.y);
            return (f_xh_y - f_x_y) / h;
        }
    } catch (error) {
        throw new Error('Error computing partial derivative: ' + error.message);
    }
}

// Check if two expressions are equal (numerically)
function expressionsAreEqual(expr1, expr2, tolerance = 0.001) {
    try {
        // Test at several random points
        const testPoints = [
            {x: 1, y: 1},
            {x: 2, y: 3},
            {x: -1, y: 2},
            {x: 0.5, y: 0.5}
        ];
        
        for (const point of testPoints) {
            const val1 = evaluateExpression(expr1, point.x, point.y);
            const val2 = evaluateExpression(expr2, point.x, point.y);
            
            if (Math.abs(val1 - val2) > tolerance) {
                return false;
            }
        }
        
        return true;
    } catch (error) {
        return false;
    }
}

// Evaluate expression at given point
function evaluateExpression(expr, x, y) {
    try {
        const evalExpr = expr
            .replace(/x/g, x)
            .replace(/y/g, y);
        return eval(evalExpr);
    } catch (error) {
        throw new Error('Error evaluating expression: ' + error.message);
    }
}

// Integrate expression with respect to x
function integrateWithRespectToX(expr) {
    try {
        // This is a simplified integration for common expressions
        // In a real application, you would use a proper symbolic integration library
        
        const integrationRules = {
            'x': 'x**2/2',
            'x**2': 'x**3/3',
            'x**n': 'x**(n+1)/(n+1)',
            'y': 'x*y',
            'y**2': 'x*y**2',
            'sin(x)': '-cos(x)',
            'cos(x)': 'sin(x)',
            'exp(x)': 'exp(x)'
        };
        
        // Simple pattern matching for integration
        // This handles basic cases; for complex expressions, use math.js integration
        return math.integrate(math.parse(expr), 'x').toString();
    } catch (error) {
        throw new Error('Error integrating expression: ' + error.message);
    }
}

// Make solveExactDE available globally
window.solveExactDE = solveExactDE;
window.parseDifferentialEquation = parseDifferentialEquation;
window.solveExactDifferentialEquation = solveExactDifferentialEquation;