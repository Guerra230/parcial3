import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatCOP } from '../../services/formatService';
import './ProductListItem.css';

interface Props {
  product: Product;
}

const Stars = ({ value }: { value: number }) => {
  const full = Math.round(value);
  return (
    <span className="pli__stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? 'is-on' : ''}>
          ★
        </span>
      ))}
    </span>
  );
};

const ProductListItem = ({ product }: Props) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(product.id);
  return (
    <article className="pli">
      <header className="pli__head">
        <Link to={`/product/${product.id}`} className="pli__title">
          {product.name}
        </Link>
        <div className="pli__rating">
          <span>{product.rating.toFixed(1)}</span>
          <Stars value={product.rating} />
        </div>
      </header>

      <div className="pli__body">
        <Link to={`/product/${product.id}`} className="pli__media">
          <img src={product.images[0]} alt={product.name} loading="lazy" />
        </Link>

        <div className="pli__info">
          <span className="pli__brand">{product.brand}</span>
          <ul className="pli__specs">
            {product.shortSpecs.map((s) => (
              <li key={s.label}>
                <span className="pli__spec-label">{s.label}</span>
                <span className="pli__spec-value">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pli__badges">
          {product.badges?.includes('insurance') && (
            <span className="pli__badge pli__badge--purple">Free insurance</span>
          )}
          {product.badges?.includes('bank-interest') && (
            <span className="pli__badge pli__badge--red">0% bank interest</span>
          )}
        </div>

        <div className="pli__price-cart">
          <p className="pli__price">{formatCOP(product.price)}</p>
          <button
            className="pli__add"
            type="button"
            onClick={() => addItem(product)}
            aria-label="Agregar al carrito"
            title="Agregar al carrito"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H6"
                stroke="#0a1838"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.5" fill="#0a1838" />
              <circle cx="17" cy="20" r="1.5" fill="#0a1838" />
            </svg>
          </button>
        </div>
      </div>

      <footer className="pli__foot">
        <label className="pli__check">
          <input type="checkbox" /> Compare
        </label>
        <button
          className={`pli__heart ${fav ? 'is-fav' : ''}`}
          type="button"
          onClick={() => toggleFavorite(product)}
          aria-pressed={fav}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={fav ? '#ef4444' : 'none'}>
            <path
              d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"
              stroke={fav ? '#ef4444' : '#3b82f6'}
              strokeWidth="1.6"
            />
          </svg>
          {fav ? 'En favoritos' : 'Add to favorites'}
        </button>
        <Link to={`/product/${product.id}`} className="pli__more">
          See more details
        </Link>
      </footer>
    </article>
  );
};

export default ProductListItem;
