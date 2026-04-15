const galleryUtils = window.SlivanaUtils;

function renderGalleryCard(item) {
    const postUrl = galleryUtils.normalizeUrl(item.link);
    const embedUrl = galleryUtils.getInstagramEmbedUrl(item.link);
    const title = galleryUtils.getDisplayTitle('', 'Gallery post', item.date);

    return `
        <article class="gallery-card">
            <div class="gallery-card-frame">
                ${embedUrl
                    ? `<iframe
                            src="${embedUrl}"
                            title="Gallery post from ${galleryUtils.escapeHtml(galleryUtils.formatDate(item.date))}"
                            loading="lazy"
                            frameborder="0"
                            scrolling="no"
                            allowtransparency="true"></iframe>`
                    : `<div class="embed-fallback">
                            <h4>Preview unavailable</h4>
                            <p>This gallery post can still be opened directly on Instagram.</p>
                       </div>`}
            </div>
            <div class="gallery-card-details">
                <div class="gallery-card-copy">
                    <p class="meta-label">${galleryUtils.escapeHtml(galleryUtils.formatDate(item.date))}</p>
                    <h4>${galleryUtils.escapeHtml(title)}</h4>
                </div>
                ${postUrl
                    ? `<a class="btn btn-secondary" href="${galleryUtils.escapeHtml(postUrl)}" target="_blank" rel="noopener noreferrer">Open on Instagram</a>`
                    : ''}
            </div>
        </article>
    `;
}

function loadGallery() {
    const galleryContainer = document.getElementById('gallery-container');

    if (!galleryContainer) {
        return;
    }

    galleryUtils.setLoadingState(galleryContainer, 'Loading gallery posts...');

    fetch('data/gallery.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to load gallery.');
            }

            return response.json();
        })
        .then(data => {
            const galleryItems = galleryUtils.sortItemsByDateDesc(Array.isArray(data) ? data : []);

            if (galleryItems.length === 0) {
                galleryUtils.setMessageState(galleryContainer, 'No gallery posts yet', 'Gallery posts will appear here when they are added.');
                return;
            }

            galleryContainer.innerHTML = galleryItems.map(renderGalleryCard).join('');
        })
        .catch(error => {
            console.error('Error loading gallery:', error);
            galleryUtils.setMessageState(galleryContainer, 'Gallery unavailable', 'We could not load the gallery right now.');
        });
}

document.addEventListener('DOMContentLoaded', loadGallery);
