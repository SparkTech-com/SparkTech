// productRender.js
import { products } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('detailContainer');
    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('pid');
    const product = products.find(p => p.id === pid);

    if (!product) {
        container.innerHTML = "<h2 style='grid-column: 1/-1; text-align:center;'>Product not found. <br><a href='index.html' style='color:#0ea5e9;'>Go back to Home</a></h2>";
        return;
    }

    const wishlist = JSON.parse(localStorage.getItem('sparktech_wishlist')) || [];
    const cart = JSON.parse(localStorage.getItem('sparktech_cart')) || [];
    
    const isWished = wishlist.includes(product.id);
    const inCart = cart.includes(product.id);

    const heartIcon = isWished ? 'bxs-heart' : 'bx-heart';
    const heartClass = isWished ? 'btn-wishlist active' : 'btn-wishlist';
    
    const cartText = inCart ? 'Remove from Cart' : 'Add to Cart';
    const cartClass = inCart ? 'btn-cart remove-mode' : 'btn-cart';
    const cartIcon = inCart ? 'bx-trash' : 'bx-cart-add';

    // Price Fix
    const displayPrice = product.price ? `₹${product.price.toLocaleString('en-IN')}` : '<span style="font-size: 1.2rem; color: gray;">Price on Request</span>';

    // Smart Video Fix
    let videoHTML = '';
    if (product.media.video) {
        if (product.media.video.includes('youtube.com') || product.media.video.includes('youtu.be')) {
            videoHTML = `<iframe width="100%" height="300" src="${product.media.video}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:16px; border: 1px solid #e2e8f0; margin-top:15px;"></iframe>`;
        } else {
            videoHTML = `<video controls style="width:100%; border-radius:16px; border: 1px solid #e2e8f0; margin-top:15px;"><source src="${product.media.video}" type="video/mp4">Your browser does not support the video tag.</video>`;
        }
    }

    const specsHTML = Object.entries(product.specs).map(([key, value]) => `
        <li><span style="text-transform: capitalize;">${key}</span> <b>${value}</b></li>
    `).join('');

    container.innerHTML = `
        <div class="media-gallery">
            <img src="${product.media.images[0]}" alt="${product.title} Main" onerror="this.src='https://placehold.co/600x400?text=Image+Not+Found'">
            <img src="${product.media.images[1]}" alt="${product.title} Secondary" onerror="this.src='https://placehold.co/600x400?text=Image+Not+Found'">
            ${videoHTML}
        </div>
        
        <div class="product-info-box">
            <span style="background: var(--bg-color); color: var(--primary); padding: 6px 12px; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 0.85rem;">${product.category}</span>
            <h1 style="margin-top:15px;">${product.title}</h1>
            <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 20px;">Brand: <b style="color:var(--text-dark);">${product.brand}</b></p>
            
            <div class="price">${displayPrice}</div>
            <p style="font-size: 1.15rem; line-height: 1.7; color: #334155;">${product.description}</p>
            
            <div class="specs-list">
                <h3>Key Specifications</h3>
                <ul>${specsHTML}</ul>
            </div>
            
            <div class="action-buttons">
                <button class="${cartClass}" data-id="${product.id}" style="padding: 15px 30px; font-size: 1.1rem;">
                    <i class='bx ${cartIcon}'></i> ${cartText}
                </button>
                <button class="${heartClass}" data-id="${product.id}" style="height: 55px; width: 55px; font-size: 1.8rem;" title="Wishlist">
                    <i class='bx ${heartIcon}'></i>
                </button>
                <button class="btn-share" id="nativeShareBtn"><i class='bx bx-share-alt'></i> Share</button>
            </div>
        </div>
    `;

    document.getElementById('nativeShareBtn').addEventListener('click', async () => {
        const shareData = {
            title: product.title,
            text: `Check out ${product.title} on SparkTech!`,
            url: window.location.href
        };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch (err) { console.log('Share canceled'); }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    });
});