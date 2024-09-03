document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cart-modal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const orderBtns = document.querySelectorAll('.order-btn');
    const findFoodBtn = document.getElementById('findFoodBtn');
    const addressInput = document.getElementById('addressInput');

    let cart = [];

    // Open cart modal
    cartIcon.onclick = () => {
        cartModal.style.display = 'block';
        updateCartDisplay();
    }

    // Close cart modal
    closeBtn.onclick = () => {
        cartModal.style.display = 'none';
    }

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    }

    // Add item to cart
    orderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const restaurant = btn.getAttribute('data-restaurant');
            addToCart(restaurant);
        });
    });

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.name === item);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name: item, quantity: 1, price: 10 }); // Assuming a fixed price of $10 for simplicity
        }
        updateCartCount();
        showNotification(`Added ${item} to cart`);
    }

    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    }

    function updateCartDisplay() {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.quantity * item.price;
            total += itemTotal;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Checkout button
    checkoutBtn.onclick = () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
        } else {
            showNotification('Thank you for your order!');
            cart = [];
            updateCartCount();
            updateCartDisplay();
            cartModal.style.display = 'none';
        }
    }

    // Find Food button
    findFoodBtn.onclick = () => {
        const address = addressInput.value.trim();
        if (address) {
            showNotification(`Searching for restaurants near: ${address}`);
            // Here you would typically make an API call to search for restaurants
        } else {
            showNotification('Please enter an address');
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = 'notification';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.restaurant-card, .step, .testimonial');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check on page load

    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    testimonialSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - testimonialSlider.offsetLeft;
        scrollLeft = testimonialSlider.scrollLeft;
    });

    testimonialSlider.addEventListener('mouseleave', () => {
        isDown = false;
    });

    testimonialSlider.addEventListener('mouseup', () => {
        isDown = false;
    });

    testimonialSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - testimonialSlider.offsetLeft;
        const walk = (x - startX) * 2;
        testimonialSlider.scrollLeft = scrollLeft - walk;
    });
});