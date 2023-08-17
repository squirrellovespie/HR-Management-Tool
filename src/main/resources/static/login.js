document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${email}&password=${password}`
            });

            const data = await response.text();
            console.log(data); // Debugging: Check the actual response received

            if (data.trim() === 'success') {
                alert('Successful login!');
            } else if (data.trim() === 'error') {
                alert('Invalid credentials');
            } else {
                alert('Unknown response from server');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
