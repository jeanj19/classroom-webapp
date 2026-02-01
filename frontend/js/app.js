// This file contains common JavaScript functions used across the application

// Check if user is authenticated
function checkAuth(requiredRole) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== requiredRole) {
        window.location.href = 'index.html';
    }
}

// Common API call function
async function apiCall(url, options = {}) {
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    };
    
    if (options.isFormData) {
        headers['Content-Type'] = 'multipart/form-data';
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: { ...headers, ...options.headers }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    return errorDiv;
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    return successDiv;
}

// Clear error and success messages
function clearMessages() {
    const errorDivs = document.querySelectorAll('.error-message');
    const successDivs = document.querySelectorAll('.success-message');
    
    errorDivs.forEach(div => div.style.display = 'none');
    successDivs.forEach(div => div.style.display = 'none');
}

// Handle logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Handle form submission
function handleFormSubmission(event, url, successMessage) {
    event.preventDefault();
    clearMessages();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    apiCall(url, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert(successMessage);
            event.target.reset();
        } else {
            throw new Error('Request failed');
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
}