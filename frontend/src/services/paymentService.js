import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/payment`;

export const paymentService = {
    // Create Razorpay order
    createOrder: async (orderData) => {
        try {
            const response = await fetch(`${API_URL}/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create order');
            }

            return data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    // Verify payment
    verifyPayment: async (paymentData) => {
        try {
            const response = await fetch(`${API_URL}/verify-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Payment verification failed');
            }

            return data;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    },

    // Get payment details
    getPaymentDetails: async (paymentId) => {
        try {
            const response = await fetch(`${API_URL}/payment/${paymentId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch payment details');
            }

            return data;
        } catch (error) {
            console.error('Error fetching payment details:', error);
            throw error;
        }
    }
};
