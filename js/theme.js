const themeToggle = document.getElementById('theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
const mobileNavQuery = typeof window.matchMedia === 'function'
    ? window.matchMedia('(max-width: 940px)')
    : null;

function isMobileViewport() {
    return Boolean(mobileNavQuery?.matches);
}

function bindMediaQueryChange(mediaQuery, handler) {
    if (!mediaQuery) {
        return;
    }

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handler);
        return;
    }

    if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handler);
    }
}

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
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    persistTheme(theme);
}

function highlightCurrentPage() {
    const navLinks = document.querySelectorAll('nav a');
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    const navPage = pageName === 'podcast-episode.html' ? 'podcasts.html' : pageName;

    navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === navPage;
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

    document.body.classList.toggle('nav-open', isOpen);
    siteNav.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.textContent = isOpen ? 'Close' : 'Menu';
}

function syncNavForViewport() {
    if (!navToggle || !siteNav) {
        return;
    }

    if (isMobileViewport()) {
        setNavOpen(false);
    } else {
        document.body.classList.remove('nav-open');
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = 'Menu';
    }
}

const storedTheme = readSavedTheme();
const prefersDarkTheme = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-color-scheme: dark)').matches;
const preferredTheme = storedTheme || (prefersDarkTheme ? 'dark' : 'light');

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
            if (isMobileViewport()) {
                setNavOpen(false);
            }
        });
    });

    document.addEventListener('click', event => {
        if (!isMobileViewport()) {
            return;
        }

        const clickedInsideHeader = event.target.closest('header');

        if (!clickedInsideHeader && navToggle.getAttribute('aria-expanded') === 'true') {
            setNavOpen(false);
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
            setNavOpen(false);
        }
    });

    bindMediaQueryChange(mobileNavQuery, syncNavForViewport);
}
