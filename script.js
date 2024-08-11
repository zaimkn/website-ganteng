document.addEventListener('DOMContentLoaded', () => {
    const commentSection = document.getElementById('commentSection');
    const authLinks = document.getElementById('authLinks');
    const logoutLink = document.getElementById('logoutLink');
    const logoutButton = document.getElementById('logoutButton');

    // Periksa status login dari localStorage
    const loggedIn = localStorage.getItem('loggedIn');

    if (loggedIn === 'true') {
        authLinks.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        authLinks.style.display = 'block';
        logoutLink.style.display = 'none';
    }

    // Logout button handler
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedIn');
        window.location.href = 'index.html';
    });
});
