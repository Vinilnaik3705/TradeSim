const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const router = express.Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const isConfigured = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

// Initialize Razorpay instance only when keys are configured
const razorpay = isConfigured
    ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
    : null;

// Config status — lets the frontend know whether live checkout is available
router.get('/config', (req, res) => {
    res.json({ configured: isConfigured });
});

// Create Order
router.post('/create-order', async (req, res) => {
    try {
        if (!isConfigured) {
            return res.status(503).json({
                success: false,
                code: 'PAYMENT_NOT_CONFIGURED',
                message: 'Payment gateway is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the backend environment.'
            });
        }

        const { amount, currency, receipt, notes } = req.body;

        const parsedAmount = Number(amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount. Amount must be a positive number.'
            });
        }

        const options = {
            amount: Math.round(parsedAmount * 100), // amount in paise
            currency: currency || 'INR',
            receipt: receipt || `receipt_${Date.now()}`,
            notes: notes || {}
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order,
            key_id: RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
    try {
        if (!isConfigured) {
            return res.status(503).json({
                success: false,
                code: 'PAYMENT_NOT_CONFIGURED',
                message: 'Payment gateway is not configured.'
            });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification fields.'
            });
        }

        // Create signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        // Timing-safe comparison to prevent signature timing attacks
        const provided = Buffer.from(razorpay_signature, 'utf8');
        const expected = Buffer.from(expectedSign, 'utf8');
        const valid = provided.length === expected.length && crypto.timingSafeEqual(provided, expected);

        if (valid) {
            res.json({
                success: true,
                message: 'Payment verified successfully',
                payment_id: razorpay_payment_id
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
});

// Get Payment Details
router.get('/payment/:paymentId', async (req, res) => {
    try {
        if (!isConfigured) {
            return res.status(503).json({
                success: false,
                code: 'PAYMENT_NOT_CONFIGURED',
                message: 'Payment gateway is not configured.'
            });
        }

        const payment = await razorpay.payments.fetch(req.params.paymentId);
        res.json({
            success: true,
            payment
        });
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment details',
            error: error.message
        });
    }
});

module.exports = router;
