document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const registrationForm = document.getElementById('registrationForm');

    saveButton.addEventListener('click', function() {
        // Get form values
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role = document.getElementById('role').value;

        // Validate required fields
        if (!first_name || !last_name || !email || !password || !confirmPassword) {
            alert('Please fill in all required fields.');
            return;
        }

        // Validate email format
		const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
		if (!emailPattern.test(email)) {
		    alert('Please enter a valid email address.');
		    return;
		}


        // Validate password conditions
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            alert('Password must contain at least 8 characters including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please confirm your password correctly.');
            return;
        }

        // Create an object with the form data
        const formData = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            role: role
        };

        // Send the form data to your Spring Boot API using fetch
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message); // Throwing an error to be caught in the catch block
                });
            }
            return response.json();
        })
        .then(data => {
            // Handle the response from the server (e.g., show a success message)
            alert(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message); // Display the error message
        });
    });

    cancelButton.addEventListener('click', function() {
        // Clear form fields on cancel
        clearFormFields();
    });
    function clearFormFields() {
        const formInputs = registrationForm.querySelectorAll('input');
        formInputs.forEach(input => {
            input.value = ''; // Clear the input value
        });
    }
});