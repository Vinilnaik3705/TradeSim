import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Smartphone, Building2, Wallet, CheckCircle, XCircle, ArrowLeft, ShieldCheck, AlertTriangle, Lock } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../components/motion';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null); // 'success' or 'failed'
    const [gatewayReady, setGatewayReady] = useState(null); // null = checking, true/false
    const [errorMessage, setErrorMessage] = useState('');

    // Get order details from navigation state
    const orderDetails = location.state || {
        amount: 0,
        assetName: 'Unknown',
        assetSymbol: 'N/A',
        quantity: 0,
        type: 'crypto' // 'crypto' or 'subscription'
    };

    useEffect(() => {
        // Check gateway configuration
        paymentService.getConfig().then((cfg) => {
            setGatewayReady(!!cfg.configured);
        });

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    const handlePayment = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            // Create order
            const orderData = {
                amount: orderDetails.amount,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                notes: {
                    assetName: orderDetails.assetName,
                    assetSymbol: orderDetails.assetSymbol,
                    quantity: orderDetails.quantity,
                    type: orderDetails.type
                }
            };

            const { order, key_id } = await paymentService.createOrder(orderData);

            // Razorpay options — UPI and Cards prioritized for Indian users
            const options = {
                key: key_id,
                amount: order.amount,
                currency: order.currency,
                name: 'Kryonex Pro',
                description: `${orderDetails.type === 'subscription' ? 'Pro Subscription' : `Purchase ${orderDetails.quantity} ${orderDetails.assetSymbol}`}`,
                order_id: order.id,
                handler: async function (response) {
                    // Payment successful — verify signature server-side
                    try {
                        const verifyData = await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyData.success) {
                            setPaymentStatus('success');
                            setTimeout(() => {
                                navigate('/dashboard');
                            }, 3000);
                        } else {
                            setPaymentStatus('failed');
                        }
                    } catch (error) {
                        setPaymentStatus('failed');
                    }
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: ''
                },
                theme: {
                    color: '#38BDF8',
                    backdrop_color: 'rgba(2, 8, 14, 0.9)'
                },
                config: {
                    display: {
                        blocks: {
                            upi: {
                                name: 'Pay via UPI',
                                instruments: [{ method: 'upi' }]
                            },
                            cards: {
                                name: 'Credit / Debit Cards',
                                instruments: [{ method: 'card' }]
                            },
                            other: {
                                name: 'Other Methods',
                                instruments: [{ method: 'netbanking' }, { method: 'wallet' }]
                            }
                        },
                        sequence: ['block.upi', 'block.cards', 'block.other'],
                        preferences: { show_default_blocks: false }
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setPaymentStatus('failed');
                setLoading(false);
            });

            rzp.open();
            setLoading(false);
        } catch (error) {
            console.error('Payment error:', error);
            setErrorMessage(error.message || 'Unable to start payment. Please try again.');
            setLoading(false);
        }
    };

    if (paymentStatus === 'success') {
        return (
            <div className="min-h-screen bg-background kx-grid-bg flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-md w-full text-center space-y-6 kx-glass rounded-2xl p-10"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-20 h-20 bg-success/[0.12] border border-success/[0.3] rounded-full flex items-center justify-center mx-auto"
                    >
                        <CheckCircle size={44} className="text-success" />
                    </motion.div>
                    <h1 className="text-3xl font-extrabold text-white">Payment Successful</h1>
                    <p className="text-[rgba(255,255,255,0.5)]">Your transaction has been completed successfully.</p>
                    <p className="text-sm text-[rgba(255,255,255,0.3)]">Redirecting to dashboard...</p>
                </motion.div>
            </div>
        );
    }

    if (paymentStatus === 'failed') {
        return (
            <div className="min-h-screen bg-background kx-grid-bg flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-md w-full text-center space-y-6 kx-glass rounded-2xl p-10"
                >
                    <div className="w-20 h-20 bg-danger/[0.12] border border-danger/[0.3] rounded-full flex items-center justify-center mx-auto">
                        <XCircle size={44} className="text-danger" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white">Payment Failed</h1>
                    <p className="text-[rgba(255,255,255,0.5)]">There was an issue processing your payment.</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setPaymentStatus(null)}
                            className="kx-shimmer px-6 py-3 bg-accent text-black rounded-xl font-bold hover:brightness-110 transition-all"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-white/[0.06] text-white border border-white/[0.1] rounded-xl font-bold hover:bg-white/[0.1] transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-background/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors"
                    >
                        <ArrowLeft size={22} className="text-white" />
                    </button>
                    <h1 className="text-xl font-extrabold text-white">Complete Payment</h1>
                    <div className="ml-auto flex items-center gap-2 text-[11px] text-[rgba(255,255,255,0.4)] font-bold uppercase tracking-wider">
                        <Lock size={13} className="text-success" /> Secured by Razorpay
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Reveal y={16}>
                            <h2 className="text-lg font-extrabold text-white mb-4">Order Summary</h2>
                            <div className="kx-card kx-glass rounded-2xl p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[rgba(255,255,255,0.4)] text-sm">Item</span>
                                    <span className="font-bold text-white text-sm">
                                        {orderDetails.type === 'subscription' ? 'Pro Subscription' : orderDetails.assetName}
                                    </span>
                                </div>
                                {orderDetails.type !== 'subscription' && (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[rgba(255,255,255,0.4)] text-sm">Symbol</span>
                                            <span className="font-mono price-mono text-white text-sm">{orderDetails.assetSymbol}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[rgba(255,255,255,0.4)] text-sm">Quantity</span>
                                            <span className="font-bold text-white text-sm">{orderDetails.quantity}</span>
                                        </div>
                                    </>
                                )}
                                <div className="border-t border-white/[0.08] pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-extrabold text-white">Total Amount</span>
                                        <span className="text-2xl font-extrabold text-accent font-mono price-mono">
                                            {'₹'}{orderDetails.amount.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Payment Methods Info */}
                        <Reveal y={16} delay={0.1}>
                            <h3 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider">Supported Payment Methods</h3>
                            <Stagger gap={0.06} className="grid grid-cols-2 gap-3">
                                <StaggerItem y={12} className="flex items-center gap-3 p-4 kx-glass rounded-xl hover:border-accent/30 transition-colors">
                                    <Smartphone className="text-accent shrink-0" size={22} />
                                    <div>
                                        <span className="text-sm font-bold text-white block">UPI</span>
                                        <span className="text-[10px] text-[rgba(255,255,255,0.35)]">GPay, PhonePe, Paytm</span>
                                    </div>
                                </StaggerItem>
                                <StaggerItem y={12} className="flex items-center gap-3 p-4 kx-glass rounded-xl hover:border-accent/30 transition-colors">
                                    <CreditCard className="text-accent shrink-0" size={22} />
                                    <div>
                                        <span className="text-sm font-bold text-white block">Cards</span>
                                        <span className="text-[10px] text-[rgba(255,255,255,0.35)]">Visa, Mastercard, RuPay</span>
                                    </div>
                                </StaggerItem>
                                <StaggerItem y={12} className="flex items-center gap-3 p-4 kx-glass rounded-xl hover:border-accent/30 transition-colors">
                                    <Building2 className="text-accent shrink-0" size={22} />
                                    <span className="text-sm font-bold text-white">Net Banking</span>
                                </StaggerItem>
                                <StaggerItem y={12} className="flex items-center gap-3 p-4 kx-glass rounded-xl hover:border-accent/30 transition-colors">
                                    <Wallet className="text-accent shrink-0" size={22} />
                                    <span className="text-sm font-bold text-white">Wallets</span>
                                </StaggerItem>
                            </Stagger>
                        </Reveal>
                    </div>

                    {/* Payment Action */}
                    <div className="space-y-6">
                        <Reveal y={16} delay={0.15}>
                            <div className="kx-card relative overflow-hidden rounded-2xl p-8 space-y-6 border border-accent/[0.15]" style={{ background: 'linear-gradient(160deg, rgba(56,189,248,0.12), rgba(5,13,20,0.9))' }}>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-accent/[0.15] rounded-full blur-[80px] pointer-events-none" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-accent/[0.12] border border-accent/[0.25] text-accent">
                                            <ShieldCheck size={22} />
                                        </div>
                                        <h2 className="text-xl font-extrabold text-white">Secure Payment</h2>
                                    </div>
                                    <p className="text-[rgba(255,255,255,0.5)] text-sm leading-relaxed">
                                        Your payment is secured by Razorpay with end-to-end encryption. UPI and all major Indian payment methods supported.
                                    </p>

                                    {gatewayReady === false && (
                                        <div className="flex items-start gap-3 bg-warning/[0.08] border border-warning/[0.25] rounded-xl p-4">
                                            <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
                                            <p className="text-[12px] text-warning leading-relaxed">
                                                Payment gateway is not configured yet. Add <span className="font-mono font-bold">RAZORPAY_KEY_ID</span> and <span className="font-mono font-bold">RAZORPAY_KEY_SECRET</span> to the server environment to enable live payments.
                                            </p>
                                        </div>
                                    )}

                                    {errorMessage && (
                                        <div className="flex items-start gap-3 bg-danger/[0.08] border border-danger/[0.25] rounded-xl p-4">
                                            <XCircle size={18} className="text-danger shrink-0 mt-0.5" />
                                            <p className="text-[12px] text-danger leading-relaxed">{errorMessage}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handlePayment}
                                        disabled={loading || gatewayReady === false}
                                        className="kx-shimmer w-full bg-accent text-black py-4 rounded-xl font-extrabold text-base hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : gatewayReady === null ? 'Checking gateway...' : 'Proceed to Pay'}
                                    </button>
                                    <div className="flex items-center justify-center gap-2 text-[11px] text-[rgba(255,255,255,0.35)] font-bold uppercase tracking-wider">
                                        <Lock size={12} />
                                        <span>256-bit SSL Encrypted</span>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Test Mode Info */}
                        <Reveal y={16} delay={0.25}>
                            <div className="kx-glass border border-warning/[0.2] rounded-xl p-4">
                                <p className="text-[12px] text-[rgba(255,255,255,0.5)] leading-relaxed">
                                    <strong className="text-warning">Test Mode:</strong> Use UPI ID <span className="font-mono text-white">success@razorpay</span> or card <span className="font-mono text-white">4111 1111 1111 1111</span> for testing.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
