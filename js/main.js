// Main JavaScript for Slivana School website

// Function to load news on homepage
function loadNews() {
    fetch('data/news.json')
        .then(response => response.json())
        .then(data => {
            const newsGrid = document.getElementById('news-grid');
            data.slice(0, 3).forEach(item => {
                const card = document.createElement('div');
                card.className = 'news-card';
                card.innerHTML = `
                    <h4>${item.title}</h4>
                    <p>${item.date}</p>
                    <p>${item.summary}</p>
                `;
                newsGrid.appendChild(card);
            });
        })
        .catch(error => console.error('Error loading news:', error));
}

// Load news when DOM is loaded
document.addEventListener('DOMContentLoaded', loadNews);