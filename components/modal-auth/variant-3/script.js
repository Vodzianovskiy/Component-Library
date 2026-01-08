// ===== TAB SWITCHING =====
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

tabLogin.addEventListener('change', () => {
    if (tabLogin.checked) {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    }
});

tabRegister.addEventListener('change', () => {
    if (tabRegister.checked) {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
});

// ===== CAPS LOCK DETECTION =====
function setupCapsDetection(inputId, noticeId) {
    const input = document.getElementById(inputId);
    const notice = document.getElementById(noticeId);
    
    if (!input || !notice) return;
    
    input.addEventListener('keyup', (e) => {
        const caps = e.getModifierState && e.getModifierState('CapsLock');
        notice.classList.toggle('show', caps);
    });
}

setupCapsDetection('loginPassword', 'loginCapsNotice');
setupCapsDetection('registerPassword', 'registerCapsNotice');

// ===== PASSWORD TOGGLE =====
document.querySelectorAll('.neu-eye').forEach(btn => {
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
const strengthDots = document.querySelectorAll('.dot');
const strengthText = document.getElementById('strengthText');

if (registerPassword) {
    registerPassword.addEventListener('input', () => {
        const password = registerPassword.value;
        const strength = calculateStrength(password);
        
        // Reset
        strengthDots.forEach(dot => {
            dot.classList.remove('active', 'weak', 'medium', 'strong');
        });
        strengthText.classList.remove('weak', 'medium', 'strong');
        
        if (strength.level === 0) {
            strengthText.textContent = 'Password Strength';
        } else if (strength.level === 1) {
            strengthDots[0].classList.add('active', 'weak');
            strengthText.classList.add('weak');
            strengthText.textContent = `Weak - ${strength.message}`;
        } else if (strength.level === 2) {
            strengthDots[0].classList.add('active', 'medium');
            strengthDots[1].classList.add('active', 'medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'Fair - Getting better';
        } else if (strength.level === 3) {
            strengthDots[0].classList.add('active', 'medium');
            strengthDots[1].classList.add('active', 'medium');
            strengthDots[2].classList.add('active', 'medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'Good - Almost there!';
        } else {
            strengthDots.forEach(dot => dot.classList.add('active', 'strong'));
            strengthText.classList.add('strong');
            strengthText.textContent = 'Strong - Excellent!';
        }
    });
}

function calculateStrength(pwd) {
    let score = 0;
    let messages = [];
    
    if (!pwd) return { level: 0, message: '' };
    
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    else messages.push('12+ chars');
    
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    else messages.push('mix case');
    
    if (/\d/.test(pwd)) score++;
    else messages.push('add numbers');
    
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    else messages.push('add symbols');
    
    return {
        level: Math.min(score, 4),
        message: messages.join(', ')
    };
}

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateInput(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('blur', () => {
        const value = input.value.trim();
        
        if (input.type === 'email' && value) {
            if (isValidEmail(value)) {
                input.classList.add('success');
                input.classList.remove('error');
                hideError(inputId);
            } else {
                input.classList.add('error');
                input.classList.remove('success');
                showError(inputId, 'Invalid email format');
            }
        } else if (input.type === 'text' && value) {
            if (value.length >= 2) {
                input.classList.add('success');
                input.classList.remove('error');
                hideError(inputId);
            } else {
                input.classList.add('error');
                showError(inputId, 'Too short');
            }
        }
    });
}

validateInput('loginEmail');
validateInput('registerEmail');
validateInput('firstName');
validateInput('lastName');

// ===== NAME AUTO-FORMAT =====
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

// ===== FORM SUBMISSION - LOGIN =====
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = loginForm.querySelector('.neu-button');
    
    if (!isValidEmail(email)) {
        showError('loginEmail', 'Invalid email');
        return;
    }
    
    if (password.length < 6) {
        showError('loginPassword', 'Password too short');
        return;
    }
    
    btn.classList.add('loading');
    btn.disabled = true;
    
    await new Promise(r => setTimeout(r, 1500));
    
    btn.classList.remove('loading');
    btn.disabled = false;
    
    showSuccess('Welcome Back!', 'You have successfully signed in.');
});

// ===== FORM SUBMISSION - REGISTER =====
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const agree = document.getElementById('agreeTerms').checked;
    const btn = registerForm.querySelector('.neu-button');
    
    let valid = true;
    
    if (firstName.length < 2) {
        showError('firstName', 'First name required');
        valid = false;
    }
    
    if (lastName.length < 2) {
        showError('lastName', 'Last name required');
        valid = false;
    }
    
    if (!isValidEmail(email)) {
        showError('registerEmail', 'Invalid email');
        valid = false;
    }
    
    const strength = calculateStrength(password);
    if (strength.level < 3) {
        showError('registerPassword', 'Password not strong enough');
        valid = false;
    }
    
    if (password !== confirm) {
        showError('confirmPassword', 'Passwords must match');
        valid = false;
    }
    
    if (!agree) {
        alert('Please accept terms and conditions');
        return;
    }
    
    if (!valid) return;
    
    btn.classList.add('loading');
    btn.disabled = true;
    
    await new Promise(r => setTimeout(r, 2000));
    
    btn.classList.remove('loading');
    btn.disabled = false;
    
    showSuccess('Account Created!', `Welcome ${firstName}! Your account is ready.`);
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
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successOverlay').classList.add('show');
}

document.getElementById('successClose').addEventListener('click', () => {
    document.getElementById('successOverlay').classList.remove('show');
    loginForm.reset();
    registerForm.reset();
    document.querySelectorAll('.error, .success').forEach(el => {
        el.classList.remove('error', 'success');
    });
});

console.log('🎨 Neumorphism Auth - Variant 3 loaded!');
