const API_BASE_URL = 'http://localhost:4423';

const API_ENDPOINTS = {
    auth: {
        register: API_BASE_URL + '/api/v1/auth/register',
        login: API_BASE_URL + '/api/v1/auth/login'
    },
    users: {
        profile: API_BASE_URL + '/api/v1/users/profile',
        updatePassword: API_BASE_URL + '/api/v1/users/profile'
    },
    tours: {
        all: API_BASE_URL + '/api/v1/tours',
        byId: function(id) {
            return API_BASE_URL + '/api/v1/tours/' + id;
        }
    },
    bookings: {
        all: API_BASE_URL + '/api/v1/bookings',
        create: API_BASE_URL + '/api/v1/bookings',
        byId: function(id) {
            return API_BASE_URL + '/api/v1/bookings/' + id;
        },
        payCash: function(id) {
            return API_BASE_URL + '/api/v1/bookings/' + id + '/pay-cash';
        },
        payPoints: function(id) {
            return API_BASE_URL + '/api/v1/bookings/' + id + '/pay-points';
        }
    },
    reviews: {
        byTour: function(tourId) {
            return API_BASE_URL + '/api/v1/tours/' + tourId + '/reviews';
        },
        create: function(tourId) {
            return API_BASE_URL + '/api/v1/tours/' + tourId + '/reviews';
        }
    },
    admin: {
        users: API_BASE_URL + '/api/v1/admin/users',
        tours: API_BASE_URL + '/api/v1/admin/tours'
    }
};

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}

function isLoggedIn() {
    return getAuthToken() !== null;
}

async function fetchWithAuth(url, options) {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (options && options.headers) {
        for (let key in options.headers) {
            headers[key] = options.headers[key];
        }
    }
    
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }
    
    const fetchOptions = {
        headers: headers
    };
    
    if (options) {
        if (options.method) fetchOptions.method = options.method;
        if (options.body) fetchOptions.body = options.body;
    }
    
    try {
        const response = await fetch(url, fetchOptions);
        
        if (response.status === 401) {
            removeAuthToken();
            alert('Session expired. Please login again.');
            window.location.href = 'login.html';
            return null;
        }
        
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
