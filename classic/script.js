/* ========================================
   Portfolio Website - Main JavaScript
   Pure vanilla JS, no dependencies
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initActiveNavLinks();
    initProjectFilters();
    initContactForm();
    initScrollToTop();
});

/* ----------------------------------------
   Navigation
   ---------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.navbar__link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    }, { passive: true });

    // Hamburger toggle
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('navbar__menu--open');
        navToggle.classList.toggle('navbar__toggle--active');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('navbar__menu--open');
            navToggle.classList.remove('navbar__toggle--active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('navbar__menu--open');
            navToggle.classList.remove('navbar__toggle--active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/* ----------------------------------------
   Scroll Animations (Intersection Observer)
   ---------------------------------------- */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ----------------------------------------
   Active Nav Link Highlighting
   ---------------------------------------- */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('navbar__link--active',
                        link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

/* ----------------------------------------
   Project Filtering
   ---------------------------------------- */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
            btn.classList.add('filter-btn--active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const shouldShow = filter === 'all' || card.dataset.category === filter;

                if (shouldShow) {
                    card.style.display = 'flex';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ----------------------------------------
   Contact Form
   ---------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const subject = form.querySelector('#subject').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !subject || !message) {
            statusEl.textContent = 'Please fill in all fields.';
            statusEl.className = 'form-status form-status--error';
            return;
        }

        // Disable button while sending
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        statusEl.textContent = 'Sending your message...';
        statusEl.className = 'form-status';

        try {
            const formData = new FormData(form);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                statusEl.textContent = 'Message sent successfully! I will get back to you soon.';
                statusEl.className = 'form-status form-status--success';
                form.reset();
            } else {
                statusEl.textContent = (data.message || 'Something went wrong. Please try again.');
                statusEl.className = 'form-status form-status--error';
            }
        } catch (error) {
            statusEl.textContent = 'Network error. Please try again later.';
            statusEl.className = 'form-status form-status--error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
        }
    });
}

/* ----------------------------------------
   Scroll to Top
   ---------------------------------------- */
function initScrollToTop() {
    const btn = document.getElementById('scroll-top');

    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('scroll-top--visible');
        } else {
            btn.classList.remove('scroll-top--visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
