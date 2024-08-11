document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const commentForm = document.getElementById('commentForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(loginForm);
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.text();
                if (response.ok) {
                    alert('Login berhasil!');
                    window.location.reload();  // Reload page to show login state
                } else {
                    alert(result);
                }
            } catch (error) {
                alert('Terjadi kesalahan: ' + error.message);
            }
        });
    }

    if (commentForm) {
        commentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(commentForm);
            try {
                const response = await fetch('/comments', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.text();
                if (response.ok) {
                    alert('Komentar berhasil dikirim!');
                    // Optionally refresh comments section here
                } else {
                    alert(result);
                }
            } catch (error) {
                alert('Terjadi kesalahan: ' + error.message);
            }
        });
    }
});
