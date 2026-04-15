window.SlivanaUtils = (() => {
    function escapeHtml(value = '') {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function normalizeUrl(url = '') {
        try {
            const parsedUrl = new URL(url);
            const pathname = parsedUrl.pathname.endsWith('/') ? parsedUrl.pathname : `${parsedUrl.pathname}/`;
            return `${parsedUrl.origin}${pathname}`;
        } catch (error) {
            return '';
        }
    }

    function getInstagramEmbedUrl(url = '') {
        const normalizedUrl = normalizeUrl(url);

        if (!normalizedUrl) {
            return '';
        }

        return `${normalizedUrl}embed`;
    }

    function formatDate(value = '') {
        if (!value || typeof value !== 'string') {
            return 'Date not provided';
        }

        const parsedDate = new Date(value);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Date not provided';
        }

        return new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(parsedDate);
    }

    function formatRichText(value = '') {
        return escapeHtml(value).replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
    }

    function setLoadingState(container, label = 'Loading content...') {
        if (!container) {
            return;
        }

        container.innerHTML = `
            <div class="state-card state-card-loading" role="status">
                <h4>Please wait</h4>
                <p>${escapeHtml(label)}</p>
            </div>
        `;
    }

    function setMessageState(container, title, description) {
        if (!container) {
            return;
        }

        container.innerHTML = `
            <div class="state-card" role="status">
                <h4>${escapeHtml(title)}</h4>
                <p>${escapeHtml(description)}</p>
            </div>
        `;
    }

    return {
        escapeHtml,
        formatDate,
        formatRichText,
        getInstagramEmbedUrl,
        normalizeUrl,
        setLoadingState,
        setMessageState
    };
})();
