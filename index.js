document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    if (isLoggedIn()) {
        const title = document.querySelector('h1');
        const loginIndicator = document.createElement('small');
        loginIndicator.style.fontSize = '14px';
        loginIndicator.style.color = '#666';
        loginIndicator.textContent = ' (Logged In)';
        title.appendChild(loginIndicator);
    }
}
