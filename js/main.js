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
            const newsItems = utils.sortItemsByDateDesc(Array.isArray(data) ? data : []);

            if (newsItems.length === 0) {
                utils.setMessageState(newsGrid, 'No news yet', 'School updates will appear here as soon as they are published.');
                return;
            }

            newsGrid.innerHTML = newsItems
                .slice(0, 3)
                .map(item => {
                    const title = utils.getDisplayTitle(item.title, 'School update', item.date);
                    const summary = item.summary || 'Read the latest published school update.';

                    return `
                    <article class="news-card">
                        <p class="meta-label">${utils.escapeHtml(utils.formatDate(item.date))}</p>
                        <h4 dir="auto">${utils.escapeHtml(title)}</h4>
                        <p dir="auto">${utils.escapeHtml(summary)}</p>
                    </article>
                `;
                })
                .join('');
        })
        .catch(error => {
            console.error('Error loading news preview:', error);
            utils.setMessageState(newsGrid, 'News unavailable', 'We could not load updates right now. Please try again later.');
        });
}

document.addEventListener('DOMContentLoaded', loadNewsPreview);
