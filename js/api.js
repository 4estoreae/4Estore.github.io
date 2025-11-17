// API Configuration
const API_CONFIG = {
    baseURL: 'https://YOUR-REPLIT-URL.replit.app',
    secret: 'YOUR_API_SECRET_TOKEN'
};

// Create order
async function createOrder(username, cart, total) {
    try {
        // Convert cart items to the required format
        const items = cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: Math.round(item.price * 100) // Convert dollars to cents
        }));

        const totalPrice = Math.round(total * 100); // Convert total to cents

        const response = await fetch(`${API_CONFIG.baseURL}/api/createOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Secret': API_CONFIG.secret
            },
            body: JSON.stringify({
                discordUsername: username,
                items: items,
                totalPrice: totalPrice
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Order creation failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Checkout handler
function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const confirmOrder = document.getElementById('confirmOrder');
    const cancelCheckout = document.getElementById('cancelCheckout');
    const checkoutTotal = document.getElementById('checkoutTotal');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            checkoutModal.classList.add('open');
            if (checkoutTotal) {
                checkoutTotal.textContent = getCartTotal().toFixed(2);
            }
        });
    }

    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', () => {
            checkoutModal.classList.remove('open');
            document.getElementById('discordUsername').value = '';
            document.getElementById('confirmJoin').checked = false;
        });
    }

    if (confirmOrder) {
        confirmOrder.addEventListener('click', async () => {
            const username = document.getElementById('discordUsername').value.trim();
            const confirmed = document.getElementById('confirmJoin').checked;

            // Validation
            if (!username) {
                alert('Please enter your Discord username!');
                return;
            }

            if (!confirmed) {
                alert('Please confirm you have joined our Discord server!');
                return;
            }

            // Disable button and show loading state
            confirmOrder.disabled = true;
            confirmOrder.textContent = 'Processing...';

            try {
                const result = await createOrder(username, cart, getCartTotal());
                
                // Success
                alert('✅ Order placed successfully! Check your Discord DMs for delivery.\n\nOrder ID: ' + (result.orderId || 'N/A'));
                
                // Clear cart and reset form
                cart = [];
                saveCart();
                checkoutModal.classList.remove('open');
                document.getElementById('cartSidebar').classList.remove('open');
                document.getElementById('discordUsername').value = '';
                document.getElementById('confirmJoin').checked = false;
            } catch (error) {
                // Error handling
                console.error('Order error:', error);
                alert('❌ Order failed: ' + error.message + '\n\nPlease contact support on Discord.');
            } finally {
                // Re-enable button
                confirmOrder.disabled = false;
                confirmOrder.textContent = 'Confirm Order';
            }
        });
    }

    // Close modal when clicking outside
    checkoutModal?.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('open');
        }
    });
}

// Initialize checkout on page load
document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
});
