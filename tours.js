let allTours = [];

document.addEventListener('DOMContentLoaded', function() {
    loadTours();
    setupSearch();
});

async function loadTours() {
    const container = document.getElementById('toursContainer');
    
    try {
        const response = await fetch(API_ENDPOINTS.tours.all);
        const data = await response.json();
        allTours = data.tours || data || [];
        
        if (allTours.length === 0) {
            container.innerHTML = '<p class="loading">No tours available</p>';
            return;
        }
        
        displayTours(allTours);
    } catch (error) {
        console.error('Error loading tours:', error);
        container.innerHTML = '<p class="loading">Error loading tours</p>';
    }
}

function displayTours(tours) {
    const container = document.getElementById('toursContainer');
    
    if (tours.length === 0) {
        container.innerHTML = '<p class="loading">No tours found</p>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < tours.length; i++) {
        const tour = tours[i];
        const tourId = tour.id || tour._id;
        const tourName = tour.name || tour.title;
        const tourGuide = tour.guide || tour.guideName || 'N/A';
        const tourDuration = tour.duration || 'N/A';
        const tourPrice = tour.price || 0;
        const tourDesc = tour.description || '';
        
        html += '<div class="tour-card">';
        html += '<h3>' + tourName + '</h3>';
        html += '<p><strong>Guide:</strong> ' + tourGuide + '</p>';
        html += '<p><strong>Duration:</strong> ' + tourDuration + '</p>';
        html += '<p><strong>Price:</strong> $' + tourPrice + '</p>';
        html += '<p>' + tourDesc + '</p>';
        html += '<button onclick="bookTour(\'' + tourId + '\')">Book Tour</button>';
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = [];
        
        for (let i = 0; i < allTours.length; i++) {
            const tour = allTours[i];
            const name = (tour.name || tour.title || '').toLowerCase();
            const desc = (tour.description || '').toLowerCase();
            
            if (name.includes(searchTerm) || desc.includes(searchTerm)) {
                filtered.push(tour);
            }
        }
        
        displayTours(filtered);
    });
}

function bookTour(tourId) {
    if (!isLoggedIn()) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }
    
    let selectedTour = null;
    for (let i = 0; i < allTours.length; i++) {
        if ((allTours[i].id || allTours[i]._id) === tourId) {
            selectedTour = allTours[i];
            break;
        }
    }
    
    if (selectedTour) {
        localStorage.setItem('selectedTour', JSON.stringify(selectedTour));
    }
    
    window.location.href = 'tickets.html';
}
