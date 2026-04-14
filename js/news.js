// News page JavaScript

let allNews = [];

function loadAllNews() {
    fetch('data/news.json')
        .then(response => response.json())
        .then(data => {
            allNews = data;
            displayNews(data);
        })
        .catch(error => console.error('Error loading news:', error));
}

function displayNews(news) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    news.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <h4>${item.title}</h4>
            <p>${item.date}</p>
            <p>${item.summary}</p>
            <p>${item.content}</p>
        `;
        newsContainer.appendChild(card);
    });
}

function searchNews() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filteredNews = allNews.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
    );
    displayNews(filteredNews);
}

document.addEventListener('DOMContentLoaded', loadAllNews);