// Podcasts page JavaScript

let allPodcasts = [];

function loadPodcasts() {
    fetch('data/podcasts.json')
        .then(response => response.json())
        .then(data => {
            allPodcasts = data;
            displayPodcasts(data);
        })
        .catch(error => console.error('Error loading podcasts:', error));
}

function displayPodcasts(podcasts) {
    const podcastsContainer = document.getElementById('podcasts-container');
    podcastsContainer.innerHTML = '';
    podcasts.forEach(item => {
        const card = document.createElement('div');
        card.className = 'podcast-embed';
        card.innerHTML = `
            <div class="embed-wrapper">
                <iframe src="${item.link}embed" width="100%" height="520" frameborder="0" style="border-radius: 16px; display: block;"></iframe>
            </div>
            <div class="podcast-details">
                <h4>${item.title}</h4>
                <p><strong>Guest:</strong> ${item.guest}</p>
                <p><strong>Date:</strong> ${item.date}</p>
            </div>
        `;
        podcastsContainer.appendChild(card);
    });
}

function searchPodcasts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filteredPodcasts = allPodcasts.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.guest.toLowerCase().includes(query)
    );
    displayPodcasts(filteredPodcasts);
}

document.addEventListener('DOMContentLoaded', loadPodcasts);