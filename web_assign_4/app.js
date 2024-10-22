$(document).ready(function() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    
    // Fetch and display all posts (READ)
    function loadPosts() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(posts) {
                $('#posts-list').empty();
                posts.forEach(post => {
                    $('#posts-list').append(`
                        <li id="post-${post.id}">
                            <h3>${post.title}</h3>
                            <p>${post.body}</p>
                            <div class="post-actions">
                                <button class="edit-btn" data-id="${post.id}">Edit</button>
                                <button class="delete-btn" data-id="${post.id}">Delete</button>
                            </div>
                        </li>
                    `);
                });
            }
        });
    }

    loadPosts();

    // Create a new post (CREATE)
    $('#post-form').submit(function(event) {
        event.preventDefault();
        const postId = $('#postId').val();
        const postData = {
            title: $('#title').val(),
            body: $('#body').val()
        };

        if (postId === '') {
            // Create new post
            $.ajax({
                url: apiUrl,
                method: 'POST',
                data: JSON.stringify(postData),
                contentType: 'application/json',
                success: function(newPost) {
                    $('#posts-list').prepend(`
                        <li id="post-${newPost.id}">
                            <h3>${newPost.title}</h3>
                            <p>${newPost.body}</p>
                            <div class="post-actions">
                                <button class="edit-btn" data-id="${newPost.id}">Edit</button>
                                <button class="delete-btn" data-id="${newPost.id}">Delete</button>
                            </div>
                        </li>
                    `);
                    resetForm();
                }
            });
        } else {
            // Update existing post
            $.ajax({
                url: `${apiUrl}/${postId}`,
                method: 'PUT',
                data: JSON.stringify(postData),
                contentType: 'application/json',
                success: function(updatedPost) {
                    $(`#post-${postId}`).html(`
                        <h3>${updatedPost.title}</h3>
                        <p>${updatedPost.body}</p>
                        <div class="post-actions">
                            <button class="edit-btn" data-id="${updatedPost.id}">Edit</button>
                            <button class="delete-btn" data-id="${updatedPost.id}">Delete</button>
                        </div>
                    `);
                    resetForm();
                }
            });
        }
    });

    // Edit post (LOAD data to the form for UPDATE)
    $(document).on('click', '.edit-btn', function() {
        const postId = $(this).data('id');
        $.ajax({
            url: `${apiUrl}/${postId}`,
            method: 'GET',
            success: function(post) {
                $('#postId').val(post.id);
                $('#title').val(post.title);
                $('#body').val(post.body);
                $('#submit-btn').text('Update Post');
                $('#form-title').text('Update Post');
                $('#cancel-btn').show();
            }
        });
    });

    // Cancel Edit
    $('#cancel-btn').click(function() {
        resetForm();
    });

    // Delete post (DELETE)
    $(document).on('click', '.delete-btn', function() {
        const postId = $(this).data('id');
        $.ajax({
            url: `${apiUrl}/${postId}`,
            method: 'DELETE',
            success: function() {
                $(`#post-${postId}`).remove();
            }
        });
    });

    // Reset form after submission or cancellation
    function resetForm() {
        $('#postId').val('');
        $('#title').val('');
        $('#body').val('');
        $('#submit-btn').text('Submit');
        $('#form-title').text('Create a New Post');
        $('#cancel-btn').hide();
    }
});
