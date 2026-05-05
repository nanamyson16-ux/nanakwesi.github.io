// Typewriter Effect
const typewriterEl = document.getElementById('typewriter');
const words = ['design', 'build', 'craft', 'create', 'shape'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => { isDeleting = true; typeWriter(); }, 1800);
        return;
    }
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
    }
    setTimeout(typeWriter, isDeleting ? 60 : 100);
}
setTimeout(typeWriter, 800);

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-link');

function setActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

// Scroll Event Listeners
const header = document.getElementById('header');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    setActiveNav();
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    revealOnScroll();
});

// Back to Top Button
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.about-text, .about-image, .project-card, .skill-category, .contact-info, .contact-form');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

revealOnScroll();

// Download CV Functionality
const downloadCVBtn = document.getElementById('download-cv');
if (downloadCVBtn) {
    downloadCVBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const blob = new Blob(['Placeholder CV Content'], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'CV_Portfolio.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    });
}

// Contact Form Validation and Submission
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let isValid = true;
    if (name === '') { showError('name', 'Name is required'); isValid = false; }
    if (email === '') { showError('email', 'Email is required'); isValid = false; }
    else if (!isValidEmail(email)) { showError('email', 'Please enter a valid email address'); isValid = false; }
    if (message === '') { showError('message', 'Message is required'); isValid = false; }
    else if (message.length < 10) { showError('message', 'Message must be at least 10 characters long'); isValid = false; }
    if (!isValid) return;
    try {
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        await new Promise(resolve => setTimeout(resolve, 1500));
        const isSuccess = Math.random() > 0.2;
        if (isSuccess) {
            showFormMessage('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.');
            contactForm.reset();
        } else {
            showFormMessage('error', 'Oops! Something went wrong. Please try again later.');
        }
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    } catch (error) {
        showFormMessage('error', 'An error occurred. Please try again.');
    }
});

function showError(fieldName, message) {
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    input.classList.add('error');
    errorElement.textContent = message;
}

function clearErrors() {
    const inputs = contactForm.querySelectorAll('.form-input');
    const errors = contactForm.querySelectorAll('.form-error');
    inputs.forEach(input => input.classList.remove('error'));
    errors.forEach(error => error.textContent = '');
    formMessage.className = 'form-message';
    formMessage.textContent = '';
}

function showFormMessage(type, message) {
    formMessage.className = `form-message ${type}`;
    formMessage.textContent = message;
    setTimeout(() => {
        formMessage.className = 'form-message';
        formMessage.textContent = '';
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

document.getElementById('name').addEventListener('blur', function() {
    if (this.value.trim() === '') showError('name', 'Name is required');
});

document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    if (email === '') showError('email', 'Email is required');
    else if (!isValidEmail(email)) showError('email', 'Please enter a valid email address');
});

document.getElementById('message').addEventListener('blur', function() {
    const message = this.value.trim();
    if (message === '') showError('message', 'Message is required');
    else if (message.length < 10) showError('message', 'Message must be at least 10 characters long');
});

contactForm.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            this.classList.remove('error');
            const errorElement = document.getElementById(`${this.id}-error`);
            if (errorElement) errorElement.textContent = '';
        }
    });
});

contactForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') e.preventDefault();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(function(link) {
        const currentRel = link.getAttribute('rel');
        if (!currentRel) {
            link.setAttribute('rel', 'noopener noreferrer');
        } else if (!currentRel.includes('noopener') || !currentRel.includes('noreferrer')) {
            const relValues = currentRel.split(' ');
            if (!relValues.includes('noopener')) relValues.push('noopener');
            if (!relValues.includes('noreferrer')) relValues.push('noreferrer');
            link.setAttribute('rel', relValues.join(' '));
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('mailto:')) {
            console.warn('Invalid email link format detected:', link);
        } else {
            const emailPart = href.replace('mailto:', '');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailPart)) console.warn('Invalid email format in mailto link:', href);
        }
    });

    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('tel:')) {
            console.warn('Invalid phone link format detected:', link);
        } else {
            const phonePart = href.replace('tel:', '');
            if (!phonePart.startsWith('+')) console.warn('Phone link missing international code (+):', href);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const cvLinks = document.querySelectorAll('a[href*="Nana_Kwesi_Annan-Dadzie_CV.pdf"]');
    cvLinks.forEach(function(link) {
        if (!link.getAttribute('target')) link.setAttribute('target', '_blank');
        if (!link.getAttribute('rel')) link.setAttribute('rel', 'noopener noreferrer');
        let isClicking = false;
        link.addEventListener('click', function(e) {
            if (isClicking) { e.preventDefault(); return false; }
            isClicking = true;
            setTimeout(function() { isClicking = false; }, 1000);
        });
    });
});