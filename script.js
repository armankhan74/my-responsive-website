// Project section interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Future interactive features can be added here
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Typing effect for the main section
const texts = ['a Web Developer', 'a UI Designer', 'a Problem Solver'];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

(function type() {
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);

    document.querySelector('.typed-text').textContent = letter;
    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000); // Pause at the end of word
    } else {
        setTimeout(type, 100); // Typing speed
    }
})();

// Modal functionality
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const closeButtons = document.querySelectorAll('.close-modal');

// Open modals
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Close modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (event.target === signupModal) {
        signupModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Form validation and submission
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// API base URL
const API_URL = 'http://localhost:5000/api/auth';

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Close modal and update UI
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Update UI to show logged in state
        updateAuthUI(true, data.user.name);
        
        // Show success message
        showNotification('Login successful!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// Handle signup form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Close modal and update UI
        signupModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Update UI to show logged in state
        updateAuthUI(true, data.user.name);
        
        // Show success message
        showNotification('Account created successfully!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// Update UI based on authentication state
function updateAuthUI(isLoggedIn, userName = '') {
    const authButtons = document.querySelector('.auth-buttons');
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <div class="user-profile">
                <span>Welcome, ${userName}</span>
                <button id="logout-btn" class="auth-btn">Logout</button>
            </div>
        `;
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    } else {
        authButtons.innerHTML = `
            <button id="login-btn" class="auth-btn">Login</button>
            <button id="signup-btn" class="auth-btn">Sign Up</button>
        `;
        // Reattach event listeners
        document.getElementById('login-btn').addEventListener('click', () => {
            loginModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        document.getElementById('signup-btn').addEventListener('click', () => {
            signupModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI(false);
    showNotification('Logged out successfully', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user) {
        updateAuthUI(true, user.name);
    }
}

// Social login buttons
document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = button.classList.contains('google') ? 'Google' : 'Facebook';
        console.log(`${platform} login clicked`);
        // Here you would implement the social login functionality
    });
});

// Add mobile menu button to HTML
document.querySelector('.navbar').insertAdjacentHTML('afterbegin', `
    <button class="menu-btn">
        <i class="fas fa-bars"></i>
    </button>
`);

// Mobile menu functionality
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    // Toggle menu icon
    const icon = menuBtn.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && 
        !menuBtn.contains(e.target) && 
        navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
        menuBtn.querySelector('i').classList.remove('fa-times');
        menuBtn.querySelector('i').classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
            menuBtn.querySelector('i').classList.remove('fa-times');
            menuBtn.querySelector('i').classList.add('fa-bars');
        }
    });
});

// Close mobile menu when window is resized above mobile breakpoint
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
        menuBtn.querySelector('i').classList.remove('fa-times');
        menuBtn.querySelector('i').classList.add('fa-bars');
    }
}); 