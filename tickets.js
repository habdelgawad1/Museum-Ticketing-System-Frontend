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
        
        if (!response.ok) {
            throw new Error('Failed to fetch tours');
        }
        
        const data = await response.json();
        console.log('Tours for dropdown:', data);
        
        availableTours = data.tours || data.data || data || [];
        
        const select = document.getElementById('tourSelect');
        select.innerHTML = '<option value="">-- Select a Tour --</option>';
        
        for (let i = 0; i < availableTours.length; i++) {
            const tour = availableTours[i];
            const option = document.createElement('option');
            option.value = tour.id || tour._id;
            option.textContent = (tour.name || tour.title) + ' - $' + (tour.price || 0);
            select.appendChild(option);
        }
    } catch (error) {
        console.error('Error loading tours:', error);
        alert('Error loading tours. Please refresh the page.');
    }
}

function checkSelectedTour() {
    const selectedTour = localStorage.getItem('selectedTour');
    if (selectedTour) {
        try {
            const tour = JSON.parse(selectedTour);
            const tourId = tour.id || tour._id;
            
            setTimeout(function() {
                const select = document.getElementById('tourSelect');
                select.value = tourId;
                updateSummary();
            }, 500);
            
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
    
    if (!tourId) {
        alert('Please select a tour');
        return;
    }
    
    let selectedTour = null;
    for (let i = 0; i < availableTours.length; i++) {
        if ((availableTours[i].id || availableTours[i]._id) === tourId) {
            selectedTour = availableTours[i];
            break;
        }
    }
    
    if (!selectedTour) {
        alert('Please select a valid tour');
        return;
    }
    
    const totalPrice = (selectedTour.price || 0) * numTickets;
    
    const bookingData = {
        tourId: tourId,
        date: date,
        time: time,
        numberOfTickets: numTickets,
        totalPrice: totalPrice,
        specialRequests: specialRequests,
        paymentMethod: paymentMethod
    };
    
    console.log('Sending booking data:', bookingData);
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.bookings.create, {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
        
        if (!response) return;
        
        if (response.ok) {
            const result = await response.json();
            console.log('Booking response:', result);
            
            const bookingId = result.id || result._id || result.bookingId || result.data?.id;
            
            if (bookingId && paymentMethod) {
                await processPayment(bookingId, paymentMethod);
            }
            
            alert('Booking created successfully!');
            document.getElementById('bookingForm').reset();
            updateSummary();
            loadBookings();
        } else {
            const error = await response.json();
            console.error('Booking error:', error);
            alert('Booking failed: ' + (error.message || error.error || 'Unknown error'));
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
        
        console.log('Processing payment:', method, 'for booking:', bookingId);
        
        const response = await fetchWithAuth(endpoint, { 
            method: 'POST',
            body: JSON.stringify({})
        });
        
        if (response && response.ok) {
            console.log('Payment processed successfully');
        } else {
            const error = await response.json();
            console.error('Payment error:', error);
        }
    } catch (error) {
        console.error('Error processing payment:', error);
    }
}

async function loadBookings() {
    const container = document.getElementById('bookingsContainer');
    
    try {
        container.innerHTML = '<p class="loading">Loading bookings...</p>';
        
        const response = await fetchWithAuth(API_ENDPOINTS.bookings.all);
        
        if (!response) return;
        
        if (response.ok) {
            const data = await response.json();
            console.log('Bookings data:', data);
            
            const bookings = data.bookings || data.data || data || [];
            
            if (bookings.length === 0) {
                container.innerHTML = '<p class="loading">No bookings yet. Book your first tour!</p>';
                return;
            }
            
            displayBookings(bookings);
        } else {
            const error = await response.json();
            console.error('Load bookings error:', error);
            container.innerHTML = '<p class="loading">Failed to load bookings</p>';
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        container.innerHTML = '<p class="loading">Failed to load bookings. Please try again.</p>';
    }
}

function displayBookings(bookings) {
    const container = document.getElementById('bookingsContainer');
    let html = '';
    
    for (let i = 0; i < bookings.length; i++) {
        const booking = bookings[i];
        const bookingId = booking.id || booking._id;
        const tourName = booking.tourName || (booking.tour && (booking.tour.name || booking.tour.title)) || 'Tour';
        const bookingDate = new Date(booking.date).toLocaleDateString();
        const bookingTime = booking.time || 'N/A';
        const tickets = booking.numberOfTickets || booking.tickets || 0;
        const price = booking.totalPrice || booking.price || 0;
        const status = booking.status || 'pending';
        const paymentStatus = booking.paymentStatus || 'pending';
        
        html += '<div class="booking-card">';
        html += '<h3>' + tourName + '</h3>';
        html += '<p><strong>Date:</strong> ' + bookingDate + '</p>';
        html += '<p><strong>Time:</strong> ' + bookingTime + '</p>';
        html += '<p><strong>Tickets:</strong> ' + tickets + '</p>';
        html += '<p><strong>Total:</strong> $' + price + '</p>';
        html += '<p><strong>Status:</strong> <span class="status-' + status + '">' + status.toUpperCase() + '</span></p>';
        html += '<p><strong>Payment:</strong> <span class="status-' + paymentStatus + '">' + paymentStatus.toUpperCase() + '</span></p>';
        
        if (status !== 'cancelled') {
            html += '<button class="btn-cancel" onclick="cancelBooking(\'' + bookingId + '\')">Cancel Booking</button>';
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
        
        if (!response) return;
        
        if (response.ok) {
            alert('Booking cancelled successfully!');
            loadBookings();
        } else {
            const error = await response.json();
            console.error('Cancel booking error:', error);
            alert('Failed to cancel: ' + (error.message || error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking. Please try again.');
    }
}
