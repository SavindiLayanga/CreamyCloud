// Cart functionality
let cart = JSON.parse(localStorage.getItem('cream_cart')) || [];

function saveCart() {
    localStorage.setItem('cream_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const itemsContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (!badge || !itemsContainer || !totalEl) return; // Not loaded yet

    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    // Update items list
    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="text-center text-gray-500 mt-10" id="empty-cart-msg">
                <i class="bi bi-cart-x text-4xl mb-3 block text-gray-300"></i>
                Your cart is empty.
            </div>
        `;
    } else {
        itemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'd-flex align-items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm';
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover">
                <div class="flex-grow-1">
                    <h6 class="font-bold text-sm mb-1">${item.name}</h6>
                    <div class="text-pink-600 font-medium text-sm">$${item.price.toFixed(2)}</div>
                </div>
                <div class="d-flex flex-column align-items-end gap-2">
                    <button class="btn btn-sm btn-light text-gray-400 hover:text-red-500 p-1" onclick="removeFromCart(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                    <div class="d-flex align-items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
                        <button class="border-0 bg-transparent text-gray-500 font-bold px-1 hover:text-pink-600" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
                        <button class="border-0 bg-transparent text-gray-500 font-bold px-1 hover:text-pink-600" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
            `;
            itemsContainer.appendChild(div);
        });
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.textContent = '$' + total.toFixed(2);
}

function addToCart(name, price, img) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    
    // Show offcanvas automatically
    const offcanvasEl = document.getElementById('cartOffcanvas');
    if (offcanvasEl) {
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
        offcanvas.show();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCart();
        updateCartUI();
    }
}

function checkout() {
    if (cart.length === 0) return;
    alert('Thank you for your order! This is a demo checkout, your ice cream is virtually on its way!');
    cart = [];
    saveCart();
    updateCartUI();
    
    const offcanvasEl = document.getElementById('cartOffcanvas');
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if(offcanvas) offcanvas.hide();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    
    // Contact form demo
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Message sent successfully! We will get back to you soon.');
            form.reset();
        });
    }
});
