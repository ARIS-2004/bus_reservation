// Booking functionality
const booking = {
    async getSchedules() {
        try {
            const response = await fetch('/api/booking/schedules');
            return await response.json();
        } catch (error) {
            console.error('Error fetching schedules:', error);
            return [];
        }
    },

    async bookSeat(scheduleId, seatNumber) {
        try {
            const response = await fetch('/api/booking/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ scheduleId, seatNumber })
            });
            return await response.json();
        } catch (error) {
            console.error('Booking error:', error);
            return null;
        }
    },

    renderSeatMap(container, bookedSeats) {
        container.innerHTML = '';
        for (let i = 1; i <= 40; i++) {
            const seat = document.createElement('div');
            seat.className = `seat ${bookedSeats.includes(i) ? 'booked' : ''}`;
            seat.textContent = i;
            seat.onclick = () => this.selectSeat(seat, i);
            container.appendChild(seat);
        }
    },

    selectSeat(seatElement, seatNumber) {
        if (seatElement.classList.contains('booked')) return;
        document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));
        seatElement.classList.add('selected');
        this.selectedSeat = seatNumber;
    }
};