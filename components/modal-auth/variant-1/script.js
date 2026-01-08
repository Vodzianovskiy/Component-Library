// ===== GLOBAL VARIABLES =====
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tabs = document.querySelectorAll('.tab');
const successOverlay = document.getElementById('successOverlay');

// ===== TAB SWITCHING =====
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Switch forms
        if (targetTab === 'login') {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    });
});

// ===== CAPS LOCK DETECTION =====
function setupCapsLockDetection(inputId, warningId) {
    const input = document.getElementById(inputId);
    const warning = document.getElementById(warningId);
    
    if (!input || !warning) return;
    
    input.addEventListener('keyup', (e) => {
        const capsLockOn = e.getModifierState && e.getModifierState('CapsLock');
        
        if (capsLockOn) {
            warning.classList.add('show');
        } else {
            warning.classList.remove('show');
        }
    });
}

setupCapsLockDetection('loginPassword', 'loginCapsWarning');
setupCapsLockDetection('registerPassword', 'registerCapsWarning');

// ===== PASSWORD VISIBILITY TOGGLE =====
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        const icon = btn.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// ===== PASSWORD STRENGTH METER =====
const registerPassword = document.getElementById('registerPassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

if (registerPassword) {
    registerPassword.addEventListener('input', () => {
        const password = registerPassword.value;
        const strength = calculatePasswordStrength(password);
        
        // Remove all classes
        strengthFill.classList.remove('weak', 'medium', 'strong');
        strengthText.classList.remove('weak', 'medium', 'strong');
        
        // Add appropriate class
        if (strength.score === 0) {
            strengthText.textContent = 'Password Strength';
        } else if (strength.score <= 2) {
            strengthFill.classList.add('weak');
            strengthText.classList.add('weak');
            strengthText.textContent = `Weak - ${strength.feedback}`;
        } else if (strength.score === 3) {
            strengthFill.classList.add('medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'Medium - Good password';
        } else {
            strengthFill.classList.add('strong');
            strengthText.classList.add('strong');
            strengthText.textContent = 'Strong - Excellent password!';
        }
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (!password) return { score: 0, feedback: '' };
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    else feedback.push('Use 12+ characters');
    
    // Lowercase check
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Add lowercase');
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Add uppercase');
    
    // Number check
    if (/\d/.test(password)) score++;
    else feedback.push('Add numbers');
    
    // Special character check
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else feedback.push('Add symbols');
    
    return {
        score: Math.min(score, 4),
        feedback: feedback.join(', ')
    };
}

// ===== REAL-TIME EMAIL VALIDATION =====
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setupEmailValidation(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('blur', () => {
        const email = input.value.trim();
        const errorSpan = document.querySelector(`[data-error="${inputId}"]`);
        
        if (email && !validateEmail(email)) {
            input.classList.add('error');
            input.classList.remove('success');
            if (errorSpan) {
                errorSpan.textContent = 'Please enter a valid email address';
                errorSpan.classList.add('show');
            }
        } else if (email) {
            input.classList.remove('error');
            input.classList.add('success');
            if (errorSpan) {
                errorSpan.classList.remove('show');
            }
        }
    });
}

setupEmailValidation('loginEmail');
setupEmailValidation('registerEmail');

// ===== REAL-TIME NAME VALIDATION =====
function setupNameValidation(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('input', () => {
        // Remove numbers and special characters
        input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
        
        // Capitalize first letter
        if (input.value.length === 1) {
            input.value = input.value.toUpperCase();
        }
    });
    
    input.addEventListener('blur', () => {
        const value = input.value.trim();
        const errorSpan = document.querySelector(`[data-error="${inputId}"]`);
        
        if (value.length < 2) {
            input.classList.add('error');
            if (errorSpan) {
                errorSpan.textContent = 'Name must be at least 2 characters';
                errorSpan.classList.add('show');
            }
        } else {
            input.classList.remove('error');
            input.classList.add('success');
            if (errorSpan) {
                errorSpan.classList.remove('show');
            }
        }
    });
}

setupNameValidation('firstName');
setupNameValidation('lastName');

// ===== PASSWORD MATCH VALIDATION =====
const confirmPassword = document.getElementById('confirmPassword');
if (confirmPassword && registerPassword) {
    confirmPassword.addEventListener('input', () => {
        const errorSpan = document.querySelector('[data-error="confirmPassword"]');
        
        if (confirmPassword.value && confirmPassword.value !== registerPassword.value) {
            confirmPassword.classList.add('error');
            confirmPassword.classList.remove('success');
            if (errorSpan) {
                errorSpan.textContent = 'Passwords do not match';
                errorSpan.classList.add('show');
            }
        } else if (confirmPassword.value) {
            confirmPassword.classList.remove('error');
            confirmPassword.classList.add('success');
            if (errorSpan) {
                errorSpan.classList.remove('show');
            }
        }
    });
}

// ===== LOGIN FORM SUBMISSION =====
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const submitBtn = loginForm.querySelector('.submit-btn');
    
    // Validate
    if (!validateEmail(email)) {
        showError('loginEmail', 'Please enter a valid email');
        return;
    }
    
    if (password.length < 6) {
        showError('loginPassword', 'Password must be at least 6 characters');
        return;
    }
    
    // Show loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Hide loading
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    
    // Show success
    showSuccess('Welcome Back!', 'You have successfully logged in.');
});

// ===== REGISTER FORM SUBMISSION =====
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const termsAccept = document.getElementById('termsAccept').checked;
    const submitBtn = registerForm.querySelector('.submit-btn');
    
    let isValid = true;
    
    // Validate first name
    if (firstName.length < 2) {
        showError('firstName', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate last name
    if (lastName.length < 2) {
        showError('lastName', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!validateEmail(email)) {
        showError('registerEmail', 'Please enter a valid email');
        isValid = false;
    }
    
    // Validate password strength
    const strength = calculatePasswordStrength(password);
    if (strength.score < 3) {
        showError('registerPassword', 'Please use a stronger password');
        isValid = false;
    }
    
    // Validate password match
    if (password !== confirm) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Validate terms
    if (!termsAccept) {
        showError('termsAccept', 'You must accept the terms and conditions');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Hide loading
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    
    // Show success
    showSuccess('Account Created!', `Welcome ${firstName}! Your account has been created successfully.`);
});

// ===== HELPER FUNCTIONS =====
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.querySelector(`[data-error="${inputId}"]`);
    
    if (input && input.type !== 'checkbox') {
        input.classList.add('error');
        input.classList.remove('success');
    }
    
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.add('show');
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorSpan) errorSpan.classList.remove('show');
    }, 5000);
}

function showSuccess(title, message) {
    const successTitle = document.getElementById('successTitle');
    const successMessage = document.getElementById('successMessage');
    
    if (successTitle) successTitle.textContent = title;
    if (successMessage) successMessage.textContent = message;
    
    successOverlay.classList.add('show');
}

// ===== SUCCESS BUTTON =====
document.getElementById('successBtn').addEventListener('click', () => {
    successOverlay.classList.remove('show');
    // Reset forms
    loginForm.reset();
    registerForm.reset();
    // Remove all validation classes
    document.querySelectorAll('.error, .success').forEach(el => {
        el.classList.remove('error', 'success');
    });
});

console.log('✅ Professional Auth Form - Variant 1 loaded successfully!');
