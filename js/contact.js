const contactForm = document.querySelector('[data-contact-form]');
const contactStatus = document.getElementById('contact-status');

function updateContactStatus(message, isError = false) {
    if (!contactStatus) {
        return;
    }

    contactStatus.textContent = message;
    contactStatus.classList.toggle('is-error', isError);
}

function buildWhatsAppMessage({ name, email, message }) {
    const lines = [
        'Hello Slivana School,',
        '',
        `Name: ${name}`
    ];

    if (email) {
        lines.push(`Email: ${email}`);
    }

    lines.push('', 'Message:', message);

    return lines.join('\n');
}

if (contactForm) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const message = String(formData.get('message') || '').trim();

        if (!name || !message) {
            updateContactStatus('Please enter your name and message before sending.', true);
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const whatsappUrl = `https://wa.me/9647502122232?text=${encodeURIComponent(buildWhatsAppMessage({ name, email, message }))}`;

        updateContactStatus('Opening WhatsApp with your message...');

        if (submitButton) {
            submitButton.disabled = true;
        }

        const openedWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        if (!openedWindow) {
            window.location.href = whatsappUrl;
        }

        if (submitButton) {
            submitButton.disabled = false;
        }
    });
}
