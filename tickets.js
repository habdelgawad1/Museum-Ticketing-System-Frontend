let availableTours = [];

document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        alert('Please login to book tickets');
        window.location.href = 'login.html';
        return;
    }
    
    loadToursDropdown();
    checkSelectedTour();
    setupForm();
    loadBookings();
});

async function loadToursDropdown() {
    try {
        const response = await fetch(API_ENDPOINTS.tours.all);
        const data = await response.json();
        availableTours = data.tours || data || [];
        
        const select = document.getElementById('tourSelect');
        for (let i = 0; i < availableTours.length; i++) {
            const tour = availableTours[i];
            const option = document.createElement('option');
            option.value = tour.id || tour._id;
            option.textContent = (tour.name || tour.title) + ' - $' + (tour.price || 0);
            select.appendChild(option);
        }
    } catch (error) {
        console.error('Error loading tours:', error);
    }
}

function checkSelectedTour() {
    const selectedTour = localStorage.getItem('selectedTour');
    if (selectedTour) {
        try {
            const tour = JSON.parse(selectedTour);
            document.getElementById('tourSelect').value = tour.id || tour._id;
            updateSummary();
            localStorage.removeItem('selectedTour');
        } catch (error) {
            console.error('Error parsing selected tour:', error);
        }
    }
}

function setupForm() {
    const form = document.getElementById('bookingForm');
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    
    form.addEventListener('submit', handleSubmit);
    
    document.getElementById('tourSelect').addEventListener('change', updateSummary);
    document.getElementById('numTickets').addEventListener('input', updateSummary);
    document.getElementById('bookingDate').addEventListener('change', updateSummary);
}

function updateSummary() {
    const tourSelect = document.getElementById('tourSelect');
    const numTickets = document.getElementById('numTickets').value;
    const bookingDate = document.getElementById('bookingDate').value;
    
    const selectedOption = tourSelect.options[tourSelect.selectedIndex];
    const tourText = selectedOption.text;
    
    document.getElementById('summaryTour').textContent = tourText !== '-- Select a Tour --' ? tourText : '-';
    document.getElementById('summaryDate').textContent = bookingDate || '-';
    document.getElementById('summaryTickets').textContent = numTickets || '-';
    
    if (tourSelect.value && numTickets) {
        let selectedTour = null;
        for (let i = 0; i < availableTours.length; i++) {
            if ((availableTours[i].id || availableTours[i]._id) === tourSelect.value) {
                selectedTour = availableTours[i];
                break;
            }
        }
        
        if (selectedTour) {
            const total = (selectedTour.price || 0) * parseInt(numTickets);
            document.getElementById('summaryTotal').textContent = '$' + total.toFixed(2);
        }
    } else {
        document.getElementById('summaryTotal').textContent = '$0.00';
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const tourId = document.getElementById('tourSelect').value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const numTickets = parseInt(document.getElementById('numTickets').value);
    const specialRequests = document.getElementById('specialRequests').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    let selectedTour = null;
    for (let i = 0; i < availableTours.length; i++) {
        if ((availableTours[i].id || availableTours[i]._id) === tourId) {
            selectedTour = availableTours[i];
            break;
        }
    }
    
    if (!selectedTour) {
        alert('Please select a tour');
        return;
    }
    
    const bookingData = {
        tourId: tourId,
        date: date,
        time: time,
        numberOfTickets: numTickets,
        totalPrice: (selectedTour.price || 0) * numTickets,
        specialRequests: specialRequests,
        paymentMethod: paymentMethod
    };
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.bookings.create, {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
        
        if (response.ok) {
            const result = await response.json();
            const bookingId = result.id || result._id || result.bookingId;
            
            if (paymentMethod === 'cash') {
                await processPayment(bookingId, 'cash');
            } else {
                await processPayment(bookingId, 'points');
            }
            
            alert('Booking confirmed successfully!');
            document.getElementById('bookingForm').reset();
            updateSummary();
            loadBookings();
        } else {
            const error = await response.json();
            alert('Booking failed: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        alert('Error creating booking. Please try again.');
    }
}

async function processPayment(bookingId, method) {
    try {
        const endpoint = method === 'cash' 
            ? API_ENDPOINTS.bookings.payCash(bookingId)
            : API_ENDPOINTS.bookings.payPoints(bookingId);
        
        await fetchWithAuth(endpoint, { method: 'POST' });
    } catch (error) {
        console.error('Error processing payment:', error);
    }
}

async function loadBookings() {
    const container = document.getElementById('bookingsContainer');
    
    try {
        container.innerHTML = '<p class="loading">Loading bookings...</p>';
        
        const response = await fetchWithAuth(API_ENDPOINTS.bookings.all);
        
        if (response.ok) {
            const data = await response.json();
            const bookings = data.bookings || data || [];
            
            if (bookings.length === 0) {
                container.innerHTML = '<p class="loading">No bookings yet</p>';
                return;
            }
            
            displayBookings(bookings);
        } else {
            container.innerHTML = '<p class="loading">Failed to load bookings</p>';
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        container.innerHTML = '<p class="loading">Failed to load bookings</p>';
    }
}

function displayBookings(bookings) {
    const container = document.getElementById('bookingsContainer');
    let html = '';
    
    for (let i = 0; i < bookings.length; i++) {
        const booking = bookings[i];
        const bookingId = booking.id || booking._id;
        const tourName = booking.tourName || (booking.tour && booking.tour.name) || 'Tour';
        const bookingDate = new Date(booking.date).toLocaleDateString();
        const bookingTime = booking.time || 'N/A';
        const tickets = booking.numberOfTickets || booking.tickets || 0;
        const price = booking.totalPrice || booking.price || 0;
        const status = booking.status || 'pending';
        
        html += '<div class="booking-card">';
        html += '<h3>' + tourName + '</h3>';
        html += '<p><strong>Date:</strong> ' + bookingDate + '</p>';
        html += '<p><strong>Time:</strong> ' + bookingTime + '</p>';
        html += '<p><strong>Tickets:</strong> ' + tickets + '</p>';
        html += '<p><strong>Total:</strong> $' + price + '</p>';
        html += '<p><strong>Status:</strong> <span class="status-' + status + '">' + status + '</span></p>';
        
        if (status !== 'cancelled') {
            html += '<button class="btn-cancel" onclick="cancelBooking(\'' + bookingId + '\')">Cancel</button>';
        }
        
        html += '</div>';
    }
    
    container.innerHTML = html;
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.bookings.byId(bookingId), {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Booking cancelled successfully!');
            loadBookings();
        } else {
            const error = await response.json();
            alert('Failed to cancel: ' + (error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking. Please try again.');
    }
}
