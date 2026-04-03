// app.js
import { products } from './products.js';

let wishlist = JSON.parse(localStorage.getItem('sparktech_wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('sparktech_cart')) || [];

export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? "<i class='bx bx-check-circle' style='color:#10b981; font-size:1.5rem;'></i>" : "<i class='bx bx-error-circle' style='color:#ef4444; font-size:1.5rem;'></i>";
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400); 
    }, 3000);
}

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const results = products.filter(p => {
            const searchString = `${p.title} ${p.brand} ${p.description} ${p.searchKeywords || ''}`.toLowerCase();
            return searchString.includes(query);
        });

        if (results.length === 0) {
            searchResults.innerHTML = `<div style="padding: 15px; text-align: center; color: gray;">No products found for "${query}"</div>`;
        } else {
            searchResults.innerHTML = results.map(p => {
                const searchPrice = p.price ? `₹${p.price.toLocaleString('en-IN')}` : 'Price on Request';
                return `
                <a href="product.html?pid=${p.id}" style="display: flex; gap: 10px; padding: 10px; border-bottom: 1px solid #f1f5f9;">
                    <img src="${p.media.images[0]}" onerror="this.src='https://placehold.co/50x50?text=No+Image'" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    <div>
                        <div style="font-weight: bold; color: #0f172a;">${p.title}</div>
                        <div style="font-size: 0.85rem; color: #0ea5e9;">${searchPrice}</div>
                    </div>
                </a>
            `}).join('');
        }
        searchResults.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.style.display = 'none';
        }
    });
}

const slides = document.querySelectorAll('.banner-slide');
if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000); 
}

function createCardHTML(product) {
    const isWished = wishlist.includes(product.id);
    const inCart = cart.includes(product.id);

    const heartIcon = isWished ? 'bxs-heart' : 'bx-heart';
    const heartClass = isWished ? 'btn-wishlist active' : 'btn-wishlist';
    
    const cartText = inCart ? 'Remove from Cart' : 'Add to Cart';
    const cartClass = inCart ? 'btn-cart remove-mode' : 'btn-cart';
    const cartIcon = inCart ? 'bx-trash' : 'bx-cart-add';

    // Price Fix
    const displayPrice = product.price ? `₹${product.price.toLocaleString('en-IN')}` : '<span style="font-size: 1rem; color: gray;">Price on Request</span>';

    return `
        <div class="card">
            <a href="product.html?pid=${product.id}">
                <div class="card-img-wrapper">
                    <img src="${product.media.images[0]}" alt="${product.title}" onerror="this.src='https://placehold.co/600x400?text=Image+Not+Found'">
                </div>
                <h3 class="card-title">${product.title}</h3>
                <p class="card-price">${displayPrice}</p>
            </a>
            <div class="action-btns">
                <button class="${cartClass}" data-id="${product.id}">
                    <i class='bx ${cartIcon}'></i> ${cartText}
                </button>
                <button class="${heartClass}" data-id="${product.id}" title="Wishlist">
                    <i class='bx ${heartIcon}'></i>
                </button>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    
    if (page === 'home') {
        const categoriesToRender = [
            { id: 'laptop-carousel', type: 'laptop' },
            { id: 'mobile-carousel', type: 'mobile' },
            { id: 'pc-carousel', type: 'pc' },
            { id: 'accessories-carousel', type: 'accessories' }
        ];

        categoriesToRender.forEach(cat => {
            const container = document.getElementById(cat.id);
            if (container) {
                // Home Page Limit and Featured Fix
                const categoryProducts = products.filter(p => p.category === cat.type && p.featured === true).slice(0, 10);
                container.innerHTML = categoryProducts.map(p => createCardHTML(p)).join('');
            }
        });
    } 
    else if (page) {
        const grid = document.getElementById('productGrid');
        if (!grid) return;

        let filteredProducts = [];

        if (page === 'wishlist') {
            filteredProducts = products.filter(p => wishlist.includes(p.id));
            if (filteredProducts.length === 0) {
                grid.innerHTML = "<div style='grid-column: 1/-1; text-align:center; padding: 40px;'><i class='bx bx-heart' style='font-size: 4rem; color: #cbd5e1;'></i><h2>Your wishlist is empty!</h2></div>";
                return;
            }
        } else {
            filteredProducts = products.filter(p => p.category === page);
            if (filteredProducts.length === 0) {
                grid.innerHTML = "<div style='grid-column: 1/-1; text-align:center; padding: 40px;'><h2>No products found in this category yet.</h2></div>";
                return;
            }
        }

        grid.innerHTML = filteredProducts.map(p => createCardHTML(p)).join('');
    }
});

document.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('.btn-wishlist');
    if (wishBtn) {
        e.preventDefault();
        const id = wishBtn.dataset.id;
        if (wishlist.includes(id)) {
            wishlist = wishlist.filter(itemId => itemId !== id);
            showToast('Removed from Wishlist', 'error');
            wishBtn.classList.remove('active');
            wishBtn.innerHTML = "<i class='bx bx-heart'></i>";
        } else {
            wishlist.push(id);
            showToast('Added to Wishlist', 'success');
            wishBtn.classList.add('active');
            wishBtn.innerHTML = "<i class='bx bxs-heart'></i>";
        }
        localStorage.setItem('sparktech_wishlist', JSON.stringify(wishlist));
    }

    const cartBtn = e.target.closest('.btn-cart');
    if (cartBtn) {
        e.preventDefault();
        const id = cartBtn.dataset.id;
        if (cart.includes(id)) {
            cart = cart.filter(itemId => itemId !== id);
            showToast('Removed from Cart', 'error');
            cartBtn.classList.remove('remove-mode');
            cartBtn.innerHTML = "<i class='bx bx-cart-add'></i> Add to Cart";
        } else {
            cart.push(id);
            showToast('Added to Cart', 'success');
            cartBtn.classList.add('remove-mode');
            cartBtn.innerHTML = "<i class='bx bx-trash'></i> Remove from Cart";
        }
        localStorage.setItem('sparktech_cart', JSON.stringify(cart));
        
        if(document.body.dataset.page === 'cart') {
            setTimeout(() => window.location.reload(), 800);
        }
    }
});

const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => { navLinks.classList.toggle('active'); });
}