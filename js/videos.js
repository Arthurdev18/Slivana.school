const videoUtils = window.SlivanaUtils;

let allVideos = [];

function updateVideoSummary(count) {
    const summary = document.getElementById('video-results-summary');

    if (!summary) {
        return;
    }

    summary.textContent = `${count} video${count === 1 ? '' : 's'} shown`;
}

function renderVideoCard(item) {
    const title = videoUtils.getDisplayTitle(item.title, 'Video post', item.date);
    const descriptionText = String(item.desc || '').trim() || 'Watch this published school video and open the original Instagram post if you need the full Instagram view.';
    const postUrl = videoUtils.normalizeUrl(item.link);
    const embedUrl = videoUtils.getInstagramEmbedUrl(item.link);

    return `
        <article class="media-card video-card-embed">
            <div class="media-frame video-embed-wrapper">
                ${embedUrl
                    ? `<iframe
                            src="${embedUrl}"
                            title="${videoUtils.escapeHtml(title)}"
                            loading="lazy"
                            frameborder="0"
                            scrolling="no"
                            allowtransparency="true"></iframe>`
                    : `<div class="embed-fallback">
                            <h4>Preview unavailable</h4>
                            <p>This video can still be opened directly on Instagram.</p>
                       </div>`}
            </div>
            <div class="media-details card-video-details">
                <p class="meta-label">${videoUtils.escapeHtml(videoUtils.formatDate(item.date))}</p>
                <h4 dir="auto">${videoUtils.escapeHtml(title)}</h4>
                <p dir="auto">${videoUtils.escapeHtml(descriptionText)}</p>
                ${postUrl
                    ? `<div class="media-actions">
                            <a class="btn btn-secondary" href="${videoUtils.escapeHtml(postUrl)}" target="_blank" rel="noopener noreferrer">Open on Instagram</a>
                       </div>`
                    : ''}
            </div>
        </article>
    `;
}

function displayVideos(videoItems) {
    const videosContainer = document.getElementById('videos-container');

    if (!videosContainer) {
        return;
    }

    if (!videoItems.length) {
        videoUtils.setMessageState(videosContainer, 'No matching videos', 'Try another search term or check back later for more school videos.');
        updateVideoSummary(0);
        return;
    }

    videosContainer.innerHTML = videoItems.map(renderVideoCard).join('');
    updateVideoSummary(videoItems.length);
}

function filterVideos() {
    const query = document.getElementById('search-input')?.value.trim().toLowerCase() || '';
    const filteredVideos = allVideos.filter(item =>
        [videoUtils.getDisplayTitle(item.title, 'Video post', item.date), item.desc, item.date, item.link]
            .filter(Boolean)
            .some(value => value.toLowerCase().includes(query))
    );

    displayVideos(filteredVideos);
}

function loadVideos() {
    const videosContainer = document.getElementById('videos-container');
    const searchInput = document.getElementById('search-input');

    if (!videosContainer) {
        return;
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterVideos);
    }

    videoUtils.setLoadingState(videosContainer, 'Loading school videos...');

    fetch('data/videos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to load videos.');
            }

            return response.json();
        })
        .then(data => {
            allVideos = videoUtils.sortItemsByDateDesc(Array.isArray(data) ? data : []);
            displayVideos(allVideos);
        })
        .catch(error => {
            console.error('Error loading videos:', error);
            videoUtils.setMessageState(videosContainer, 'Videos unavailable', 'We could not load the video page right now.');
            updateVideoSummary(0);
        });
}

document.addEventListener('DOMContentLoaded', loadVideos);
