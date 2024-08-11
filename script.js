document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const commentForm = document.getElementById('commentForm');
    const commentsSection = document.getElementById('commentsSection');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');

    // Handle registration
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                alert('Registrasi berhasil! Anda sekarang bisa login.');
                registerSection.style.display = 'none'; // Hide register section
                loginSection.style.display = 'block'; // Show login section
            } else {
                const error = await response.text();
                alert(`Error: ${error}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Handle login
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('Login berhasil!');
                loginSection.style.display = 'none'; // Hide login section
                commentForm.style.display = 'block'; // Show comment form
                commentsSection.style.display = 'block'; // Show comments section
            } else {
                const error = await response.text();
                alert(`Error: ${error}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Handle comment submission
    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const comment = document.getElementById('comment').value;

        try {
            const response = await fetch('/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment })
            });

            if (response.ok) {
                const commentItem = document.createElement('li');
                commentItem.textContent = comment;
                document.getElementById('commentsList').appendChild(commentItem);
                document.getElementById('comment').value = ''; // Clear textarea
            } else {
                const error = await response.text();
                alert(`Error: ${error}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Optional: Fetch and display existing comments on page load
    (async () => {
        try {
            const response = await fetch('/comments');
            if (response.ok) {
                const comments = await response.json();
                const commentsList = document.getElementById('commentsList');
                comments.forEach(comment => {
                    const commentItem = document.createElement('li');
                    commentItem.textContent = comment;
                    commentsList.appendChild(commentItem);
                });
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    })();
});
