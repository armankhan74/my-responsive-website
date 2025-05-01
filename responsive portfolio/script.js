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

// Initialize the tour
const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
        classes: 'shepherd-theme-custom',
        scrollTo: true,
        cancelIcon: {
            enabled: true
        }
    }
});

// Add tour steps
tour.addStep({
    id: 'welcome',
    text: 'Welcome to my portfolio! Let me show you around.',
    attachTo: {
        element: '.logo',
        on: 'bottom'
    },
    buttons: [
        {
            text: 'Next',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'navigation',
    text: 'Use these navigation links to explore different sections of my portfolio.',
    attachTo: {
        element: '.nav-links',
        on: 'bottom'
    },
    buttons: [
        {
            text: 'Back',
            action: tour.back
        },
        {
            text: 'Next',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'search',
    text: 'Looking for something specific? Use the search bar to find it quickly.',
    attachTo: {
        element: '.search-bar',
        on: 'bottom'
    },
    buttons: [
        {
            text: 'Back',
            action: tour.back
        },
        {
            text: 'Next',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'projects',
    text: 'Here you can explore my latest projects and see my work in action.',
    attachTo: {
        element: '.projects',
        on: 'top'
    },
    buttons: [
        {
            text: 'Back',
            action: tour.back
        },
        {
            text: 'Next',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'about',
    text: 'Learn more about me, my skills, and my experience in the About section.',
    attachTo: {
        element: '.about',
        on: 'top'
    },
    buttons: [
        {
            text: 'Back',
            action: tour.back
        },
        {
            text: 'Next',
            action: tour.next
        }
    ]
});

tour.addStep({
    id: 'contact',
    text: 'Feel free to reach out to me through the contact information in the footer.',
    attachTo: {
        element: '.footer',
        on: 'top'
    },
    buttons: [
        {
            text: 'Back',
            action: tour.back
        },
        {
            text: 'Finish',
            action: tour.complete
        }
    ]
});

// Start tour when button is clicked
document.getElementById('start-tour').addEventListener('click', () => {
    tour.start();
});

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