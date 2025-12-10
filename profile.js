document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        alert('Please login to view profile');
        window.location.href = 'login.html';
        return;
    }
    
    loadProfile();
    setupForms();
});

async function loadProfile() {
    const profileInfo = document.getElementById('profileInfo');
    
    try {
        profileInfo.innerHTML = '<p class="loading">Loading profile...</p>';
        
        const response = await fetchWithAuth(API_ENDPOINTS.users.profile);
        
        if (!response) return;
        
        if (response.ok) {
            const result = await response.json();
            console.log('Profile data:', result);
            
            const userData = result.user || result.data || result;
            displayProfile(userData);
            fillUpdateForm(userData);
        } else {
            const error = await response.json();
            console.error('Profile load error:', error);
            profileInfo.innerHTML = '<p class="loading">Failed to load profile</p>';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        profileInfo.innerHTML = '<p class="loading">Failed to load profile. Please try again.</p>';
    }
}

function displayProfile(userData) {
    const profileInfo = document.getElementById('profileInfo');
    let html = '';
    
    html += '<div class="profile-info-row">';
    html += '<strong>Email:</strong> ' + (userData.email || 'N/A');
    html += '</div>';
    
    html += '<div class="profile-info-row">';
    html += '<strong>Name:</strong> ' + (userData.name || userData.fullName || 'Not set');
    html += '</div>';
    
    html += '<div class="profile-info-row">';
    html += '<strong>Phone:</strong> ' + (userData.phone || userData.phoneNumber || 'Not set');
    html += '</div>';
    
    html += '<div class="profile-info-row">';
    html += '<strong>Country:</strong> ' + (userData.country || 'Not set');
    html += '</div>';
    
    html += '<div class="profile-info-row">';
    html += '<strong>Role:</strong> ' + (userData.role || 'visitor');
    html += '</div>';
    
    if (userData.points !== undefined && userData.points !== null) {
        html += '<div class="profile-info-row">';
        html += '<strong>Reward Points:</strong> ' + userData.points;
        html += '</div>';
    }
    
    profileInfo.innerHTML = html;
}

function fillUpdateForm(userData) {
    document.getElementById('profileEmail').value = userData.email || '';
    document.getElementById('profileName').value = userData.name || userData.fullName || '';
    document.getElementById('profilePhone').value = userData.phone || userData.phoneNumber || '';
    document.getElementById('profileCountry').value = userData.country || '';
}

function setupForms() {
    document.getElementById('updateForm').addEventListener('submit', handleUpdateProfile);
    document.getElementById('passwordForm').addEventListener('submit', handleChangePassword);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

async function handleUpdateProfile(e) {
    e.preventDefault();
    
    const profileData = {
        email: document.getElementById('profileEmail').value.trim(),
        name: document.getElementById('profileName').value.trim(),
        phone: document.getElementById('profilePhone').value.trim(),
    };
    
    console.log('Updating profile with:', profileData);
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.users.profile, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        
        if (!response) return;
        
        if (response.ok) {
            alert('Profile updated successfully!');
            loadProfile();
        } else {
            const error = await response.json();
            console.error('Update profile error:', error);
            alert('Failed to update: ' + (error.message || error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters!');
        return;
    }
    
    const passwordData = {
        currentPassword: currentPassword,
        newPassword: newPassword
    };
    
    console.log('Changing password...');
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.users.updatePassword, {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
        
        if (!response) return;
        
        if (response.ok) {
            alert('Password changed successfully!');
            document.getElementById('passwordForm').reset();
        } else {
            const error = await response.json();
            console.error('Change password error:', error);
            alert('Failed to change password: ' + (error.message || error.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error changing password:', error);
        alert('Error changing password. Please try again.');
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        removeAuthToken();
        alert('Logged out successfully');
        window.location.href = 'index.html';
    }
}
