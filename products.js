// ============================================================
// SparkTech — Products Database
// Supports: multiple images, YouTube/local/external videos
// ============================================================
const SPARKTECH_PRODUCTS = [

  /* ─────────────── LAPTOPS ─────────────── */
  {
    id:"lt001", name:"Apple MacBook Pro 14\" M3 Pro", brand:"Apple",
    category:"laptops", price:199900, originalPrice:229900,
    images:[
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"
    ],
    videos:["https://www.youtube.com/embed/ZMEAEjHOOcI"],
    rating:4.9, reviews:2341, stock:15, featured:true, badge:"Best Seller",
    description:"The most powerful MacBook Pro ever. M3 Pro chip, 22-hour battery, Liquid Retina XDR display, and ProRes video acceleration. Perfect for professionals and creatives.",
    specs:{RAM:"18GB Unified",Storage:"512GB SSD",Processor:"Apple M3 Pro",Display:"14.2\" Liquid Retina XDR 120Hz",Battery:"22hr",OS:"macOS Sonoma",Weight:"1.61kg"},
    keywords:["apple","macbook","laptop","m3","pro","macos","ultrabook"]
  },
  {
    id:"lt002", name:"Dell XPS 15 OLED", brand:"Dell",
    category:"laptops", price:175000, originalPrice:195000,
    images:[
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
    ],
    videos:[],
    rating:4.7, reviews:1876, stock:8, featured:true, badge:"Top Rated",
    description:"15.6\" OLED touch display with Intel Core i9, RTX 4070, and premium build quality for professionals and creators who demand the best.",
    specs:{RAM:"32GB DDR5",Storage:"1TB NVMe",Processor:"Intel Core i9-13900H",Display:"15.6\" OLED Touch",GPU:"NVIDIA RTX 4070",Battery:"13hr"},
    keywords:["dell","xps","oled","laptop","creator","i9","rtx"]
  },
  {
    id:"lt003", name:"ASUS ROG Zephyrus G14", brand:"ASUS",
    category:"laptops", price:149900, originalPrice:169900,
    images:[
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80"
    ],
    videos:["https://www.youtube.com/embed/4DhEE-5GkZA"],
    rating:4.8, reviews:3102, stock:12, featured:true, badge:"Gaming",
    description:"AMD Ryzen 9 8945HS, RX 7600S GPU, 120Hz QHD display in a compact 14\" gaming form factor. Silence Mode for work, Turbo for play.",
    specs:{RAM:"16GB LPDDR5",Storage:"512GB SSD",Processor:"AMD Ryzen 9 8945HS",Display:"14\" QHD 120Hz",GPU:"AMD RX 7600S",Battery:"10hr"},
    keywords:["asus","rog","gaming","laptop","amd","ryzen","zephyrus"]
  },
  {
    id:"lt004", name:"Lenovo ThinkPad X1 Carbon Gen 11", brand:"Lenovo",
    category:"laptops", price:132000, originalPrice:145000,
    images:["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"],
    videos:[],
    rating:4.6, reviews:987, stock:20, featured:false, badge:"Business",
    description:"Ultra-light 1.12kg business laptop with 2.8K OLED, military-grade MIL-SPEC durability, and 15hr battery life. The professional's choice.",
    specs:{RAM:"16GB LPDDR5",Storage:"512GB SSD",Processor:"Intel Core i7-1365U",Display:"14\" 2.8K OLED",Weight:"1.12kg",Battery:"15hr"},
    keywords:["lenovo","thinkpad","business","ultralight","x1","carbon"]
  },
  {
    id:"lt005", name:"HP Spectre x360 14 2-in-1", brand:"HP",
    category:"laptops", price:125000, originalPrice:138000,
    images:["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"],
    videos:[],
    rating:4.5, reviews:654, stock:6, featured:true, badge:"2-in-1",
    description:"Convertible 2-in-1 with OLED touchscreen, Intel Evo platform, 360° hinge, and 17hr battery. Laptop, tablet, tent — all in one.",
    specs:{RAM:"16GB",Storage:"512GB SSD",Processor:"Intel Core i7-1355U",Display:"13.5\" OLED Touch",Type:"2-in-1 Convertible",Battery:"17hr"},
    keywords:["hp","spectre","convertible","2in1","oled","touchscreen"]
  },
  {
    id:"lt006", name:"MSI Titan GT77 HX Ultimate", brand:"MSI",
    category:"laptops", price:285000, originalPrice:310000,
    images:["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80"],
    videos:[],
    rating:4.7, reviews:421, stock:3, featured:false, badge:"Ultimate",
    description:"Core i9-13980HX, RTX 4090, 17.3\" 4K Mini-LED 144Hz — the most powerful gaming laptop ever made. Desktop replacement redefined.",
    specs:{RAM:"64GB DDR5",Storage:"4TB NVMe",Processor:"Intel Core i9-13980HX",Display:"17.3\" 4K Mini-LED 144Hz",GPU:"NVIDIA RTX 4090",Battery:"6hr"},
    keywords:["msi","titan","gaming","rtx4090","flagship","desktop-replacement"]
  },

  /* ─────────────── MOBILES ─────────────── */
  {
    id:"mb001", name:"iPhone 15 Pro Max", brand:"Apple",
    category:"mobiles", price:134900, originalPrice:134900,
    images:[
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80"
    ],
    videos:["https://www.youtube.com/embed/eXAYYnZOiHg"],
    rating:4.9, reviews:8921, stock:25, featured:true, badge:"New",
    description:"Titanium design, A17 Pro chip, 48MP camera system with 5x optical zoom, USB-C connectivity, and the new Action button for instant customization.",
    specs:{RAM:"8GB",Storage:"256GB",Processor:"Apple A17 Pro",Display:"6.7\" Super Retina XDR ProMotion",Camera:"48MP + 12MP + 12MP",Battery:"4422mAh"},
    keywords:["apple","iphone","15","pro","max","titanium","a17","5x zoom"]
  },
  {
    id:"mb002", name:"Samsung Galaxy S24 Ultra", brand:"Samsung",
    category:"mobiles", price:129999, originalPrice:134999,
    images:[
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
      "https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?w=800&q=80"
    ],
    videos:[],
    rating:4.8, reviews:5432, stock:18, featured:true, badge:"S Pen",
    description:"200MP camera, built-in S Pen, Snapdragon 8 Gen 3 for Galaxy, titanium frame, and Galaxy AI features that change how you work.",
    specs:{RAM:"12GB",Storage:"256GB",Processor:"Snapdragon 8 Gen 3",Display:"6.8\" QHD+ 120Hz",Camera:"200MP+12MP+50MP+10MP",Battery:"5000mAh"},
    keywords:["samsung","galaxy","s24","ultra","spen","android","200mp"]
  },
  {
    id:"mb003", name:"OnePlus 12 5G", brand:"OnePlus",
    category:"mobiles", price:64999, originalPrice:69999,
    images:["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"],
    videos:[],
    rating:4.7, reviews:3211, stock:30, featured:true, badge:"Fast Charge",
    description:"Hasselblad cameras, 100W SUPERVOOC charging (full charge in 26 min), Snapdragon 8 Gen 3, and buttery 120Hz LTPO display.",
    specs:{RAM:"16GB",Storage:"512GB",Processor:"Snapdragon 8 Gen 3",Display:"6.82\" QHD+ 120Hz",Camera:"50MP Hasselblad+48MP+64MP",Battery:"5400mAh 100W"},
    keywords:["oneplus","12","hasselblad","supervooc","android","snapdragon"]
  },
  {
    id:"mb004", name:"Google Pixel 8 Pro", brand:"Google",
    category:"mobiles", price:89999, originalPrice:99999,
    images:["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"],
    videos:[],
    rating:4.7, reviews:1876, stock:14, featured:false, badge:"AI Camera",
    description:"Google Tensor G3, industry-best computational photography, 7 years of guaranteed OS updates, and advanced Gemini AI features.",
    specs:{RAM:"12GB",Storage:"128GB",Processor:"Google Tensor G3",Display:"6.7\" LTPO OLED 120Hz",Camera:"50MP+48MP+48MP",Battery:"5050mAh"},
    keywords:["google","pixel","8","pro","tensor","ai","photography"]
  },
  {
    id:"mb005", name:"Xiaomi 14 Ultra", brand:"Xiaomi",
    category:"mobiles", price:99999, originalPrice:109999,
    images:["https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80"],
    videos:[],
    rating:4.8, reviews:2134, stock:10, featured:true, badge:"Leica",
    description:"Leica quad camera system with variable aperture, Snapdragon 8 Gen 3, 90W wireless charging, and premium ceramic body.",
    specs:{RAM:"16GB",Storage:"512GB",Processor:"Snapdragon 8 Gen 3",Display:"6.73\" LTPO AMOLED 120Hz",Camera:"50MP Leica x4",Battery:"5300mAh 90W"},
    keywords:["xiaomi","14","ultra","leica","camera","snapdragon"]
  },
  {
    id:"mb006", name:"Samsung Galaxy Z Fold 5", brand:"Samsung",
    category:"mobiles", price:154999, originalPrice:164999,
    images:["https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?w=800&q=80"],
    videos:[],
    rating:4.6, reviews:987, stock:7, featured:false, badge:"Foldable",
    description:"7.6\" inner foldable display, Snapdragon 8 Gen 2, FlexMode for hands-free video calls, and IPX8 water resistance.",
    specs:{RAM:"12GB",Storage:"256GB",Processor:"Snapdragon 8 Gen 2",Display:"7.6\" Foldable + 6.2\" Cover",Camera:"50MP+12MP+10MP",Battery:"4400mAh"},
    keywords:["samsung","fold","foldable","galaxy","z","fold5"]
  },

  /* ─────────────── TABLETS ─────────────── */
  {
    id:"tb001", name:"iPad Pro 12.9\" M2 WiFi", brand:"Apple",
    category:"tablets", price:112900, originalPrice:119900,
    images:["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"],
    videos:[],
    rating:4.9, reviews:3421, stock:11, featured:true, badge:"Pro",
    description:"M2 chip, Liquid Retina XDR with ProMotion 120Hz, Apple Pencil hover detection, and Thunderbolt 4 connectivity.",
    specs:{RAM:"8GB",Storage:"128GB",Processor:"Apple M2",Display:"12.9\" Liquid Retina XDR 120Hz",Camera:"12MP+10MP+LiDAR",Battery:"10hr"},
    keywords:["apple","ipad","pro","m2","tablet","pencil","thunderbolt"]
  },
  {
    id:"tb002", name:"Samsung Galaxy Tab S9 Ultra", brand:"Samsung",
    category:"tablets", price:108999, originalPrice:119999,
    images:["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80"],
    videos:[],
    rating:4.7, reviews:1654, stock:8, featured:true, badge:"AMOLED",
    description:"14.6\" Dynamic AMOLED display, Snapdragon 8 Gen 2, S Pen included, and IP68 water resistance for ultimate productivity.",
    specs:{RAM:"12GB",Storage:"256GB",Processor:"Snapdragon 8 Gen 2",Display:"14.6\" Dynamic AMOLED 120Hz",SpeN:"Included",Battery:"11200mAh"},
    keywords:["samsung","galaxy","tab","s9","ultra","tablet","spen","amoled"]
  },
  {
    id:"tb003", name:"Xiaomi Pad 6 Pro", brand:"Xiaomi",
    category:"tablets", price:34999, originalPrice:39999,
    images:["https://images.unsplash.com/photo-1574096079513-d8259312b785?w=800&q=80"],
    videos:[],
    rating:4.5, reviews:876, stock:20, featured:false, badge:"Value",
    description:"11\" 144Hz LCD, Snapdragon 8+ Gen 1, 67W fast charging, quad speakers with Dolby Atmos — incredible value.",
    specs:{RAM:"8GB",Storage:"256GB",Processor:"Snapdragon 8+ Gen 1",Display:"11\" LCD 144Hz",Speakers:"Quad Dolby Atmos",Battery:"8600mAh 67W"},
    keywords:["xiaomi","pad","6","pro","tablet","144hz","budget"]
  },

  /* ─────────────── COMPUTERS ─────────────── */
  {
    id:"pc001", name:"Apple Mac Mini M2 Pro", brand:"Apple",
    category:"computers", price:89900, originalPrice:94900,
    images:["https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&q=80"],
    videos:[],
    rating:4.8, reviews:2109, stock:9, featured:true, badge:"Compact",
    description:"Tiny powerhouse with M2 Pro, 10-core CPU, 16-core GPU, up to 32GB unified memory, and 3 Thunderbolt 4 ports.",
    specs:{RAM:"16GB Unified",Storage:"512GB SSD",Processor:"Apple M2 Pro",GPU:"16-core GPU",Ports:"Thunderbolt 4 x3, HDMI 2.1",OS:"macOS Sonoma"},
    keywords:["apple","mac","mini","m2","pro","desktop","compact"]
  },
  {
    id:"pc002", name:"ASUS ProArt Station PD5 Workstation", brand:"ASUS",
    category:"computers", price:145000, originalPrice:159000,
    images:["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80"],
    videos:[],
    rating:4.6, reviews:321, stock:5, featured:true, badge:"Workstation",
    description:"Core i9-13900K, RTX 4070 Ti, 64GB DDR5 — built for 3D rendering, video editing, and creative professionals.",
    specs:{RAM:"64GB DDR5",Storage:"2TB NVMe",Processor:"Intel Core i9-13900K",GPU:"NVIDIA RTX 4070 Ti",PSU:"850W 80+ Gold"},
    keywords:["asus","proart","workstation","desktop","rtx","rendering","creator"]
  },

  /* ─────────────── PC COMPONENTS ─────────────── */
  {
    id:"comp001", name:"NVIDIA GeForce RTX 4080 Super", brand:"NVIDIA",
    category:"components", price:89999, originalPrice:99999,
    images:["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80"],
    videos:[],
    rating:4.9, reviews:1876, stock:6, featured:true, badge:"GPU",
    description:"16GB GDDR6X, DLSS 3.5 Frame Generation, Ada Lovelace architecture — the GPU for serious 4K gaming and AI workloads.",
    specs:{VRAM:"16GB GDDR6X",Architecture:"Ada Lovelace",TDP:"320W",DLSS:"3.5",Interface:"PCIe 4.0 x16"},
    keywords:["nvidia","rtx","4080","super","gpu","graphics","gaming","4k"]
  },
  {
    id:"comp002", name:"AMD Ryzen 9 7950X Processor", brand:"AMD",
    category:"components", price:54999, originalPrice:62999,
    images:["https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80"],
    videos:[],
    rating:4.8, reviews:987, stock:12, featured:true, badge:"CPU",
    description:"16 cores, 32 threads, 5.7GHz boost — AMD's flagship Zen 4 processor for content creators and enthusiast gamers.",
    specs:{Cores:"16C / 32T",BoostClock:"5.7GHz",TDP:"170W",Socket:"AM5",Cache:"80MB",Node:"5nm TSMC"},
    keywords:["amd","ryzen","9","7950x","cpu","processor","am5","zen4"]
  },
  {
    id:"comp003", name:"Samsung 990 Pro 2TB NVMe SSD", brand:"Samsung",
    category:"components", price:18999, originalPrice:22999,
    images:["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80"],
    videos:[],
    rating:4.9, reviews:3421, stock:25, featured:false, badge:"SSD",
    description:"7450MB/s read, 6900MB/s write — PCIe 4.0 NVMe ultimate storage for PS5, desktops, and laptops.",
    specs:{Capacity:"2TB",Interface:"PCIe 4.0 NVMe M.2",Read:"7450 MB/s",Write:"6900 MB/s",TBW:"1200 TBW"},
    keywords:["samsung","990","pro","ssd","nvme","m2","storage","pcie4"]
  },
  {
    id:"comp004", name:"Corsair Vengeance DDR5 32GB Kit", brand:"Corsair",
    category:"components", price:12999, originalPrice:15999,
    images:["https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80"],
    videos:[],
    rating:4.7, reviews:2109, stock:18, featured:false, badge:"RAM",
    description:"32GB (2×16GB) DDR5-6000 with Intel XMP 3.0 and AMD EXPO, aggressive aluminum heatspreader for optimal cooling.",
    specs:{Capacity:"32GB (2×16GB)",Speed:"DDR5-6000",Timings:"CL30",Voltage:"1.35V",XMP:"3.0 & EXPO"},
    keywords:["corsair","vengeance","ddr5","ram","memory","32gb","xmp"]
  },

  /* ─────────────── ACCESSORIES ─────────────── */
  {
    id:"acc001", name:"Apple AirPods Pro 2nd Gen", brand:"Apple",
    category:"accessories", price:24900, originalPrice:26900,
    images:["https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&q=80"],
    videos:[],
    rating:4.8, reviews:8765, stock:35, featured:true, badge:"ANC",
    description:"Active Noise Cancellation, Transparency mode, Adaptive Audio, and MagSafe USB-C charging case with up to 30hr total battery.",
    specs:{Type:"True Wireless IEM",ANC:"Adaptive",BatteryLife:"6hr + 30hr case",Bluetooth:"5.3",WaterResistant:"IPX4"},
    keywords:["apple","airpods","pro","anc","earbuds","wireless","magsafe"]
  },
  {
    id:"acc002", name:"Sony WH-1000XM5 Headphones", brand:"Sony",
    category:"accessories", price:29990, originalPrice:34990,
    images:["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    videos:[],
    rating:4.9, reviews:12341, stock:22, featured:true, badge:"Best ANC",
    description:"Industry-leading ANC with 8 mics, 30hr battery, multipoint Bluetooth 5.2, LDAC Hi-Res Audio, and foldable design.",
    specs:{Type:"Over-Ear",ANC:"8 Microphones",BatteryLife:"30hr",Bluetooth:"5.2",Codec:"LDAC, AAC, SBC"},
    keywords:["sony","wh1000xm5","headphones","anc","wireless","ldac"]
  },
  {
    id:"acc003", name:"Logitech MX Master 3S Mouse", brand:"Logitech",
    category:"accessories", price:8999, originalPrice:10999,
    images:["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80"],
    videos:[],
    rating:4.8, reviews:5432, stock:40, featured:true, badge:"Productivity",
    description:"8000 DPI Darkfield sensor, MagSpeed electromagnetic scroll, USB-C, works on any surface including glass.",
    specs:{DPI:"200–8000",Battery:"70 days",Connectivity:"Bluetooth & Logi Bolt",Buttons:"7 programmable",Weight:"141g"},
    keywords:["logitech","mx","master","mouse","wireless","productivity","ergonomic"]
  },
  {
    id:"acc004", name:"Samsung 27\" 4K OLED Monitor S90PC", brand:"Samsung",
    category:"accessories", price:59999, originalPrice:69999,
    images:["https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80"],
    videos:[],
    rating:4.7, reviews:876, stock:7, featured:true, badge:"OLED",
    description:"27\" 4K OLED, 0.03ms GtG, 240Hz, 99% DCI-P3, USB-C 90W PD — the ultimate monitor for gaming and creative work.",
    specs:{Size:"27\"",Resolution:"3840×2160",Panel:"OLED",RefreshRate:"240Hz",ResponseTime:"0.03ms GtG"},
    keywords:["samsung","monitor","oled","4k","240hz","gaming","display"]
  },
  {
    id:"acc005", name:"Anker 100W GaN 3-Port Charger", brand:"Anker",
    category:"accessories", price:3499, originalPrice:4499,
    images:["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80"],
    videos:[],
    rating:4.6, reviews:6543, stock:50, featured:false, badge:"GaN",
    description:"Compact 100W GaN III, 2× USB-C + 1× USB-A, PPS & PD 3.0 — charges MacBook Pro, iPad, and iPhone simultaneously.",
    specs:{Power:"100W Total",Ports:"USB-C×2, USB-A×1",Tech:"GaN III, PD 3.0, PPS",Weight:"148g"},
    keywords:["anker","charger","gan","100w","usbc","fast","charging"]
  },

  /* ─────────────── SMARTWATCHES ─────────────── */
  {
    id:"sw001", name:"Apple Watch Ultra 2", brand:"Apple",
    category:"smartwatches", price:89900, originalPrice:89900,
    images:["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80"],
    videos:[],
    rating:4.8, reviews:2109, stock:10, featured:true, badge:"Rugged",
    description:"49mm titanium, precision dual-frequency GPS, 60hr battery in low-power mode, 2000-nit display — for athletes and adventurers.",
    specs:{Case:"49mm Titanium",Display:"2000 nits OLED",GPS:"L1+L5 Dual",Battery:"36hr / 60hr LP",Water:"100m WR"},
    keywords:["apple","watch","ultra","2","gps","titanium","rugged","sports"]
  },
  {
    id:"sw002", name:"Samsung Galaxy Watch 6 Classic 47mm", brand:"Samsung",
    category:"smartwatches", price:34999, originalPrice:39999,
    images:["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    videos:[],
    rating:4.6, reviews:1543, stock:15, featured:true, badge:"Classic",
    description:"Rotating physical bezel, Super AMOLED, BIA + ECG + Blood Pressure sensors, Wear OS 4 with Galaxy AI integration.",
    specs:{Case:"47mm Stainless Steel",Display:"Super AMOLED",Battery:"40hr",Water:"5ATM+IP68",Health:"BIA, ECG, BP"},
    keywords:["samsung","galaxy","watch","6","classic","wear","os","rotating"]
  },

  /* ─────────────── GAMING ─────────────── */
  {
    id:"gm001", name:"Sony DualSense Edge Pro Controller", brand:"Sony",
    category:"gaming", price:19999, originalPrice:22999,
    images:["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80"],
    videos:[],
    rating:4.7, reviews:3421, stock:12, featured:true, badge:"Pro",
    description:"PS5 pro controller with swappable stick modules, back buttons, adjustable triggers, and haptic feedback perfected.",
    specs:{Platform:"PS5 / PC",Battery:"12hr",Connection:"USB-C / Bluetooth 5.1",Features:"Haptic, Adaptive Triggers, Remappable"},
    keywords:["sony","dualsense","edge","ps5","controller","gaming","pro"]
  },
  {
    id:"gm002", name:"Razer BlackWidow V4 Pro Wireless", brand:"Razer",
    category:"gaming", price:16999, originalPrice:19999,
    images:["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
    videos:[],
    rating:4.6, reviews:2134, stock:16, featured:false, badge:"Mechanical",
    description:"Wireless mechanical gaming keyboard with Razer Chroma RGB, Command Dial, and 200hr battery life.",
    specs:{Type:"Mechanical",Switches:"Razer Yellow Silent",RGB:"Chroma Per-key",Battery:"200hr",Connectivity:"2.4GHz & BT"},
    keywords:["razer","blackwidow","mechanical","keyboard","gaming","rgb","wireless"]
  }
];

// Auto-build images array for products that only have image field
SPARKTECH_PRODUCTS.forEach(p => {
  if (!p.images || !p.images.length) {
    p.images = p.image ? [p.image] : [];
  }
  if (!p.videos) p.videos = [];
});
