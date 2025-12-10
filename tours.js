let allTours = [];

document.addEventListener('DOMContentLoaded', function() {
    loadTours();
    setupSearch();
});

async function loadTours() {
    const container = document.getElementById('toursContainer');
    
    try {
        container.innerHTML = '<p class="loading">Loading tours...</p>';
        
        const response = await fetch(API_ENDPOINTS.tours.all);
        
        if (!response.ok) {
            throw new Error('Failed to fetch tours');
        }
        
        const data = await response.json();
        console.log('Tours data:', data);
        
        allTours = data.tours || data.data || data || [];
        
        if (allTours.length === 0) {
            container.innerHTML = '<p class="loading">No tours available</p>';
            return;
        }
        
        displayTours(allTours);
    } catch (error) {
        console.error('Error loading tours:', error);
        container.innerHTML = '<p class="loading">Error loading tours. Please try again later.</p>';
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
        const tourName = tour.name || tour.title || 'Unnamed Tour';
        const tourGuide = tour.guide || tour.guideName || 'N/A';
        const tourDuration = tour.duration || 'N/A';
        const tourPrice = tour.price || 0;
        const tourCapacity = tour.maxCapacity || tour.capacity || 'N/A';
        const tourLanguage = tour.language || 'N/A';
        const tourDesc = tour.description || 'No description available';
        
        html += '<div class="tour-card">';
        html += '<h3>' + tourName + '</h3>';
        html += '<p><strong>Guide:</strong> ' + tourGuide + '</p>';
        html += '<p><strong>Duration:</strong> ' + tourDuration + '</p>';
        html += '<p><strong>Language:</strong> ' + tourLanguage + '</p>';
        html += '<p><strong>Price:</strong> $' + tourPrice + '</p>';
        html += '<p><strong>Capacity:</strong> ' + tourCapacity + ' people</p>';
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
            const guide = (tour.guide || tour.guideName || '').toLowerCase();
            
            if (name.includes(searchTerm) || desc.includes(searchTerm) || guide.includes(searchTerm)) {
                filtered.push(tour);
            }
        }
        
        displayTours(filtered);
    });
}

function bookTour(tourId) {
    if (!isLoggedIn()) {
        alert('Please login first to book a tour');
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
