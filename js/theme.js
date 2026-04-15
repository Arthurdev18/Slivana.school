const themeToggle = document.getElementById('theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
const mobileNavQuery = window.matchMedia('(max-width: 760px)');

function readSavedTheme() {
    try {
        return localStorage.getItem('site-theme');
    } catch (error) {
        return null;
    }
}

function persistTheme(theme) {
    try {
        localStorage.setItem('site-theme', theme);
    } catch (error) {
        console.warn('Unable to save theme preference.', error);
    }
}

function setTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    document.documentElement.style.colorScheme = theme;

    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
        themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    persistTheme(theme);
}

function highlightCurrentPage() {
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === currentPage;
        link.classList.toggle('active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function setNavOpen(isOpen) {
    if (!navToggle || !siteNav) {
        return;
    }

    siteNav.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.textContent = isOpen ? 'Close' : 'Menu';
}

function syncNavForViewport() {
    if (!navToggle || !siteNav) {
        return;
    }

    if (mobileNavQuery.matches) {
        setNavOpen(false);
    } else {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = 'Menu';
    }
}

const storedTheme = readSavedTheme();
const preferredTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

setTheme(preferredTheme);
highlightCurrentPage();
syncNavForViewport();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        setTheme(nextTheme);
    });
}

if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        setNavOpen(!isOpen);
    });

    siteNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavQuery.matches) {
                setNavOpen(false);
            }
        });
    });

    mobileNavQuery.addEventListener('change', syncNavForViewport);
}
