document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        alert('Please login to access admin panel');
        window.location.href = 'login.html';
        return;
    }
    
    setupForms();
    loadTours();
});

function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

function setupForms() {
    document.getElementById('createTourForm').addEventListener('submit', handleCreateTour);
    document.getElementById('addAdminForm').addEventListener('submit', handleAddAdmin);
}

async function handleCreateTour(e) {
    e.preventDefault();
    
    const tourData = {
        name: document.getElementById('tourName').value,
        guide: document.getElementById('tourGuide').value,
        duration: document.getElementById('tourDuration').value,
        language: document.getElementById('tourLanguage').value,
        price: parseFloat(document.getElementById('tourPrice').value),
        maxCapacity: parseInt(document.getElementById('tourCapacity').value),
        description: document.getElementById('tourDescription').value
    };
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.admin.tours, {
            method: 'POST',
            body: JSON.stringify(tourData)
        });
        
        if (response.ok) {
            alert('Tour created successfully!');
            document.getElementById('createTourForm').reset();
            loadTours();
        } else {
            const error = await response.json();
            alert('Failed to create tour: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error creating tour:', error);
        alert('Error creating tour. Please try again.');
    }
}

async function loadTours() {
    const container = document.getElementById('toursContainer');
    
    try {
        container.innerHTML = '<p class="loading">Loading tours...</p>';
        
        const response = await fetch(API_ENDPOINTS.tours.all);
        
        if (response.ok) {
            const data = await response.json();
            const tours = data.tours || data || [];
            
            if (tours.length === 0) {
                container.innerHTML = '<p class="loading">No tours available</p>';
                return;
            }
            
            displayTours(tours);
        } else {
            container.innerHTML = '<p class="loading">Failed to load tours</p>';
        }
    } catch (error) {
        console.error('Error loading tours:', error);
        container.innerHTML = '<p class="loading">Failed to load tours</p>';
    }
}

function displayTours(tours) {
    const container = document.getElementById('toursContainer');
    let html = '';
    
    for (let i = 0; i < tours.length; i++) {
        const tour = tours[i];
        const tourId = tour.id || tour._id;
        const tourName = tour.name || tour.title;
        const tourGuide = tour.guide || tour.guideName || 'N/A';
        const tourDuration = tour.duration || 'N/A';
        const tourPrice = tour.price || 0;
        const tourCapacity = tour.maxCapacity || tour.capacity || 'N/A';
        
        html += '<div class="tour-card">';
        html += '<h3>' + tourName + '</h3>';
        html += '<p><strong>Guide:</strong> ' + tourGuide + '</p>';
        html += '<p><strong>Duration:</strong> ' + tourDuration + '</p>';
        html += '<p><strong>Price:</strong> $' + tourPrice + '</p>';
        html += '<p><strong>Capacity:</strong> ' + tourCapacity + '</p>';
        html += '<button class="btn-edit" onclick="editTour(\'' + tourId + '\')">Edit</button>';
        html += '<button class="btn-delete" onclick="deleteTour(\'' + tourId + '\')">Delete</button>';
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function editTour(tourId) {
    alert('Edit functionality - Tour ID: ' + tourId);
}

async function deleteTour(tourId) {
    if (!confirm('Are you sure you want to delete this tour?')) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.admin.tours, {
            method: 'DELETE',
            body: JSON.stringify({ id: tourId })
        });
        
        if (response.ok) {
            alert('Tour deleted successfully!');
            loadTours();
        } else {
            const error = await response.json();
            alert('Failed to delete tour: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting tour:', error);
        alert('Error deleting tour. Please try again.');
    }
}

async function handleAddAdmin(e) {
    e.preventDefault();
    
    const adminData = {
        email: document.getElementById('adminEmail').value,
        password: document.getElementById('adminPassword').value,
        role: document.getElementById('adminRole').value
    };
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.admin.users, {
            method: 'POST',
            body: JSON.stringify(adminData)
        });
        
        if (response.ok) {
            alert('Admin user created successfully!');
            document.getElementById('addAdminForm').reset();
        } else {
            const error = await response.json();
            alert('Failed to create admin: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error creating admin:', error);
        alert('Error creating admin. Please try again.');
    }
}
