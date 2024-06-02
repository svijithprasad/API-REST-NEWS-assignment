document.getElementById('fetch-posts').addEventListener('click', fetchPosts);
document.getElementById('back-button').addEventListener('click', showPostsList);

let users = [];

function fetchUsers() {
    return fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => {
            users = data;
            return users;
        });
}

function fetchPosts() {
    showLoader();
    Promise.all([fetch('https://jsonplaceholder.typicode.com/posts'), fetchUsers()])
        .then(([postsResponse]) => postsResponse.json())
        .then(postsData => {
            const postsContainer = document.getElementById('posts-container');
            postsContainer.innerHTML = '';
            postsData.forEach(post => {
                const user = users.find(user => user.id === post.userId);
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                    <p>Author: ${user.name} (${user.email})</p>
                `;
                postElement.addEventListener('click', () => showPostDetails(post.id));
                postsContainer.appendChild(postElement);
            });
            hideLoader();
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            hideLoader();
        });
}

function showPostDetails(postId) {
    showLoader();
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            const user = users.find(user => user.id === post.userId);
            const postDetails = document.getElementById('post-details');
            postDetails.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <p>Author: ${user.name} (${user.email})</p>
                <h3>Comments</h3>
                <div id="comments-container"></div>
            `;
            fetchComments(postId);
            document.getElementById('posts-container').classList.add('hidden');
            document.getElementById('post-details-container').classList.remove('hidden');
            hideLoader();
        })
        .catch(error => {
            console.error('Error fetching post details:', error);
            hideLoader();
        });
}

function fetchComments(postId) {
    showLoader();
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then(response => response.json())
        .then(commentsData => {
            const commentsContainer = document.getElementById('comments-container');
            commentsContainer.innerHTML = '';
            commentsData.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <p><strong>${comment.name}</strong> (${comment.email}):</p>
                    <p>${comment.body}</p>
                `;
                commentsContainer.appendChild(commentElement);
            });
            hideLoader();
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
            hideLoader();
        });
}

function showPostsList() {
    document.getElementById('posts-container').classList.remove('hidden');
    document.getElementById('post-details-container').classList.add('hidden');
}

function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}
