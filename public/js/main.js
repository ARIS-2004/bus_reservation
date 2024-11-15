// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('mainContent');
    const authModal = document.getElementById('authModal');
    
    // Make loadPage available globally
    window.loadPage = async function(page) {
        switch(page) {
            case 'home':
                renderHomePage();
                break;
            case 'schedule':
                renderSchedulePage();
                break;
            case 'dashboard':
                if (!localStorage.getItem('token')) {
                    showAuthModal('login');
                    return;
                }
                renderDashboard();
                break;
            case 'login':
                showAuthModal('login');
                break;
        }
    };

    // Make selectSchedule available globally
    window.selectSchedule = async function(scheduleId) {
        if (!localStorage.getItem('token')) {
            showAuthModal('login');
            return;
        }
        mainContent.innerHTML = `
            <div class="booking-section">
                <h2>Select Your Seat</h2>
                <div class="seat-map" id="seatMap"></div>
                <button class="btn btn-primary" onclick="confirmBooking('${scheduleId}')">
                    Confirm Booking
                </button>
            </div>
        `;
        booking.renderSeatMap(document.getElementById('seatMap'), []);
    };

    // Make confirmBooking available globally
    window.confirmBooking = async function(scheduleId) {
        if (!booking.selectedSeat) {
            alert('Please select a seat first');
            return;
        }
        const bookingResult = await booking.bookSeat(scheduleId, booking.selectedSeat);
        if (bookingResult) {
            await payment.processPayment(bookingResult._id, bookingResult.amount);
        }
    };

    // Navigation handling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.id.replace('Link', '');
            loadPage(page);
        });
    });

    // Page renderers
    function renderHomePage() {
        mainContent.innerHTML = `
            <div class="hero">
                <h1>Welcome to BusGo</h1>
                <p>Your trusted partner for bus reservations</p>
                <button class="btn btn-primary" onclick="loadPage('schedule')">
                    Book Now
                </button>
            </div>
        `;
    }

    async function renderSchedulePage() {
        const schedules = await booking.getSchedules();
        mainContent.innerHTML = `
            <div class="schedules">
                <h2>Available Bus Schedules</h2>
                <div class="schedule-list">
                    ${schedules.map(schedule => `
                        <div class="schedule-card">
                            <h3>${schedule.route}</h3>
                            <p>Departure: ${schedule.departure}</p>
                            <p>Arrival: ${schedule.arrival}</p>
                            <p>Price: $${schedule.price}</p>
                            <button class="btn btn-primary" 
                                onclick="selectSchedule('${schedule.id}')">
                                Select Seats
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    async function renderDashboard() {
        const userData = await fetch('/api/auth/user', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json());

        mainContent.innerHTML = `
            <div class="dashboard">
                <h2>Welcome, ${userData.name}</h2>
                <div class="booking-history">
                    <h3>Your Bookings</h3>
                    ${userData.bookingHistory.map(booking => `
                        <div class="booking-card">
                            <p>Booking ID: ${booking._id}</p>
                            <p>Status: ${booking.status}</p>
                            <div id="trackingMap-${booking._id}" class="tracking-map"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Initialize tracking maps for each booking
        userData.bookingHistory.forEach(booking => {
            tracking.initMap(`trackingMap-${booking._id}`);
        });
    }

    // Auth modal handling
    window.showAuthModal = function(type) {
        const authForms = document.getElementById('authForms');
        authForms.innerHTML = type === 'login' ? getLoginForm() : getSignupForm();
        authModal.style.display = 'block';
    };

    function getLoginForm() {
        return `
            <h2>Login</h2>
            <form id="loginForm" onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
                <p>Don't have an account? 
                    <a href="#" onclick="showAuthModal('signup')">Sign up</a>
                </p>
            </form>
        `;
    }

    function getSignupForm() {
        return `
            <h2>Sign Up</h2>
            <form id="signupForm" onsubmit="handleSignup(event)">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Sign Up</button>
                <p>Already have an account? 
                    <a href="#" onclick="showAuthModal('login')">Login</a>
                </p>
            </form>
        `;
    }

    // Auth handlers
    window.handleLogin = async function(event) {
        event.preventDefault();
        const form = event.target;
        const success = await auth.login(
            form.email.value,
            form.password.value
        );
        if (success) {
            authModal.style.display = 'none';
            loadPage('dashboard');
        }
    };

    window.handleSignup = async function(event) {
        event.preventDefault();
        const form = event.target;
        const success = await auth.signup(
            form.name.value,
            form.email.value,
            form.password.value
        );
        if (success) {
            showAuthModal('login');
        }
    };

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === authModal) {
            authModal.style.display = 'none';
        }
    };

    // Initial page load
    loadPage('home');
});