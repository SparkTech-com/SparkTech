// cartRender.js
import { products } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    const cartGrid = document.getElementById('cartGrid');
    const cartTotalBox = document.getElementById('cartTotalBox');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    
    let cart = JSON.parse(localStorage.getItem('sparktech_cart')) || [];
    const cartProducts = products.filter(p => cart.includes(p.id));

    if (cartProducts.length === 0) {
        cartGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class='bx bx-cart-alt' style="font-size: 5rem; color: #cbd5e1; margin-bottom: 20px;"></i>
                <h2>Your cart is empty!</h2>
                <p style="color: gray; margin-bottom: 20px;">Looks like you haven't added anything yet.</p>
                <a href="index.html" style="background: var(--primary); color: white; padding: 12px 25px; border-radius: 8px; font-weight: bold;">Start Shopping</a>
            </div>
        `;
        cartTotalBox.style.display = 'none';
        return;
    }

    let totalAmount = 0;

    cartGrid.innerHTML = cartProducts.map(product => {
        // Price Fix for Calculation
        if (product.price) {
            totalAmount += product.price;
        }
        
        const displayPrice = product.price ? `₹${product.price.toLocaleString('en-IN')}` : '<span style="font-size: 1rem; color: gray;">Price on Request</span>';

        return `
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <a href="product.html?pid=${product.id}">
                <div class="card-img-wrapper" style="height: 150px;">
                    <img src="${product.media.images[0]}" alt="${product.title}" onerror="this.src='https://placehold.co/600x400?text=Image+Not+Found'">
                </div>
                <h3 class="card-title">${product.title}</h3>
                <p class="card-price">${displayPrice}</p>
            </a>
            <div class="action-btns" style="margin-top: 15px;">
                <button class="btn-cart remove-mode" data-id="${product.id}" style="width: 100%;">
                    <i class='bx bx-trash'></i> Remove from Cart
                </button>
            </div>
        </div>
        `;
    }).join('');

    cartTotalBox.style.display = 'block';
    cartTotalAmount.innerHTML = `₹${totalAmount.toLocaleString('en-IN')}`;
});