window.SlivanaUtils = (() => {
    const dateOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

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

            if (!/^https?:$/.test(parsedUrl.protocol)) {
                return '';
            }

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

        const dateOnlyMatch = value.match(dateOnlyPattern);

        if (dateOnlyMatch) {
            const [, year, month, day] = dateOnlyMatch;
            const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

            return new Intl.DateTimeFormat('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
            }).format(parsedDate);
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

    function toTimestamp(value = '') {
        const parsedValue = new Date(value).getTime();
        return Number.isNaN(parsedValue) ? 0 : parsedValue;
    }

    function sortItemsByDateDesc(items = []) {
        return [...items].sort((firstItem, secondItem) => toTimestamp(secondItem?.date) - toTimestamp(firstItem?.date));
    }

    function getDisplayTitle(value = '', fallbackLabel = 'Post', date = '') {
        const title = String(value || '').trim();

        if (title) {
            return title;
        }

        const formattedDate = formatDate(date);

        if (formattedDate === 'Date not provided') {
            return fallbackLabel;
        }

        return `${fallbackLabel} from ${formattedDate}`;
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
        getDisplayTitle,
        formatRichText,
        getInstagramEmbedUrl,
        normalizeUrl,
        sortItemsByDateDesc,
        setLoadingState,
        setMessageState
    };
})();
