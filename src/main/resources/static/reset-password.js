document.addEventListener('DOMContentLoaded', function () {
    const resetPasswordForm = document.getElementById('reset-password-form');
    const messageDiv = document.getElementById('message');

    resetPasswordForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const temporaryPassword = document.getElementById('temporaryPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate password conditions
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(newPassword)) {
            alert('Password must contain at least 8 characters including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
            return;
        }

        try {
            const response = await fetch('/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${email}&temporaryPassword=${temporaryPassword}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`
            });

            const data = await response.text();

            if (data.trim() === 'success') {
                messageDiv.textContent = 'Password reset successful. You can now log in with your new password.';
            } else if (data.trim() === 'error') {
                messageDiv.textContent = 'Password reset failed. Please try again.';
            } else if (data.trim() === 'invalid') {
                messageDiv.textContent = 'Invalid user or temporary password.';
            } else if (data.trim() === 'nomatch') {
                messageDiv.textContent = 'Password and confirmation do not match.';
            } else {
                messageDiv.textContent = 'An error occurred. Please try again later.';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'An error occurred. Please try again later.';
        }
    });
});
