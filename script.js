document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');

    // Load comments from server
    const loadComments = async () => {
        const response = await fetch('/comments');
        const comments = await response.json();
        commentsList.innerHTML = comments.map(comment => 
            `<li><strong>${comment.username}:</strong> ${comment.comment}</li>`
        ).join('');
    };

    loadComments();

    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const comment = document.getElementById('comment').value;
        const response = await fetch('/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment })
        });

        if (response.ok) {
            document.getElementById('comment').value = '';
            loadComments();
        } else {
            alert('Failed to add comment');
        }
    });
});
