import { useMemo, useState } from 'react';
import ProductListItem from '../ProductListItem/ProductListItem';
import type { Product } from '../../types/product';
import { formatCOP } from '../../services/formatService';
import './ProductListing.css';

interface Props {
  products: Product[];
  title: string;
  showBanner?: boolean;
}

const COLORS = [
  { name: 'Blue', code: '#1d4ed8' },
  { name: 'Black', code: '#0a0a0a' },
  { name: 'Silver', code: '#cbd5e1' },
  { name: 'Purple', code: '#7c3aed' },
  { name: 'Orange', code: '#f97316' },
  { name: 'Brown', code: '#7c2d12' },
  { name: 'Green', code: '#16a34a' },
  { name: 'Pink', code: '#ec4899' },
];

const PRICE_RANGES = [
  { label: '$5,000,000 - Above', min: 5000000, max: undefined },
  { label: '$100,000 - $500,000', min: 100000, max: 500000 },
  { label: '$3,000,000 - $5,000,000', min: 3000000, max: 5000000 },
];

type Order = 'relevance' | 'price-asc' | 'price-desc';

const ProductListing = ({ products, title, showBanner = false }: Props) => {
  const [order, setOrder] = useState<Order>('relevance');
  const [colorFilter, setColorFilter] = useState<string[]>([]);
  const [brandFilter, setBrandFilter] = useState<string[]>([]);
  const [brandQuery, setBrandQuery] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const brands = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => s.add(p.brand));
    return Array.from(s);
  }, [products]);

  const filteredBrands = useMemo(
    () =>
      brands.filter((b) =>
        b.toLowerCase().includes(brandQuery.toLowerCase())
      ),
    [brands, brandQuery]
  );

  const filtered = useMemo(() => {
    let result = [...products];
    if (brandFilter.length) {
      result = result.filter((p) => brandFilter.includes(p.brand));
    }
    if (colorFilter.length) {
      result = result.filter((p) =>
        colorFilter
          .map((c) => c.toLowerCase())
          .includes(p.color.toLowerCase())
      );
    }
    if (minPrice) {
      const min = Number(minPrice);
      result = result.filter((p) => p.price >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      result = result.filter((p) => p.price <= max);
    }
    if (order === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (order === 'price-desc') result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, brandFilter, colorFilter, minPrice, maxPrice, order]);

  const toggleBrand = (b: string) =>
    setBrandFilter((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const toggleColor = (c: string) =>
    setColorFilter((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="listing container">
      <button
        type="button"
        className="listing__filters-toggle"
        onClick={() => setFiltersOpen((v) => !v)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {filtersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
      </button>

      <aside className={`listing__filters ${filtersOpen ? 'is-open' : ''}`}>
        <h3 className="listing__filters-title">Filter by:</h3>

        <section className="listing__group">
          <h4>Categories</h4>
          <ul>
            <li>...Electronics Accessories</li>
            <li>...Mobile Phones</li>
          </ul>
        </section>

        <section className="listing__group">
          <h4>Brand</h4>
          <input
            type="text"
            placeholder="Search by brand"
            className="listing__brand-input"
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
          />
          {filteredBrands.map((b) => (
            <label key={b} className="listing__check">
              <input
                type="checkbox"
                checked={brandFilter.includes(b)}
                onChange={() => toggleBrand(b)}
              />
              <span>{b}</span>
              <span className="listing__check-count">
                ({products.filter((p) => p.brand === b).length})
              </span>
            </label>
          ))}
        </section>

        <section className="listing__group">
          <h4>Price Range</h4>
          <ul className="listing__price-list">
            {PRICE_RANGES.map((p) => (
              <li
                key={p.label}
                className="listing__price-row"
                onClick={() => {
                  setMinPrice(p.min ? String(p.min) : '');
                  setMaxPrice(p.max ? String(p.max) : '');
                }}
              >
                <span>{p.label}</span>
                <span>
                  {
                    products.filter(
                      (pr) =>
                        pr.price >= (p.min ?? 0) &&
                        (!p.max || pr.price <= p.max)
                    ).length
                  }
                </span>
              </li>
            ))}
          </ul>
          <div className="listing__price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button
              type="button"
              className="listing__price-go"
              aria-label="Apply price"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="m9 6 6 6-6 6"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>

        <section className="listing__group">
          <h4>Color</h4>
          {COLORS.map((c) => (
            <label key={c.name} className="listing__check">
              <input
                type="checkbox"
                checked={colorFilter.includes(c.name)}
                onChange={() => toggleColor(c.name)}
              />
              <span
                className="listing__color-dot"
                style={{ background: c.code }}
              />
              <span>{c.name}</span>
              <span className="listing__check-count">
                ({products.filter((p) => p.color.toLowerCase() === c.name.toLowerCase()).length})
              </span>
            </label>
          ))}
        </section>
      </aside>

      <div className="listing__main">
        <div className="listing__header">
          <p className="listing__results-count">
            Showing {filtered.length} of {products.length} results for "{title}"
          </p>
          <label className="listing__order">
            Order by
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as Order)}
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>

        {showBanner && (
          <div className="listing__banner">
            <div className="listing__banner-text">
              <span className="listing__banner-tag">APPLE</span>
              <h3>iPhone 17 256GB 5G Morado Lavanda</h3>
            </div>
            <div className="listing__banner-price">
              <small>Por solo:</small>
              <strong>{formatCOP(4669010)}</strong>
              <button className="listing__banner-btn" type="button">
                Comprar ya
              </button>
            </div>
          </div>
        )}

        <div className="listing__list">
          {filtered.map((p) => (
            <ProductListItem key={p.id} product={p} />
          ))}
          {filtered.length === 0 && (
            <p className="listing__empty">
              No se encontraron productos con esos filtros.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
