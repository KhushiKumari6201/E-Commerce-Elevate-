export const allProducts = [
  {
    id: 'p1',
    name: 'Apple iPhone 15 Pro Max',
    brand: 'Apple',
    price: 159900,
    mrp: 159900,
    discount: 0,
    rating: 4.9,
    reviews: 12420,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Electronics',
    colors: [
      { name: 'Titanium Black', class: 'bg-zinc-800', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400', isAvailable: true },
      { name: 'Titanium Gray', class: 'bg-gray-400', image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&q=80&w=400', isAvailable: true },
      { name: 'Titanium Blue', class: 'bg-slate-700', image: 'https://images.unsplash.com/photo-1606933248051-5ce98adc4cf5?auto=format&fit=crop&q=80&w=400', isAvailable: false }
    ]
  },
  {
    id: 'p2',
    name: 'Zara Men\'s Denim Jacket',
    brand: 'Zara',
    price: 3990,
    mrp: 4990,
    discount: 20,
    rating: 4.6,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Fashion',
    colors: [
      { name: 'Light Blue', class: 'bg-blue-300', image: 'https://images.unsplash.com/photo-1578932750294-708afbd1df1d?auto=format&fit=crop&q=80&w=400', isAvailable: true },
      { name: 'Classic Indigo', class: 'bg-blue-700', image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=400', isAvailable: true },
      { name: 'Washed Black', class: 'bg-zinc-700', image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=400', isAvailable: false }
    ]
  },
  {
    id: 'p3',
    name: 'Modern Velvet Sofa',
    brand: 'Home Decor',
    price: 45000,
    mrp: 60000,
    discount: 25,
    rating: 4.5,
    reviews: 340,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
    assured: false,
    category: 'Home',
    colors: [
      { name: 'Emerald Green', class: 'bg-emerald-700', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400' },
      { name: 'Navy Blue', class: 'bg-blue-900', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' },
      { name: 'Blush Pink', class: 'bg-rose-300', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'p4',
    name: 'Sony Alpha a7 IV Camera',
    brand: 'Sony',
    price: 214990,
    mrp: 224990,
    discount: 4,
    rating: 4.8,
    reviews: 1120,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Electronics',
    colors: [
      { name: 'Matte Black', class: 'bg-black', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'p5',
    name: 'Ray-Ban Classic Aviator',
    brand: 'Ray-Ban',
    price: 8500,
    mrp: 10500,
    discount: 19,
    rating: 4.7,
    reviews: 5600,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Fashion',
    colors: [
      { name: 'Gold/Green', class: 'bg-yellow-600', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400' },
      { name: 'Black/Grey', class: 'bg-gray-800', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400' },
      { name: 'Silver/Blue', class: 'bg-slate-400', image: 'https://images.unsplash.com/photo-1508296695146-367180069918?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'p6',
    name: 'Dyson V15 Detect Vacuum',
    brand: 'Dyson',
    price: 65900,
    mrp: 75900,
    discount: 13,
    rating: 4.8,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Home',
    colors: [
      { name: 'Nickel/Gold', class: 'bg-yellow-500', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=400' },
      { name: 'Iron/Red', class: 'bg-red-600', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'p7',
    name: 'Dell XPS 15 Laptop',
    brand: 'Dell',
    price: 185000,
    mrp: 210000,
    discount: 12,
    rating: 4.6,
    reviews: 2340,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Electronics',
    colors: [
      { name: 'Platinum Silver', class: 'bg-gray-300', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400' },
      { name: 'Frost White', class: 'bg-gray-100', image: 'https://images.unsplash.com/photo-1588405748409-a6b1b8a7ae8b?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'p8',
    name: 'JBL Charge 5 Speaker',
    brand: 'JBL',
    price: 12999,
    mrp: 15999,
    discount: 18,
    rating: 4.5,
    reviews: 4500,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Electronics',
    colors: [
      { name: 'Midnight Black', class: 'bg-black', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400' },
      { name: 'Ocean Blue', class: 'bg-blue-600', image: 'https://images.unsplash.com/photo-1589003077984-894e133da97f?auto=format&fit=crop&q=80&w=400' },
      { name: 'Camo', class: 'bg-green-800', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'f1',
    name: 'Sony WH-1000XM5 Noise Cancelling',
    brand: 'Sony',
    price: 24990,
    mrp: 34990,
    discount: 28,
    rating: 4.8,
    reviews: 12453,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Electronics',
    colors: [
      { name: 'Black', class: 'bg-black', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400' },
      { name: 'Silver', class: 'bg-gray-300', image: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&q=80&w=400' },
      { name: 'Midnight Blue', class: 'bg-blue-900', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'f2',
    name: 'Samsung Galaxy Watch 6 Classic',
    brand: 'Samsung',
    price: 29999,
    mrp: 42999,
    discount: 30,
    rating: 4.7,
    reviews: 5320,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Electronics',
    colors: [
      { name: 'Silver', class: 'bg-gray-300', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400' },
      { name: 'Black', class: 'bg-black', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'f3',
    name: 'Nike Air Force 1 \'07',
    brand: 'Nike',
    price: 7495,
    mrp: 9995,
    discount: 25,
    rating: 4.9,
    reviews: 45210,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Fashion',
    colors: [
      { name: 'Triple White', class: 'bg-white', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400', isAvailable: true },
      { name: 'Triple Black', class: 'bg-black', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400', isAvailable: true },
      { name: 'White/Red', class: 'bg-red-500', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400', isAvailable: false }
    ]
  },
  {
    id: 'f4',
    name: 'Dior Sauvage Eau De Parfum',
    brand: 'Dior',
    price: 11500,
    mrp: 13000,
    discount: 11,
    rating: 4.8,
    reviews: 9800,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=400',
    assured: false,
    category: 'Beauty',
    colors: [
      { name: 'Default', class: 'bg-blue-950' }
    ]
  },
  {
    id: 'p9',
    name: 'Organic Honey 1KG',
    brand: 'Nature',
    price: 450,
    mrp: 600,
    discount: 25,
    rating: 4.6,
    reviews: 1200,
    image: '/organic_honey.png',
    assured: true,
    category: 'Grocery',
    colors: []
  },
  {
    id: 'p10',
    name: 'LEGO City Police Station',
    brand: 'LEGO',
    price: 4500,
    mrp: 5999,
    discount: 25,
    rating: 4.9,
    reviews: 800,
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Toys',
    colors: []
  },
  {
    id: 'p11',
    name: 'Yonex Badminton Racket',
    brand: 'Yonex',
    price: 2499,
    mrp: 3500,
    discount: 28,
    rating: 4.5,
    reviews: 3200,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Sports',
    colors: []
  },
  {
    id: 'p12',
    name: 'Philips Air Fryer XL',
    brand: 'Philips',
    price: 9999,
    mrp: 14995,
    discount: 33,
    rating: 4.7,
    reviews: 4500,
    image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Appliances',
    colors: [
      { name: 'Black', class: 'bg-black' }
    ]
  },
  {
    id: 'p13',
    name: 'Atomic Habits',
    brand: 'Penguin',
    price: 499,
    mrp: 799,
    discount: 37,
    rating: 4.8,
    reviews: 15600,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Books',
    colors: []
  },
  {
    id: 'p14',
    name: 'Fresh Hass Avocados (Pack of 4)',
    brand: 'Nature Farm',
    price: 350,
    mrp: 450,
    discount: 22,
    rating: 4.5,
    reviews: 420,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Grocery',
    colors: []
  },
  {
    id: 'p15',
    name: 'Fresh White Bread',
    brand: 'Daily Bake',
    price: 80,
    mrp: 100,
    discount: 20,
    rating: 4.7,
    reviews: 156,
    image: '/white_bread.png',
    assured: true,
    category: 'Grocery',
    colors: []
  },
  {
    id: 'p16',
    name: 'MAC Matte Lipstick - Ruby Woo',
    brand: 'MAC Cosmetics',
    price: 1950,
    mrp: 1950,
    discount: 0,
    rating: 4.8,
    reviews: 8500,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Beauty',
    colors: [
      { name: 'Ruby Woo', class: 'bg-red-600' }
    ]
  },
  {
    id: 'p17',
    name: 'Advanced Night Repair Serum',
    brand: 'Estée Lauder',
    price: 8500,
    mrp: 9500,
    discount: 10,
    rating: 4.9,
    reviews: 12400,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Beauty',
    colors: []
  },
  {
    id: 'p18',
    name: 'Hot Wheels 5-Car Gift Pack',
    brand: 'Hot Wheels',
    price: 799,
    mrp: 999,
    discount: 20,
    rating: 4.6,
    reviews: 3200,
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Toys',
    colors: []
  },
  {
    id: 'p19',
    name: 'Nike Elite Championship Basketball',
    brand: 'Nike',
    price: 2495,
    mrp: 2995,
    discount: 16,
    rating: 4.8,
    reviews: 1450,
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Sports',
    colors: []
  },
  {
    id: 'p20',
    name: 'Samsung 28L Convection Microwave',
    brand: 'Samsung',
    price: 11500,
    mrp: 15500,
    discount: 25,
    rating: 4.5,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1585659722983-38ca8e9af1a0?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Appliances',
    colors: [
      { name: 'Silver', class: 'bg-gray-300' }
    ]
  },
  {
    id: 'p21',
    name: 'The Alchemist by Paulo Coelho',
    brand: 'HarperCollins',
    price: 299,
    mrp: 399,
    discount: 25,
    rating: 4.9,
    reviews: 45000,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Books',
    colors: []
  },
  {
    id: 'p22',
    name: 'Logitech MX Master 3S Mouse',
    brand: 'Logitech',
    price: 8995,
    mrp: 10995,
    discount: 18,
    rating: 4.8,
    reviews: 6700,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Electronics',
    colors: [
      { name: 'Graphite', class: 'bg-gray-800', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400', isAvailable: true },
      { name: 'Pale Gray', class: 'bg-gray-200', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400', isAvailable: false }
    ]
  },
  {
    id: 'p23',
    name: 'Levi\'s 501 Original Fit Jeans',
    brand: 'Levi\'s',
    price: 3599,
    mrp: 4599,
    discount: 21,
    rating: 4.6,
    reviews: 12500,
    image: 'https://images.unsplash.com/photo-1542272604-780c8d5215fa?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Fashion',
    colors: [
      { name: 'Dark Wash', class: 'bg-blue-900', image: 'https://images.unsplash.com/photo-1542272604-780c8d5215fa?auto=format&fit=crop&q=80&w=400', isAvailable: true },
      { name: 'Light Wash', class: 'bg-blue-400', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400', isAvailable: true }
    ]
  },
  {
    id: 'p24',
    name: 'Lavender Scented Soy Candle',
    brand: 'Lumina',
    price: 599,
    mrp: 899,
    discount: 33,
    rating: 4.7,
    reviews: 840,
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=400',
    assured: true,
    category: 'Home',
    colors: []
  }
];

export const flashProducts = allProducts.filter(p => p.id.startsWith('f'));
export const featuredProducts = allProducts.filter(p => p.id.startsWith('p'));
