const search = {
  async searchBuses(from, to, date) {
    try {
      const response = await fetch(
        `/api/booking/search?from=${from}&to=${to}&date=${date}`
      );
      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },

  async getSeats(scheduleId) {
    try {
      const response = await fetch(`/api/booking/seats/${scheduleId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching seats:', error);
      return null;
    }
  },

  renderSearchResults(schedules, container) {
    container.innerHTML = schedules.map(schedule => `
      <div class="schedule-card">
        <h3>${schedule.route.from} to ${schedule.route.to}</h3>
        <p>Date: ${new Date(schedule.date).toLocaleDateString()}</p>
        <p>Departure: ${schedule.departure}</p>
        <p>Arrival: ${schedule.arrival}</p>
        <p>Price: $${schedule.price}</p>
        <button class="btn btn-primary" 
          onclick="selectSchedule('${schedule._id}')">
          Select Seats
        </button>
      </div>
    `).join('');
  }
};