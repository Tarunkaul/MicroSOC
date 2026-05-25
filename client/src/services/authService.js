const API_URL = 'http://localhost:5000/api';

class AuthService {
    async signup(name, email, password, role = 'analyst') {
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
            }

            return data;
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                message: 'Network error. Please check if the server is running.',
            };
        }
    }

    // Sign In
    async signin(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Store token in localStorage
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
            }

            return data;
        } catch (error) {
            console.error('Signin error:', error);
            return {
                success: false,
                message: 'Network error. Please try again.',
            };
        }
    }

    // Get User Profile (Protected Route Example)
    async getProfile() {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return {
                    success: false,
                    message: 'No authentication token found',
                };
            }

            const response = await fetch(`${API_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Profile fetch error:', error);
            return {
                success: false,
                message: 'Network error. Please try again.',
            };
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Get token
    getToken() {
        return localStorage.getItem('token');
    }
}

export default new AuthService();