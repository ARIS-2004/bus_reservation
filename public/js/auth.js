// Auth functionality
const auth = {
    async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                return true;
            }
            throw new Error(data.message);
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },

    async signup(name, email, password) {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (response.ok) {
                return true;
            }
            throw new Error(data.message);
        } catch (error) {
            console.error('Signup error:', error);
            return false;
        }
    },

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
};