// Cart Management System
let cart = [];

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem('4e_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (error) {
            console.error('Error loading cart:', error);
            cart = [];
        }
    }
    updateCartUI();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('4e_cart', JSON.stringify(cart));
    updateCartUI();
}

// Add item to cart
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ 
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            type: product.type,
            quantity: 1 
        });
    }
    
    saveCart();
    showNotification('✅ Added to cart!');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    showNotification('🗑️ Item removed');
}

// Update item quantity
function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += delta;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
        }
    }
}

// Get cart total price
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get total items count
function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        showNotification('🗑️ Cart cleared');
    }
}

// Update all cart UI elements
function updateCartUI() {
    updateCartCount();
    updateCartItems();
    updateCartTotal();
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = getCartItemCount();
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Update cart items display
function updateCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #aaa;">
                <p style="font-size: 3rem; margin-bottom: 1rem;">🛒</p>
                <p>Your cart is empty</p>
                <a href="products.html" style="color: #8B5CF6; text-decoration: none; margin-top: 1rem; display: inline-block;">Browse Products</a>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-header">
                    <strong>${item.name}</strong>
                    <span style="color: #8B5CF6; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div style="color: #888; font-size: 0.85rem; margin: 0.25rem 0;">
                    $${item.price.toFixed(2)} each
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, -1)" title="Decrease quantity">-</button>
                        <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" title="Increase quantity">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove from cart">
                        🗑️ Remove
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Update cart total display
function updateCartTotal() {
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutTotal = document.getElementById('checkoutTotal');

    const total = getCartTotal();

    if (cartTotal) {
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    if (checkoutTotal) {
        checkoutTotal.textContent = total.toFixed(2);
    }

    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

// Show notification toast
function showNotification(message) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.toast-notification');
    existing.forEach(el => el.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #8B5CF6, #C084FC);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        z-index: 1000;
        font-weight: bold;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize cart sidebar functionality
function initCartSidebar() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');

    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cartSidebar.classList.toggle('open');
            
            // Close mobile menu if open
            const navLinks = document.getElementById('navLinks');
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        });
    }

    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (cartSidebar && 
            cartSidebar.classList.contains('open') && 
            !cartSidebar.contains(e.target) && 
            !cartBtn.contains(e.target)) {
            cartSidebar.classList.remove('open');
        }
    });

    // Prevent cart clicks from closing it
    if (cartSidebar) {
        cartSidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Initialize mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            // Close cart if open
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) {
                cartSidebar.classList.remove('open');
            }
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && 
            navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}

// Add animation styles
function addAnimationStyles() {
    if (!document.getElementById('cart-animations')) {
        const style = document.createElement('style');
        style.id = 'cart-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .cart-item {
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initCartSidebar();
    initMobileMenu();
    addAnimationStyles();
});

// Save cart before page unload
window.addEventListener('beforeunload', () => {
    localStorage.setItem('4e_cart', JSON.stringify(cart));
});
