document.addEventListener('DOMContentLoaded', () => {
    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('Login successful');
                // Redirect or refresh to show comment section
                window.location.reload();
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Komentar
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const comment = document.getElementById('comment').value;

            const response = await fetch('/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment })
            });

            if (response.ok) {
                alert('Comment submitted');
                document.getElementById('comment').value = ''; // Clear comment input
                loadComments(); // Reload comments
            } else {
                alert('Failed to submit comment');
            }
        });
    }

    // Function to load comments from the server
    function loadComments() {
        fetch('/comments')
            .then(response => response.json())
            .then(data => {
                const commentsList = document.getElementById('commentsList');
                if (commentsList) {
                    commentsList.innerHTML = '';
                    data.comments.forEach(comment => {
                        const li = document.createElement('li');
                        li.textContent = comment;
                        commentsList.appendChild(li);
                    });
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Initial load of comments if on homepage
    if (window.location.pathname === '/') {
        loadComments();
    }
});
