const newsUtils = window.SlivanaUtils;

let allNews = [];

function updateNewsSummary(count) {
    const summary = document.getElementById('news-results-summary');

    if (!summary) {
        return;
    }

    summary.textContent = `${count} update${count === 1 ? '' : 's'} shown`;
}

function displayNews(newsItems) {
    const newsContainer = document.getElementById('news-container');

    if (!newsContainer) {
        return;
    }

    if (!newsItems.length) {
        newsUtils.setMessageState(newsContainer, 'No matching updates', 'Try a different search term or check back later for new announcements.');
        updateNewsSummary(0);
        return;
    }

    newsContainer.innerHTML = newsItems
        .map(item => `
            <article class="news-card news-card-full">
                <p class="meta-label">${newsUtils.escapeHtml(newsUtils.formatDate(item.date))}</p>
                <h4>${newsUtils.escapeHtml(item.title)}</h4>
                <p>${newsUtils.escapeHtml(item.summary)}</p>
                <div class="news-card-content">${newsUtils.formatRichText(item.content || '')}</div>
                ${item.link
                    ? `<div class="news-card-actions">
                            <a class="btn btn-secondary" href="${newsUtils.escapeHtml(newsUtils.normalizeUrl(item.link))}" target="_blank" rel="noopener noreferrer">Open on Instagram</a>
                       </div>`
                    : ''}
            </article>
        `)
        .join('');

    updateNewsSummary(newsItems.length);
}

function filterNews() {
    const searchInput = document.getElementById('search-input');

    if (!searchInput) {
        displayNews(allNews);
        return;
    }

    const query = searchInput.value.trim().toLowerCase();
    const filteredNews = allNews.filter(item =>
        [item.title, item.summary, item.content]
            .filter(Boolean)
            .some(value => value.toLowerCase().includes(query))
    );

    displayNews(filteredNews);
}

function loadAllNews() {
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search-input');

    if (!newsContainer) {
        return;
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterNews);
    }

    newsUtils.setLoadingState(newsContainer, 'Loading school updates...');

    fetch('data/news.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to load news.');
            }

            return response.json();
        })
        .then(data => {
            allNews = Array.isArray(data) ? data : [];
            displayNews(allNews);
        })
        .catch(error => {
            console.error('Error loading news:', error);
            newsUtils.setMessageState(newsContainer, 'Updates unavailable', 'We could not load the news feed right now.');
            updateNewsSummary(0);
        });
}

document.addEventListener('DOMContentLoaded', loadAllNews);
