const utils = window.SlivanaUtils;

function loadNewsPreview() {
    const newsGrid = document.getElementById('news-grid');

    if (!newsGrid) {
        return;
    }

    utils.setLoadingState(newsGrid, 'Loading the latest school updates...');

    fetch('data/news.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to load news.');
            }

            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                utils.setMessageState(newsGrid, 'No news yet', 'School updates will appear here as soon as they are published.');
                return;
            }

            newsGrid.innerHTML = data
                .slice(0, 3)
                .map(item => `
                    <article class="news-card">
                        <p class="meta-label">${utils.escapeHtml(utils.formatDate(item.date))}</p>
                        <h4>${utils.escapeHtml(item.title)}</h4>
                        <p>${utils.escapeHtml(item.summary)}</p>
                    </article>
                `)
                .join('');
        })
        .catch(error => {
            console.error('Error loading news preview:', error);
            utils.setMessageState(newsGrid, 'News unavailable', 'We could not load updates right now. Please try again later.');
        });
}

document.addEventListener('DOMContentLoaded', loadNewsPreview);
