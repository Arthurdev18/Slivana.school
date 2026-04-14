// Videos page JavaScript

function loadVideos() {
    fetch('data/videos.json')
        .then(response => response.json())
        .then(data => {
            const videosContainer = document.getElementById('videos-container');
            videosContainer.innerHTML = '';
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'video-card-embed';
                card.innerHTML = `
                    <div class="video-embed-wrapper">
                        <iframe src="${item.link}embed" width="100%" height="300" frameborder="0" style="border-radius: 16px; display: block;"></iframe>
                    </div>
                `;
                videosContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Error loading videos:', error));
}

document.addEventListener('DOMContentLoaded', loadVideos);