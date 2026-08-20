(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    const currentYearEl = document.getElementById('current-year');
    const resumeBtn = document.getElementById('resume-download-btn');

    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    function onScroll() {
        const scrollY = window.scrollY;

        if (navbar) {
            if (scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        updateActiveNavLink();
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    onScroll();

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 120;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');

            if (!correspondingLink) return;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                });
                correspondingLink.classList.add('active');
            }
        });
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            const expanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = link.getAttribute('href');

            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);

                if (target) {
                    if (navMenu.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    }

                    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 60;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    history.pushState(null, '', href);
                }
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        if (anchor.classList.contains('nav-link')) return;

        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);

                if (target) {
                    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 60;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    history.pushState(null, '', href);
                }
            }
        });
    });

    const revealElements = document.querySelectorAll('.reveal, .fade-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    function showToast(message, isError) {
        if (!toast) return;

        toast.textContent = message;
        toast.className = 'toast show' + (isError ? ' error' : '');

        setTimeout(function () {
            toast.classList.remove('show');
        }, 3500);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showToast('Please fill in all fields before submitting.', true);
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address.', true);
                return;
            }

            showToast('Thank you for your message! (Demo: Backend integration coming in Phase 2)');
            contactForm.reset();
        });
    }

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(function (card) {
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const firstLink = card.querySelector('.project-link');
                if (firstLink && !firstLink.classList.contains('disabled-link')) {
                    firstLink.click();
                }
            }
        });
    });

    if (resumeBtn) {
        const resumePath = resumeBtn.getAttribute('href');
        const resumeReady = resumePath && resumePath !== '#' && resumePath.includes('.pdf');
        if (!resumeReady) {
            resumeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                showToast('Resume PDF coming soon. Please check back later!');
            });
        }
    }

    console.log(
        '%c Welcome to my Portfolio! ',
        'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 6px;'
    );
    console.log(
        '%c Built with HTML, CSS, and Vanilla JavaScript. ',
        'color: #9ca3af; font-size: 12px;'
    );

})();
