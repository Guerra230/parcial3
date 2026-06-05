import type { Product } from '../types/product';

const iphoneImg =
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&q=80';
const iphoneBackImg =
  'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=900&q=80';
const iphoneSilverImg =
  'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=900&q=80';
const iphoneOrangeImg =
  'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=900&q=80';
const samsungImg =
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&q=80';
const samsungS26Img =
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80';
const macbookImg =
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=80';
const ipadImg =
  'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=900&q=80';
const airpodsImg =
  'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?w=900&q=80';
const tvImg =
  'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=900&q=80';
const ps5Img =
  'https://images.unsplash.com/photo-1606318313846-f3e9c2dc0a82?w=900&q=80';
const gamingPcImg =
  'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=900&q=80';
const watchImg =
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&q=80';
const laptopHpImg =
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80';

const iphoneSpecs = [
  { label: 'Capacidad de almacenamiento', value: '512 GB' },
  { label: 'Tamaño de la pantalla', value: '6.9' },
  { label: 'Cámara posterior', value: '48 MP' },
  { label: 'Cámara frontal', value: '18 MP' },
  { label: 'Sistema operativo específico', value: 'iOS 26' },
  { label: 'Memoria RAM', value: '12GB' },
];

const iphoneSections = [
  {
    title: 'Pantalla',
    body: 'Pantalla Super Retina XDR OLED de 6.1 pulgadas\nResolución aproximada 2556 × 1179 píxeles\nTecnología ProMotion hasta 120 Hz',
  },
  {
    title: 'Procesador',
    body: 'Chip A17 Pro\nAlto rendimiento para juegos, edición, multitarea y aplicaciones avanzadas',
  },
  { title: 'Memoria RAM', body: '8 GB de RAM' },
  {
    title: 'Capacidad de almacenamiento',
    body: '128 GB\n256 GB\n512 GB\n1 TB',
  },
  {
    title: 'Cámaras',
    body: 'Sistema de triple cámara trasera\n• Cámara principal 48 MP\n• Ultra gran angular 12 MP\n• Teleobjetivo 12 MP\nGrabación de video 4K\nCámara frontal 12 MP',
  },
  {
    title: 'Batería',
    body: 'Batería de larga duración\nCompatible con carga rápida\nCompatible con carga inalámbrica MagSafe',
  },
  { title: 'Conectividad', body: '5G\nWi-Fi 6E\nBluetooth 5.3\nPuerto USB-C' },
];

const iphoneDescription =
  'El iPhone 15 Pro de Apple es un smartphone de gama alta diseñado para ofrecer máximo rendimiento, fotografía profesional y una experiencia fluida en el uso diario. Cuenta con un elegante diseño premium, materiales resistentes y un potente procesador que permite ejecutar aplicaciones, juegos y tareas exigentes sin esfuerzo. Su avanzado sistema de cámaras permite capturar fotos y videos con gran nivel de detalle, incluso en condiciones de poca luz.';

export const PRODUCTS: Product[] = [
  {
    id: 'iphone-17-pm-512-darkblue',
    name: 'iPhone 17 Pro Max 512GB | 5G | Chip Apple A19 Pro',
    brand: 'APPLE',
    category: 'smartphones',
    price: 6299000,
    oldPrice: 8159000,
    currency: 'COP',
    rating: 5.0,
    reviews: 124,
    stock: 25,
    color: 'Darkblue',
    images: [iphoneImg, iphoneBackImg, iphoneSilverImg],
    shortSpecs: iphoneSpecs,
    description: iphoneDescription,
    sections: iphoneSections,
    badges: ['insurance', 'bank-interest', 'on-sale'],
    freeShipping: true,
  },
  {
    id: 'iphone-17-pm-256-silver',
    name: 'iPhone 17 Pro Max 256GB 5G Silver',
    brand: 'APPLE',
    category: 'smartphones',
    price: 6799000,
    currency: 'COP',
    rating: 5.0,
    reviews: 89,
    stock: 18,
    color: 'Silver',
    images: [iphoneSilverImg, iphoneImg],
    shortSpecs: [
      { label: 'Rear Camera Resolution 1', value: '48 MP' },
      { label: 'Internal Memory', value: '256 GB' },
      { label: 'Screen Size', value: '6.9 Inches' },
      { label: 'RAM', value: '12 GB' },
    ],
    description: iphoneDescription,
    sections: iphoneSections,
    badges: ['insurance', 'bank-interest'],
    freeShipping: true,
  },
  {
    id: 'iphone-17-pm-512-orange',
    name: 'iPhone 17 Pro Max 512GB 5G Orange',
    brand: 'APPLE',
    category: 'smartphones',
    price: 5999000,
    currency: 'COP',
    rating: 5.0,
    reviews: 67,
    stock: 12,
    color: 'Orange',
    images: [iphoneOrangeImg, iphoneImg],
    shortSpecs: [
      { label: 'Rear Camera Resolution 1', value: '48 MP' },
      { label: 'Internal Memory', value: '256 GB' },
      { label: 'Screen Size', value: '6.9 Inches' },
      { label: 'RAM', value: '12 GB' },
    ],
    description: iphoneDescription,
    sections: iphoneSections,
    badges: ['insurance', 'bank-interest'],
    freeShipping: true,
  },
  {
    id: 'iphone-17-256-black',
    name: 'Smartphone iPhone 17 - 6.3" Display - A19 Chip - 8GB RAM - 256GB Storage - Black',
    brand: 'APPLE',
    category: 'smartphones',
    price: 4799000,
    currency: 'COP',
    rating: 4.9,
    reviews: 54,
    stock: 30,
    color: 'Black',
    images: [iphoneImg],
    shortSpecs: [
      { label: 'Internal Memory', value: '256 GB' },
      { label: 'Screen Size', value: '6.3 Inches' },
      { label: 'RAM', value: '8 GB' },
    ],
    description: iphoneDescription,
    badges: ['trending'],
    freeShipping: true,
  },
  {
    id: 'samsung-s26-ultra',
    name: 'Celular | Samsung Galaxy S26 Ultra | 5G | 256 GB | 12GB RAM',
    brand: 'SAMSUNG',
    category: 'smartphones',
    price: 8699900,
    currency: 'COP',
    rating: 4.8,
    reviews: 210,
    stock: 14,
    color: 'Black',
    images: [samsungS26Img, samsungImg],
    shortSpecs: [
      { label: 'Internal Memory', value: '256 GB' },
      { label: 'Screen Size', value: '6.8 Inches' },
      { label: 'RAM', value: '12 GB' },
    ],
    description:
      'Galaxy S26 Ultra de Samsung con cámara de 200MP, pantalla AMOLED Dynamic, S-Pen integrado y procesador Snapdragon de última generación.',
    badges: ['on-sale'],
    freeShipping: true,
  },
  {
    id: 'gaming-pc-ryzen-7',
    name: 'Gaming PC Ryzen 7 5700G 32GB RAM 1TB SSD + 22" Monitor',
    brand: 'AMD',
    category: 'gaming-pc',
    price: 2799900,
    currency: 'COP',
    rating: 4.9,
    reviews: 73,
    stock: 8,
    color: 'Black',
    images: [gamingPcImg],
    shortSpecs: [
      { label: 'Procesador', value: 'Ryzen 7 5700G' },
      { label: 'RAM', value: '32 GB' },
      { label: 'Almacenamiento', value: '1 TB SSD' },
    ],
    description:
      'PC Gaming con procesador Ryzen 7 5700G, 32GB RAM DDR4, 1TB SSD NVMe, gabinete RGB y monitor 22" Full HD incluido.',
    badges: ['on-sale'],
    freeShipping: true,
  },
  {
    id: 'samsung-tv-75',
    name: 'Televisor SAMSUNG 75 pulgadas LED Uhd4K Smart TV',
    brand: 'SAMSUNG',
    category: 'televisions',
    price: 3399600,
    currency: 'COP',
    rating: 4.7,
    reviews: 156,
    stock: 6,
    color: 'Black',
    images: [tvImg],
    shortSpecs: [
      { label: 'Tamaño', value: '75 pulgadas' },
      { label: 'Resolución', value: '4K UHD' },
      { label: 'Smart TV', value: 'Tizen' },
    ],
    description:
      'Smart TV Samsung 75" Crystal UHD 4K con HDR, Tizen OS, control por voz y conexión inalámbrica.',
    badges: ['on-sale'],
    freeShipping: true,
  },
  {
    id: 'ps5-spiderman',
    name: 'Consola Playstation 5 Slim Lector Disco Ps5 Spiderman Digital',
    brand: 'SONY',
    category: 'consoles',
    price: 2429849,
    currency: 'COP',
    rating: 4.9,
    reviews: 312,
    stock: 11,
    color: 'White',
    images: [ps5Img],
    shortSpecs: [
      { label: 'Modelo', value: 'PS5 Slim' },
      { label: 'Almacenamiento', value: '1 TB' },
    ],
    description:
      'PlayStation 5 Slim edición Spiderman 2 con lector de disco, control DualSense y juego digital incluido.',
    badges: ['on-sale'],
    freeShipping: true,
  },
  {
    id: 'ipad-air-m2',
    name: 'iPad Air de 11 pulgadas M2',
    brand: 'APPLE',
    category: 'tablets',
    price: 4299000,
    currency: 'COP',
    rating: 4.8,
    reviews: 48,
    stock: 22,
    color: 'Blue',
    images: [ipadImg],
    shortSpecs: [
      { label: 'Pantalla', value: '11 pulgadas' },
      { label: 'Chip', value: 'Apple M2' },
    ],
    description: 'iPad Air con chip M2, pantalla Liquid Retina y compatibilidad con Apple Pencil Pro.',
    freeShipping: true,
  },
  {
    id: 'macbook-air-m3',
    name: 'Macbook Air 13.6 Pulgadas Chip M3 Apple 8C Cpu 8C Gpu Ram 8Gb Ssd 256Gb Midnight',
    brand: 'APPLE',
    category: 'laptops',
    price: 4999000,
    currency: 'COP',
    rating: 4.9,
    reviews: 92,
    stock: 16,
    color: 'Midnight',
    images: [macbookImg],
    shortSpecs: [
      { label: 'Chip', value: 'M3' },
      { label: 'RAM', value: '8 GB' },
      { label: 'Almacenamiento', value: '256 GB' },
    ],
    description: 'MacBook Air 13.6" con chip Apple M3, batería de hasta 18 horas y diseño ultradelgado.',
    freeShipping: true,
  },
  {
    id: 'airpods-max-azul',
    name: 'Airpods Max Azul Medianoche',
    brand: 'APPLE',
    category: 'audio',
    price: 2199000,
    currency: 'COP',
    rating: 4.7,
    reviews: 134,
    stock: 9,
    color: 'Midnight',
    images: [airpodsImg],
    shortSpecs: [
      { label: 'Tipo', value: 'Over-ear' },
      { label: 'Cancelación', value: 'Activa' },
    ],
    description: 'AirPods Max con cancelación activa de ruido, audio espacial y diseño en aluminio.',
    freeShipping: true,
  },
  {
    id: 'laptop-hp-fd1251la',
    name: 'Laptop HP 15" FD1251LA - Intel Core Ultra 5 - 16GB RAM - 512GB SSD - Silver',
    brand: 'HP',
    category: 'laptops',
    price: 2599070,
    currency: 'COP',
    rating: 4.9,
    reviews: 22,
    stock: 17,
    color: 'Silver',
    images: [laptopHpImg],
    shortSpecs: [
      { label: 'Procesador', value: 'Intel Core Ultra 5' },
      { label: 'RAM', value: '16 GB' },
      { label: 'SSD', value: '512 GB' },
    ],
    description:
      'HP Laptop 15 con Intel Core Ultra 5, pantalla OLED, 16GB RAM y 512GB SSD para máximo rendimiento.',
    freeShipping: true,
  },
  {
    id: 'laptop-hp-fd1056la',
    name: 'Laptop HP 15" FD1056LA - Intel Core Ultra 5 - 24GB RAM - 512GB SSD - Blue',
    brand: 'HP',
    category: 'laptops',
    price: 2618070,
    currency: 'COP',
    rating: 4.8,
    reviews: 12,
    stock: 7,
    color: 'Blue',
    images: [laptopHpImg],
    shortSpecs: [
      { label: 'Procesador', value: 'Intel Core Ultra 5' },
      { label: 'RAM', value: '24 GB' },
      { label: 'SSD', value: '512 GB' },
    ],
    description:
      'HP Laptop 15 con Intel Core Ultra 5, 24GB RAM y 512GB SSD. Ideal para trabajo y estudio.',
    freeShipping: true,
  },
  {
    id: 'apple-watch-series-10',
    name: 'Apple Watch Series 10 GPS 42mm',
    brand: 'APPLE',
    category: 'smartwatches',
    price: 1899000,
    currency: 'COP',
    rating: 4.8,
    reviews: 87,
    stock: 21,
    color: 'Silver',
    images: [watchImg],
    shortSpecs: [
      { label: 'Tamaño caja', value: '42 mm' },
      { label: 'Conectividad', value: 'GPS' },
    ],
    description: 'Apple Watch Series 10 con pantalla más grande, sensor de salud avanzado y batería todo el día.',
    freeShipping: true,
  },
];

export const TODAY_DEALS_IDS = [
  'samsung-s26-ultra',
  'gaming-pc-ryzen-7',
  'samsung-tv-75',
  'ps5-spiderman',
];

export const RECOMMENDED_IDS = [
  'laptop-hp-fd1251la',
  'iphone-17-256-black',
  'laptop-hp-fd1056la',
];

export const RELATED_TO_IPHONE = [
  'ipad-air-m2',
  'macbook-air-m3',
  'airpods-max-azul',
];
