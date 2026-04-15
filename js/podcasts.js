const podcastUtils = window.SlivanaUtils;

let allPodcasts = [];

function updatePodcastSummary(count) {
    const summary = document.getElementById('podcast-results-summary');

    if (!summary) {
        return;
    }

    summary.textContent = `${count} podcast${count === 1 ? '' : 's'} shown`;
}

function renderPodcastCard(item) {
    const title = podcastUtils.escapeHtml(item.title || 'Untitled episode');
    const postUrl = podcastUtils.normalizeUrl(item.link);
    const embedUrl = podcastUtils.getInstagramEmbedUrl(item.link);

    return `
        <article class="media-card podcast-embed">
            <div class="media-frame embed-wrapper">
                ${embedUrl
                    ? `<iframe
                            src="${embedUrl}"
                            title="${title}"
                            loading="lazy"
                            frameborder="0"
                            scrolling="no"
                            allowtransparency="true"></iframe>`
                    : `<div class="embed-fallback">
                            <h4>Preview unavailable</h4>
                            <p>This episode can still be opened directly on Instagram.</p>
                       </div>`}
            </div>
            <div class="media-details podcast-details">
                <p class="meta-label">${podcastUtils.escapeHtml(podcastUtils.formatDate(item.date))}</p>
                <h4>${title}</h4>
                <p>Listen to this published school episode and open the original post for the full Instagram view.</p>
                ${postUrl
                    ? `<a class="btn btn-secondary" href="${postUrl}" target="_blank" rel="noopener noreferrer">Open on Instagram</a>`
                    : ''}
            </div>
        </article>
    `;
}

function displayPodcasts(podcastItems) {
    const podcastsContainer = document.getElementById('podcasts-container');

    if (!podcastsContainer) {
        return;
    }

    if (!podcastItems.length) {
        podcastUtils.setMessageState(podcastsContainer, 'No matching podcasts', 'Try a different search term or check back later for more episodes.');
        updatePodcastSummary(0);
        return;
    }

    podcastsContainer.innerHTML = podcastItems.map(renderPodcastCard).join('');
    updatePodcastSummary(podcastItems.length);
}

function filterPodcasts() {
    const query = document.getElementById('search-input')?.value.trim().toLowerCase() || '';
    const filteredPodcasts = allPodcasts.filter(item =>
        (item.title || '').toLowerCase().includes(query)
    );

    displayPodcasts(filteredPodcasts);
}

function loadPodcasts() {
    const podcastsContainer = document.getElementById('podcasts-container');
    const searchInput = document.getElementById('search-input');

    if (!podcastsContainer) {
        return;
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterPodcasts);
    }

    podcastUtils.setLoadingState(podcastsContainer, 'Loading podcast episodes...');

    fetch('data/podcasts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to load podcasts.');
            }

            return response.json();
        })
        .then(data => {
            allPodcasts = Array.isArray(data) ? data : [];
            displayPodcasts(allPodcasts);
        })
        .catch(error => {
            console.error('Error loading podcasts:', error);
            podcastUtils.setMessageState(podcastsContainer, 'Podcasts unavailable', 'We could not load the podcast page right now.');
            updatePodcastSummary(0);
        });
}

document.addEventListener('DOMContentLoaded', loadPodcasts);
