// Sample product data
const products = [
    { id: 1, name: "เสื้อเชิ้ตสีขาว", price: 1999, category: "clothing", image: "/api/placeholder/250/200" },
    { id: 2, name: "กางเกงยีนส์", price: 2499, category: "clothing", image: "/api/placeholder/250/200" },
    { id: 3, name: "รองเท้าผ้าใบ", price: 1799, category: "shoes", image: "/api/placeholder/250/200" },
    { id: 4, name: "กระเป๋าสะพาย", price: 3299, category: "bags", image: "/api/placeholder/250/200" },
    { id: 5, name: "นาฬิกาข้อมือ", price: 5999, category: "accessories", image: "/api/placeholder/250/200" },
    { id: 6, name: "แว่นตากันแดด", price: 1599, category: "accessories", image: "/api/placeholder/250/200" },
    { id: 7, name: "เดรสยาว", price: 3799, category: "clothing", image: "/api/placeholder/250/200" },
    { id: 8, name: "รองเท้าส้นสูง", price: 2899, category: "shoes", image: "/api/placeholder/250/200" }
];

// Function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(price);
}

// Function to render product cards
function renderProducts(productsToRender) {
    const productGrid = document.getElementById('products-grid');
    if (!productGrid) return;
    productGrid.innerHTML = '';
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="add-to-cart" data-id="${product.id}">เพิ่มลงตะกร้า</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Function to add item to cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`เพิ่ม ${product.name} ลงในตะกร้าแล้ว`);
    }
}

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Search functionality
const searchForm = document.getElementById('search-form');
const searchOverlay = document.getElementById('search-overlay');
const searchIcon = document.getElementById('search-icon');

if (searchIcon) {
    searchIcon.addEventListener('click', () => {
        if (searchOverlay) {
            searchOverlay.style.display = 'block';
        }
    });
}

if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = e.target.elements.search.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
        if (searchOverlay) {
            searchOverlay.style.display = 'none';
        }
    });
}

// Close search overlay when clicking outside
if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.style.display = 'none';
        }
    });
}

// Filter and sort functionality
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');

function applyFiltersAndSort() {
    let filteredProducts = [...products];
    
    // Apply category filter
    if (categoryFilter && categoryFilter.value) {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter.value);
    }
    
    // Apply sort
    if (sortFilter) {
        switch (sortFilter.value) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
    }
    
    renderProducts(filteredProducts);
}

if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFiltersAndSort);
}
if (sortFilter) {
    sortFilter.addEventListener('change', applyFiltersAndSort);
}

// Pagination
const itemsPerPage = 4;
let currentPage = 1;

function renderPaginatedProducts() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    renderProducts(paginatedProducts);
    updatePaginationButtons();
}

function updatePaginationButtons() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    
    if (prevButton) {
        prevButton.disabled = currentPage === 1;
    }
    if (nextButton) {
        nextButton.disabled = currentPage === Math.ceil(products.length / itemsPerPage);
    }
    if (currentPageSpan) {
        currentPageSpan.textContent = `หน้า ${currentPage}`;
    }
}

const prevButton = document.getElementById('prev-page');
if (prevButton) {
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPaginatedProducts();
        }
    });
}

const nextButton = document.getElementById('next-page');
if (nextButton) {
    nextButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(products.length / itemsPerPage)) {
            currentPage++;
            renderPaginatedProducts();
        }
    });
}

// Newsletter subscription
const newsletterForm = document.getElementById('newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        // Here you would typically send this email to your server
        console.log(`Subscribed email: ${email}`);
        alert('ขอบคุณสำหรับการสมัครรับข่าวสาร!');
        e.target.reset();
    });
}

// Scroll to top functionality
const scrollToTopButton = document.createElement('div');
scrollToTopButton.classList.add('scroll-to-top');
scrollToTopButton.innerHTML = '&#8679;';
document.body.appendChild(scrollToTopButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        scrollToTopButton.classList.add('show');
    } else {
        scrollToTopButton.classList.remove('show');
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderPaginatedProducts();
    updateCartCount();
    
    // Add event listener for add to cart buttons
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });
});

// Featured products on homepage
function renderFeaturedProducts() {
    const featuredProductsGrid = document.getElementById('featured-products-grid');
    if (featuredProductsGrid) {
        const featuredProducts = products.slice(0, 4); // Display first 4 products as featured
        featuredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${formatPrice(product.price)}</p>
                    <button class="add-to-cart" data-id="${product.id}">เพิ่มลงตะกร้า</button>
                </div>
            `;
            featuredProductsGrid.appendChild(productCard);
        });
    }
}

// Call renderFeaturedProducts on homepage
if (document.querySelector('.featured-products')) {
    renderFeaturedProducts();
}

// เพิ่ม Fade-in animation เมื่อ scroll
document.addEventListener('DOMContentLoaded', function() {
    var fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(function(element) {
            var rect = element.getBoundingClientRect();
            var elementTop = rect.top;
            var elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkFade);
    checkFade();
});