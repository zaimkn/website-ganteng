document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        alert('Login berhasil!');
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        alert('Login gagal.');
    }
});
