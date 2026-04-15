const episodeUtils = window.SlivanaUtils;

function renderEpisodePage() {
    const container = document.getElementById('podcast-episode-container');
    const titleElement = document.getElementById('episode-page-title');
    const summaryElement = document.getElementById('episode-page-summary');

    if (!container || !titleElement || !summaryElement) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const date = params.get('date') || '';
    const title = episodeUtils.getDisplayTitle(params.get('title') || '', 'Podcast episode', date);
    const postUrl = episodeUtils.normalizeUrl(params.get('link') || '');
    const embedUrl = episodeUtils.getInstagramEmbedUrl(postUrl);
    const formattedDate = episodeUtils.formatDate(date);

    titleElement.textContent = title;
    titleElement.setAttribute('dir', 'auto');
    summaryElement.textContent = formattedDate === 'Date not provided'
        ? 'Open a single published episode in a cleaner page view.'
        : `Published on ${formattedDate}. Open the original Instagram post whenever you need it.`;

    document.title = `${title} | Slivana School`;

    if (!postUrl) {
        episodeUtils.setMessageState(container, 'Episode link unavailable', 'Please return to the podcasts page and choose a published episode.');
        return;
    }

    container.innerHTML = `
        <article class="media-card podcast-embed">
            <div class="media-frame embed-wrapper">
                ${embedUrl
                    ? `<iframe
                            src="${episodeUtils.escapeHtml(embedUrl)}"
                            title="${episodeUtils.escapeHtml(title)}"
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
                <p class="meta-label">${episodeUtils.escapeHtml(formattedDate)}</p>
                <h4 dir="auto">${episodeUtils.escapeHtml(title)}</h4>
                <p>Use this page to focus on one published episode and jump back to the full podcast library whenever you need another post.</p>
                <div class="media-actions">
                    <a class="btn" href="podcasts.html">Back to Podcasts</a>
                    <a class="btn btn-secondary" href="${episodeUtils.escapeHtml(postUrl)}" target="_blank" rel="noopener noreferrer">Open on Instagram</a>
                </div>
            </div>
        </article>
    `;
}

document.addEventListener('DOMContentLoaded', renderEpisodePage);
