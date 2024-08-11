document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                alert('Registrasi berhasil! Anda sekarang bisa login.');
                window.location.href = 'login.html'; // Redirect ke halaman login setelah pendaftaran berhasil
            } else {
                const error = await response.text();
                alert(`Error: ${error}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
