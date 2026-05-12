import type { CategoryNavItem } from '../types/category';

export const CATEGORIES: CategoryNavItem[] = [
  {
    id: 'smartphones',
    label: 'Smartphones',
    slug: 'smartphones',
    megaMenu: [
      {
        title: 'Smartphones',
        icon: 'phone',
        groups: [
          {
            heading: 'Brands',
            items: [
              'iPhone | Samsung | Xiaomi | Motorola | vivo |',
              'Oppo | Realme | ZTE | TCL | Kalley | Huawei |',
              'Honor | Tecno | Infinix | Poco',
            ],
          },
          {
            heading: 'Storage capacity',
            items: ['64 GB | 128 GB | 256 | 512 | 1T 1 2T'],
          },
          {
            heading: 'RAM memory',
            items: ['2 GB | 3 GB | 4 GB | 6 GB | 8 GB | 12 GB'],
          },
        ],
      },
      {
        title: 'Accessories',
        icon: 'tv',
        groups: [
          {
            heading: 'Mobile & Tablet Accessories',
            items: [
              'Cases and Covers',
              'Headphones and Hands-Free',
              'Micro SD Memory Cards',
              'External Power Bank Batteries',
              'Cables, Chargers, Adapters',
              'Bases and Stands',
            ],
          },
        ],
      },
      {
        title: 'More',
        icon: 'search',
        groups: [
          {
            heading: 'Discover More',
            items: [
              'Free Insurance',
              'Trade-In Plan',
              'Cheap Phones',
              'Mobile Phone Launches',
              'SIM Cards',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'laptops',
    label: 'Laptops',
    slug: 'laptops',
    megaMenu: [
      {
        title: 'Laptops and Notebooks',
        icon: 'laptop',
        groups: [
          {
            heading: 'Laptops',
            items: [
              'Gaming Laptops',
              'For Content Creators',
              'With Artificial Intelligence',
              'Business Laptops',
            ],
          },
          {
            heading: 'Brands',
            items: ['HP | Lenovo | Acer | Apple | Asus | MSI'],
          },
          {
            heading: 'Processors and Graphics Cards',
            items: ['Intel | AMD | Nvidia | Snapdragon'],
          },
        ],
      },
      {
        title: 'Desktop Computers and All-in-One',
        icon: 'desktop',
        groups: [
          {
            heading: 'Screen Size',
            items: ['19" to 22"', '23" to 27"', 'More than 27"'],
          },
          {
            heading: 'Brands',
            items: ['Lenovo | HP | Apple | Acer'],
          },
        ],
      },
      {
        title: 'Gaming Zone',
        icon: 'gaming',
        groups: [
          {
            heading: 'Type',
            items: [
              'Gaming Laptops',
              'Gaming Towers',
              'Gaming Monitors',
              'Gaming Accessories',
              'Gaming Chairs',
            ],
          },
          {
            heading: 'Brands',
            items: ['Asus | HP | MSI | ROG | Lenovo | Acer | Predator'],
          },
        ],
      },
    ],
  },
  {
    id: 'tablets',
    label: 'Tablets',
    slug: 'tablets',
    megaMenu: [
      {
        title: 'Tablets',
        icon: 'tablet',
        groups: [
          {
            heading: 'Brands',
            items: ['Apple', 'Samsung', 'Lenovo', 'Huawei', 'Xiaomi'],
          },
          {
            heading: 'Screen size',
            items: ['8"', '10"', '11"', '12.9"'],
          },
        ],
      },
      {
        title: 'Accessories',
        icon: 'tv',
        groups: [
          {
            heading: 'Useful add-ons',
            items: ['Stylus pens', 'Keyboards', 'Cases', 'Stands'],
          },
        ],
      },
    ],
  },
  {
    id: 'consoles',
    label: 'Consoles',
    slug: 'consoles',
    megaMenu: [
      {
        title: 'Consoles',
        icon: 'console',
        groups: [
          {
            heading: 'Brands',
            items: ['PlayStation', 'Nintendo', 'Asus', 'Lenovo'],
          },
          {
            heading: 'Video Games',
            items: ['PlayStation', 'XBOX', 'Nintendo'],
          },
        ],
      },
      {
        title: 'Controllers and Accessories',
        icon: 'controller',
        groups: [
          {
            heading: 'Brands',
            items: ['PlayStation', 'Nintendo', 'Asus', 'Lenovo'],
          },
          {
            heading: 'PC Gaming',
            items: ['Gaming Laptops', 'Gaming Monitors', 'Accessories'],
          },
        ],
      },
      {
        title: 'Memberships',
        icon: 'badge',
        groups: [
          {
            heading: 'Digital Codes',
            items: ['XBOX', 'IMVU', 'FREEFIRE'],
          },
        ],
      },
    ],
  },
  {
    id: 'televisions',
    label: 'Televisions',
    slug: 'televisions',
    megaMenu: [
      {
        title: 'Televisions',
        icon: 'tv',
        groups: [
          {
            heading: 'Brands',
            items: ['Samsung', 'LG', 'Sony', 'TCL', 'Hisense'],
          },
          {
            heading: 'Screen size',
            items: ['43"', '50"', '55"', '65"', '75"'],
          },
        ],
      },
    ],
  },
  {
    id: 'smartwatches',
    label: 'Smartwatches',
    slug: 'smartwatches',
    megaMenu: [
      {
        title: 'Smartwatches',
        icon: 'watch',
        groups: [
          {
            heading: 'Brands',
            items: ['Apple', 'Samsung', 'Garmin', 'Huawei', 'Xiaomi'],
          },
        ],
      },
    ],
  },
  {
    id: 'trending',
    label: 'Trending',
    slug: 'trending',
    highlight: true,
  },
  {
    id: 'on-sale',
    label: 'On Sale',
    slug: 'on-sale',
    highlight: true,
  },
];

export const POPULAR_SEARCHES = [
  'Airpods',
  'Smart TV',
  'Iphone 17',
  'Ipad',
  'Gaming',
  'Samsung',
  'Apple',
  'Smartwatch',
  'Vivobook',
  'Monitors',
];
