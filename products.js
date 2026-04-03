// products.js
export const products = [
    // --- Laptops ---
    {
      id: "LP-001", category: "laptop", brand: "Dell", title: "Dell XPS 13 9340", 
      price: null, // यहाँ प्राइस दिया गया है
      featured: true, // true का मतलब यह होम पेज पर दिखेगा
      description: "Premium ultrabook with slim design, fast performance and OLED display.",
      specs: { ram: "16GB", rom: "1TB SSD", processor: "Intel Core Ultra 7" },
      searchKeywords: "dell xps 13 laptop 16gb 1tb ssd ultrabook",
      media: { images: ["https://placehold.co/600x400/0ea5e9/ffffff?text=Dell+XPS+Front", "https://placehold.co/600x400/0284c7/ffffff?text=Dell+XPS+Side"], video: "https://www.w3schools.com/html/mov_bbb.mp4" }
    },
    {
      id: "LP-002", category: "laptop", brand: "Apple", title: "MacBook Air M3", 
      price: null, // प्राइस नहीं है! अब यह क्रैश नहीं होगा, 'Price on Request' दिखाएगा
      featured: false, // false का मतलब यह होम पेज पर नहीं दिखेगा, सिर्फ Laptops पेज पर दिखेगा
      description: "Supercharged by M3 chip. Incredibly thin and light.",
      specs: { ram: "8GB", rom: "256GB SSD", processor: "Apple M3" },
      searchKeywords: "apple macbook air m3 laptop 8gb 256gb macos",
      media: { images: ["https://placehold.co/600x400/64748b/ffffff?text=MacBook+Air", "https://placehold.co/600x400/475569/ffffff?text=MacBook+Side"], video: "https://www.youtube.com/embed/dQw4w9WgXcQ" } // यूट्यूब लिंक का उदाहरण
    },
    // --- Mobiles ---
    {
      id: "SP-001", category: "mobile", brand: "Apple", title: "iPhone 15 Pro", 
      price: 134900,
      featured: true,
      description: "Titanium design, A17 Pro chip, 48MP main camera.",
      specs: { ram: "8GB", rom: "256GB", processor: "A17 Pro" },
      searchKeywords: "apple iphone 15 pro mobile smartphone 8gb 256gb ios",
      media: { images: ["https://placehold.co/600x400/facc15/000000?text=iPhone+15+Pro", "https://placehold.co/600x400/fbbf24/000000?text=iPhone+Back"], video: "https://www.w3schools.com/html/mov_bbb.mp4" }
    },
    {
      id: "SP-002", category: "mobile", brand: "Samsung", title: "Galaxy S24 Ultra", 
      price: 129999,
      featured: true,
      description: "Galaxy AI is here. Titanium exterior, 200MP camera.",
      specs: { ram: "12GB", rom: "512GB", processor: "Snapdragon 8 Gen 3" },
      searchKeywords: "samsung galaxy s24 ultra mobile smartphone 12gb 512gb android ai",
      media: { images: ["https://placehold.co/600x400/3b82f6/ffffff?text=S24+Ultra", "https://placehold.co/600x400/2563eb/ffffff?text=S24+Pen"], video: "https://www.w3schools.com/html/mov_bbb.mp4" }
    },
    // --- PC Components ---
    {
      id: "PC-001", category: "pc", brand: "Nvidia", title: "RTX 4070 Ti Super GPU", 
      price: 82000,
      featured: true,
      description: "Ultimate gaming and creator GPU with DLSS 3.",
      specs: { ram: "16GB VRAM", rom: "N/A", processor: "Ada Lovelace Architecture" },
      searchKeywords: "nvidia rtx 4070 ti super graphic card gpu pc component 16gb gaming",
      media: { images: ["https://placehold.co/600x400/10b981/ffffff?text=RTX+4070", "https://placehold.co/600x400/059669/ffffff?text=GPU+Fans"], video: "https://www.w3schools.com/html/mov_bbb.mp4" }
    },
    // --- Accessories ---
    {
      id: "AC-001", category: "accessories", brand: "Sony", title: "WH-1000XM5 Headphones", 
      
      featured: true,
      description: "Industry leading noise canceling wireless headphones.",
      specs: { type: "Over-ear", battery: "30 Hours", connectivity: "Bluetooth 5.2" },
      searchKeywords: "sony wh 1000xm5 headphones wireless bluetooth anc audio accessories",
      media: { images: ["https://th.bing.com/th/id/OIP.z6TqFIBKADkWsJG8mWE--gHaHa?w=174&h=180&c=7&r=0&o=7&pid=1.7&rm=3", 
        "https://res.cloudinary.com/dpuntsj8x/image/upload/v1775214732/Screenshot_2026-02-15_100638_j7paul.png"], 
        video: "https://res.cloudinary.com/dpuntsj8x/video/upload/v1775215142/videoplayback_ciy7r7.mp4" }
    }
];