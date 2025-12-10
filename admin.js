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
        name: document.getElementById('tourName').value.trim(),
        guide: document.getElementById('tourGuide').value.trim(),
        duration: document.getElementById('tourDuration').value.trim(),
        language: document.getElementById('tourLanguage').value.trim(),
        price: parseFloat(document.getElementById('tourPrice').value),
        maxCapacity: parseInt(document.getElementById('tourCapacity').value),
        description: document.getElementById('tourDescription').value.trim()
    };
    
    console.log('Creating tour with data:', tourData);
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.admin.tours, {
            method: 'POST',
            body: JSON.stringify(tourData)
        });
        
        if (!response) return;
        
        if (response.ok) {
            const result = await response.json();
            console.log('Tour created:', result);
            alert('Tour created successfully!');
            document.getElementById('createTourForm').reset();
            loadTours();
        } else {
            const error = await response.json();
            console.error('Create tour error:', error);
            alert('Failed to create tour: ' + (error.message || error.error || 'Unknown error'));
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
        
        if (!response.ok) {
            throw new Error('Failed to fetch tours');
        }
        
        const data = await response.json();
        console.log('Admin tours data:', data);
        
        const tours = data.tours || data.data || data || [];
        
        if (tours.length === 0) {
            container.innerHTML = '<p class="loading">No tours available</p>';
            return;
        }
        
        displayTours(tours);
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
        const tourName = tour.name || tour.title || 'Unnamed Tour';
        const tourGuide = tour.guide || tour.guideName || 'N/A';
        const tourDuration = tour.duration || 'N/A';
        const tourPrice = tour.price || 0;
        const tourCapacity = tour.maxCapacity || tour.capacity || 'N/A';
        const tourLanguage = tour.language || 'N/A';
        
        html += '<div class="tour-card">';
        html += '<h3>' + tourName + '</h3>';
        html += '<p><strong>Guide:</strong> ' + tourGuide + '</p>';
        html += '<p><strong>Duration:</strong> ' + tourDuration + '</p>';
        html += '<p><strong>Language:</strong> ' + tourLanguage + '</p>';
        html += '<p><strong>Price:</strong> $' + tourPrice + '</p>';
        html += '<p><strong>Capacity:</strong> ' + tourCapacity + '</p>';
        html += '<button class="btn-edit" onclick="editTour(\'' + tourId + '\')">Edit</button>';
        html += '<button class="btn-delete" onclick="deleteTour(\'' + tourId + '\')">Delete</button>';
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function editTour(tourId) {
    alert('Edit functionality - Tour ID: ' + tourId + '\n\nNote: Edit feature needs to be implemented with a form to update tour details.');
}

async function deleteTour(tourId) {
    if (!confirm('Are you sure you want to delete this tour?')) {
        return;
    }
    
    console.log('Deleting tour:', tourId);
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.admin.tours, {
            method: 'DELETE',
            body: JSON.stringify({ id: tourId })
        });
        
        if (!response) return;
        
        if (response.ok) {
            alert('Tour deleted successfully!');
            loadTours();
        } else {
            const error = await response.json();
            console.error('Delete tour error:', error);
            alert('Failed to delete tour: ' + (error.message || error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting tour:', error);
        alert('Error deleting tour. Please try again.');
    }
}

async function handleAddAdmin(e) {
    e.preventDefault();
    
    const adminData = {
        email: document.getElementById('adminEmail').value.trim(),
        password: document.getElementById('adminPassword').value,
        role: document.getElementById('adminRole').value
    };
    
    console.log('Creating admin user with data:', adminData);
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.admin.users, {
            method: 'POST',
            body: JSON.stringify(adminData)
        });
        
        if (!response) return;
        
        if (response.ok) {
            const result = await response.json();
            console.log('Admin created:', result);
            alert('Admin user created successfully!');
            document.getElementById('addAdminForm').reset();
        } else {
            const error = await response.json();
            console.error('Create admin error:', error);
            alert('Failed to create admin: ' + (error.message || error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error creating admin:', error);
        alert('Error creating admin. Please try again.');
    }
}
