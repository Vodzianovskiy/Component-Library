// ===== MODE SWITCHING =====
const switchBtns = document.querySelectorAll('.switch-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        
        switchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (mode === 'login') {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    });
});

// ===== CAPS LOCK DETECTION =====
function capsLockDetection(inputId, indicatorId) {
    const input = document.getElementById(inputId);
    const indicator = document.getElementById(indicatorId);
    
    if (!input || !indicator) return;
    
    input.addEventListener('keyup', (e) => {
        const isCapsLock = e.getModifierState && e.getModifierState('CapsLock');
        indicator.classList.toggle('show', isCapsLock);
    });
}

capsLockDetection('loginPassword', 'loginCapsIndicator');
capsLockDetection('registerPassword', 'registerCapsIndicator');

// ===== PASSWORD VISIBILITY =====
document.querySelectorAll('.password-toggle').forEach(btn => {
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

// ===== PASSWORD STRENGTH =====
const registerPassword = document.getElementById('registerPassword');
const strengthProgress = document.getElementById('strengthProgress');
const strengthLabel = document.getElementById('strengthLabel');
const strengthPercentage = document.getElementById('strengthPercentage');

if (registerPassword) {
    registerPassword.addEventListener('input', () => {
        const password = registerPassword.value;
        const result = evaluatePasswordStrength(password);
        
        // Remove classes
        strengthProgress.classList.remove('weak', 'fair', 'good', 'strong');
        strengthLabel.classList.remove('weak', 'fair', 'good', 'strong');
        
        if (result.level === 0) {
            strengthLabel.textContent = 'Password Strength';
            strengthPercentage.textContent = '0%';
        } else if (result.level === 1) {
            strengthProgress.classList.add('weak');
            strengthLabel.classList.add('weak');
            strengthLabel.textContent = `Weak - ${result.feedback}`;
            strengthPercentage.textContent = '25%';
        } else if (result.level === 2) {
            strengthProgress.classList.add('fair');
            strengthLabel.classList.add('fair');
            strengthLabel.textContent = 'Fair - Add more complexity';
            strengthPercentage.textContent = '50%';
        } else if (result.level === 3) {
            strengthProgress.classList.add('good');
            strengthLabel.classList.add('good');
            strengthLabel.textContent = 'Good - Almost perfect!';
            strengthPercentage.textContent = '75%';
        } else {
            strengthProgress.classList.add('strong');
            strengthLabel.classList.add('strong');
            strengthLabel.textContent = 'Strong - Excellent password!';
            strengthPercentage.textContent = '100%';
        }
    });
}

function evaluatePasswordStrength(pwd) {
    let score = 0;
    let feedback = [];
    
    if (!pwd) return { level: 0, feedback: '' };
    
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    else feedback.push('12+ chars');
    
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    else feedback.push('mix case');
    
    if (/\d/.test(pwd)) score++;
    else feedback.push('numbers');
    
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    else feedback.push('symbols');
    
    return {
        level: Math.min(score, 4),
        feedback: feedback.join(', ')
    };
}

// ===== EMAIL VALIDATION =====
function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setupInputValidation(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('blur', () => {
        const value = input.value.trim();
        
        if (input.type === 'email' && value) {
            if (isEmailValid(value)) {
                input.classList.add('success');
                input.classList.remove('error');
                hideFieldError(inputId);
            } else {
                input.classList.add('error');
                input.classList.remove('success');
                showFieldError(inputId, 'Invalid email address');
            }
        } else if (input.type === 'text' && value) {
            if (value.length >= 2) {
                input.classList.add('success');
                input.classList.remove('error');
                hideFieldError(inputId);
            } else {
                input.classList.add('error');
                showFieldError(inputId, 'Too short');
            }
        }
    });
}

setupInputValidation('loginEmail');
setupInputValidation('registerEmail');
setupInputValidation('firstName');
setupInputValidation('lastName');

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
            showFieldError('confirmPassword', 'Passwords do not match');
        } else if (confirmPassword.value) {
            confirmPassword.classList.remove('error');
            confirmPassword.classList.add('success');
            hideFieldError('confirmPassword');
        }
    });
}

// ===== LOGIN SUBMISSION =====
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = loginForm.querySelector('.dark-button');
    
    if (!isEmailValid(email)) {
        showFieldError('loginEmail', 'Invalid email');
        return;
    }
    
    if (password.length < 6) {
        showFieldError('loginPassword', 'Password too short');
        return;
    }
    
    btn.classList.add('loading');
    btn.disabled = true;
    
    await new Promise(r => setTimeout(r, 1500));
    
    btn.classList.remove('loading');
    btn.disabled = false;
    
    showSuccessModal('Welcome Back!', 'You have successfully signed in to your account.');
});

// ===== REGISTER SUBMISSION =====
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const agree = document.getElementById('agreeTerms').checked;
    const btn = registerForm.querySelector('.dark-button');
    
    let isValid = true;
    
    if (firstName.length < 2) {
        showFieldError('firstName', 'First name required');
        isValid = false;
    }
    
    if (lastName.length < 2) {
        showFieldError('lastName', 'Last name required');
        isValid = false;
    }
    
    if (!isEmailValid(email)) {
        showFieldError('registerEmail', 'Invalid email');
        isValid = false;
    }
    
    const strength = evaluatePasswordStrength(password);
    if (strength.level < 3) {
        showFieldError('registerPassword', 'Password not strong enough');
        isValid = false;
    }
    
    if (password !== confirm) {
        showFieldError('confirmPassword', 'Passwords must match');
        isValid = false;
    }
    
    if (!agree) {
        alert('Please accept the terms and conditions');
        return;
    }
    
    if (!isValid) return;
    
    btn.classList.add('loading');
    btn.disabled = true;
    
    await new Promise(r => setTimeout(r, 2000));
    
    btn.classList.remove('loading');
    btn.disabled = false;
    
    showSuccessModal('Account Created!', `Welcome ${firstName}! Your account has been successfully created.`);
});

// ===== HELPER FUNCTIONS =====
function showFieldError(inputId, message) {
    const errorSpan = document.querySelector(`[data-error="${inputId}"]`);
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.add('show');
        setTimeout(() => errorSpan.classList.remove('show'), 4000);
    }
}

function hideFieldError(inputId) {
    const errorSpan = document.querySelector(`[data-error="${inputId}"]`);
    if (errorSpan) {
        errorSpan.classList.remove('show');
    }
}

function showSuccessModal(title, message) {
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMsg').textContent = message;
    document.getElementById('successBackdrop').classList.add('show');
}

document.getElementById('closeSuccess').addEventListener('click', () => {
    document.getElementById('successBackdrop').classList.remove('show');
    loginForm.reset();
    registerForm.reset();
    document.querySelectorAll('.error, .success').forEach(el => {
        el.classList.remove('error', 'success');
    });
});

console.log('🌙 Dark Mode Auth - Variant 4 loaded!');
