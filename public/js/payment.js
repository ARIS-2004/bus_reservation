// Payment functionality
const payment = {
    stripe: Stripe('your_publishable_key'),

    async processPayment(bookingId, amount) {
        try {
            const response = await fetch('/api/payment/create-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ bookingId, amount })
            });
            
            const session = await response.json();
            const result = await this.stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Payment error:', error);
            return false;
        }
    }
};