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

    form.addEventListener('submit', (e) => {
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

        // Construct mailto link
        const mailtoLink = `mailto:thusharkanth2002@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        window.location.href = mailtoLink;

        statusEl.textContent = 'Opening your email client... You can also email me directly at thusharkanth2002@gmail.com';
        statusEl.className = 'form-status form-status--success';

        form.reset();
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
