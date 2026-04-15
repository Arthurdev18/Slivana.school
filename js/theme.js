const themeToggle = document.getElementById('theme-toggle');

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

const storedTheme = readSavedTheme();
const preferredTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

setTheme(preferredTheme);
highlightCurrentPage();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        setTheme(nextTheme);
    });
}
