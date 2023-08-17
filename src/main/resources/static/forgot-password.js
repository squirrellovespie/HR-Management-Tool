document.addEventListener('DOMContentLoaded', function () {
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    forgotPasswordForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;

        // You can make an AJAX request to your Spring Boot API here
        // Example using Fetch API:
        fetch('/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${email}`
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});