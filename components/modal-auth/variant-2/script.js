// ===== MODE TOGGLE =====
const modeToggle = document.querySelector('.mode-toggle');
const modeBtns = document.querySelectorAll('.mode-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        
        // Update active button
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Toggle slider
        if (mode === 'register') {
            modeToggle.classList.add('register-active');
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        } else {
            modeToggle.classList.remove('register-active');
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        }
    });
});

// ===== CAPS LOCK DETECTION =====
function detectCapsLock(inputId, alertId) {
    const input = document.getElementById(inputId);
    const alert = document.getElementById(alertId);
    
    if (!input || !alert) return;
    
    input.addEventListener('keyup', (e) => {
        const isCapsLock = e.getModifierState && e.getModifierState('CapsLock');
        alert.classList.toggle('show', isCapsLock);
    });
}

detectCapsLock('loginPassword', 'loginCaps');
detectCapsLock('registerPassword', 'registerCaps');

// ===== PASSWORD VISIBILITY TOGGLE =====
document.querySelectorAll('.eye-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        const icon = btn.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// ===== PASSWORD STRENGTH METER =====
const registerPassword = document.getElementById('registerPassword');
const strengthBars = document.querySelectorAll('.strength-bar');
const strengthLabel = document.getElementById('strengthLabel');

if (registerPassword) {
    registerPassword.addEventListener('input', () => {
        const password = registerPassword.value;
        const strength = checkPasswordStrength(password);
        
        // Reset bars
        strengthBars.forEach(bar => {
            bar.classList.remove('active', 'weak', 'medium', 'strong');
        });
        strengthLabel.classList.remove('weak', 'medium', 'strong');
        
        if (strength.level === 0) {
            strengthLabel.textContent = 'Enter password';
        } else if (strength.level === 1) {
            strengthBars[0].classList.add('active', 'weak');
            strengthLabel.classList.add('weak');
            strengthLabel.textContent = `Weak - ${strength.feedback}`;
        } else if (strength.level === 2) {
            strengthBars[0].classList.add('active', 'medium');
            strengthBars[1].classList.add('active', 'medium');
            strengthLabel.classList.add('medium');
            strengthLabel.textContent = 'Fair - Add more variety';
        } else if (strength.level === 3) {
            strengthBars[0].classList.add('active', 'medium');
            strengthBars[1].classList.add('active', 'medium');
            strengthBars[2].classList.add('active', 'medium');
            strengthLabel.classList.add('medium');
            strengthLabel.textContent = 'Good - Almost there!';
        } else {
            strengthBars.forEach(bar => bar.classList.add('active', 'strong'));
            strengthLabel.classList.add('strong');
            strengthLabel.textContent = 'Strong - Perfect!';
        }
    });
}

function checkPasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (!password) return { level: 0, feedback: '' };
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    else feedback.push('12+ chars');
    
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    else feedback.push('upper & lower case');
    
    if (/\d/.test(password)) score++;
    else feedback.push('numbers');
    
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else feedback.push('symbols');
    
    return {
        level: Math.min(score, 4),
        feedback: feedback.join(', ')
    };
}

// ===== EMAIL VALIDATION =====
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setupRealtimeValidation(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('blur', () => {
        const value = input.value.trim();
        
        if (input.type === 'email' && value) {
            if (validateEmail(value)) {
                input.classList.add('success');
                input.classList.remove('error');
            } else {
                input.classList.add('error');
                input.classList.remove('success');
                showError(inputId, 'Invalid email format');
            }
        } else if (input.type === 'text' && value) {
            if (value.length >= 2) {
                input.classList.add('success');
                input.classList.remove('error');
            } else {
                input.classList.add('error');
                showError(inputId, 'Too short');
            }
        }
    });
}

setupRealtimeValidation('loginEmail');
setupRealtimeValidation('registerEmail');
setupRealtimeValidation('firstName');
setupRealtimeValidation('lastName');

// ===== NAME FORMATTING =====
['firstName', 'lastName'].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
        if (input.value.length === 1) {
            input.value = input.value.toUpperCase();
        }
    });
});

// ===== PASSWORD MATCH =====
const confirmPassword = document.getElementById('confirmPassword');
if (confirmPassword && registerPassword) {
    confirmPassword.addEventListener('input', () => {
        if (confirmPassword.value && confirmPassword.value !== registerPassword.value) {
            confirmPassword.classList.add('error');
            confirmPassword.classList.remove('success');
            showError('confirmPassword', 'Passwords do not match');
        } else if (confirmPassword.value) {
            confirmPassword.classList.remove('error');
            confirmPassword.classList.add('success');
            hideError('confirmPassword');
        }
    });
}

// ===== FORM SUBMISSIONS =====
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const submitBtn = loginForm.querySelector('.glass-submit');
    
    if (!validateEmail(email)) {
        showError('loginEmail', 'Invalid email address');
        return;
    }
    
    if (password.length < 6) {
        showError('loginPassword', 'Password too short');
        return;
    }
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    
    showSuccess('Welcome Back!', 'You have successfully signed in.');
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const agree = document.getElementById('agreeTerms').checked;
    const submitBtn = registerForm.querySelector('.glass-submit');
    
    let valid = true;
    
    if (firstName.length < 2) {
        showError('firstName', 'First name required');
        valid = false;
    }
    
    if (lastName.length < 2) {
        showError('lastName', 'Last name required');
        valid = false;
    }
    
    if (!validateEmail(email)) {
        showError('registerEmail', 'Invalid email');
        valid = false;
    }
    
    const strength = checkPasswordStrength(password);
    if (strength.level < 3) {
        showError('registerPassword', 'Password not strong enough');
        valid = false;
    }
    
    if (password !== confirm) {
        showError('confirmPassword', 'Passwords must match');
        valid = false;
    }
    
    if (!agree) {
        alert('Please accept the terms');
        return;
    }
    
    if (!valid) return;
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    
    showSuccess('Account Created!', `Welcome aboard, ${firstName}! Your account is ready.`);
});

// ===== HELPER FUNCTIONS =====
function showError(inputId, message) {
    const errorSpan = document.querySelector(`[data-error="${inputId}"]`);
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.add('show');
        setTimeout(() => errorSpan.classList.remove('show'), 4000);
    }
}

function hideError(inputId) {
    const errorSpan = document.querySelector(`[data-error="${inputId}"]`);
    if (errorSpan) {
        errorSpan.classList.remove('show');
    }
}

function showSuccess(title, message) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMsg').textContent = message;
    document.getElementById('successModal').classList.add('show');
}

document.getElementById('closeSuccess').addEventListener('click', () => {
    document.getElementById('successModal').classList.remove('show');
    loginForm.reset();
    registerForm.reset();
    document.querySelectorAll('.error, .success').forEach(el => {
        el.classList.remove('error', 'success');
    });
});

console.log('💎 Glassmorphism Auth - Variant 2 loaded!');
