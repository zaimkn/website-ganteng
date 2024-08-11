document.addEventListener('DOMContentLoaded', (event) => {
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');
    
    // Load comments from local storage
    const loadComments = () => {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        commentsList.innerHTML = comments.map(comment => `<li><strong>${comment.username}:</strong> ${comment.comment}</li>`).join('');
    };

    loadComments();
    
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const comment = document.getElementById('comment').value;
        
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push({ username, comment });
        
        localStorage.setItem('comments', JSON.stringify(comments));
        
        document.getElementById('username').value = '';
        document.getElementById('comment').value = '';
        
        loadComments();
    });
});
