const feedback = {
  async submit(rating, comment) {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating, comment })
      });
      return await response.json();
    } catch (error) {
      console.error('Feedback submission error:', error);
      return null;
    }
  },

  async getFeedbacks() {
    try {
      const response = await fetch('/api/feedback');
      return await response.json();
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      return [];
    }
  }
};